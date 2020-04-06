from flask import Flask, render_template
from flask_mail import Mail
from flaskext.mysql import MySQL
import secrets
import os
from datetime import timedelta

app = Flask(__name__)

#MySQL setup
app.config['MYSQL_DATABASE_USER'] = os.environ['DB_USER']  # change to ur local username
app.config['MYSQL_DATABASE_PASSWORD'] = os.environ['DB_PASS']  # change to ur local password
app.config['MYSQL_DATABASE_DB'] = 'niledb'  # change to whatever the db will be named
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

# FLASK SESSION LIFETIME SETUP
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=45)

# FLASK-MAIL SETUP
app.config['DEBUG'] = True
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT']=465
app.config['MAIL_USE_SSL']=True
app.config['MAIL_USERNAME']='rootatnilebookstore@gmail.com'
app.config['MAIL_PASSWORD']='Testing1'
mail=Mail(app)

#secret_key generation
app.secret_key = secrets.token_urlsafe(256)

#initialization of connection
mysql = MySQL()
mysql.init_app(app)
conn = mysql.connect()

# if you reformat this code, the imports go up resulting in
# circular importing which breaks the blueprint architecture

from routes.common import routes as common_routes
from routes.user import routes as user_routes
from routes.admin import routes as admin_routes
from routes.books import routes as book_routes

app.register_blueprint(common_routes.common_bp)
app.register_blueprint(user_routes.user_bp, url_prefix="/nileuser")
app.register_blueprint(admin_routes.admin_bp, url_prefix="/admin")
app.register_blueprint(book_routes.books_bp)

# @app.route('/about/')
# def about():
#     return render_template('about.html')
