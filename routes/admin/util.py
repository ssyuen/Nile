from flask import flash, redirect,url_for
from functools import wraps

def admin_required(session):
    def dec(f):
        @wraps(f)
        def wrapped_func(*args, **kws):
            if 'admin' in session and session['admin']:
                return f(*args, **kws)
            else:
                flash('You need to be an admin to access that area!')
                return redirect(url_for('common_bp.landing_page'))
        return wrapped_func
    return dec