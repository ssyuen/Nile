from flask import Blueprint, render_template,request,jsonify, redirect, flash, session
from flaskext.mysql import MySQL
from functools import wraps
from server import conn

user_bp = Blueprint('user_bp', __name__,
                    template_folder='templates', static_folder='static')


def login_required(f):
    @wraps(f)
    def wrapped_func(*args,**kws):
        if 'logged_in' in session:
            return f(*args,**kws)
        else:
            flash('You need to login to access this area!')
            return redirect('/login/')
    return wrapped_func

@user_bp.route('/')
def landing_page():
    return render_template('browse.html')

@user_bp.route('/login/',methods=['POST','GET'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        cursor = conn.cursor()
        query = 'SELECT email,password,firstName from users WHERE email = "' + email +  '" AND password = "' + password + '"'
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

@user_bp.route('/register/',methods=['POST','GET'])
def register():
    if request.method == 'GET':
        return render_template('reg.html')
    else:
        #NEED TO CHECK REQUEST FORM SIZE TO SEE IF OPTIONAL COMPONENNTS HAVE BEEN ADDED
        firstName = request.form.get('firstName')
        lastName = request.form.get('lastName')
        email = request.form.get('email')
        password = request.form.get('password')

        #optional
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

@user_bp.route('/shoppingcart/')
def shopping_cart():
    return render_template('shoppingcart.html')

#@login_required func decorator needs to be implemented for all user routes
"""User Routes"""
@user_bp.route('/user/billingaddress/')
@login_required
def billing_address(route='/user/billingaddress/'):
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
def profile(route='/user/profile/'):
    return render_template('./user pages/profile.html')