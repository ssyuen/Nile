from flask import Flask
from flaskext.mysql import MySQL
import secrets

app = Flask(__name__)

#MySQL setup
app.config['MYSQL_DATABASE_USER'] = 'root' #change to ur local username
app.config['MYSQL_DATABASE_PASSWORD'] = 'root' #change to ur local password
app.config['MYSQL_DATABASE_DB'] = 'niledb' #change to whatever the db will be named
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

#secret_key generation
app.secret_key = secrets.token_urlsafe(256)

#initialization of connection
mysql = MySQL()
mysql.init_app(app)
conn = mysql.connect()

#if you reformat this code, the imports go up resulting in
#circular importing which breaks the blueprint architecture
from routes.user import routes as user_routes
from routes.admin import routes as admin_routes
app.register_blueprint(admin_routes.admin_bp)
app.register_blueprint(user_routes.user_bp)
