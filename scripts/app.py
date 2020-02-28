from flask import Flask, render_template, request,jsonify
from flaskext.mysql import MySQL

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

@app.route('/login.html')
def login():
    return render_template('login.html')

@app.route('/reg.html')
def reg():
    return render_template('reg.html')

@app.route('/shoppingcart.html')
def shopping_cart():
    return render_template('shoppingcart.html')

@app.route('/user/billingaddress.html')
def billing_address():
    return render_template('./user pages/billingaddress.html')

@app.route('/user/checkout.html')
def checkout():
    return render_template('./user pages/checkout.html')

@app.route('/user/orderhist.html')
def order_history():
    return render_template('./user pages/orderhist.html')

@app.route('/user/paymentinfo.html')
def payment_info():
    return render_template('./user pages/paymentinfo.html')

@app.route('/user/profile.html')
def profile():
    return render_template('./user pages/profile.html')

@app.route('/admin/add_books.html')
def profile():
    return render_template('./user pages/add_books.html')

@app.route('/admin/add_promo.html')
def profile():
    return render_template('./user pages/add_promo.html')

@app.route('/admin/admin.html')
def profile():
    return render_template('./user pages/admin.html')

@app.route('/admin/manage_books.html')
def profile():
    return render_template('./user pages/manage_books.html')

@app.route('/admin/manage_promo.html')
def profile():
    return render_template('./user pages/manage_promo.html')

@app.route('/admin/manage_users.html')
def profile():
    return render_template('./user pages/manage_users.html')