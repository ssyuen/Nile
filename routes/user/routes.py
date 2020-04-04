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
            return redirect(url_for('user_bp.login', ctx=f.__name__))

    return wrapped_func


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
