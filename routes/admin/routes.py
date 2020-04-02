from flask import Blueprint, render_template, request, jsonify, redirect, flash, session
from functools import wraps
from server import mysql

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


@admin_bp.route('/add_books/', methods=['GET', 'POST'])
@admin_required
def add_books():
    if request.method == 'POST':
        book_title = request.form.get('bookTitle')
        isbn = request.form.get('isbn')
        author_firstname = request.form.get('authorFirstName')
        author_lastname = request.form.get('authorLastName')
        edition = request.form.get('edition')
        publisher = request.form.get('publisher')
        genre = request.form.get('genre')
        num_pages = request.form.get('numPages')
        date_published = request.form.get('datePublished')
        recv_stock = request.form.get('recvStock')
        binding_type = request.form.get('bindingType')
        print(binding_type)
        price = request.form.get('price')
        cover_image = request.form.get('coverImage')
        book_summary = request.form.get('bookSummary')

        conn = mysql.connect()
        cursor = conn.cursor()

        query = """
        INSERT INTO book (ISBN, bindingID, genreID, title, price, numPages, image,
        edition, publisher, publicationDate, stock, authorFirstName, authorLastName, summary)
        VALUES (
        %s,
        (SELECT bindingID FROM binding WHERE binding = %s),
        (SELECT genreID FROM genre WHERE genre = %s),
        %s, %s, %s, %s, %s, %s, 
        %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (isbn, binding_type, genre, book_title, price, num_pages, cover_image, edition,
                               publisher, date_published, recv_stock, author_firstname, author_lastname, book_summary))
        conn.commit()
        conn.close()

    return render_template('./add_books_form.html')


@admin_bp.route('/base_admin/')
@admin_required
def base_admin():
    return render_template('./adminBase.html')


@admin_bp.route('/adm_overview/')
@admin_required
def adm_overview():
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


@admin_bp.route('/add_books_form/')
@admin_required
def add_books_form():
    return render_template('./forms/add_books_form.html')


@admin_bp.route('/manage_books_form/')
@admin_required
def manage_books_form():
    return render_template('./forms/manage_books_form.html')


@admin_bp.route('/manage_promo_form/')
@admin_required
def manage_promo_form():
    return render_template('./forms/manage_promo_form.html')


@admin_bp.route('/add_promo_form/')
@admin_required
def add_promo_form():
    return render_template('./forms/add_promo_form.html')


@admin_bp.route('/manage_users_form/')
@admin_required
def manage_users_form():
    return render_template('./forms/manage_users_form.html')
