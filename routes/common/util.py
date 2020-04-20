import secrets
from datetime import datetime, timedelta
from flask import flash, redirect, url_for
from functools import wraps


def get_genres(cursor, close=False):
    cursor.execute('SELECT genre FROM genre')
    return [genre[0] for genre in cursor.fetchall()]


def get_genres_count(cursor, close=False):
    cursor.execute(
        'SELECT (SELECT genre FROM genre WHERE id=genreID_book_FK), COUNT(*) AS numBooks FROM book GROUP BY genreID_book_FK')
    payload = {}
    for genre, count in cursor.fetchall():
        payload[genre] = count

    return payload


def get_bindings(cursor, close=False):
    cursor.execute('SELECT binding FROM binding')
    results = cursor.fetchall()
    return [binding[0] for binding in results]


def get_bindings_count(cursor, close=False):
    cursor.execute(
        'SELECT (SELECT binding FROM binding WHERE id=bindingID_book_FK), COUNT(*) AS numBooks FROM book GROUP BY bindingID_book_FK')
    payload = {}
    for genre, count in cursor.fetchall():
        payload[genre] = count

    return payload


def generate_secure_token(session,purpose):
    '''
    session - backend session for an indiviudal user

    purpose - the purpose of the token. if 'checkout', then token is to secure checkout page to ensure after successful checkout, the page cannot be revisited, else 'expire', register_conf/forget password should timeout after a certain amount of time
    '''
    secure_token = secrets.token_urlsafe(64)
    if purpose is 'checkout_token':
        session[purpose] = secure_token
    elif purpose is 'register_token':
        session[purpose] = {secure_token: datetime.now()}
    elif purpose is 'forgot_token':
        session[purpose] = {secure_token: datetime.now()}
    elif purpose is 'order_token':
        session[purpose] = {secure_token: datetime.now()}
        
def secure_link(session,purpose):
    def dec(f):
        @wraps(f)
        def wrapped_func(*args, **kws):
            # if any of these if-else-ifs are entered, that means the link is still good
            if (purpose == 'register_token' or 'forgot_token' or 'order_token'):
                session_time = [st for st in session[purpose].values()][0]
                curr_time = datetime.now()
                if session_time > datetime.now():
                    print('hi')

                curr_time = datetime.now() - session_time

                if (curr_time > datetime.minute(5)):
                    return f(*args, **kws)
            else:
                # THIS SHOULD REDIRECT TO EXPIRED PAGE LINK
                return redirect(url_for('common_bp.landing_page'))

        return wrapped_func
    return dec


def insert_address(cursor, payload):
    '''
    cursor - cursor object from conn

    payload - (street1,street2,city,zip,state,country,addressTypeID_address_FK)
    '''
    cursor.execute(
        'INSERT INTO address (street1,street2,city,zip,state,country,addressTypeID_address_FK) VALUES (%s, %s, %s, %s, %s, %s, %s)', payload)


def get_address_id(cursor):
    cursor.execute('SELECT id FROM address ORDER BY id DESC LIMIT 1')
    return cursor.fetchall()[0][0]


def insert_user(cursor, payload):
    '''
    cursor - cursor object from conn

    payload - (email,statusID_user_FK,pass, firstname, lastname)
    '''
    cursor.execute(
        'INSERT INTO user (email,statusID_user_FK,pass, firstname, lastname) VALUES (%s, %s, %s, %s, %s)', payload)


def get_user_id(cursor, email):
    cursor.execute('SELECT id FROM user WHERE email = %s', email)
    return cursor.fetchall()[0][0]


def insert_useraddress(cursor, payload,email=None):
    '''
    cursor - cursor object from conn

    email - user email

    payload - (userID_ua_FK, addressID_ua_FK)
    '''
    if email is not None:
        cursor.execute( 'INSERT INTO user_address (userID_ua_FK, addressID_ua_FK) VALUES ((SELECT id FROM user WHERE email=%s), %s)',(email,payload[0]))
    else:
        cursor.execute(
            'INSERT INTO user_address (userID_ua_FK, addressID_ua_FK) VALUES (%s, %s)',payload)


def insert_userpayment(cursor, payload):
    '''
    cursor - cursor object from conn

    payload - (userID_pm_FK, paymentID_pm_FK)
    '''
    cursor.execute(
        'INSERT INTO user_paymentmethod (userID_pm_FK, paymentID_pm_FK) VALUES (%s, %s)')


def insert_payment(cursor, payload):
    '''
    cursor - cursor object from conn

    payload - (firstname,lastname,cardNumber, cardType, expirationDate, billingAddress_addr_FK)
    '''
    cursor.execute(
        'INSERT INTO payment_method (firstname,lastname,cardNumber, cardType, expirationDate, billingAddress_addr_FK) VALUES (%s,%s,%s, %s, %s, %s)')


def get_payment_id(cursor):
    cursor.execute('SELECT id FROM payment_method ORDER BY id DESC LIMIT 1')
    return cursor.fetchall()[0][0]

def get_book_orderdetails(cursor,user_id):
    cursor.execute('SELECT * FROM book_orderdetail WHERE userID_bod_FK=%s',user_id)
    return cursor.fetchall()

def check_login(session) -> bool:
    if 'logged_in' in session and session['logged_in']:
        return True
    else:
        return False

def get_first_name(cursor,email):
    cursor.execute('SELECT firstname FROM user WHERE email=%s',email)


def save_cart(mysql, session):
    conn = mysql.connect()
    cursor = conn.cursor()
    cart = session['shopping_cart']

    for book_isbn, quantity in cart.items():
        query = '''INSERT IGNORE INTO book_orderdetail (userID_bod_FK,ISBN_bod_FK,quantity) VALUES ((SELECT id FROM user WHERE email = %s), %s, %s)'''
        cursor.execute(query, (session['email'], book_isbn, str(quantity)))
        conn.commit()

        query = '''INSERT IGNORE INTO shoppingcart (userID_sc_FK, bod_sc_FK) VALUES ((SELECT id FROM user WHERE email = %s), (SELECT id FROM book_orderdetail ORDER BY id DESC LIMIT 1))'''
        cursor.execute(query, (session['email']))
        conn.commit()

    conn.close()


def load_cart(mysql, session):
    conn = mysql.connect()
    cursor = conn.cursor()

    bod_id_query = '''SELECT bod_sc_FK FROM shoppingcart WHERE userID_sc_FK = (SELECT id FROM user WHERE email = %s)'''
    cursor.execute(bod_id_query, (session['email']))
    bod_ids = cursor.fetchall()

    book_payload = {}
    for bod_id in bod_ids:
        book_query = '''SELECT ISBN_bod_FK,quantity FROM book_orderdetail WHERE id=%s'''
        cursor.execute(book_query, (bod_id))
        results = cursor.fetchall()
        book = results[0][0]
        quantity = results[0][1]
        book_payload[book] = int(quantity)
    if len(book_payload) == 0:
        session['shopping_cart'] = {}
    else:
        session['shopping_cart'] = book_payload
    conn.close()


def login_required(session):
    def dec(f):
        @wraps(f)
        def wrapped_func(*args, **kws):
            if check_login(session):
                return f(*args, **kws)
            else:
                flash('You need to login to access this area!')
                return redirect(url_for('common_bp.login', ctx=f.__name__))

        return wrapped_func
    return dec


def remember_me(session):
    def dec(f):
        @wraps(f)
        def wrapped_func(*args, **kws):
            try:
                if session['remember_me']:
                    g.PERMANENT_SESSION_LIFETIME = timedelta(days=7)
                    return f(*args, **kws)
            except KeyError:
                session['remember_me'] = False
                return f(*args, **kws)
            else:
                return f(*args, **kws)

        return wrapped_func
    return dec


def cart_session(session):
    def dec(f):
        @wraps(f)
        def wrapped_func(*args, **kws):
            if 'shopping_cart' in session:
                return f(*args, **kws)
            else:
                session['shopping_cart'] = dict()
                return f(*args, **kws)

        return wrapped_func
    return dec


