import bcrypt
from flask import Blueprint, render_template, request, jsonify, session
from flask_mail import Message
from flaskext.mysql import pymysql

from routes.common.util import *
from server import mail, fernet, mysql

common_bp = Blueprint('common_bp', __name__,
                      template_folder='templates', static_folder='static')


@common_bp.route('/about/')
@cart_session(session)
@remember_me(session)
def about():
    return render_template('about.html')


@common_bp.route('/')
@cart_session(session)
@remember_me(session)
def landing_page(search_results=None):
    # STEP 1: Make call to database to return all books, need ISBN for query in /product/?isbn=<isbn>
    conn = mysql.connect()
    cursor = conn.cursor()

    if search_results is None:
        query = '''SELECT
            title,
            price,
            CONCAT(authorFirstName, ' ', authorLastName) AS author_name,
            ISBN,
            summary,
            publicationDate,
            numPages,
            (SELECT binding FROM binding WHERE binding.id=book.bindingID_book_FK) AS binding,
            (SELECT genre from genre WHERE genre.id=book.genreID_book_FK) AS genre,
            nile_cover_ID
            FROM book ORDER BY title'''
        cursor.execute(query)

        # STEP 2: Pass list of books to browse.html
        results = cursor.fetchall()
        header = [desc[0] for desc in cursor.description]
        books = [dict(zip(header, result)) for result in results]

        # STEP 3: In browse.html, iterate through list of books to populate page
        genres = get_genres(cursor)
        genre_counts = get_genres_count(cursor)
        bindings = get_bindings(cursor)
        binding_counts = get_bindings_count(cursor)

        return render_template('browse.html', books=books, genres=genres, genre_counts=genre_counts, bindings=bindings,
                               binding_counts=binding_counts)
    else:
        return render_template('browse.html')


@common_bp.route('/login/', methods=['POST', 'GET'])
@cart_session(session)
@remember_me(session)
def login():
    if check_login(session):
        return redirect(url_for('common_bp.landing_page'))
    if request.method == 'POST':
        userEmail = request.form.get('userEmail')
        password = request.form.get('userPassword')
        session_remember_me = request.form.get('rememberMe')
        cursor = generate_cursor(mysql)

        # ADMIN LOGIN
        if '@nile.com' in userEmail:
            cursor.execute(
                """SELECT email ,pass, firstName, lastName from admin WHERE email = %s""", userEmail)

            try:
                results = cursor.fetchall()[0]
                db_pass = results[1].encode('utf-8')

                if bcrypt.checkpw(password.encode('utf-8'), db_pass):
                    store_login(session, results, admin=True)

                    session['remember_me'] = session_remember_me
                    if session['remember_me'] is not None:
                        session.permanent = True

                    ctx = request.args.get('next')
                    return redirect(ctx or url_for('common_bp.landing_page'))
                else:
                    flash('Your login details were incorrect. Please try again.')
                    return redirect('/login/')
            except IndexError:
                flash('Your login details were not found. Please try again.')
                return redirect('/login/')

        else:
            cursor.execute(
                'SELECT email, pass, firstName, lastName, statusID_user_FK from user WHERE email= %s', userEmail)
            try:
                results = cursor.fetchall()[0]
                db_pass = results[1].encode('utf-8')

                # PASSWORD CHECKING
                if bcrypt.checkpw(password.encode('utf-8'), db_pass):
                    # VERIFIED ACCOUNT
                    if int(results[4]) == 2:
                        session['verified'] = True
                    else:
                        session['verified'] = False
                        flash(
                            'You must verify your account before being able to login!')
                        return redirect(url_for('common_bp.login'))

                    store_login(session, results)

                    session['remember_me'] = session_remember_me
                    if session['remember_me'] is not None:
                        session.permanent = True

                    subscriber_check_query = 'SELECT isSubscribed FROM user WHERE email=%s'
                    cursor.execute(subscriber_check_query, (session['email']))
                    session['subscribed'] = cursor.fetchall()[0][0]
                    print(session['subscribed'])

                    # ENSURES A USER'S CHECKOUT SESSION CANNOT BE ACCESSED WITHOUT THE TOKEN
                    generate_secure_token(session, 'checkout_token')

                    # IF USER LOGGED IN WITH ITEMS IN THEIR CART, STORE TO DB
                    save_cart(mysql, session)
                    load_cart(mysql, session)

                    ctx = request.args.get('ctx')
                    if ctx is not None:
                        return redirect(url_for('user_bp.' + ctx))
                    else:
                        return redirect('/')

                # INCORRECT PASSWORD
                else:
                    flash('Your login details were incorrect. Please try again.')
                    return redirect(url_for('common_bp.login'))

            # EMAIL NOT FOUND IN DB
            except IndexError:
                flash('Your login details were not found. Please try again.')
                return redirect(url_for('common_bp.login'))
    else:
        return render_template('login.html')


@common_bp.route('/logout/', methods=['GET'])
@cart_session(session)
@remember_me(session)
def logout():
    if check_login(session):
        session.permanent = False
        session.clear()
        flash('Logged out successfully.')
        return redirect('/')
    flash('Error logging out.')
    return redirect(url_for('common_bp.landing_page'))


@common_bp.route('/register/', methods=['POST', 'GET'])
@cart_session(session)
@remember_me(session)
def register():
    if request.method == 'GET':
        return render_template('reg.html')
    else:
        # NEED TO CHECK REQUEST FORM SIZE TO SEE IF OPTIONAL COMPONENTS HAVE BEEN ADDED
        firstName = request.form.get('inputFirstName')
        firstLetter = firstName[0].upper()
        firstName = firstLetter + firstName[1:].lower()

        lastName = request.form.get('inputLastName')
        firstLetter = lastName[0].upper()
        lastName = firstLetter + lastName[1:].lower()

        # simple check for if someone is trying to use the nile domain
        email = request.form.get('inputEmail')
        if '@nile.com' in email:
            flash(
                'The email you have chosen is from a restricted domain. Please choose another email.')
            return redirect(url_for('common_bp.register'))

        password = request.form.get('inputPassword')
        password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        # USER PAYLOAD
        user_payload = (email, str(1),
                        password, firstName, lastName)

        # shipping address optional
        shipping_address = request.form.get('addAddressStreetAddress')
        shipping_apt = request.form.get('addAddressApartmentOrSuite')
        shipping_zipcode = request.form.get('addZipcode')
        shipping_city = request.form.get('addAddressCity')
        shipping_state = request.form.get('addAddressState')
        shipping_country = request.form.get('addAddressCountry')
        # 1 on the end specifies that this is a shipping address
        shipping_payload = (shipping_address, shipping_apt, shipping_city, shipping_zipcode,
                            shipping_state, shipping_country, str(1))

        # payment info optional + associated billing info
        card_first_name = request.form.get('cardHolderFirstName')
        card_last_name = request.form.get('cardHolderLastName')
        try:
            ccn = fernet.encrypt(request.form.get('ccn').encode('utf-8'))
        except:
            ccn = ''
        ccexp = request.form.get('ccexp') + '-01'
        ccn_provider = request.form.get('CCNProvider')
        billing_address = request.form.get('billingStreetAddress')
        billing_apt_suite = request.form.get('billingApartmentOrSuite')
        billing_zip = request.form.get('billingZipcode')
        billing_city = request.form.get('billingCity')
        billing_state = request.form.get('billingState')
        billing_country = request.form.get('billingCountry')
        # 2 on the end specifies that this is a billing address
        billing_payload = (billing_address, billing_apt_suite, billing_city,
                           billing_zip, billing_state, billing_country, str(2))

        # INITIALIZE CONNECTION TO DB
        conn = mysql.connect()
        cursor = conn.cursor()

        # INSERTING WITH NO SHIPPING OR PAYMENT METHOD
        if None in shipping_payload and None in billing_payload:
            try:
                insert_user(cursor, user_payload)
                user_id = get_user_id(cursor, email)
            except pymysql.err.IntegrityError:
                flash('An account with this email already exists.')
                conn.close()
                return redirect(url_for('common_bp.register'))

        else:  # insert with shipping and billing address
            # INSERTING SHIPPING ADDRESS AND PAYMENT INFO
            if None not in shipping_payload and None not in billing_payload:
                insert_address(cursor, shipping_payload)
                shipping_id = get_address_id(cursor)

                insert_address(cursor, billing_payload)
                billing_id = get_address_id(cursor)

                insert_user(cursor, user_payload)
                user_id = get_user_id(cursor, email)

                # INSERTING USER ID AND SHIPPING ADDRESS ID INTO user_address association table
                insert_useraddress(cursor, (user_id, shipping_id))

                # payment_payload depends on user and billing FKs
                payment_payload = (card_first_name, card_last_name,
                                   ccn, ccn_provider, ccexp, billing_id)
                insert_payment(cursor, payment_payload)
                payment_id = get_payment_id(cursor)
                insert_userpayment(cursor, (user_id, payment_id))

            # INSERTING BILLING ADDRESS (PAYMENT INFO ONLY)
            elif None in shipping_payload and None not in billing_payload:
                billing_id = get_address_id(cursor)

                insert_user(cursor, user_payload)
                user_id = get_user_id(cursor, email)

                payment_payload = (card_first_name, card_last_name, ccn, ccn_provider, ccexp,
                                   billing_id)
                insert_payment(cursor, payment_payload)
                payment_id = get_payment_id(cursor)
                insert_userpayment(cursor, (user_id, payment_id))

            # INSERTING SHIPPING ADDRESS (SHIPPING ADDRESS ONLY)
            elif None in billing_payload and None not in shipping_payload:
                shipping_id = get_address_id(cursor)

                insert_user(cursor, user_payload)
                user_id = get_user_id(cursor, email)

                # INSERTING USER ID AND SHIPPING ADDRESS ID INTO user_address association table
                insert_useraddress(cursor, (user_id, shipping_id))

        generate_secure_token(session, 'register_token')

        conn.commit()
        conn.close()
        session['verified'] = False
        return redirect(
            url_for('common_bp.register_confirmation', sending_token=secrets.token_urlsafe(256), email=email,
                    user_id=user_id, name=firstName))


@common_bp.route('/conf/register_confirmation/<sending_token>+<email>+<user_id>+<name>', methods=['GET'])
@secure_link(session, 'register_token')
@cart_session(session)
@remember_me(session)
def register_confirmation(sending_token, email=None, user_id=None, name=None):
    try:
        if 'register_token' in session:
            conn = mysql.connect()
            cursor = conn.cursor()

            verification_token = secrets.token_urlsafe(16)

            query = 'INSERT INTO user_token (userID_utoken_FK,token) VALUES (%s, %s)'
            cursor.execute(query, (user_id, verification_token))

            conn.commit()
            conn.close()

            verification_url = f'http://127.0.0.1:5000/conf/email_confirmation/{verification_token}'
            production_url = f'https://www.nilebookstore.com/conf/email_confirmation/{verification_token}'

            message_body = 'Hi ' + name + \
                           f',\n\nPlease click on the following link to confirm your registration here at ' \
                           f'Nile!\n\nDevelopment:{verification_url}\n_________________\n\nProduction:' \
                           f'{production_url}\n\nRegards, Nile Bookstore Management '
            msg = Message(subject='Nile Registration Confirmation', recipients=[
                email, 'rootatnilebookstore@gmail.com'], sender='rootatnilebookstore@gmail.com', body=message_body)
            mail.send(msg)
        else:
            return redirect(url_for('common_bp.landing_page'))

    except pymysql.err.IntegrityError:
        return render_template('confirmation/reg_conf.html')

    return render_template('confirmation/reg_conf.html')


@common_bp.route('/conf/email_confirmation/<verify_token>', methods=['GET'])
@cart_session(session)
@remember_me(session)
def email_confirmation(verify_token):
    # system needs to send an email with url back to a page
    conn = mysql.connect()
    cursor = conn.cursor()

    # extract token from url
    verification_token = request.path[25:]

    query = """
    UPDATE user SET statusID_user_FK = 2 
    WHERE user.id = (SELECT userID_utoken_FK FROM user_token WHERE user_token.token = %s)
    """

    cursor.execute(query, verification_token)
    conn.commit()
    conn.close()

    if 'register_token' in session:
        session.pop('register_token')
        return render_template('confirmation/email_conf.html')
    else:
        return redirect(url_for('common_bp.landing_page'))


@common_bp.route('/forgot/', methods=['POST', 'GET'])
@cart_session(session)
@remember_me(session)
def forgot():
    if request.method == 'GET':
        return render_template('./forgot.html')
    else:
        conn = mysql.connect()
        cursor = conn.cursor()

        email = request.form.get('forgotEmailInput')
        name_query = """SELECT firstname FROM user WHERE email = %s"""
        cursor.execute(name_query, email)
        results = cursor.fetchall()
        if len(results) == 0:
            flash('That email address does not exist within our system!')
            return redirect(url_for('common_bp.forgot'))
        name = results[0][0]

        verification_token = secrets.token_urlsafe(16)

        query = 'INSERT INTO user_token (userID_utoken_FK,token) VALUES ((SELECT id FROM user WHERE email = %s), %s)'
        cursor.execute(query, (email, verification_token))
        conn.commit()
        conn.close()

        verification_url = 'http://127.0.0.1:5000' + \
                           url_for('common_bp.reset_pass', verify_token=verification_token)
        production_url = 'https://www.nilebookstore.com' + \
                         url_for('common_bp.reset_pass', verify_token=verification_token)

        message_body = 'Hi ' + name + \
                       f',\n\nPlease click on the following link to reset your password.\n\nDevelopment:{verification_url}\n_________________\n\nProduction:{production_url}\n\nRegards, Nile Bookstore Management'
        msg = Message(subject='Reset Password', recipients=[
            email, 'rootatnilebookstore@gmail.com'], sender='rootatnilebookstore@gmail.com', body=message_body)
        mail.send(msg)
        generate_secure_token(session, 'forgot_token')
        return redirect(url_for('common_bp.forgot_email_conf'))


@common_bp.route('/reset_pass/<verify_token>', methods=['POST', 'GET'])
@secure_link(session, 'forgot_token')
@cart_session(session)
@remember_me(session)
def reset_pass(verify_token):
    if request.method == 'GET':
        return render_template('confirmation/reset_pass_conf.html')
    elif request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor()

        # extract token from url
        verification_token = request.path[12:]

        user_id_query = """(SELECT userID_utoken_FK FROM user_token WHERE user_token.token = %s)"""
        cursor.execute(user_id_query, verification_token)
        try:
            user_id = cursor.fetchall()[0][0]
        except IndexError:
            flash('You have already reset your password using this verification link!')
            if check_login(session):
                return redirect(url_for('common_bp.landing_page'))
            else:
                return redirect(url_for('common_bp.login'))

        # extract password from request
        confirmNewPassword = request.form.get('confirmNewPassword')
        confirmNewPassword = bcrypt.hashpw(
            confirmNewPassword.encode('utf-8'), bcrypt.gensalt())

        # update password in user
        query = 'UPDATE user SET pass = %s WHERE user.id = %s'
        cursor.execute(query, (confirmNewPassword, user_id))
        conn.commit()

        # delete user/token pair from user_token
        query = 'DELETE FROM user_token WHERE userID_utoken_FK = %s AND token = %s'
        cursor.execute(query, (user_id, verification_token))
        conn.commit()
        conn.close()

        session.pop('forgot_token')

        return redirect(url_for('common_bp.login'))


@common_bp.route('/forgot_email_conf/')
@cart_session(session)
@remember_me(session)
def forgot_email_conf():
    return render_template('confirmation/forgot_email_conf.html')


@common_bp.route('/shoppingcart/', methods=['GET', 'POST'])
@cart_session(session)
@remember_me(session)
def shopping_cart():
    conn = mysql.connect()
    cursor = conn.cursor()

    old_cart = session['shopping_cart']
    # USER VISITS SHOPPING CART
    if request.method == 'GET':
        book_payload = {}
        for isbn, quantity in session['shopping_cart'].items():
            query = """
            SELECT nile_cover_ID, title, CONCAT(authorFirstName, ' ', authorLastName) 
            AS author_name, price 
            FROM book 
            WHERE ISBN = %s
            """
            cursor.execute(query, isbn)
            results = cursor.fetchall()[0]
            nile_cover_ID = results[0]
            title = results[1]
            author_name = results[2]
            price = results[3]
            book_payload[isbn] = {'nile_cover_id': nile_cover_ID, 'title': title,
                                  'author_name': author_name, 'price': price, 'quantity': quantity}

        return render_template('shoppingcart.html', book_payload=book_payload)

    # LOGGED IN USER EDITS QUANTITY ON SHOPPING CART PAGE
    elif request.method == 'POST' and check_login(session):
        book_isbn = request.form.get('bookISBN')
        quant_flag = request.form.get('newQuantity')

        bod_id_query = """
        SELECT bod_sc_FK FROM shoppingcart 
        JOIN book_orderdetail 
        ON bod_sc_FK=book_orderdetail.id 
        WHERE userID_bod_FK = (SELECT id FROM user WHERE email = %s) AND ISBN_bod_FK =%s
        """
        cursor.execute(bod_id_query, (session['email'], book_isbn))
        bod_id = cursor.fetchall()[0][0]

        # REMOVE FROM CART
        if quant_flag is None:
            old_cart.pop(book_isbn)
            session['shopping_cart'] = old_cart
            query = """
            DELETE FROM shoppingcart 
            WHERE userID_sc_FK = (SELECT id FROM user WHERE email = %s) 
            AND bod_sc_FK = %s
            """
            cursor.execute(
                query, (session['email'], bod_id))

            query = """DELETE FROM book_orderdetail WHERE id = %s"""
            cursor.execute(query, bod_id)

        # EDIT THE QUANTITY
        else:
            old_cart[book_isbn] = int(quant_flag)
            session['shopping_cart'] = old_cart
            quant_query = """UPDATE book_orderdetail SET quantity = %s WHERE id = %s AND ISBN_bod_FK = %s"""
            cursor.execute(quant_query, (quant_flag, bod_id, book_isbn))

        conn.commit()
        conn.close()
        return jsonify({'response': 200})

    # NON LOGGED IN USER EDITS QUANTITY ON SHOPPING CART PAGE
    else:
        book_isbn = request.form.get('bookISBN')
        quant_flag = request.form.get('newQuantity')

        if quant_flag is None:
            old_cart.pop(book_isbn)
            session['shopping_cart'] = old_cart
        else:
            old_cart[book_isbn] = int(quant_flag)
            session['shopping_cart'] = old_cart

        return jsonify({'response': 200})


@common_bp.route('/product/', methods=['GET', 'POST'])
@cart_session(session)
@remember_me(session)
def product(title=None, price=None, author_name=None, ISBN=None, summary=None, publicationDate=None, numPages=None,
            binding=None, genre=None, nile_cover_ID=None):

    # STEP 2: Link sends
    if request.method == 'GET':
        return render_template('product.html', title=title, price=price, author_name=author_name, isbn=ISBN,
                               summary=summary, publicationDate=publicationDate, numPages=numPages, binding=binding,
                               genre=genre, nile_cover_ID=nile_cover_ID)

    # LOGGED IN AND ADDING/DELETING FROM CART
    elif check_login(session):
        conn = mysql.connect()
        cursor = conn.cursor()

        book_isbn = request.form.get('bookISBN')
        old_cart = session['shopping_cart']

        # IF BOOK IN CART, REMOVE
        if book_isbn in session['shopping_cart']:
            old_cart.pop(book_isbn)

            bod_id_query = """
            SELECT bod_sc_FK FROM shoppingcart 
            WHERE userID_sc_FK = (SELECT id FROM user WHERE email = %s) 
            AND bod_sc_FK = (SELECT id FROM book_orderdetail WHERE ISBN_bod_FK = %s)
            """
            cursor.execute(bod_id_query, (session['email'], book_isbn))
            bod_id = cursor.fetchall()[0][0]

            query = """
            DELETE FROM shoppingcart 
            WHERE userID_sc_FK = (SELECT id FROM user WHERE email = %s) 
            AND bod_sc_FK = (SELECT id FROM book_orderdetail WHERE ISBN_bod_FK = %s)
            """
            cursor.execute(query, (session['email'], book_isbn))
            conn.commit()

            query = """DELETE FROM book_orderdetail WHERE id = %s"""
            cursor.execute(query, bod_id)
            conn.commit()

        # IF BOOK NOT IN CART, ADD
        else:
            old_cart[book_isbn] = 1

            query = """
            INSERT INTO book_orderdetail (userID_bod_FK,ISBN_bod_FK,quantity) 
            VALUES ((SELECT id FROM user WHERE email = %s), %s, %s)
            """
            cursor.execute(query, (session['email'], book_isbn, str(1)))
            conn.commit()

            query = """
            INSERT INTO shoppingcart (userID_sc_FK, bod_sc_FK) 
            VALUES ((SELECT id FROM user WHERE email = %s), 
            (SELECT id FROM book_orderdetail ORDER BY id DESC LIMIT 1))
            """
            cursor.execute(query, (session['email']))
            conn.commit()

        session['shopping_cart'] = old_cart
        return jsonify(session['shopping_cart'])

    # NOT LOGGED IN BUT ADDING/DELETING
    else:
        book_isbn = request.form.get('bookISBN')
        old_cart = session['shopping_cart']

        # REMOVING FROM CART
        if book_isbn in session['shopping_cart']:
            old_cart.pop(book_isbn)

        # ADDING TO CART
        else:
            old_cart[book_isbn] = 1

        session['shopping_cart'] = old_cart
        return jsonify(session['shopping_cart'])
