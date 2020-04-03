from flask import Blueprint, render_template, request, jsonify, redirect, flash, session, url_for
from flask_mail import Message
from functools import wraps
from flaskext.mysql import pymysql
import requests as r
import bcrypt
import sys
import secrets
from server import mysql, mail

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
            return redirect(url_for('user_bp.login', ctx=f.__name__))
    return wrapped_func


def cart_session(f):
    @wraps(f)
    def wrapped_func(*args, **kws):
        if 'shopping_cart' in session:
            # print(True)
            return f(*args, **kws)
        else:
            session['shopping_cart'] = list()
            return f(*args, **kws)
    return wrapped_func


@user_bp.route('/')
@cart_session
def landing_page(search_results=None):
    # print(session['shopping_cart'])
    # STEP 1: Make call to database to return all books, need ISBN for query in /product/?isbn=<isbn>
    conn = mysql.connect()
    cursor = conn.cursor()
    query = 'SELECT * FROM books'

    # STEP 2: Pass list of books to browse.html

    # STEP 3: In browse.html, iterate through list of books to populate page
    conn.close()
    return render_template('browse.html')


@user_bp.route('/login/', methods=['POST', 'GET'])
@cart_session
def login(ctx=None):
    if request.method == 'POST':
        userEmail = request.form.get('userEmail')
        password = request.form.get('userPassword')
        conn = mysql.connect()
        cursor = conn.cursor()

        if '@nile.com' in userEmail:

            admin_payload = userEmail
            query = 'SELECT email ,pass, firstName, lastName from admin WHERE email = %s'
            cursor.execute(query, (admin_payload))
            conn.close()

            try:
                results = cursor.fetchall()[0]
                db_pass = results[1].encode('utf-8')
                # db_pass = db_pass[2:-1].encode('utf-8')
                if bcrypt.checkpw(password.encode('utf-8'), db_pass):
                    session['logged_in'] = True
                    session['email'] = results[0]
                    session['admin'] = True
                    session['lastName'] = results[3]
                    session['firstName'] = results[2]

                    session.permanent = True

                    # flash('Welcome, ' + session['firstName'] + '!')
                    ctx = request.args.get('next')
                    return redirect(ctx or url_for('user_bp.landing_page'))
                else:
                    flash('Your login details were incorrect. Please try again.')
                    return redirect('/login/')
            except IndexError:
                flash('Your login details were not found. Please try again.')
                return redirect('/login/')
        else:

            user_payload = userEmail
            query = 'SELECT email, pass, firstName, lastName from user WHERE email= %s'
            cursor.execute(query, user_payload)
            conn.close()
            try:
                results = cursor.fetchall()[0]
                # print(results)
                # unencoded_pass = results[1]
                db_pass = results[1].encode('utf-8')
                # print(f'unencoded = {unencoded_pass}')
                print(db_pass)
                # db_pass = db_pass[2:-1].encode('utf-8')

                if bcrypt.checkpw(password.encode('utf-8'), db_pass):
                    session['logged_in'] = True
                    session['email'] = results[0]
                    session['admin'] = False
                    session['lastName'] = results[3]
                    session['firstName'] = results[2]

                    session.permanent = True

                    ctx = request.args.get('ctx')
                    if ctx is not None:
                        return redirect(url_for('user_bp.' + ctx))
                    else:
                        return redirect('/')
                else:
                    flash('Your login details were incorrect. Please try again.')
                    return redirect('/login/')
                session['logged_in'] = True
                session['email'] = userEmail
                session['firstName'] = results[2]

                session.permanent = True

                flash('Welcome, ' + session['firstName'] + '!')
                return redirect('/')
            except IndexError:
                flash('Your login details were not found. Please try again.')
                return redirect('/login/')

    else:
        return render_template('login.html')


@user_bp.route('/logout/', methods=['GET'])
@cart_session
def logout():
    if 'logged_in' in session and session['logged_in']:
        if 'admin' in session:
            session['admin'] = False
        session['logged_in'] = False
        session['admin'] = False
        flash('Logged out successfully.')
        return redirect('/')
    flash('Error logging out.')
    return redirect('/')


@user_bp.route('/register/', methods=['POST', 'GET'])
@cart_session
def register():
    if request.method == 'GET':
        return render_template('reg.html')
    else:
        # NEED TO CHECK REQUEST FORM SIZE TO SEE IF OPTIONAL COMPONENNTS HAVE BEEN ADDED
        firstName = request.form.get('inputFirstName')
        firstLetter = firstName[0].upper()
        firstName = firstLetter + firstName[1:].lower()

        lastName = request.form.get('inputLastName')
        firstLetter = lastName[0].upper()
        lastName = firstLetter + lastName[1:].lower()

        email = request.form.get('inputEmail')
        password = request.form.get('inputPassword')
        password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        # USER PAYLOAD
        user_payload = (email, str(1),
                        password, firstName, lastName)

        # shipping address optional
        shipping_address = request.form.get('addAddressStreetAddress')
        shipping_apt = request.form.get('addAddressApartmentOrSuite')
        shipping_zipcode = request.form.get('addZipcode')
        shipping_city = request.form.get('addAddressCity')
        shipping_state = request.form.get('addAddressState')
        shipping_country = request.form.get('addAddressCountry')
        # 1 on the end specifies that this is a shipping address
        shipping_payload = (shipping_address, shipping_apt, shipping_city, shipping_zipcode,
                            shipping_state, shipping_country, str(1))

        # payment info optional + associated billing info
        card_first_name = request.form.get('cardHolderFirstName')
        card_last_name = request.form.get('cardHolderLastName')
        try:
            ccn = bcrypt.hashpw(request.form.get(
                'ccn').encode('utf-8'), bcrypt.gensalt())
        except:
            ccn = ''
        ccexp = request.form.get('ccexp') + '-01'

        billing_address = request.form.get('billingStreetAddress')
        billing_apt_suite = request.form.get('billingApartmentOrSuite')
        billing_zip = request.form.get('billingZipcode')
        billing_city = request.form.get('billingCity')
        billing_state = request.form.get('billingState')
        billing_country = request.form.get('billingCountry')
        # 2 on the end specifies that this is a billing address
        billing_payload = (billing_address, billing_apt_suite, billing_city,
                           billing_zip, billing_state, billing_country, str(2))

        # INITIALIZE CONNECTION TO DB
        conn = mysql.connect()
        cursor = conn.cursor()

        '''
        REGISTRATION CONDITIONS:
        #1: NO SHIPPING OR PAYMENT METHOD
        #2: SHIPPING ADDRESS PROVIDED
        #3: PAYMENT METHOD PROVIDED
        #4: BOTH SHIPPING AND PAYMENT PROVIDED
        '''

        # INSERTING WITH NO SHIPPING OR PAYMENT METHOD
        if None in shipping_payload and None in billing_payload:
            query = 'INSERT INTO user (email,statusID_user_FK,pass, firstname, lastname) VALUES (%s, %s, %s, %s, %s)'
            try:
                cursor.execute(query, user_payload)
                conn.commit()

                user_id_query = 'SELECT id FROM user ORDER BY id DESC LIMIT 1'
                cursor.execute(user_id_query)
                user_id = cursor.fetchall()[0][0]

                conn.close()
            except(pymysql.err.IntegrityError):
                flash('An account with this email already exists.')
                return redirect(url_for('user_bp.register'))

        else:  # insert with shipping and billing address
            # INSERTING SHIPPING ADDRESS AND PAYMENT INFO
            if None not in shipping_payload and None not in billing_payload:
                query = 'INSERT INTO `address`(street1, street2, city, zip, state, country, addressTypeID_address_FK) VALUES(%s, %s, %s, %s, %s, %s, %s)'
                cursor.execute(query, shipping_payload)

                # EXTRACTING SHIPPING ADDRESS
                shipping_id_query = 'SELECT id FROM address ORDER BY id DESC LIMIT 1'
                cursor.execute(shipping_id_query)
                shipping_id = cursor.fetchall()[0][0]

                # INSERTING BILLING ADDRESS
                query = 'INSERT INTO address (street1,street2,city,zip,state,country,addressTypeID_address_FK) VALUES (%s, %s, %s, %s, %s, %s, %s)'
                cursor.execute(query, billing_payload)

                # EXTRACTING BILLING ADDRESS ID
                billing_id_query = 'SELECT id FROM address ORDER BY id DESC LIMIT 1'
                cursor.execute(billing_id_query)
                billing_id = cursor.fetchall()[0][0]

                # INSERTING USER
                query = 'INSERT INTO user (email, statusID_user_FK,pass, firstname, lastname) VALUES (%s, %s, %s, %s, %s)'
                cursor.execute(query, user_payload)

                # EXTRACTING USER ID
                user_id_query = 'SELECT id FROM user ORDER BY id DESC LIMIT 1'
                cursor.execute(user_id_query)
                user_id = cursor.fetchall()[0][0]

                # INSERTING USER ID AND SHIPPING ADDRESS ID INTO user_address association table
                query = 'INSERT INTO user_address (userID_ua_FK, addressID_ua_FK) VALUES (%s, %s)'
                cursor.execute(query, (user_id, shipping_id))

                # payment_payload depends on user and billing FKs
                payment_payload = (ccn, ccexp, user_id, billing_id)
                query = 'INSERT INTO payment_method (cardNumber, expirationDate, userID_payment_FK, billingAddress_addr_FK) VALUES (%s, %s, %s, %s)'
                cursor.execute(query, payment_payload)

            # INSERTING BILLING ADDRESS (PAYMENT INFO ONLY)
            elif None in shipping_payload and None not in billing_payload:
                query = 'INSERT INTO address (street1,street2,city,zip,state,country,addressTypeID_address_FK) VALUES (%s, %s, %s, %s, %s, %s, %s)'
                cursor.execute(query, billing_payload)

                # EXTRACTING BILLING ADDRESS ID
                billing_id_query = 'SELECT id FROM address ORDER BY id DESC LIMIT 1'
                cursor.execute(billing_id_query)
                billing_id = cursor.fetchall()[0][0]

                # INSERTING USER
                query = 'INSERT INTO user (email, statusID_user_FK,pass, firstname, lastname) VALUES (%s, %s, %s, %s, %s)'
                cursor.execute(query, user_payload)

                # EXTRACTING USER ID
                user_id_query = 'SELECT id FROM user ORDER BY id DESC LIMIT 1'
                cursor.execute(user_id_query)
                user_id = cursor.fetchall()[0][0]

                # payment_payload depends on user and billing FKs
                payment_payload = (ccn, ccexp, user_id, billing_id)
                query = 'INSERT INTO payment_method (cardNumber, expirationDate, userID_payment_FK, billingAddress_addr_FK) VALUES (%s, %s, %s, %s)'
                cursor.execute(query, payment_payload)

            # INSERTING SHIPPING ADDRESS (SHIPPING ADDRESS ONLY)
            elif None in billing_payload and None not in shipping_payload:
                print('inserting only shipping address')
                query = 'INSERT INTO `address`(street1, street2, city, zip, state, country, addressTypeID_address_FK) VALUES(%s, %s, %s, %s, %s, %s, %s)'
                cursor.execute(query, shipping_payload)

                # EXTRACTING SHIPPING ADDRESS
                shipping_id_query = 'SELECT id FROM address ORDER BY id DESC LIMIT 1'
                cursor.execute(shipping_id_query)
                shipping_id = cursor.fetchall()[0][0]

                # INSERTING USER
                query = 'INSERT INTO user (email, statusID_user_FK,pass, firstname, lastname) VALUES (%s, %s, %s, %s, %s)'
                cursor.execute(query, user_payload)

                # EXTRACTING USER ID
                user_id_query = 'SELECT id FROM user ORDER BY id DESC LIMIT 1'
                cursor.execute(user_id_query)
                user_id = cursor.fetchall()[0][0]

                # INSERTING USER ID AND SHIPPING ADDRESS ID INTO user_address association table
                query = 'INSERT INTO user_address (userID_ua_FK, addressID_ua_FK) VALUES (%s, %s)'
                cursor.execute(query, (user_id, shipping_id))

            conn.commit()
            conn.close()

        # return render_template('confirmation/reg_conf.html')
        return redirect(url_for('user_bp.register_confirmation', sending_token=secrets.token_urlsafe(256), email=email, user_id=user_id, name=firstName))


@user_bp.route('/register_confirmation/<sending_token>++<email>+<user_id>+<name>', methods=['GET'])
@cart_session
def register_confirmation(sending_token, email=None, user_id=None, name=None):
    try:
        conn = mysql.connect()
        cursor = conn.cursor()

        verification_token = secrets.token_urlsafe(16)

        query = 'INSERT INTO user_token (userID_utoken_FK,token) VALUES (%s, %s)'
        cursor.execute(query, (user_id, verification_token))

        conn.commit()
        conn.close()

        verification_url = f'http://127.0.0.1:5000/email_confirmation/{verification_token}'

        message_body = 'Hi ' + name + \
            f',\n\nPlease click on the following link to confirm your registration here at Nile!\n\n{verification_url}\n\nRegards, Nile Bookstore Management'
        msg = Message(subject='Nile Registration Confirmation', recipients=[
            email, 'rootatnilebookstore@gmail.com'], sender='rootatnilebookstore@gmail.com', body=message_body)
        mail.send(msg)

    except(pymysql.err.IntegrityError):
        return render_template('confirmation/reg_conf.html')

    return render_template('confirmation/reg_conf.html')


@user_bp.route('/email_confirmation/<verify_token>', methods=['GET'])
@cart_session
def email_confirmation(verify_token):
    # system needs to send an email with url back to a page
    conn = mysql.connect()
    cursor = conn.cursor()

    verification_token = request.path[20:]
    print('emailconfirmation', verification_token)
    user_id_query = 'SELECT userID_utoken_FK FROM user_token WHERE user_token.token = %s'
    cursor.execute(user_id_query, (verification_token))
    user_id = cursor.fetchall()[0][0]

    query = 'UPDATE user SET statusID_user_FK = 2 WHERE user.id = %s'

    cursor.execute(query, (user_id))
    conn.commit()
    conn.close()

    return render_template('confirmation/email_conf.html')


@user_bp.route('/shoppingcart/')
@cart_session
def shopping_cart():
    return render_template('shoppingcart.html')


@user_bp.route('/product/', methods=['GET', 'POST'])
@cart_session
def product():
    print('In Product')
    # STEP 1: User clicks on a book from browse.html

    # STEP 2: Link sends
    if request.method == 'GET':
        return render_template('/product.html')
    else:
        print(session, file=sys.stderr)
        book_isbn = request.form.get('bookISBN')
        old_cart = session['shopping_cart']
        if book_isbn in session['shopping_cart']:
            old_cart.remove(book_isbn)
        else:
            old_cart.append(book_isbn)
        session['shopping_cart'] = old_cart
        print(session, file=sys.stderr)
        return jsonify(session['shopping_cart'])


@user_bp.route('/add_to_cart/', methods=['POST'])
@cart_session
def add_to_cart():
    return ''


@user_bp.route('/checkout/')
@login_required
@cart_session
def checkout():
    return render_template('./checkout.html')


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


@user_bp.route('/change_name/', methods=['GET'])
@login_required
@cart_session
def change_name():
    return render_template('profile/profileChangeName.html')


@user_bp.route('/change_pass/', methods=['GET'])
@login_required
@cart_session
def change_pass():
    return render_template('profile/profileChangePassword.html')


@user_bp.route('/order_history/', methods=['GET'])
@login_required
@cart_session
def order_history():
    return render_template('profile/profileOrderHistory.html')


@user_bp.route('/shipping_address/', methods=['GET'])
@login_required
@cart_session
def shipping_address():
    return render_template('profile/profileShippingAddress.html')


@user_bp.route('/payment_methods/', methods=['GET'])
@login_required
@cart_session
def payment_methods():
    return render_template('profile/profilePaymentMethods.html')


@user_bp.route('/password_change/', methods=['POST'])
@login_required
@cart_session
def password_change():
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


@user_bp.route('/forgot/')
@cart_session
def forgot():
    return render_template('./forgot.html')
