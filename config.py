import os


'''
Configuration settings to be used on localhost.
'''
class DevelopmentConfig:
    # SERVER RELOAD ON CODE CHANGE
    DEBUG = True

    #MySQL setup
    MYSQL_DATABASE_USER = os.environ['DB_USER']
    MYSQL_DATABASE_PASSWORD = os.environ['DB_PASS']
    MYSQL_DATABASE_DB = 'niledb'
    MYSQL_DATABASE_HOST = 'localhost'

    # FLASK-MAIL SETUP
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'rootatnilebookstore@gmail.com'
    MAIL_PASSWORD = 'Testing1'


'''
Configuration settings to be used on PythonAnywhere.
'''
class ProductionConfig:
    # SERVER RELOAD ON CODE CHANGE
    DEBUG = False

    #MySQL setup
    MYSQL_DATABASE_USER = os.environ['DB_USER']
    MYSQL_DATABASE_PASSWORD = os.environ['DB_PASS']
    MYSQL_DATABASE_DB = 'niledb' #CHANGE TO PA DB
    MYSQL_DATABASE_HOST = 'localhost' #CHANGE TO PA DB URL

    # FLASK-MAIL SETUP
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'rootatnilebookstore@gmail.com'
    MAIL_PASSWORD = 'Testing1'
    