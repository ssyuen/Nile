from flask import flash, redirect,url_for
from functools import wraps
from datetime import datetime
from flask_mail import Message
from server import mail

def user_only(session):
    def dec(f):
        @wraps(f)
        def wrapped_func(*args, **kws):
            if 'admin' in session and session['admin']:
                flash(
                    'Please login using a non-administrative account to access this feature.')
                return redirect(url_for('common_bp.landing_page'))
            else:
                return f(*args, **kws)

        return wrapped_func
    return dec

def send_change_conf_email(recipient, recipient_fname, sender='rootatnilebookstore@gmail.com'):
    current_time = datetime.now()
    message_body = 'Hi ' + recipient_fname + \
                   f',\n\nThere have been changes made to your profile on {current_time.month}/{current_time.day}/{current_time.year}, {current_time.hour}:{current_time.minute}:{current_time.second}. If this was not you, please go and change your password.\n\nRegards, Nile Bookstore Management'
    msg = Message(subject='Nile Profile Change', recipients=[
        recipient, 'rootatnilebookstore@gmail.com'], sender='rootatnilebookstore@gmail.com', body=message_body)
    mail.send(msg)