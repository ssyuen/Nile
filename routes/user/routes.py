from flask import Blueprint, render_template, request, jsonify, redirect, flash, session, url_for
from functools import wraps
from flaskext.mysql import pymysql
import bcrypt
import sys
from server import mysql

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
                if bcrypt.checkpw(password.encode(), db_pass):
                    session['logged_in'] = True
                    session['email'] = results[0]
                    session['admin'] = True
                    session['lastName'] = results[3]
                    session['firstName'] = results[2]
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
                db_pass = results[1].encode('utf-8')
                # db_pass = db_pass[2:-1].encode('utf-8')

                if bcrypt.checkpw(password.encode('utf-8'), db_pass):
                    session['logged_in'] = True
                    session['email'] = results[0]
                    session['admin'] = False
                    session['lastName'] = results[3]
                    session['firstName'] = results[2]
                    ctx = request.args.get('ctx')
                    if ctx is not None:
                        return redirect(url_for('user_bp.' + ctx))
                    else:
                        return redirect('/')
                else:
                    flash('Your login details were incorrect. Please try again.')
                    return redirect('/login/')
                session['logged_in'] = True
                session['email'] = email
                session['firstName'] = results[2]
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
        firstName = request.form.get('inputFirstname')
        lastName = request.form.get('inputLastname')
        email = request.form.get('inputEmail')
        password = request.form.get('inputPassword')
        password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        # optional

        address = request.form.get('addAddressStreetAddress')
        apt = request.form.get('addAddressApartmentOrSuite')
        zipcode = request.form.get('addZipcode')
        city = request.form.get('addAddressCity')
        state = request.form.get('addAddressState')
        country = request.form.get('addAddressCountry')

        conn = mysql.connect()
        cursor = conn.cursor()

        user_payload = (email, str(1),
                        password, firstName, lastName)
        if address and apt and city and state and country is None:

            query = 'INSERT INTO user (email,statusID_user_FK,pass, firstname, lastname) VALUES (%s, %s, %s, %s, %s)'
            try:
                cursor.execute(query, user_payload)
                conn.commit()
                conn.close()
            except(pymysql.err.IntegrityError):
                flash('An account with this email already exists.')
                return redirect(url_for('user_bp.register'))

        else:  # insert with address
            address_payload = (address, apt, city, zipcode,
                               state, country, str(1))
            # print(address_payload)
            query = 'INSERT INTO `address`(street1, street2, city, zip, state, country, addressTypeID_address_FK) VALUES(%s, %s, %s, %s, %s, %s, %s)'
            cursor.execute(query, address_payload)
            conn.commit()

            query = 'INSERT INTO user (email, statusID_user_FK,pass, firstname, lastname) VALUES (%s, %s, %s, %s, %s)'
            cursor.execute(query, user_payload)
            conn.commit()

            user_id_query = 'SELECT id FROM user ORDER BY id DESC LIMIT 1'
            cursor.execute(user_id_query)
            user_id = cursor.fetchall()[0][0]

            address_id_query = 'SELECT id FROM address ORDER BY id DESC LIMIT 1'
            cursor.execute(address_id_query)
            address_id = cursor.fetchall()[0][0]

            query = 'INSERT INTO user_address (userID_ua_FK, addressID_ua_FK) VALUES (%s, %s)'
            cursor.execute(query, (user_id, address_id))
            conn.commit()

            conn.close()

        return render_template('reg_conf.html')


@user_bp.route('/register_confirmation/', methods=['POST', 'GET'])
@cart_session
def register_confirmation():
    # system needs to send an email with url back to a page
    # if request.method == 'GET':

    return render_template('reg_conf.html')


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
        book_isbn = request.form.get('bookISBN')
        old_cart = session['shopping_cart']
        old_cart.append(book_isbn)
        session['shopping_cart'] = old_cart
        print(session, file=sys.stderr)
        return jsonify(session['shopping_cart'])


@user_bp.route('/add_to_cart/', methods=['POST'])
@cart_session
def add_to_cart():
    return ''


# @login_required func decorator needs to be implemented for all user routes
"""User Routes"""
@user_bp.route('/billingaddress/')
@login_required
@cart_session
def billing_address():
    return render_template('./billingaddress.html')


@user_bp.route('/checkout/')
@login_required
@cart_session
def checkout():
    return render_template('./checkout.html')


@user_bp.route('/orderhist/')
@login_required
@cart_session
def order_history():
    return render_template('./orderhist.html')


@user_bp.route('/paymentinfo/')
@login_required
@cart_session
def payment_info():
    return render_template('./paymentinfo.html')


@user_bp.route('/profile/',methods=['GET'])
@login_required
@cart_session
def profile():
    return render_template('./profile.html')

@user_bp.route('/password_change/',methods=['POST'])
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
            return jsonify({'Response':400})
        else:
            new_password = bcrypt.hashpw(new_password.encode('utf-8'),bcrypt.gensalt())
            conn = mysql.connect()
            cursor = conn.cursor()
            print(session['email'])
            query = 'UPDATE user SET pass=%s WHERE email=%s'
            cursor.execute(query,(new_password,session['email']))
            conn.commit()
            conn.close()
            return jsonify({'Response':200})



@user_bp.route('/forgot/')
@cart_session
def forgot():
    return render_template('./forgot.html')
