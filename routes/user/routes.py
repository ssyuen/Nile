from flask import Blueprint, render_template, request, jsonify, redirect, flash, session
from functools import wraps
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
        if 'logged_in' in session:
            return f(*args, **kws)
        else:
            flash('You need to login to access this area!')
            return redirect('/login/')
    return wrapped_func


@user_bp.route('/')
def landing_page():
    return render_template('browse.html')


@user_bp.route('/login/', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # ONCE DB SCHEMA IS SETUP, GET RID
        # OF AND PASSWORD AND USE BCRYPT.CHECKPW(PASSWORD,QUERIED PASSWORD)
        if '@nile.com' in email:

            query = 'SELECT email ,pass, firstName from admin WHERE email = "' + \
                    email + '" AND pass = "' + password + '"'
        else:
            query = 'SELECT email ,pass, firstName from user WHERE email = "' + \
                    email + '" AND pass = "' + password + '"'

        print(email)

        cursor = conn.cursor()
        cursor.execute(query)

        try:
            results = cursor.fetchall()[0]
            session['logged_in'] = True
            session['email'] = email
            session['firstName'] = results[2]
            flash('Welcome, ' + session['firstName'] + '!')
            return redirect('/')
        except IndexError:
            print('login details incorrect')
            flash('Your login details were not found. Please try again.')
            return redirect('/login/')
    else:
        return render_template('login.html')


@user_bp.route('/logout/', methods=['GET'])
def logout():
    if session['logged_in']:
        session['logged_in'] = False
        flash('Logged out successfully.')
        return redirect('/')
    flash('Error logging out.')
    return redirect('/')


@user_bp.route('/register/', methods=['POST', 'GET'])
def register():
    if request.method == 'GET':
        return render_template('reg.html')
    else:
        # NEED TO CHECK REQUEST FORM SIZE TO SEE IF OPTIONAL COMPONENNTS HAVE BEEN ADDED
        firstName = request.form.get('firstName')
        lastName = request.form.get('lastName')
        email = request.form.get('email')
        password = request.form.get('password')
        # password = bcrypt.hashpw(request.form.get('password').encode(), bcrypt.gensalt())

        # optional
        address = request.form.get('address')
        apt = request.form.get('apt')
        city = request.form.get('city')
        state = request.form.get('state')
        country = request.form.get('country')

        # cursor = conn.cursor()
        # query = 'INSERT INTO users (firstName,lastName,email,password'"'
        # cursor.execute(query)
        # try:
        #     results = cursor.fetchall()[0]

    return render_template('reg.html')

@user_bp.route('/register_confirmation/',methods=['POST','GET'])
def register_confirmation():
    #system needs to send an email with url back to a page
    pass

@user_bp.route('/shoppingcart/')
def shopping_cart():
    return render_template('shoppingcart.html')


# @login_required func decorator needs to be implemented for all user routes
"""User Routes"""
@user_bp.route('/user/billingaddress/')
@login_required
def billing_address():
    return render_template('./user pages/billingaddress.html')


@user_bp.route('/user/checkout/')
@login_required
def checkout():
    return render_template('./user pages/checkout.html')


@user_bp.route('/user/orderhist/')
@login_required
def order_history():
    return render_template('./user pages/orderhist.html')


@user_bp.route('/user/paymentinfo/')
@login_required
def payment_info():
    return render_template('./user pages/paymentinfo.html')


@user_bp.route('/user/profile/')
@login_required
def profile():
    return render_template('./user pages/profile.html')
