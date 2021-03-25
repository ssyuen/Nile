from datetime import datetime
from functools import wraps

from flask import flash, redirect, url_for
from flask_mail import Message

from server import mail, fernet

SALES_TAX = {'GA': 2.50, 'CA': 3.50}

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


def send_change_conf_email(recipient, recipient_fname):
    current_time = datetime.now()
    message_body = 'Hi ' + recipient_fname + \
                   f',\n\nThere have been changes made to your profile on {current_time.month}/{current_time.day}/{current_time.year}, {current_time.hour}:{current_time.minute}:{current_time.second}. If this was not you, please go and change your password.\n\nRegards, Nile Bookstore Management'
    msg = Message(subject='Nile Profile Change', recipients=[
        recipient, 'rootatnilebookstore@gmail.com'], sender='rootatnilebookstore@gmail.com', body=message_body)
    mail.send(msg)


def send_order_conf_email(recipient, recipient_fname, conf_token, time, subtotal, shipping_cost, sales_tax, grand_total, shipping_payload, payment_payload, billing_payload, sender='rootatnilebookstore@gmail.com'):
    message_body = f"""Hi {recipient_fname},\n\nYour order has been processed.\n\n---------------------ORDER DETAILS------------------------\n\nYour order confirmation number is :{conf_token}\n\nTime: {time}\n\nSubtotal: {subtotal}\nShipping: {shipping_cost}\nTax: {sales_tax}\n\nGrand Total: {grand_total}\n\nShipping Address:\n{shipping_payload['street1']}\n{shipping_payload['street2']}\n{shipping_payload['zip']}\n{shipping_payload['city']}, {shipping_payload['state']}\n{shipping_payload['country']}\n\nPayment Method:\n{payment_payload['cardType']} {fernet.decrypt(payment_payload['cardNumber'].encode('utf-8')).decode('utf-8')[-4:]}\n\nBilling Address:\n{billing_payload['street1']}\n{billing_payload['street2']}\n{billing_payload['zip']}\n{billing_payload['city']}, {billing_payload['state']}\n{billing_payload['country']}\n\nThanks for shopping at Nile,\nThe Nile Team."""
    msg = Message(subject=f'Nile Order Confirmation {conf_token}', recipients=[
        recipient, 'rootatnilebookstore@gmail.com'], sender='rootatnilebookstore@gmail.com', body=message_body)
    mail.send(msg)


def calculate_shipping(quantity):
    return float("{:.2f}".format(SHIPPING_PRICE + .5 * quantity))


def insert_order(cursor, payload):
    order_query = """INSERT INTO `order` (userID_order_FK,paymentID_order_FK,total,salesTax,shippingPrice,
    dateOrdered,promotionID,confirmationNumber,shippingAddrID_order_FK) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s); """
    print(f'insert order order_payload --> {payload}')
    cursor.execute(order_query, payload)


def get_order_id(cursor):
    cursor.execute("""SELECT id FROM `order` ORDER BY id DESC LIMIT 1""")
    return cursor.fetchall()[0][0]


def insert_orderbod(cursor, payload):
    cursor.execute(
        """INSERT INTO order_bod (orderID_obod_FK, bodID_obod_FK) VALUES (%s, %s)""", payload)


def delete_shopping_cart(cursor, user_id):
    cursor.execute("""DELETE FROM shoppingcart WHERE userID_sc_FK=%s""", user_id)


def secure_checkout(session):
    def dec(f):
        @wraps(f)
        def wrapped_func(*args, **kws):
            if 'checkout_token' in session:
                return f(*args, **kws)
            else:
                # SHOW ERROR PAGE THAT ONCE YOU SUBMIT AN ORDER YOU ARE NOT ABLE TO GO BACK TO THE CHECKOUT PAGE
                return redirect(url_for('common_bp.landing_page'))
        return wrapped_func
    return dec


def get_subscription(cursor, email, admin=False):
    if not admin:
        cursor.execute("""SELECT isSubscribed FROM user WHERE email=%s""", email)
        return cursor.fetchall()[0][0]
    else:
        cursor.execute(
            """SELECT isSubscribed FROM admin WHERE email=%s""", email)
        return cursor.fetchall()[0][0]
