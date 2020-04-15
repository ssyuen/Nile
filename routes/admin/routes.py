from flask import Blueprint, render_template, request, redirect, flash, session, url_for, jsonify
from functools import wraps
import bcrypt
from server import mysql
import sys
import string

from routes.common.routes import remember_me
from routes.user.routes import send_change_conf_email

admin_bp = Blueprint('admin_bp', __name__,
                     template_folder='templates', static_folder='static')


def admin_required(f):
    @wraps(f)
    def wrapped_func(*args, **kws):
        if 'admin' in session and session['admin']:
            return f(*args, **kws)
        else:
            flash('You need to be an admin to access that area!')
            return redirect(url_for('common_bp.landing_page'))
    return wrapped_func

@admin_bp.route('/overview/')
@admin_required
@remember_me
def overview():
    return render_template('./adminOverview.html')


@admin_bp.route('/change_name/',methods=['GET','POST'])
@admin_required
@remember_me
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
        fname_query = '''
        UPDATE admin SET firstname = %s WHERE email = %s
        '''
        cursor.execute(fname_query, (fname, session['email']))
        conn.commit()

        session['lastName'] = lname
        lname_query = '''
        UPDATE admin SET lastname = %s WHERE email = %s
        '''
        cursor.execute(lname_query, (lname, session['email']))
        conn.commit()

        conn.close()

        send_change_conf_email(session['email'],session['firstName'])

        flash('Your information has been recorded.')
        return redirect(url_for('admin_bp.change_name'))


@admin_bp.route('/change_pass/',methods=['GET','POST'])
@admin_required
@remember_me
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

            query = 'UPDATE admin SET pass=%s WHERE email=%s'
            cursor.execute(query, (new_password, session['email']))
            conn.commit()
            conn.close()

            send_change_conf_email(session['email'],session['firstName'])

            flash('Your information has been recorded.')
            return redirect(url_for('admin_bp.change_pass'))
    else:
        return render_template('adminChangePassword.html')

@admin_bp.route('/manage_books/')
@admin_required
@remember_me
def manage_books():
    return render_template('./adminManageBooks.html')


@admin_bp.route('/manage_promotions/')
@admin_required
@remember_me
def manage_promotions():
    return render_template('./adminManagePromotions.html')


@admin_bp.route('/manage_users/')
@admin_required
@remember_me
def manage_users():
    return render_template('./adminManageUsers.html')


@admin_bp.route('/manage_books/mbooksf/', methods=['GET', 'POST'])
@admin_required
@remember_me
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
        cursor.execute(query, (isbn, binding_type, genre, p_type, book_title, price, num_pages, cover_id, edition,
                               publisher, date_published, recv_stock, author_firstname, author_lastname, book_summary))
        conn.commit()
        conn.close()

        return redirect(url_for('admin_bp.add_books_form'))

    return render_template('./forms/manage_books_form.html')


@admin_bp.route('/manage_promotions/epromof/')
@admin_required
@remember_me
def edit_promo_form():
    return render_template('./forms/edit_promo_form.html')


@admin_bp.route('/manage_promotions/apromof/')
@admin_required
@remember_me
def add_promo_form():
    return render_template('./forms/add_promo_form.html')


@admin_bp.route('/manage_users/eusrf/')
@admin_required
@remember_me
def edit_users_form():
    return render_template('./forms/edit_users_form.html')

@admin_bp.route('/subscriptions/',methods=['POST','GET'])
@login_required
@cart_session
@remember_me
@user_only
def manage_subscriptions():

    if request.method == 'GET':
        return render_template('profile/profileSubscriptions.html')
    else:
        conn = mysql.connect()
        cursor = conn.cursor()

        flag = request.form.get("flag")

        if flag == 'SUBSCRIBE':
            conn.close()
            return 200
        elif flag == 'UNSUBSCRIBE':
            conn.close()
            return 200
