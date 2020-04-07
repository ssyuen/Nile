from flask import Blueprint, render_template, request, jsonify, redirect, flash, session, url_for
from flask_mail import Message
from functools import wraps
from flaskext.mysql import pymysql
import requests as r
import bcrypt
import sys
import secrets
from server import mysql, mail

from routes.common.routes import cart_session

user_bp = Blueprint('user_bp', __name__,
                    template_folder='templates', static_folder='static')


def login_required(f):
    @wraps(f)
    def wrapped_func(*args, **kws):
        if 'logged_in' in session and session['logged_in']:
            return f(*args, **kws)
        else:
            flash('You need to login to access this area!')
            # return redirect('/login/')
            return redirect(url_for('common_bp.login', ctx=f.__name__))

    return wrapped_func


@user_bp.route('/checkout/')
@login_required
@cart_session
def checkout():
    if session['verified']:
        return render_template('./checkout.html')
    else:
        flash('You must verify your email before checking out!')
        return redirect(url_for('user_bp.checkout'))


@user_bp.route('/base_profile/', methods=['GET'])
@login_required
@cart_session
def base_profile():
    return render_template('profile/profileBase.html')


@user_bp.route('/overview/', methods=['GET'])
@login_required
@cart_session
def overview():
    return render_template('profile/profileOverview.html')


# TODO
@user_bp.route('/change_name/', methods=['GET'])
@login_required
@cart_session
def change_name():
    return render_template('profile/profileChangeName.html')


# TODO
@user_bp.route('/change_pass/', methods=['GET'])
@login_required
@cart_session
def change_pass():
    if request.method == 'POST':
        new_password = request.form.get('newPassword')
        confirm_new_password = request.form.get('confirmNewPassword')

        print(new_password)
        print(confirm_new_password)
        print(type(new_password))
        if new_password != confirm_new_password:
            return jsonify({'Response': 400})
        else:
            new_password = bcrypt.hashpw(
                new_password.encode('utf-8'), bcrypt.gensalt())
            conn = mysql.connect()
            cursor = conn.cursor()
            print(session['email'])
            query = 'UPDATE user SET pass=%s WHERE email=%s'
            cursor.execute(query, (new_password, session['email']))
            conn.commit()
            conn.close()
            return jsonify({'Response': 200})
    else:
        return render_template('profile/profileChangePassword.html')


@user_bp.route('/order_history/', methods=['GET'])
@login_required
@cart_session
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


# TODO
@user_bp.route('/shipping_address/', methods=['GET', 'POST'])
@login_required
@cart_session
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


# TODO
@user_bp.route('/payment_methods/', methods=['GET', 'POST'])
@login_required
@cart_session
def payment_methods():
    pass
