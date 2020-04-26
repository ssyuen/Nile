from flask import flash, redirect,url_for
from functools import wraps
from flask_mail import Message
from server import mail

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

def send_promo_email(recipient, recipient_fname, promo_code,promo_amount,url,sender='rootatnilebookstore@gmail.com'):
    message_body = f'Hey {recipient_fname},\n\nTake advantage of our promo code {promo_code} for an additional {promo_amount*100}% off on your order of any books! Shop our collection today at {url}.\n\nThanks for shopping at Nile,\n\nThe Nile Team.'
    msg = Message(subject='Nile Profile Change', recipients=[recipient],cc=['rootatnilebookstore@gmail.com'],sender='rootatnilebookstore@gmail.com', body=message_body)
    mail.send(msg)