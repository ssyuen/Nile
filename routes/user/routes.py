from flask import Blueprint, render_template, request, jsonify, redirect, flash, session, url_for
from functools import wraps
from flaskext.mysql import pymysql
import bcrypt
# from models.abs_models import abs_models
# from models.users import User
from server import conn
# import conn

# from scripts.apps.books import books
# from scripts.apps.checkout import checkout
# from scripts.apps.login_registration import login
# from scripts.apps.login_registration import reg
# from scripts.apps.promos import promos
# from scripts.apps.users import users
# from scripts.apps.users.user_profile import billing
# from scripts.apps.users.user_profile import payment
# from scripts.apps.users.user_profile import profile

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
            print(True)
            return f(*args, **kws)
        else:
            session['shopping_cart'] = list()
            return f(*args, **kws)
    return wrapped_func


@user_bp.route('/')
@cart_session
def landing_page(search_results=None):
    print(session['shopping_cart'])
    # STEP 1: Make call to database to return all books, need ISBN for query in /product/?isbn=<isbn>
    cursor = conn.cursor()
    query = 'SELECT * FROM books'

    # STEP 2: Pass list of books to browse.html

    # STEP 3: In browse.html, iterate through list of books to populate page
    return render_template('browse.html')


@user_bp.route('/login/', methods=['POST', 'GET'])
@cart_session
def login(ctx=None):
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        cursor = conn.cursor()
        # ONCE DB SCHEMA IS SETUP, GET RID
        # OF AND PASSWORD AND USE BCRYPT.CHECKPW(PASSWORD,QUERIED PASSWORD)
        if '@nile.com' in email:

            query = 'SELECT email ,pass, firstName, lastName, username from admin WHERE email = "' + \
                    email + '"'
            cursor.execute(query)

            try:
                results = cursor.fetchall()[0]
                db_pass = results[1]
                db_pass = db_pass[2:-1].encode('utf-8')
                if bcrypt.checkpw(password.encode(), db_pass):
                    session['logged_in'] = True
                    session['email'] = email
                    session['admin'] = True
                    session['username'] = results[4]
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
            # query = 'SELECT email ,pass, firstName, lastName from user WHERE email = "' + \
            #         email + '"'
            query = 'SELECT email, pass, firstName, lastName, username from user WHERE email= %s'
            cursor.execute(query, (email))
            try:
                results = cursor.fetchall()[0]
                db_pass = results[1]
                db_pass = db_pass[2:-1].encode('utf-8')

                if bcrypt.checkpw(password.encode('utf-8'), db_pass):
                    session['logged_in'] = True
                    session['email'] = email
                    session['admin'] = False
                    session['username'] = results[4]
                    session['lastName'] = results[3]
                    session['firstName'] = results[2]
                    # flash('Welcome, ' + session['firstName'] + '!')
                    ctx = request.args.get('ctx')
                    if ctx is not None:
                        return redirect(url_for('user_bp.' + ctx))
                    else:
                        return redirect('/')
                    # return redirect('/')
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
    if session['logged_in']:
        session['admin'] = False
        session['logged_in'] = False
        # flash('Logged out successfully.')
        return redirect('/')
    else:
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
        username = request.form.get('inputUsername')
        password = request.form.get('inputPassword')
        password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        # optional

        address = request.form.get('addAddressStreetAddress')
        apt = request.form.get('addAddressApartmentOrSuite')
        zipcode = request.form.get('addZipcode')
        city = request.form.get('addAddressCity')
        state = request.form.get('addAddressState')
        country = request.form.get('addAddressCountry')

        cursor = conn.cursor()

        # query = 'INSERT INTO orders (orderID) VALUES(0)'
        # cursor.execute(query)
        # db_order = 'SELECT orderID FROM orders ORDER BY orderID DESC LIMIT 1'
        # cursor.execute(db_order)
        # results = cursor.fetchall()[0]
        # order_id = results[0]

        # query = 'INSERT INTO shoppingCart (orderID) VALUES("' + str(order_id) + '")'
        # cursor.execute(query)
        # db_cart = 'SELECT cartID FROM shoppingCart ORDER BY cartID DESC LIMIT 1'
        # cursor.execute(db_cart)
        # results = cursor.fetchall()[0]
        # cart_id = results[0]

        # FRONT-END NEEDS TO PROHIBIT ADDRESS FROM BEING PARTIALLY FILLED OUT
        if address or apt or city or state or country is None:
            user_payload = (email, username, str(
                1), password, firstName, lastName)
            query = 'INSERT INTO user (email, username,statusID_user_FK,pass, firstname, lastname) VALUES (%s, %s, %s, %s, %s, %s)'
            try:
                cursor.execute(query, user_payload)
                conn.commit()
            except(pymysql.err.IntegrityError):
                flash('An account with this email/username already exists.')
                return redirect(url_for('user_bp.register'))

        else:  # insert with address
            query = 'INSERT INTO `address`(`street`, `city`, `state`, `zip`,`country`,addressTypeID_address_FK) VALUES(%s, %s, %s, %s, %s, %s, %s)'
            cursor.execute(query)
            db_address = 'SELECT addressID FROM address ORDER BY addressID DESC LIMIT 1'
            cursor.execute(db_address)
            results = cursor.fetchall()[0]
            address_id = results[0]
            query = 'INSERT INTO user (email, username, statusID,pass, firstname, lastname) VALUES (%s, %s, %s, %s, %s, %s)'
            cursor.execute(query, user_payload)
            conn.commit()

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
    # STEP 1: User clicks on a book from browse.html

    # STEP 2: Link sends
    if request.method == 'GET':
        return render_template('/product.html')
    else:
        book_name = request.form.get('bookName')
        print(f'book name is {book_name}')
        print(f'type is {type(book_name)}')

        old_cart = session['shopping_cart']
        print(f'old cart is {old_cart}')
        old_cart.append(book_name)
        session['shopping_cart'] = old_cart
        print(f'new cart is {session["shopping_cart"]}')
        # session['shopping_cart'].append(book_name)
        # print(session['shopping_cart'])
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


@user_bp.route('/profile/')
@login_required
@cart_session
def profile():
    return render_template('./profile.html')


@user_bp.route('/forgot/')
@cart_session
def forgot():
    return render_template('./forgot.html')
