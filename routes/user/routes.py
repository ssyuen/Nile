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


def login_required(f):
    @wraps(f)
    def wrapped_func(*args, **kws):
        if 'logged_in' in session and session['logged_in']:
            return f(*args, **kws)
        else:
            flash('You need to login to access this area!')
            return redirect(url_for('common_bp.login', ctx=f.__name__))

    return wrapped_func


def send_change_conf_email(recipient,recipient_fname,sender='rootatnilebookstore@gmail.com'):
    current_time = datetime.now()
    message_body = 'Hi ' + recipient_fname + \
        f',\n\nThere have been changes made to your profile on {current_time.month}/{current_time.day}/{current_time.year}, {current_time.hour}:{current_time.minute}:{current_time.second}. If this was not you, please go and change your password.\n\nRegards, Nile Bookstore Management'
    msg = Message(subject='Nile Profile Change', recipients=[
        recipient, 'rootatnilebookstore@gmail.com'], sender='rootatnilebookstore@gmail.com', body=message_body)
    mail.send(msg)


@user_bp.route('/checkout/')
@login_required
@cart_session
@remember_me
def checkout():
    return redirect(url_for('user_bp.checkout'))


@user_bp.route('/base_profile/', methods=['GET'])
@login_required
@cart_session
@remember_me
def base_profile():
    return render_template('profile/profileBase.html')


@user_bp.route('/overview/', methods=['GET'])
@login_required
@cart_session
@remember_me
def overview():
    return render_template('profile/profileOverview.html')


@user_bp.route('/change_name/', methods=['GET', 'POST'])
@login_required
@cart_session
@remember_me
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

        send_change_conf_email(session['email'],session['firstName'])

        flash('Your information has been recorded.')
        return redirect(url_for('user_bp.change_name'))


@user_bp.route('/change_pass/', methods=['GET', 'POST'])
@login_required
@cart_session
@remember_me
def change_pass():
    if request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor()

        new_password = request.form.get('newPassword')
        confirm_new_password = request.form.get('confirmNewPassword')

        if new_password != confirm_new_password:
            return jsonify({'Response': 400})
        else:
            new_password = bcrypt.hashpw(
                new_password.encode('utf-8'), bcrypt.gensalt())

            query = 'UPDATE user SET pass=%s WHERE email=%s'
            cursor.execute(query, (new_password, session['email']))
            conn.commit()
            conn.close()

            send_change_conf_email(session['email'],session['firstName'])

            flash('Your information has been recorded.')
            return redirect(url_for('user_bp.change_pass'))
    else:
        return render_template('profile/profileChangePassword.html')


@user_bp.route('/order_history/', methods=['GET'])
@login_required
@cart_session
@remember_me
def order_history():
    # Connect to niledb
    conn = mysql.connect()
    cursor = conn.cursor()

    # Grab the order histor from the user
    order_history_query = """ SELECT `order`.`id`, `book`.`price`, `book`.`ISBN`, `book`.`title`, `book`.`authorFirstName`, `book`.`authorLastName`, `order`.`dateOrdered`
                FROM `niledb`.`user`
                JOIN `niledb`.`order` ON `user`.`id`=`order`.`userID_order_FK`
                JOIN `niledb`.`order_bod` ON `order`.`id`=`order_bod`.`orderID_obod_FK`
                JOIN `niledb`.`book_orderdetail` ON `order_bod`.`bodID_obod_FK`=`book_orderdetail`.`id`
                JOIN `niledb`.`book` ON `book_orderdetail`.`ISBN_bod_FK`=`book`.`ISBN`
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
            conn.commit()

        elif flag == "REMOVE_FLAG":
            remove_query = '''
            DELETE FROM user_address
            WHERE userID_ua_FK = (SELECT id FROM user WHERE email = %s)
                AND addressID_ua_FK = %s
            '''
            cursor.execute(remove_query, (session['email'], addr_id))

            remove_query = '''
            DELETE FROM address WHERE id = %s
            '''
            cursor.execute(remove_query, (addr_id))
            conn.commit()

        elif flag == "EDIT_FLAG":

            update_query = '''
            UPDATE address SET street1 = %s, street2 = %s, city = %s, zip = %s, state = %s, country = %s, addressTypeID_address_FK = %s
            WHERE id = %s
            '''
            cursor.execute(update_query, (street_addr, street_addr2,
                                          zipcode, city, state, country, 1, addr_id))
            conn.commit()
        
        send_change_conf_email(session['email'],session['firstName'])
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

            create_a = """
                INSERT INTO address(street1, street2, city, zip, state, country, addressTypeID_address_FK) 
                VALUES(%s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(create_a, (street1, street2,
                                      city, zipcode, state, country, 2))

            create_pm = """
                INSERT INTO payment_method(firstname, lastname, cardNumber, cardType, expirationDate, userID_payment_FK, billingAddress_addr_FK)
                VALUES (%s, %s, %s, %s, %s, 
                (SELECT id FROM user WHERE email = %s), 
                (SELECT id FROM address ORDER BY id DESC LIMIT 1)
                )
            """
            cursor.execute(create_pm, (cfn, cln, ccn,
                                       ct, ccexp, session['email']))
            conn.commit()

        elif flag == "REMOVE_FLAG":
            remove_pm = """DELETE FROM payment_method WHERE id = %s"""
            cursor.execute(remove_pm, (pm_id))

            remove_a = """DELETE FROM address WHERE id = %s"""
            cursor.execute(remove_a, (addr_id))
            conn.commit()

        elif flag == "EDIT_FLAG":

            update_pm = '''UPDATE payment_method SET firstname = %s, lastname = %s, expirationDate = %s WHERE id = %s'''
            cursor.execute(update_pm, (cfn, cln, ccexp))
            conn.commit()

            update_a = '''UPDATE address SET street1 = %s, street2 = %s, city = %s, zip = %s, state = %s, country = %s WHERE id = %s'''
            cursor.execute(update_a, (street1, street2, city,
                                      zipcode, state, country, addr_id))
            conn.commit()

        conn.close()

        send_change_conf_email(session['email'],session['firstName'])

        return redirect(url_for('user_bp.payment_methods'))

    # GET REQUEST
    else:

        user_payments = """
            SELECT PM.id, PM.firstname, PM.lastname, PM.cardNumber, PM.cardType, PM.expirationDate, PM.billingAddress_addr_FK, A.id,
                    A.street1, A.street2, A.zip, A.city, A.state, A.country
            FROM payment_method PM
                    INNER JOIN address A ON PM.billingAddress_addr_FK = A.id
            WHERE userID_payment_FK = (SELECT id FROM user WHERE email = %s)
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
