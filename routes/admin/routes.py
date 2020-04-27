from flask import Blueprint, render_template, request, redirect, flash, session, url_for, jsonify
from functools import wraps
import bcrypt
from server import mysql
import sys
import string

from routes.common.util import remember_me, cart_session
from routes.user.routes import send_change_conf_email, get_subscription
from routes.admin.util import admin_required, send_promo_email

admin_bp = Blueprint('admin_bp', __name__,
                     template_folder='templates', static_folder='static')


@admin_bp.route('/overview/')
@admin_required(session)
@remember_me(session)
def overview():
    return render_template('./adminOverview.html')


@admin_bp.route('/change_name/', methods=['GET', 'POST'])
@admin_required(session)
@remember_me(session)
def change_name():
    if request.method == 'GET':
        return render_template('adminChangeName.html')
    else:
        conn = mysql.connect()
        cursor = conn.cursor()

        fname = request.form.get('inputFirstname')
        firstLetter = fname[0].upper()
        fname = firstLetter + fname[1:].lower()

        lname = request.form.get('inputLastname')
        firstLetter = lname[0].upper()
        lname = firstLetter + lname[1:].lower()

        session['firstName'] = fname
        cursor.execute('UPDATE admin SET firstname = %s WHERE email = %s', (fname, session['email']))
        conn.commit()

        session['lastName'] = lname
        cursor.execute('UPDATE admin SET lastname = %s WHERE email = %s', (lname, session['email']))
        conn.commit()

        conn.close()

        send_change_conf_email(session['email'], session['firstName'])

        flash('Your information has been recorded.')
        return redirect(url_for('admin_bp.change_name'))


@admin_bp.route('/change_pass/', methods=['GET', 'POST'])
@admin_required(session)
@remember_me(session)
def change_pass():
    if request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor()

        new_password = request.form.get('newPassword')
        confirm_new_password = request.form.get('confirmNewPassword')

        if new_password != confirm_new_password:
            return jsonify({'Response': 400})
        else:
            new_password = bcrypt.hashpw(
                new_password.encode('utf-8'), bcrypt.gensalt())

            cursor.execute('UPDATE admin SET pass=%s WHERE email=%s', (new_password, session['email']))
            conn.commit()
            conn.close()

            send_change_conf_email(session['email'], session['firstName'])

            flash('Your information has been recorded.')
            return redirect(url_for('admin_bp.change_pass'))
    else:
        return render_template('adminChangePassword.html')


@admin_bp.route('/manage_books/')
@admin_required(session)
@remember_me(session)
def manage_books():
    return render_template('./adminManageBooks.html')


@admin_bp.route('/manage_promotions/')
@admin_required(session)
@remember_me(session)
def manage_promotions():
    return render_template('./adminManagePromotions.html')


@admin_bp.route('/manage_users/')
@admin_required(session)
@remember_me(session)
def manage_users():
    return render_template('./adminManageUsers.html')


@admin_bp.route('/manage_books/mbooksf/', methods=['GET', 'POST'])
@admin_required(session)
@remember_me(session)
def add_books_form():
    if request.method == 'POST':
        book_title = string.capwords(request.form.get('bookTitle')).strip()
        isbn = request.form.get('isbn').replace("-", "").strip()
        author_firstname = string.capwords(request.form.get('authorFirstName')).strip()
        author_lastname = string.capwords(request.form.get('authorLastName')).strip()
        edition = request.form.get('edition').strip()
        publisher = request.form.get('publisher').strip()
        genre = request.form.get('genre').strip()
        p_type = request.form.get('productType').strip()
        num_pages = request.form.get('numPages').strip()
        date_published = request.form.get('datePublished').strip()
        recv_stock = request.form.get('recvStock').strip()
        binding_type = request.form.get('bindingType').strip()
        price = request.form.get('price').strip()
        cover_id = request.form.get('coverID').strip()
        book_summary = request.form.get('bookSummary').strip()

        print(cover_id, file=sys.stderr)
        conn = mysql.connect()
        cursor = conn.cursor()
        query = """
        INSERT INTO book (ISBN, bindingID_book_FK, genreID_book_FK, typeID_book_FK, title, price, numPages, nile_cover_ID,
        edition, publisher, publicationDate, stock, authorFirstName, authorLastName, summary)
        VALUES (
        %s,
        (SELECT id FROM binding WHERE binding = %s),
        (SELECT id FROM genre WHERE genre = %s),
        (SELECT id from product_type where type = %s),
        %s, %s, %s, %s, %s, %s,
        %s, %s, %s, %s, %s)
        """

        try:
            cursor.execute(query, (isbn, binding_type, genre, p_type, book_title, price, num_pages, cover_id, edition,
                                   publisher, date_published, recv_stock, author_firstname, author_lastname,
                                   book_summary))
            conn.commit()
            conn.close()
        except Exception as e:
            flash('Book already exists in the database')
            return redirect(url_for('admin_bp.add_books_form'))

        flash('Book has been successfully added.')
        return redirect(url_for('admin_bp.add_books_form'))

    return render_template('./forms/manage_books_form.html')


@admin_bp.route('/manage_promotions/epromof/')
@admin_required(session)
@remember_me(session)
def edit_promo_form():
    return render_template('./forms/edit_promo_form.html')


@admin_bp.route('/manage_promotions/apromof/', methods=['GET', 'POST'])
@admin_required(session)
@remember_me(session)
def add_promo_form():
    if request.method == 'POST':
        promo_name = request.form.get('promoName')
        promo_code = request.form.get('promoCode')
        promo_amt = float(request.form.get('promoAmt')) / 100
        promo_start = request.form.get('promoStart')
        promo_expiry = request.form.get('promoExpiry')
        promo_notes = request.form.get('promoNotes')

        conn = mysql.connect()
        cursor = conn.cursor()

        query = """
                INSERT INTO promotion (code, name, discount, startDate, endDate, notes)
                VALUES (%s, %s, %s, %s, %s, %s)
                """
        try:
            cursor.execute(query, (promo_code, promo_name, promo_amt, promo_start, promo_expiry, promo_notes))

            subscribed_users_query = 'SELECT firstname, email FROM user WHERE isSubscribed = 1'
            cursor.execute(subscribed_users_query)

            results = cursor.fetchall()
            conn.commit()
            conn.close()
        except Exception as e:
            flash('A promotion with this code already exists.')
            return redirect(url_for('admin_bp.add_promo_form'))

        for result in results:
            send_promo_email(recipient=result[1], recipient_fname=result[0], promo_code=promo_code,
                             promo_amount=promo_amt, url=request.url_root)

        flash('Promotion has been successfully added.')

        return redirect(url_for('admin_bp.add_promo_form'))

    return render_template('./forms/add_promo_form.html')


@admin_bp.route('/manage_users/eusrf/')
@admin_required(session)
@remember_me(session)
def edit_users_form():
    return render_template('./forms/edit_users_form.html')


@admin_bp.route('/settings/', methods=['POST', 'GET'])
@remember_me(session)
@admin_required(session)
def settings():
    if request.method == 'GET':
        conn = mysql.connect()
        cursor = conn.cursor()
        subscription = int.from_bytes(get_subscription(cursor, session['email'], True), 'big')

        if subscription == 1:
            return render_template('adminSubscription.html', subscription="checked")
        else:
            return render_template('adminSubscription.html', subscription="")
    elif request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor()

        flag = request.form.get("flag")

        # USER IS SUBSCRIBING
        if flag == 'SUBSCRIBE':
            query = 'UPDATE admin SET isSubscribed = %s WHERE email = %s'
            cursor.execute(query, (1, session['email']))

            conn.commit()
            conn.close()
            return jsonify({'response': 200})

        # USER IS UNSUBSCRIBING
        elif flag == 'UNSUBSCRIBE':
            query = 'UPDATE admin SET isSubscribed = %s WHERE email = %s'
            cursor.execute(query, (0, session['email']))

            conn.commit()
            conn.close()
            return jsonify({'response': 200})
