from flask import Blueprint, render_template, request, jsonify, redirect, flash, session
from functools import wraps
from server import conn
# from ..import conn

admin_bp = Blueprint('admin_bp', __name__,
                     template_folder='templates', static_folder='static')


def login_required(f):
    @wraps(f)
    def wrapped_func(*args, **kws):
        if 'logged_in' in session:
            return f(*args, **kws)
        else:
            flash('You need to login to access this area!')
            return redirect('/login/')
    return wrapped_func


@admin_bp.route('/logout/', methods=['GET'])
def logout():
    if session['logged_in']:
        session['logged_in'] = False
        flash('Logged out successfully.')
        return redirect('/')
    flash('Error logging out.')
    return redirect('/')


@admin_bp.route('/admin/add_books/')
@login_required
def add_books():
    bookTitle       = request.form.get('bookTitle')
    isbn            = request.form.get('isbn')
    authorFirstName = request.form.get('authorFirstName')
    authorLastName  = request.form.get('authorLastName')
    genre           = request.form.get('genre')
    numPages        = request.form.get('numPages')
    datePublished   = request.form.get('datePublished')
    bindingType     = request.form.get('bindingType')
    receivedStock   = request.form.get('recvStock')
    sellingPrice    = request.form.get('price')
    coverImage      = request.form.get('coverImage')
    summary         = request.form.get('bookSummary')

    #Do Something now....
    return render_template('./admin pages/add_books.html')


@admin_bp.route('/admin/add_promo/')
@login_required
def add_promo():
    return render_template('./admin pages/add_promo.html')


@admin_bp.route('/admin/')
@login_required
def admin():
    return render_template('./admin pages/admin.html')


@admin_bp.route('/admin/manage_books/')
@login_required
def manage_books():
    return render_template('./admin pages/manage_books.html')


@admin_bp.route('/admin/manage_promo/')
@login_required
def manage_promo():
    return render_template('./admin pages/manage_promo.html')


@admin_bp.route('/admin/manage_users/')
@login_required
def manage_users():
    return render_template('./admin pages/manage_users.html')
