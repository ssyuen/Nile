from flask import Flask, render_template
# from flaskext.mysql import MySQL
import sqlalchemy.dialects.mysql.mysqlconnector
import sqlalchemy.dialects.mysql
from flask_sqlalchemy import SQLAlchemy
import secrets
import os

app = Flask(__name__)

SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username=os.environ['DB_USER'],
    password=os.environ['DB_PASS'],
    hostname="localhost",
    databasename="alctest",
)

app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
import models
#MySQL setup
#app.config['MYSQL_DATABASE_USER'] = os.environ['DB_USER']  # change to ur local username
#app.config['MYSQL_DATABASE_PASSWORD'] = os.environ['DB_PASS']  # change to ur local password

#app.config['MYSQL_DATABASE_DB'] = 'niledb'  # change to whatever the db will be named
#app.config['MYSQL_DATABASE_HOST'] = 'localhost'

#secret_key generation
app.secret_key = secrets.token_urlsafe(256)

#initialization of connection
# mysql = MySQL()
# mysql.init_app(app)
# conn = mysql.connect()

#if you reformat this code, the imports go up resulting in
#circular importing which breaks the blueprint architecture

from routes.user import routes as user_routes
from routes.admin import routes as admin_routes

app.register_blueprint(admin_routes.admin_bp)
app.register_blueprint(user_routes.user_bp)

@app.route('/about/')
def about():
    return render_template('about.html')
