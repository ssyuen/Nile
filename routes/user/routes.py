from flask import Blueprint, render_template, request, jsonify, redirect, flash, session, url_for
from functools import wraps
from flaskext.mysql import pymysql
import requests as r
import bcrypt
import sys
import secrets
from server import mysql

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
