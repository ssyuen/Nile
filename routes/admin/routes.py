from flask import Blueprint, render_template,request,jsonify, redirect, flash, session
from flaskext.mysql import MySQL
from functools import wraps
from server import conn

admin_bp = Blueprint('admin_bp', __name__,
                    template_folder='templates', static_folder='static')


def login_required(f):
    @wraps(f)
    def wrapped_func(*args,**kws):
        if 'logged_in' in session:
            return f(*args,**kws)
        else:
            flash('You need to login to access this area!')
            return redirect('/login/')
    return wrapped_func

@admin_bp.route('/admin/add_books/')
@login_required
def add_books():
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