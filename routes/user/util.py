from flask import flash, redirect,url_for
from functools import wraps
from datetime import datetime
from flask_mail import Message
from server import mail

SALES_TAX  = {'GA':.04, 'CA':.0725}

# MULTIPLY THIS BY THE TOTAL AMOUNT OF BOOKS
SHIPPING_PRICE = float("{:.2f}".format(4.00))

def user_only(session):
    def dec(f):
        @wraps(f)
        def wrapped_func(*args, **kws):
            if 'admin' in session and session['admin']:
                flash(
                    'Please login using a non-administrative account to access this feature.')
                return redirect(url_for('common_bp.landing_page'))
            else:
                return f(*args, **kws)

        return wrapped_func
    return dec

def send_change_conf_email(recipient, recipient_fname, sender='rootatnilebookstore@gmail.com'):
    current_time = datetime.now()
    message_body = 'Hi ' + recipient_fname + \
                   f',\n\nThere have been changes made to your profile on {current_time.month}/{current_time.day}/{current_time.year}, {current_time.hour}:{current_time.minute}:{current_time.second}. If this was not you, please go and change your password.\n\nRegards, Nile Bookstore Management'
    msg = Message(subject='Nile Profile Change', recipients=[
        recipient, 'rootatnilebookstore@gmail.com'], sender='rootatnilebookstore@gmail.com', body=message_body)
    mail.send(msg)

def calculate_shipping(quantity):
    return float("{:.2f}".format(SHIPPING_PRICE + .5 * quantity))

def insert_order(cursor,payload):
    '''
    cursor - cursor object from conn

    payload - (userID_order_FK,paymentID_order_FK,total,salesTax,shippingPrice,dateOrdered,promotionID,confirmationNumber,shippingAddrID_order_FK)
    '''
    order_query = '''INSERT INTO order (userID_order_FK,paymentID_order_FK,total,salesTax,shippingPrice,dateOrdered,promotionID,confirmationNumber,shippingAddrID_order_FK)
            VALUES (
            (SELECT id FROM user WHERE email = %s),
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s)
            '''
    cursor.execute(order_query,payload)

def get_order_id(cursor):
    cursor.execute('SELECT id FROM order ORDER BY id DESC LIMIT 1')
    return cursor.fetchall()[0][0]

def insert_orderbod(cursor,payload):
    '''
    cursor - cursor object from conn

    payload - (orderID_obod_FK, bodID_obod_FK)
    '''
    cursor.execute('INSERT INTO order_bod (orderID_obod_FK, bodID_obod_FK) VALUES (%s, %s)',payload)

def delete_shopping_cart(cursor,user_id):
    cursor.execute('DELETE FROM shoppingcart WHERE userID_sc_FK=%s',user_id)

def secure_checkout(session):
    def dec(f):
        @wraps(f)
        def wrapped_func(*args, **kws):
            # UPON SUCCESSFUL CHECKOUT, POP 'checkout_token' FROM SESSION
            if 'checkout_token' in session:
                return f(*args, **kws)
            else:
                # SHOW ERROR PAGE THAT ONCE YOU SUBMIT AN ORDER YOU ARE NOT ABLE TO GO BACK TO THE CHECKOUT PAGE
                return redirect(url_for('common_bp.landing_page'))
        return wrapped_func
    return dec