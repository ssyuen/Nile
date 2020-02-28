from flask import Flask, render_template, request,jsonify
from flaskext.mysql import MySQL

from scripts.apps.books import books
from scripts.apps.checkout import checkout
from scripts.apps.login_registration import login
from scripts.apps.login_registration import reg
from scripts.apps.promos import promos
from scripts.apps.users import users
from scripts.apps.users.user_profile import billing
from scripts.apps.users.user_profile import payment
from scripts.apps.users.user_profile import profile


app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'nile_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql = MySQL()
mysql.init_app(app)



"""
This doubles as the browinsg page and the landing page.
"""
@app.route('/')
def landing_page():
    return render_template('browse.html')

@app.route('/login/')
def login():
    return render_template('login.html')

@app.route('/register/')
def reg():
    return render_template('reg.html')

@app.route('/shoppingcart/')
def shopping_cart():
    return render_template('shoppingcart.html')



"""User Routes"""
@app.route('/user/billingaddress/')
def billing_address():
    return render_template('./user pages/billingaddress.html')

@app.route('/user/checkout/')
def checkout():
    return render_template('./user pages/checkout.html')

@app.route('/user/orderhist/')
def order_history():
    return render_template('./user pages/orderhist.html')

@app.route('/user/paymentinfo/')
def payment_info():
    return render_template('./user pages/paymentinfo.html')

@app.route('/user/profile/')
def profile():
    return render_template('./user pages/profile.html')



"""Admin Routes"""
@app.route('/admin/add_books/')
def add_books():
    return render_template('./admin pages/add_books.html')

@app.route('/admin/add_promo/')
def add_promo():
    return render_template('./admin pages/add_promo.html')

@app.route('/admin/')
def admin():
    return render_template('./admin pages/admin.html')

@app.route('/admin/manage_books/')
def manage_books():
    return render_template('./admin pages/manage_books.html')

@app.route('/admin/manage_promo/')
def manage_promo():
    return render_template('./admin pages/manage_promo.html')

@app.route('/admin/manage_users/')
def manage_users():
    return render_template('./admin pages/manage_users.html')