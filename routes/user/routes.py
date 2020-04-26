from flask import Blueprint, render_template, request, jsonify, redirect, flash, session, url_for
from flask_mail import Message
from functools import wraps
from flaskext.mysql import pymysql
import requests as r
import bcrypt
import sys
import secrets
from server import mysql, mail
from key import FERNET
from datetime import datetime
from uuid import uuid1

from routes.common.util import remember_me, cart_session, login_required, insert_address, insert_payment, \
    insert_useraddress, insert_userpayment, get_address_id, insert_userpayment, get_user_id, get_payment_id, \
    insert_payment, get_book_orderdetails, get_first_name, generate_secure_token, secure_link
from routes.user.util import *

user_bp = Blueprint('user_bp', __name__,
                    template_folder='templates', static_folder='static')


def get_books(cursor):
    if len(session['shopping_cart']) == 0:
        return redirect(url_for('common_bp.landing_page'))

    total_quantity = 0
    sub_total = 0
    # BOOKS FROM SHOPPING CART
    book_payload = {}
    for isbn, quantity in session['shopping_cart'].items():
        query = """SELECT nile_cover_ID, title, CONCAT(authorFirstName, ' ', authorLastName) AS author_name, price FROM book WHERE ISBN = %s"""
        cursor.execute(query, (isbn))
        results = cursor.fetchall()[0]
        nile_cover_ID = results[0]
        title = results[1]
        author_name = results[2]
        price = results[3]
        total_price = price * quantity
        sub_total += total_price
        total_quantity += quantity
        book_payload[isbn] = {'nile_cover_id': nile_cover_ID, 'title': title,
                              'author_name': author_name, 'price': price, 'total_price': total_price,
                              'quantity': quantity}

    return {"book_payload": book_payload,
            "sub_total": sub_total,
            "book_quantity": total_quantity}


@user_bp.route('/checkout/shipping/', methods=['POST', 'GET'])
@login_required(session)
@secure_checkout(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def shipping_checkout():
    if len(session['shopping_cart']) == 0:
        return redirect(url_for('common_bp.landing_page'))

    conn = mysql.connect()
    cursor = conn.cursor()

    if request.method == 'GET':
        # SHIPPING ADDRESSES FROM DB
        shipping_payload = {}
        shipping_query = '''SELECT * FROM address JOIN user_address ON  user_address.addressID_ua_FK = address.id WHERE addressTypeID_address_FK=1 AND user_address.userID_ua_FK=(SELECT id FROM user WHERE email = %s)'''
        cursor.execute(shipping_query, (session['email']))
        results = cursor.fetchall()
        for shipping_address in results:
            shipping_payload[shipping_address[0]] = {
                'street1': shipping_address[1],
                'street2': shipping_address[2],
                'city': shipping_address[3],
                'zip': shipping_address[4],
                'state': shipping_address[5],
                'country': shipping_address[6]
            }

        x = get_books(cursor)
        shipping_price = calculate_shipping(x['book_quantity'])

        conn.close()
        return render_template('checkout/shippingCheckout.html',
                               shipping_payload=shipping_payload,
                               book_payload=x['book_payload'],
                               sub_total=x['sub_total'],
                               shipping_price=shipping_price)
    elif request.method == 'POST':
        SHIPPING_IDENT = request.form.get('SHIPPING_IDENT')
        REMEMBER_SHIPPING = request.form.get('REMEMBER_SHIPPING')

        # USER CHOOSES NEW SHIPPING
        SHIPPING_HEADERS = ['street1', 'street2',
                            'zip', 'city', 'state', 'country']
        addressStreetAddress = request.form.get('addressStreetAddress')
        addressApartmentOrSuite = request.form.get('addressApartmentOrSuite')
        addressZip = request.form.get('addressZip')
        addressCity = request.form.get('addressCity')
        addressState = request.form.get('addressState')
        addressCountry = request.form.get('addressCountry')

        shipping_payload = (addressStreetAddress, addressApartmentOrSuite,
                            addressCity, addressZip, addressState, addressCountry, str(1))

        formatted_shipping = zip(SHIPPING_HEADERS, shipping_payload[:-1])
        formatted_shipping_payload = {table_headers: val for (
            table_headers, val) in formatted_shipping}

        # IF USING NEW SHIPPING ADDRESS
        if SHIPPING_IDENT == None:
            # insert_address(cursor, shipping_payload)
            session['new_shipping'] = shipping_payload
            # shipping_id = get_address_id(cursor)
            # session['new_shipping_id'] = shipping_id
            # session['shipping'] = shipping_id
            session['shipping_state'] = addressState
            session['shipping_payload'] = formatted_shipping_payload

            if REMEMBER_SHIPPING != None and int(REMEMBER_SHIPPING) != 0:

                user_id = get_user_id(cursor, session['email'])
                session['shipping_remember'] = True
            else:
                session['shipping_remember'] = False
                # insert_useraddress(cursor, (user_id, shipping_id))

        # SAVED SHIPPING ADDRESS
        else:
            shipping_id = SHIPPING_IDENT
            session['shipping'] = shipping_id
            session['shipping_state'] = request.form.get('SHIPPING_STATE')
            shipping_query = 'SELECT * FROM address WHERE id = %s'
            cursor.execute(shipping_query, (shipping_id))

            header = [desc[0] for desc in cursor.description][1:-1]
            shipping_payload = {}
            results = cursor.fetchall()[0][1:-1]
            formatted_results = zip(header, results)
            shipping_payload = {table_headers: val for (
                table_headers, val) in formatted_results}
            session['shipping_payload'] = shipping_payload

        conn.commit()
        conn.close()
        return redirect(url_for('user_bp.billing_checkout'))


@user_bp.route('/checkout/billing/', methods=['POST', 'GET'])
@login_required(session)
@secure_checkout(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def billing_checkout():
    if len(session['shopping_cart']) == 0:
        return redirect(url_for('common_bp.landing_page'))

    conn = mysql.connect()
    cursor = conn.cursor()

    if request.method == 'GET':
        # BILLING ADDRESSES FROM DB
        payment_payload = {}

        payment_query = '''
                SELECT pm.id, street1, street2, city, zip, state, country, firstName, lastName, cardNumber, cardType, expirationDate
                FROM user_paymentmethod upm
                JOIN payment_method pm ON upm.paymentID_pm_FK = pm.id
                JOIN address a ON pm.billingAddress_addr_FK = a.id
                WHERE upm.userID_pm_FK = (SELECT id FROM user WHERE email = %s)'''

        cursor.execute(payment_query, (session['email']))
        results = cursor.fetchall()
        for i in results:
            payment_payload[i[0]] = {
                'street1': i[1],
                'street2': i[2],
                'city': i[3],
                'zip': i[4],
                'state': i[5],
                'country': i[6],
                'card_fname': i[7].upper(),
                'card_lname': i[8].upper(),
                'card_number': FERNET.decrypt(
                    i[9].encode('utf-8')).decode('utf-8')[-4:],
                'card_type': i[10],
                'card_expiry': str(i[11].year) + '-' + str(i[11].month).zfill(2)
            }

        x = get_books(cursor)

        sub_total = x['sub_total']
        shipping_price = "{:.2f}".format(
            calculate_shipping(x['book_quantity']))
        sales_tax = "{:.2f}".format(SALES_TAX[session['shipping_state']])
        grand_total = "{:.2f}".format(
            float(sub_total) + float(shipping_price) + float(sales_tax))

        conn.close()
        return render_template('checkout/billingCheckout.html',
                               billing_payload=payment_payload,
                               book_payload=x['book_payload'],
                               sub_total=sub_total,
                               shipping_price=shipping_price,
                               sales_tax=sales_tax,
                               grand_total=grand_total)
    elif request.method == 'POST':
        PAYMENT_IDENT = request.form.get('PAYMENT_IDENT')
        REMEMBER_PAYMENT = request.form.get('REMEMBER_PAYMENT')

        # USER CHOOSES NEW PAYMENT
        checkoutCardHolderFirstName = request.form.get('cardHolderFirstName')
        checkoutCardHolderLastName = request.form.get('cardHolderLastName')
        try:
            ccn = FERNET.encrypt(request.form.get('ccn').encode('utf-8'))
        except:
            ccn = ''
        ct = request.form.get("CCNProvider")
        ccexp = request.form.get('ccexp')
        if ccexp != None:
            ccexp += '-01'

        BILLING_HEADERS = ['street1', 'street2',
                           'zip', 'city', 'state', 'country']
        billingStreetAddress = request.form.get('billingStreetAddress')
        billingApartmentOrSuite = request.form.get('billingApartmentOrSuite')
        billingAddressZip = request.form.get('billingAddressZip')
        billingAddressCity = request.form.get('billingAddressCity')
        billingAddressState = request.form.get('billingAddressState')
        billingAddressCountry = request.form.get('billingAddressCountry')

        # PAYMENT PAYLOAD CREATED AFTER BILLING_PAYLOAD HAS BEEN INSERTED
        billing_payload = (billingStreetAddress, billingApartmentOrSuite, billingAddressCity,
                           billingAddressZip, billingAddressState, billingAddressCountry, str(2))
        formatted_billing = zip(BILLING_HEADERS, billing_payload[:-1])
        formatted_billing_payload = {table_headers: val for (
            table_headers, val) in formatted_billing}

        # IF USING NEW SHIPPING ADDRESS
        if PAYMENT_IDENT == None:
            # insert_address(cursor, billing_payload)
            session['new_billing'] = billing_payload
            # billing_id = get_address_id(cursor)
            # session['new_billing_id'] = billing_id

            PAYMENT_HEADERS = ['firstname',
                               'lastname', 'cardNumber', 'cardType']
            payment_payload = [checkoutCardHolderFirstName,
                               checkoutCardHolderLastName, ccn, ct, ccexp, 0]
            formatted_results = zip(PAYMENT_HEADERS, payment_payload[:-1])
            formatted_payment_payload = {table_headers: val for (
                table_headers, val) in formatted_results}
            formatted_payment_payload['cardNumber'] = FERNET.decrypt(
                formatted_payment_payload['cardNumber']).decode('utf-8')[-4:]

            session['payment_payload'] = formatted_payment_payload
            session['billing_payload'] = formatted_billing_payload

            # insert_payment(cursor, payment_payload)
            session['new_payment'] = payment_payload
            # payment_id = get_payment_id(cursor)
            # session['new_payment_id'] = payment_id
            # session['payment'] = payment_id
            if REMEMBER_PAYMENT != None and int(REMEMBER_PAYMENT) != 0:
                user_id = get_user_id(cursor, session['email'])
                session['payment_remember'] = True
                # insert_userpayment(cursor, (user_id, payment_id))
            else:
                session['payment_remember'] = False

        # SAVED SHIPPING ADDRESS
        else:
            payment_id = PAYMENT_IDENT

            session['payment'] = payment_id

            payment_payload = {}
            payment_query = 'SELECT firstname,lastname,cardNumber,cardType, billingAddress_addr_FK FROM payment_method WHERE id = %s'
            cursor.execute(payment_query, (payment_id))

            header = [desc[0] for desc in cursor.description][:-1]
            payment_payload = {}
            results = cursor.fetchall()[0]
            table_vals = results[:-1]
            billing_id = results[-1]

            formatted_results = zip(header, results)
            payment_payload = {table_headers: val for (
                table_headers, val) in zip(header, results)}

            payment_payload['cardNumber'] = FERNET.decrypt(
                payment_payload['cardNumber'].encode('utf-8')).decode('utf-8')[-4:]
            session['payment_payload'] = payment_payload

            billing_payload = {}
            billing_query = 'SELECT * FROM address WHERE id = %s'
            cursor.execute(billing_query, (billing_id))

            header = [desc[0] for desc in cursor.description][1:-1]
            billing_payload = {}
            results = cursor.fetchall()[0][1:-1]
            formatted_results = zip(header, results)
            billing_payload = {table_headers: val for (
                table_headers, val) in zip(header, results)}
            session['billing_payload'] = billing_payload

        # print(session['payment_payload'])
        # print(session['billing_payload'])

        conn.commit()
        conn.close()
        return redirect(url_for('user_bp.review_checkout'))


@user_bp.route('/checkout/review/', methods=['POST', 'GET'])
@login_required(session)
@secure_checkout(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def review_checkout():
    conn = mysql.connect()
    cursor = conn.cursor()
    if request.method == 'GET':
        if len(session['shopping_cart']) == 0:
            return redirect(url_for('common_bp.landing_page'))

        x = get_books(cursor)
        SALES_TAX = {'GA': 2.50, 'CA': 3.50}
        sub_total = "{:.2f}".format(x['sub_total'])
        shipping_price = "{:.2f}".format(
            calculate_shipping(x['book_quantity']))
        sales_tax = "{:.2f}".format(SALES_TAX[session['shipping_state']])
        grand_total = "{:.2f}".format(
            float(sub_total) + float(shipping_price) + float(sales_tax))

        session['sub_total'] = sub_total
        # print(type(sub_total))
        session['shipping_price'] = shipping_price
        # print(type(shipping_price))
        session['sales_tax'] = sales_tax
        # print(type(sales_tax))
        session['grand_total'] = grand_total
        # print(type(grand_total))

        if 'payment_payload' and 'billing_payload' in session:
            payment_payload = session['payment_payload']
            billing_payload = session['billing_payload']
            shipping_payload = session['shipping_payload']

            print(f'billing payload --> {billing_payload}')
            print(f'payment payload --> {payment_payload}')
            print(f'shippign payload --> {shipping_payload}')

            print('DONE IF')

            conn.close()
            return render_template('checkout/reviewOrder.html',
                                   book_payload=x['book_payload'],
                                   sub_total=sub_total,
                                   shipping_price=shipping_price,
                                   sales_tax=sales_tax,
                                   grand_total=grand_total,
                                   payment_payload=payment_payload,
                                   billing_payload=billing_payload,
                                   shipping_payload=shipping_payload)

        else:
            payment_query = 'SELECT firstname,lastname,cardNumber,cardType, billingAddress_addr_FK FROM payment_method WHERE id = %s'
            cursor.execute(payment_query, (session['payment']))

            header = [desc[0] for desc in cursor.description][1:-1]
            payment_payload = {}
            results = cursor.fetchall()[0][1:-1]
            formatted_results = zip(header, results)
            payment_payload = {table_headers: val for (
                table_headers, val) in zip(header, results)}
            session['payment_payload'] = payment_payload

            billing_query = 'SELECT * FROM address WHERE id = %s'
            cursor.execute(billing_query, (billing_id))

            header = [desc[0] for desc in cursor.description][1:-1]
            billing_payload = {}
            results = cursor.fetchall()[0][1:-1]
            formatted_results = zip(header, results)
            billing_payload = {table_headers: val for (
                table_headers, val) in formatted_results}
            session['billing_payload'] = billing_payload

            shipping_payload = session['shipping_payload']

            print(f'billing payload --> {billing_payload}')
            print(f'payment payload --> {payment_payload}')
            print(f'shippign payload --> {shipping_payload}')

            print('DONE ELSE')

            conn.close()
            return render_template('checkout/reviewOrder.html',
                                   book_payload=x['book_payload'],
                                   sub_total=float(x['sub_total']),
                                   shipping_price=float(shipping_price),
                                   sales_tax=float(sales_tax),
                                   grand_total=float(grand_total),
                                   payment_payload=payment_payload,
                                   billing_payload=billing_payload,
                                   shipping_payload=shipping_payload)

    elif request.method == 'POST':

        # TOTALS/PRICES
        SALES_TAX = session['sales_tax']
        SHIPPING_COST = session['shipping_price']

        SUB_TOTAL = session['sub_total']
        GRAND_TOTAL = request.form.get('GRAND_TOTAL')

        # PROMOTION
        PROMO_IDENT = request.form.get('PROMO_IDENT')

        if PROMO_IDENT != None:
            promo_id_query = 'SELECT id FROM promotion WHERE code = %s'
            cursor.execute(promo_id_query, (PROMO_IDENT))
            PROMO_IDENT = cursor.fetchall()[0][0]

        user_id = get_user_id(cursor, session['email'])
        payment_id, shipping_id = '',''

        if 'new_payment' in session:
            insert_address(cursor, session['new_billing'])
            billing_id = get_address_id(cursor)
            session['new_payment'][-1] = billing_id
            # payment_payload = (payment_val for payment_val in session['new_payment'])
            payment_payload = (session['new_payment'][0].upper(), session['new_payment'][1].upper(), session['new_payment']
                               [2], session['new_payment'][3], session['new_payment'][4], session['new_payment'][5])
            print(payment_payload)
            insert_payment(cursor, payment_payload)
            payment_id = get_payment_id(cursor)
            if 'payment_remember' in session and session['payment_remember']:
                
                insert_userpayment(cursor, (user_id, payment_id))
        else:
            payment_id = session['payment']

        if 'new_shipping' in session:
            insert_address(cursor, session['new_shipping'])
            shipping_id = get_address_id(cursor)
            if 'payment_remember' in session and session['payment_remember']:
                
                insert_useraddress(cursor, (user_id, shipping_id))
        else:
            shipping_id = session['shipping']
        
        payment_id = int(payment_id)
        grand_total = float(GRAND_TOTAL)
        sales_tax = float(SALES_TAX)
        shipping_cost = float(SHIPPING_COST)
        order_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        promo_id = PROMO_IDENT
        order_num = str(uuid1())
        shipping_id = int(shipping_id)

        order_payload = (user_id, payment_id, grand_total, sales_tax,
                         shipping_cost, order_time, promo_id, order_num, shipping_id)
        insert_order(cursor, order_payload)
        order_id = get_order_id(cursor)

        # PREPARE SHIPPING/PAYMENT/BILLING PAYLOADS FOR ORDER CONF EMAIL
        shipping_address_query = '''SELECT street1, street2, zip, city, state, country FROM address WHERE id = %s'''
        cursor.execute(shipping_address_query,(shipping_id))
        results = cursor.fetchall()[0]
        headers = [desc[0] for desc in cursor.description]
        formatted_results = zip(headers,results)
        shipping_payload = {table_headers:val for (table_headers,val) in formatted_results}

        payment_method_query = '''SELECT cardType, cardNumber, billingAddress_addr_FK FROM payment_method WHERE id = %s'''
        cursor.execute(payment_method_query,(payment_id))
        results = cursor.fetchall()[0]
        table_vals = results[:-1]
        billing_id = results[-1]
        headers = [desc[0] for desc in cursor.description][:-1]
        formatted_results = zip(headers,table_vals)
        payment_payload = {table_headers:val for (table_headers,val) in formatted_results}

        billing_query = '''SELECT street1, street2, zip,city,state,country FROM address WHERE id = %s'''
        cursor.execute(billing_query,(billing_id))
        results = cursor.fetchall()[0]
        headers = [desc[0] for desc in cursor.description]
        formatted_results = zip(headers,results)
        billing_payload = {table_headers:val for (table_headers,val) in formatted_results}


        # STEP 3: INSERT INTO order_bod TABLE
        book_orderdetails = get_book_orderdetails(cursor, user_id)
        for bod in book_orderdetails:
            insert_orderbod(cursor, (order_id, bod[0]))

        # STEP 4: AFTER SUCCESSFUL CHECKOUT, DELETE FROM SHOPPINGCART TABLE AND REDIRECT TO CHECKOUT CONFIRMATION PAGE/ROUTE
        delete_shopping_cart(cursor, user_id)
        session['shopping_cart'] = {}

        conn.commit()
        conn.close()

        send_order_conf_email(session['email'], get_first_name(mysql, session['email']), order_num, time=order_time, subtotal=SUB_TOTAL,
                              shipping_cost=shipping_cost, sales_tax=sales_tax, grand_total=grand_total, shipping_payload=shipping_payload, payment_payload=payment_payload,billing_payload=billing_payload)

        session.pop('checkout_token')
        generate_secure_token(session, 'checkout_token')
        generate_secure_token(session, 'order_token')
        return redirect(url_for('user_bp.order_conf', conf_token=secrets.token_urlsafe(256), order_num=order_num))


@user_bp.route('/base_profile/', methods=['GET'])
@login_required(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def base_profile():
    return render_template('profile/profileBase.html')


@user_bp.route('/overview/', methods=['GET'])
@login_required(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def overview():
    conn = mysql.connect()
    cursor = conn.cursor()

    get_num_orders = """SELECT COUNT(*) 
        FROM `order` WHERE userID_order_FK = (SELECT id FROM user WHERE email = %s) 
        GROUP BY userID_order_FK"""
    cursor.execute(get_num_orders, session['email'])
    num_orders = cursor.fetchall()

    if len(num_orders) != 0:
        num_orders = num_orders[0][0]
    else:
        num_orders = 0

    get_top_four_orders = """SELECT dateOrdered, confirmationNumber FROM `order` 
    WHERE userID_order_FK = (SELECT id FROM user WHERE email = %s) 
    ORDER BY dateOrdered DESC LIMIT 4"""
    cursor.execute(get_top_four_orders, session['email'])
    top_four = cursor.fetchall()
    print(top_four, file=sys.stderr)

    return render_template('profile/profileOverview.html', num_orders=num_orders, top_four=top_four)


@user_bp.route('/change_name/', methods=['GET', 'POST'])
@login_required(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def change_name():
    if request.method == 'GET':
        return render_template('profile/profileChangeName.html')
    else:
        conn = mysql.connect()
        cursor = conn.cursor()

        fname = request.form.get('inputFirstname')
        firstLetter = fname[0].upper()
        fname = firstLetter + fname[1:].lower()

        lname = request.form.get('inputLastname')
        firstLetter = lname[0].upper()
        lname = firstLetter + lname[1:].lower()

        session['firstName'] = fname
        cursor.execute(
            'UPDATE user SET firstname = %s WHERE email = %s', (fname, session['email']))
        conn.commit()

        session['lastName'] = lname
        cursor.execute(
            'UPDATE user SET lastname = %s WHERE email = %s', (lname, session['email']))
        conn.commit()

        conn.close()

        if session['subscribed'] == b'\x01':
            send_change_conf_email(session['email'], session['firstName'])

        flash('Your information has been recorded.')
        return redirect(url_for('user_bp.change_name'))


@user_bp.route('/change_pass/', methods=['GET', 'POST'])
@login_required(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def change_pass():
    if request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor()

        cursor.execute('SELECT pass FROM user WHERE email = %s',
                       (session['email']))
        db_pass = cursor.fetchall()[0][0].encode('utf-8')
        current_password = request.form.get('currentPassword')
        if not bcrypt.checkpw(current_password.encode('utf-8'), db_pass):
            flash(
                'The current password you have entered does not match the password in our system.', category='err')
            return redirect(url_for('user_bp.change_pass'))

        new_password = request.form.get('newPassword')
        confirm_new_password = request.form.get('confirmNewPassword')

        if new_password != confirm_new_password:
            flash(
                'There was an error in trying to record your information.', category='err')
            return redirect(url_for('user_bp.change_pass'))
        else:
            new_password = bcrypt.hashpw(
                new_password.encode('utf-8'), bcrypt.gensalt())

            query = 'UPDATE user SET pass=%s WHERE email=%s'
            cursor.execute(query, (new_password, session['email']))
            conn.commit()
            conn.close()

            if session['subscribed'] == b'\x01':
                send_change_conf_email(session['email'], session['firstName'])

            flash('Your information has been recorded.', category='success')
            return redirect(url_for('user_bp.change_pass'))
    else:
        return render_template('profile/profileChangePassword.html')


@user_bp.route('/order_history/', methods=['GET'])
@login_required(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def order_history():
    conn = mysql.connect()
    cursor = conn.cursor()

    order_history_query = """ 
       SELECT o.`confirmationNumber`, b.`price`, b.`ISBN`,  b.`title`, obod.quantity,  
       b.`authorFirstName`, b.`authorLastName`, o.`dateOrdered`, o.shippingPrice, o.salesTax, o.total
                   FROM `user` u
                   JOIN `order` o ON u.`id`= o.`userID_order_FK`
                   JOIN `order_bod` ON o.`id`=`order_bod`.`orderID_obod_FK`
                   JOIN `book_orderdetail` obod ON `order_bod`.`bodID_obod_FK`= obod.`id`
                   JOIN `book` b ON obod.`ISBN_bod_FK`= b.`ISBN`
                   WHERE u.email=%s
                   ORDER BY o.`dateOrdered` ASC; """
    cursor.execute(order_history_query, (session["email"]))
    data = cursor.fetchall()

    conn.close()
    return render_template('profile/profileOrderHistory.html', data=data)


@user_bp.route('/shipping_address/', methods=['GET', 'POST'])
@login_required(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def shipping_address():
    conn = mysql.connect()
    cursor = conn.cursor()

    if request.method == 'POST':

        flag = request.form.get("form_flag")
        addr_id = request.form.get('addressID')

        street_addr = request.form.get("addressStreetAddress")
        street_addr2 = request.form.get("addressApartmentOrSuite")
        zipcode = request.form.get("addressZip")
        city = request.form.get("addressCity")
        state = request.form.get("addressState")
        country = request.form.get("addressCountry")

        if flag == "CREATE_FLAG":

            query = """
            INSERT INTO address (street1, street2, city, zip, state, country, addressTypeID_address_FK)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
            """

            create_ship_payload = (
                street_addr, street_addr2, city, zipcode, state, country, 1)
            cursor.execute(query, create_ship_payload)

            query2 = """
            INSERT INTO user_address (userID_ua_FK, addressID_ua_FK)
            VALUES (
                (SELECT id FROM user WHERE email = %s),
                (SELECT id FROM address ORDER BY id DESC LIMIT 1)
            )
            """
            cursor.execute(query2, (session['email']))

        elif flag == "REMOVE_FLAG":
            remove_query = '''
            DELETE FROM user_address
            WHERE userID_ua_FK = (SELECT id FROM user WHERE email = %s)
                AND addressID_ua_FK = %s
            '''
            cursor.execute(remove_query, (session['email'], addr_id))

        elif flag == "EDIT_FLAG":

            update_query = '''
            UPDATE address SET street1 = %s, street2 = %s, city = %s, zip = %s, state = %s, country = %s, addressTypeID_address_FK = %s
            WHERE id = %s
            '''
            cursor.execute(update_query, (street_addr, street_addr2,
                                          city, zipcode, state, country, 1, addr_id))

        conn.commit()

        if session['subscribed'] == b'\x01':
            send_change_conf_email(session['email'], session['firstName'])
        return redirect(url_for('user_bp.shipping_address'))

    elif request.method == 'GET':
        user_addresses = """
            SELECT UA.userID_ua_FK, A.id, A.street1, A.street2, A.city, A.zip, A.state, A.country
            FROM user_address UA
                    INNER JOIN address A ON UA.addressID_ua_FK = A.id
            WHERE userID_ua_FK = (SELECT id FROM user WHERE email = %s)
            ORDER BY addressID_ua_FK;
            """
        cursor.execute(user_addresses, (session['email']))
        # ((68, '123 Wallaby', '', 'Lilburn', '30609', 'Georgia', 'United States'), (68, '362', ...))
        data = cursor.fetchall()
        # We want [{street1: 123 Wallaby, street2: 23}, {street1: 362 Nowhere, street2: ''}, {street1: 999 Somewhere, street2: 27}]

        sendable = []

        for addr_tup in data:
            addr_dict = {}
            addr_dict['addressID'] = addr_tup[1]
            addr_dict['street1'] = addr_tup[2]
            addr_dict['street2'] = addr_tup[3]
            addr_dict['city'] = addr_tup[4]
            addr_dict['zip'] = addr_tup[5]
            addr_dict['state'] = addr_tup[6]
            addr_dict['country'] = addr_tup[7]
            sendable.append(addr_dict)

        print(sendable, file=sys.stderr)

        conn.close()
        return render_template('profile/profileShippingAddress.html', data=sendable)


@user_bp.route('/payment_methods/', methods=['GET', 'POST'])
@login_required(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def payment_methods():
    conn = mysql.connect()
    cursor = conn.cursor()

    if request.method == 'POST':
        flag = request.form.get("form_flag")
        addr_id = request.form.get('billingAddressID')
        pm_id = request.form.get("pm_id")

        cfn = request.form.get("cardHolderFirstName").title()
        cln = request.form.get("cardHolderLastName").title()
        ct = request.form.get("CCNProvider")
        ccexp = request.form.get("ccexp") + '-01'
        street1 = request.form.get("billingStreetAddress").title()
        street2 = request.form.get("billingApartmentOrSuite").title()
        zipcode = request.form.get("billingAddressZip")
        city = request.form.get("billingAddressCity").title()
        state = request.form.get("billingAddressState")
        country = request.form.get("billingAddressCountry")

        if flag == "CREATE_FLAG":
            ccn = FERNET.encrypt(
                request.form.get('ccn').encode('utf-8'))

            create_shipping_address = """
                INSERT INTO address(street1, street2, city, zip, state, country, addressTypeID_address_FK) 
                VALUES(%s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(create_shipping_address, (street1, street2,
                                                     city, zipcode, state, country, 2))

            create_pm = """
                INSERT INTO payment_method(firstname, lastname, cardNumber, cardType, expirationDate, billingAddress_addr_FK)
                VALUES (%s, %s, %s, %s, %s, 
                (SELECT id FROM address ORDER BY id DESC LIMIT 1)
                )
            """
            cursor.execute(create_pm, (cfn, cln, ccn,
                                       ct, ccexp))

            create_pm_association = """
            INSERT INTO user_paymentmethod (userID_pm_FK, paymentID_pm_FK)
            VALUES (
                (SELECT id FROM user WHERE email = %s),
                (SELECT id FROM payment_method ORDER BY id DESC LIMIT 1)
            )
            """
            cursor.execute(create_pm_association, (session['email']))

        elif flag == "REMOVE_FLAG":

            remove_query = '''
            DELETE FROM user_paymentmethod
            WHERE userID_pm_FK = (SELECT id FROM user WHERE email = %s)
                AND paymentID_pm_FK = %s
            '''
            cursor.execute(remove_query, (session['email'], pm_id))

            remove_query = '''
            DELETE FROM user_address
            WHERE userID_ua_FK = (SELECT id FROM user WHERE email = %s)
                AND addressID_ua_FK = %s
            '''
            cursor.execute(remove_query, (session['email'], addr_id))

        elif flag == "EDIT_FLAG":

            update_pm = '''UPDATE payment_method SET firstname = %s, lastname = %s, expirationDate = %s WHERE id = %s'''
            cursor.execute(update_pm, (cfn, cln, ccexp, pm_id))

            update_a = '''UPDATE address SET street1 = %s, street2 = %s, city = %s, zip = %s, state = %s, country = %s WHERE id = %s'''
            cursor.execute(update_a, (street1, street2, city,
                                      zipcode, state, country, addr_id))

        conn.commit()
        conn.close()

        if session['subscribed'] ==  b'\x01':
            send_change_conf_email(session['email'], session['firstName'])
        return redirect(url_for('user_bp.payment_methods'))

    # GET REQUEST
    else:

        user_payments = """
            SELECT UPM.paymentID_pm_FK, PM.firstname, PM.lastname, PM.cardNumber, PM.cardType, PM.expirationDate, PM.billingAddress_addr_FK, A.id,
                    A.street1, A.street2, A.zip, A.city, A.state, A.country
            FROM user_paymentmethod UPM 
                    INNER JOIN payment_method PM ON UPM.paymentID_pm_FK=PM.id
                    INNER JOIN address A ON PM.billingAddress_addr_FK = A.id
            WHERE userID_pm_FK = (SELECT id FROM user WHERE email = %s)
            ORDER BY addressTypeID_address_FK;            
            """
        cursor.execute(user_payments, (session['email']))
        data = cursor.fetchall()

        payment_sendable = []

        for pay_tup in data:
            pay_dict = {}
            pay_dict['pm_id'] = pay_tup[0]
            pay_dict['firstname'] = str(pay_tup[1]).upper()
            pay_dict['lastname'] = str(pay_tup[2]).upper()
            pay_dict['cardNumber'] = FERNET.decrypt(
                pay_tup[3].encode('utf-8')).decode('utf-8')[-4:]
            pay_dict['cardType'] = pay_tup[4]
            pay_dict['expirationDate'] = str(
                pay_tup[5].year) + '-' + str(pay_tup[5].month).zfill(2)
            pay_dict['billingAddressID'] = pay_tup[7]
            pay_dict['street1'] = pay_tup[8]
            pay_dict['street2'] = pay_tup[9]
            pay_dict['zip'] = pay_tup[10]
            pay_dict['city'] = pay_tup[11]
            pay_dict['state'] = pay_tup[12]
            pay_dict['country'] = pay_tup[13]

            print(pay_dict['expirationDate'])
            payment_sendable.append(pay_dict)

        return render_template('profile/profilePaymentMethods.html', data=payment_sendable)


@user_bp.route('/settings/', methods=['POST', 'GET'])
@login_required(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def settings():
    if request.method == 'GET':
        conn = mysql.connect()
        cursor = conn.cursor()
        subscription = int.from_bytes(
            get_subscription(cursor, session['email']), 'big')

        if subscription == 1:
            return render_template('profile/profileSubscriptions.html', subscription="checked")
        else:
            return render_template('profile/profileSubscriptions.html', subscription="")
    elif request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor()

        flag = request.form.get("flag")

        # USER IS SUBSCRIBING
        if flag == 'SUBSCRIBE':
            query = 'UPDATE user SET isSubscribed = %s WHERE email = %s'
            cursor.execute(query, (1, session['email']))

            conn.commit()
            conn.close()
            return jsonify({'response': 200})

        # USER IS UNSUBSCRIBING
        elif flag == 'UNSUBSCRIBE':
            query = 'UPDATE user SET isSubscribed = %s WHERE email = %s'
            cursor.execute(query, (0, session['email']))

            conn.commit()
            conn.close()
            return jsonify({'response': 200})


@user_bp.route('/order_conf/<conf_token>+<order_num>', methods=['GET'])
@login_required(session)
@cart_session(session)
@remember_me(session)
@user_only(session)
def order_conf(conf_token, order_num=None):

    return render_template('checkout/orderConf.html', order_num=order_num)
