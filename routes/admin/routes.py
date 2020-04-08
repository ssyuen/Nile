from flask import Blueprint, render_template, request, jsonify, redirect, flash, session
from functools import wraps
from server import mysql
import sys
import string

admin_bp = Blueprint('admin_bp', __name__,
                     template_folder='templates', static_folder='static')


def admin_required(f):
    @wraps(f)
    def wrapped_func(*args, **kws):
        if 'admin' in session and session['admin']:
            return f(*args, **kws)
        else:
            flash('You need to be an admin to access that area!')
            return redirect('/')
    return wrapped_func

def login_required(f):
    @wraps(f)
    def wrapped_func(*args, **kws):
        if 'logged_in' in session and session['logged_in']:
            return f(*args, **kws)
        else:
            flash('You need to login to access this area!')
            return redirect('/login/')
    return wrapped_func

# @admin_bp.route('/logout/', methods=['GET'])
# def logout():
#     if 'logged_in' in session and session['logged_in']:
#         if 'admin' in session:
#             session['admin'] = False
#         session['logged_in'] = False
#         session['admin'] = False
#         flash('Logged out successfully.')
#         return redirect('/')
#     flash('Error logging out.')
#     return redirect('/')

@admin_bp.route('/overview/')
@admin_required
def overview():
    return render_template('./adminOverview.html')


@admin_bp.route('/change_name/')
@admin_required
def change_name():
    return render_template('./adminChangeName.html')


@admin_bp.route('/change_pass/')
@admin_required
def change_pass():
    return render_template('./adminChangePassword.html')

@admin_bp.route('/manage_books/')
@admin_required
def manage_books():
    return render_template('./adminManageBooks.html')


@admin_bp.route('/manage_promotions/')
@admin_required
def manage_promotions():
    return render_template('./adminManagePromotions.html')


@admin_bp.route('/manage_users/')
@admin_required
def manage_users():
    return render_template('./adminManageUsers.html')


@admin_bp.route('/manage_books/mbooksf/', methods=['GET', 'POST'])
@admin_required
def add_books_form():
    if request.method == 'POST':
        book_title = string.capwords(request.form.get('bookTitle')).strip()
        isbn = request.form.get('isbn').replace("-", "").strip()
        author_firstname = string.capwords(request.form.get('authorFirstName')).strip()
        author_lastname = string.capwords(request.form.get('authorLastName')).strip()
        edition = request.form.get('edition').strip()
        publisher = request.form.get('publisher').strip()
        genre = request.form.get('genre').strip()
        num_pages = request.form.get('numPages').strip()
        date_published = request.form.get('datePublished').strip()
        recv_stock = request.form.get('recvStock').strip()
        binding_type = request.form.get('bindingType').strip()
        print(binding_type).strip()
        price = request.form.get('price').strip()
        cover_id = request.form.get('coverID').strip()
        book_summary = request.form.get('bookSummary').strip()

        print(cover_id, file=sys.stderr)
        conn = mysql.connect()
        cursor = conn.cursor()

        query = """
        INSERT INTO book (ISBN, bindingID_book_FK, genreID_book_FK, title, price, numPages, nile_cover_ID,
        edition, publisher, publicationDate, stock, authorFirstName, authorLastName, summary)
        VALUES (
        %s,
        (SELECT id FROM binding WHERE binding = %s),
        (SELECT id FROM genre WHERE genre = %s),
        %s, %s, %s, %s, %s, %s,
        %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (isbn, binding_type, genre, book_title, price, num_pages, cover_id, edition,
                               publisher, date_published, recv_stock, author_firstname, author_lastname, book_summary))
        conn.commit()
        conn.close()

    return render_template('./forms/manage_books_form.html')


@admin_bp.route('/manage_promotions/epromof/')
@admin_required
def edit_promo_form():
    return render_template('./forms/edit_promo_form.html')


@admin_bp.route('/manage_promotions/apromof/')
@admin_required
def add_promo_form():
    return render_template('./forms/add_promo_form.html')


@admin_bp.route('/manage_users/eusrf/')
@admin_required
def edit_users_form():
    return render_template('./forms/edit_users_form.html')
