from flask import Flask, render_template
from flask_mail import Mail
from flaskext.mysql import MySQL
import secrets


mysql = MySQL()
mail = Mail()


def create_server(config):
    app = Flask(__name__)

    # update app config from file config.py
    app.config.from_object('config.DevelopmentConfig')

    with app.app_context():
        # initialize extensions
        mysql.init_app(app)
        mail=Mail(app)

        #secret_key generation
        app.secret_key = secrets.token_urlsafe(256)
        

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

    return app
