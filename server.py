from routes.user import routes as user_routes
from routes.admin import routes as admin_routes
from flask import Flask
from flaskext.mysql import MySQL
import random as rand

# from scripts.apps.books import books
# from scripts.apps.checkout import checkout
# from scripts.apps.login_registration import login
# from scripts.apps.login_registration import reg
# from scripts.apps.promos import promos
# from scripts.apps.users import users
# from scripts.apps.users.user_profile import billing
# from scripts.apps.users.user_profile import payment
# from scripts.apps.users.user_profile import profile

app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root' #change to ur local username
app.config['MYSQL_DATABASE_PASSWORD'] = 'root' #change to ur local password
app.config['MYSQL_DATABASE_DB'] = 'nile_db' #change to whatever the db will be named
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

app.secret_key = str(rand.randint(0, 100))

mysql = MySQL()
mysql.init_app(app)
conn = mysql.connect()


app.register_blueprint(admin_routes.admin_bp)
app.register_blueprint(user_routes.user_bp)
