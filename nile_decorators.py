from flask import flash,redirect
from functools import wraps

def login_required(f):
    @wraps(f)
    def wrapped_func(*args,**kws):
        if 'logged_in' in session:
            return f(*args,**kws)
        else:
            flash('You need to login to access this area!')
            return redirect('/login/')
    return wrapped_func