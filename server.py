from flask import Flask, render_template, request,jsonify, redirect, flash, session
from flaskext.mysql import MySQL
from functools import wraps


from scripts.apps.books import books
from scripts.apps.checkout import checkout
from scripts.apps.login_registration import login
from scripts.apps.login_registration import reg
from scripts.apps.promos import promos
from scripts.apps.users import users
from scripts.apps.users.user_profile import billing
from scripts.apps.users.user_profile import payment
from scripts.apps.users.user_profile import profile
from nile_decorators import login_required
import random as rand

app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'nile_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

app.secret_key = str(rand.randint(0,100))

mysql = MySQL()
mysql.init_app(app)
conn = mysql.connect()


def login_required(f):
    @wraps(f)
    def wrapped_func(*args,**kws):
        if 'logged_in' in session:
            return f(*args,**kws)
        else:
            flash('You need to login to access this area!')
            return redirect('/login/')
    return wrapped_func


"""
This doubles as the browinsg page and the landing page.
"""
@app.route('/')
def landing_page():
    return render_template('browse.html')

@app.route('/login/',methods=['POST','GET'])
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

# @app.route('/validate_login/',methods=['POST'])
# def validate_login():
#     pass
  

@app.route('/register/',methods=['POST','GET'])
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

@app.route('/shoppingcart/')
def shopping_cart():
    return render_template('shoppingcart.html')


#@login_required func decorator needs to be implemented for all user routes
"""User Routes"""
@app.route('/user/billingaddress/')
@login_required
def billing_address(route='/user/billingaddress/'):
    return render_template('./user pages/billingaddress.html')

@app.route('/user/checkout/')
@login_required
def checkout():
    return render_template('./user pages/checkout.html')

@app.route('/user/orderhist/')
@login_required
def order_history():
    return render_template('./user pages/orderhist.html')

@app.route('/user/paymentinfo/')
@login_required
def payment_info():
    return render_template('./user pages/paymentinfo.html')

@app.route('/user/profile/')
@login_required
def profile(route='/user/profile/'):
    return render_template('./user pages/profile.html')


#@login_required func decorator needs to be implemented for all admin routes
"""Admin Routes"""
@app.route('/admin/add_books/')
@login_required
def add_books():
    return render_template('./admin pages/add_books.html')

@app.route('/admin/add_promo/')
@login_required
def add_promo():
    return render_template('./admin pages/add_promo.html')

@app.route('/admin/')
@login_required
def admin():
    return render_template('./admin pages/admin.html')

@app.route('/admin/manage_books/')
@login_required
def manage_books():
    return render_template('./admin pages/manage_books.html')

@app.route('/admin/manage_promo/')
@login_required
def manage_promo():
    return render_template('./admin pages/manage_promo.html')

@app.route('/admin/manage_users/')
@login_required
def manage_users():
    return render_template('./admin pages/manage_users.html')