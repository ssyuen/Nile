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

from routes.common.routes import cart_session, remember_me

user_bp = Blueprint('user_bp', __name__,
                    template_folder='templates', static_folder='static')


SALES_TAX  = {'GA':.04, 'CA':.0725}

# MULTIPLY THIS BY THE TOTAL AMOUNT OF BOOKS
SHIPPING_PRICE = 4.00
def calculate_shipping(quantity):
    return SHIPPING_PRICE + .5 * quantity


def login_required(f):
    @wraps(f)
    def wrapped_func(*args, **kws):
        if 'logged_in' in session and session['logged_in']:
            return f(*args, **kws)
        else:
            flash('You need to login to access this area!')
            return redirect(url_for('common_bp.login', ctx=f.__name__))

    return wrapped_func


def user_only(f):
    @wraps(f)
    def wrapped_func(*args, **kws):
        if 'admin' in session and session['admin']:
            flash(
                'Please login using a non-administrative account to access this feature.')
            return redirect(url_for('common_bp.landing_page'))
        else:
            return f(*args, **kws)

    return wrapped_func


def send_change_conf_email(recipient, recipient_fname, sender='rootatnilebookstore@gmail.com'):
    current_time = datetime.now()
    message_body = 'Hi ' + recipient_fname + \
                   f',\n\nThere have been changes made to your profile on {current_time.month}/{current_time.day}/{current_time.year}, {current_time.hour}:{current_time.minute}:{current_time.second}. If this was not you, please go and change your password.\n\nRegards, Nile Bookstore Management'
    msg = Message(subject='Nile Profile Change', recipients=[
        recipient, 'rootatnilebookstore@gmail.com'], sender='rootatnilebookstore@gmail.com', body=message_body)
    mail.send(msg)


@user_bp.route('/checkout/', methods=['POST', 'GET'])
@login_required
@cart_session
@remember_me
@user_only
def checkout():
    '''
    REQUIREMENTS:
    - Fill out available shipping addresses
    - Fill out available billing addresses
    - Fill out cart area with items from the cart
    - Sucessful checkout ends with confirmation email
    - AJAX POST on Enter an Address OR when you select an address
    - AJAX POST on Eneter a Billing Address OR when you select an address
    - When form is submitted, the credit card must be validated against the one in the db
    - Applying of PROMO code must be successful VIA POST, else, flash error message while re-rendering a portion of the page
    '''

    conn = mysql.connect()
    cursor = conn.cursor()

    if request.method == 'POST':
        '''
        POST-REQUIREMENTS

            # 1: User is not able to go back to the checkout area

        POSSIBLE CASES

            # 1: User enters a new shipping address, then insert into address table
            # 2: User enters a new payment method, then new billing address must be inserted into address table first, then new payment method into payment_method table
            # 3: User enters a new shipping address and chooses to remember (save) new address, then insert into address table, then insert into user_address table
            # 4: User enters a new payment method and chooses to remember (save) new payment method, then insert into address table, then payment_method table, then paymentmethod_user table
            # 5: User uses a saved address, then insert the address id into the order table
            # 6: User uses a saved payment_method, then insert the payment_method id into the order table

        AVAILABLE FLAGS

            SHIPPING_IDENT --> SAVED ADDRESS
            PAYMENT_IDENT --> SAVED PAYMENT METHOD
            REMEMBER_SHIPPING --> INSERT NEW SHIPPING METHOD INTO USER_ADDRESS
            REMEMBER_BILLING --> INSERT NEW PAYMENT METHOD INTO USER_PAYMENTMETHOD

        NEW SHIPPING FORM NAMES:

            addressStreetAddress
            addressApartmentOrSuite
            addressZip
            addressCity
            addressState
            addressCountry

        NEW PAYMENT FORM NAMES:

            checkoutCardHolderFirstName
            checkoutCardHolderLastName
            ccn
            ccexp
            billingStreetAddress
            billingApartmentOrSuite
            billingAddressZip
            billingAddressCity
            billingAddressCountry
        '''
        # STEP 1: RETRIEVE FORM VALUES
        print(request.form)

        # USER CHOOSES SAVED OPTIONS
        SHIPPING_IDENT = request.form.get('SHIPPING_IDENT')
        PAYMENT_IDENT = request.form.get('PAYMENT_IDENT')
        
        # USER CHOOSES TO SAVE NEW SHIPPING/PAYMENT
        REMEMBER_SHIPPING = request.form.get('REMEMBER_SHIPPING')
        REMEMBER_BILLING = request.form.get('REMEMBER_BILLING')
        

        # USER CHOOSES NEW SHIPPING
        addressStreetAddress = request.form.get('addressStreetAddress')
        addressApartmentOrSuite = request.form.get('addressApartmentOrSuite')
        addressZip = request.form.get('addressZip')
        addressCity = request.form.get('addressCity')
        addressState = request.form.get('addressState')
        addressCountry = request.form.get('addressCountry')

        shipping_payload = (addressStreetAddress,addressApartmentOrSuite,addressZip,addressCity,addressState,addressCountry,str(1))

        # USER CHOOSES NEW PAYMENT
        checkoutCardHolderFirstName = request.form.get('checkoutCardHolderFirstName')
        checkoutCardHolderLastName = request.form.get('checkoutCardHolderLastName')
        ccn = request.form.get('ccn')
        ct = request.form.get("CCNProvider")
        ccexp = request.form.get('ccexp')
        billingStreetAddress = request.form.get('billingStreetAddres')
        billingApartmentOrSuite = request.form.get('billingApartmentOrSuite')
        billingAddressZip = request.form.get('billingAddressZip')
        billingAddressCity = request.form.get('billingAddressCity')
        billingAddressState = request.form.get('billingAddressState')
        billingAddressCountry = request.form.get('billingAddressCountry')
        
        # PAYMENT PAYLOAD CREATED AFTER BILLING_PAYLOAD HAS BEEN INSERTED
        billing_payload = (billingStreetAddress,billingApartmentOrSuite,billingAddressZip,billingAddressCity,billingAddressCountry,str(2))

        # NEW SHIPPING AND PAYMENT METHODS
        if SHIPPING_IDENT and PAYMENT_IDENT not in request.form:
            shipping_query = '''INSERT INTO address (street1,street2,zip,city,state,country,addressTypeID_address_FK) VALUES (%s,%s,%s,%s,%s,%s,%s)'''
            if REMEMBER_SHIPPING is not None:
                cursor.execute(shipping_query,shipping_payload)
                user_address_query = '''INSERT INTO user_address (userID_ua_FK,addressID_ua_FK) VALUES ((SELECT id FROM user WHERE email = %s), %s)'''
            
            billing_query = '''INSERT INTO address (street1, street2, zip, city, state,couuntry, addressTypeID_address_FK) VALUES (%s,%s,%s,%s,%s,%s,%s) '''
            if REMEMBER_BILLING is not None:
                cursor.execute(billing_query,billing_payload)
            
            payment_payload = (checkoutCardHolderFirstName,checkoutCardHolderLastName,ccn,ct,ccexp)
            payment_query = '''INSERT INTO payment_method (firstname,lastname,cardNumber,cardType,expirationDate,billingAddress_addr_FK) VALUES (%s,%s,%s,%s,%s,%s)'''
            

            pass

        # SAVED SHIPPING ADDRESS, NEW PAYMENT METHOD
        elif SHIPPING_IDENT in request.form:
            pass
        
        # SAVED PAYMENT METHOD, NEW SHIPPING ADDRESS
        elif PAYMENT_IDENT in request.form:
            pass

        # USING BOTH SAVED SHIPPING AND PAYMENT
        else:
            order_query = '''INSERT INTO order (userID_order_FK,paymentID_order_FK,total,salesTax,shippingPrice,dateOrdered,promotionID,confirmationNumber,shippingAddrID_order_FK)
            VALUES (
            (SELECT id FROM user WHERE email = %s),
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s)
            '''
            pass
        # STEP 2: INSERT INTO TABLES ACCORDING TO CASE ENDING WITH INSERTING INTO ORDER

        # STEP 3: INSERT INTO order_bod TABLE

        # STEP 4: INSERT INTO order_bod TABLE (associates an order with the appropriate book_orderdetail)

        # STEP 5: AFTER SUCCESSFUL CHECKOUT, DELETE FROM SHOPPINGCART TABLE AND REDIRECT TO CHECKOUT CONFIRMATION PAGE/ROUTE

    elif request.method == 'GET':
        total_quantity = 0
        grand_total = 0
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
            grand_total += total_price
            total_quantity += quantity
            book_payload[isbn] = {'nile_cover_id': nile_cover_ID, 'title': title,
                                  'author_name': author_name, 'price': price, 'total_price': total_price, 'quantity': quantity}

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
        print(f'billing payload --> {payment_payload}')

        return render_template('checkout.html', book_payload=book_payload, shipping_payload=shipping_payload,
                               billing_payload=payment_payload, total_quantity=total_quantity,grand_total=grand_total,
                               shipping_price=calculate_shipping(quantity=total_quantity))


@user_bp.route('/base_profile/', methods=['GET'])
@login_required
@cart_session
@remember_me
@user_only
def base_profile():
    return render_template('profile/profileBase.html')


@user_bp.route('/overview/', methods=['GET'])
@login_required
@cart_session
@remember_me
@user_only
def overview():
    return render_template('profile/profileOverview.html')


@user_bp.route('/change_name/', methods=['GET', 'POST'])
@login_required
@cart_session
@remember_me
@user_only
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
        fname_query = '''
        UPDATE user SET firstname = %s WHERE email = %s
        '''
        cursor.execute(fname_query, (fname, session['email']))
        conn.commit()

        session['lastName'] = lname
        lname_query = '''
        UPDATE user SET lastname = %s WHERE email = %s
        '''
        cursor.execute(lname_query, (lname, session['email']))
        conn.commit()

        conn.close()

        send_change_conf_email(session['email'], session['firstName'])

        flash('Your information has been recorded.')
        return redirect(url_for('user_bp.change_name'))


@user_bp.route('/change_pass/', methods=['GET', 'POST'])
@login_required
@cart_session
@remember_me
@user_only
def change_pass():
    if request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor()

        db_pass_query = '''SELECT pass FROM user WHERE email = %s'''
        cursor.execute(db_pass_query, (session['email']))
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

            send_change_conf_email(session['email'], session['firstName'])

            flash('Your information has been recorded.', category='success')
            return redirect(url_for('user_bp.change_pass'))
    else:
        return render_template('profile/profileChangePassword.html')


@user_bp.route('/order_history/', methods=['GET'])
@login_required
@cart_session
@remember_me
@user_only
def order_history():
    # Connect to niledb
    conn = mysql.connect()
    cursor = conn.cursor()

    # Grab the order histor from the user
    order_history_query = """ SELECT `order`.`id`, `book`.`price`, `book`.`ISBN`, `book`.`title`, `book`.`authorFirstName`, `book`.`authorLastName`, `order`.`dateOrdered`
                FROM `user`
                JOIN `order` ON `user`.`id`=`order`.`userID_order_FK`
                JOIN `order_bod` ON `order`.`id`=`order_bod`.`orderID_obod_FK`
                JOIN `book_orderdetail` ON `order_bod`.`bodID_obod_FK`=`book_orderdetail`.`id`
                JOIN `book` ON `book_orderdetail`.`ISBN_bod_FK`=`book`.`ISBN`
                WHERE user.email=%s
                ORDER BY `order`.`dateOrdered` ASC; """
    cursor.execute(order_history_query, (session["email"]))
    data = cursor.fetchall()

    # Close connection
    conn.close()
    return render_template('profile/profileOrderHistory.html', data=data)


@user_bp.route('/shipping_address/', methods=['GET', 'POST'])
@login_required
@cart_session
@remember_me
@user_only
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
@login_required
@cart_session
@remember_me
@user_only
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


@user_bp.route('/subscriptions/', methods=['POST', 'GET'])
@login_required
@cart_session
@remember_me
@user_only
def manage_subscriptions():
    if request.method == 'GET':
        return render_template('profile/profileSubscriptions.html')
    elif request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor()

        flag = request.form.get("flag")

        # USER IS SUBSCRIBING
        if flag == 'SUBSCRIBE':
            query = 'UPDATE user SET isSubscribed = %s WHERE email = %s'
            cursor.execute(query, (1, session['email']))

            print('subscribed')

            conn.commit()
            conn.close()
            return jsonify({'response': 200})

        # USER IS UNSUBSCRIBING
        elif flag == 'UNSUBSCRIBE':
            query = 'UPDATE user SET isSubscribed = %s WHERE email = %s'
            cursor.execute(query, (0, session['email']))

            print('unsubscribed')

            conn.commit()
            conn.close()
            return jsonify({'response': 200})
