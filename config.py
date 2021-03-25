import os

'''
Configuration settings to be used on localhost.
'''


class DevelopmentConfig:
    # SERVER RELOAD ON CODE CHANGE
    DEBUG = True

    TEMPLATES_AUTO_RELOAD = True

    # MySQL setup
    MYSQL_DATABASE_USER = os.environ['DB_USER']
    MYSQL_DATABASE_PASSWORD = os.environ['DB_PASS']
    MYSQL_DATABASE_DB = os.environ.get('DB')
    MYSQL_DATABASE_HOST = os.environ.get('DB_HOST')

    # FLASK-MAIL SETUP
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = os.environ.get('MAIL_PORT')
    MAIL_USE_SSL = True
    MAIL_USERNAME = os.environ.get('MAIL_USER')
    MAIL_PASSWORD = os.environ.get('MAIL_PASS')


'''
Configuration settings to be used on PythonAnywhere.
'''


class ProductionConfig:
    # SERVER RELOAD ON CODE CHANGE
    DEBUG = False

    # MySQL setup
    MYSQL_DATABASE_USER = os.environ['DB_USER']
    MYSQL_DATABASE_PASSWORD = os.environ['DB_PASS']
    MYSQL_DATABASE_DB = 'niledb'  # CHANGE TO PA DB
    MYSQL_DATABASE_HOST = 'localhost'  # CHANGE TO PA DB URL

    # FLASK-MAIL SETUP
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'rootatnilebookstore@gmail.com'
    MAIL_PASSWORD = 'Testing1'
