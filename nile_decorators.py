from flask import flash,redirect
def login_required(f):
  @wraps(f)
  def wrapped_func(*args,**kws):
    if 'logged_in' in session:
      return f(*args, **kwargs)
    else:
      flash('You need to login to access this area!')
      return redirect('/login/')