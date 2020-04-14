from flask import Blueprint, request, render_template, jsonify, redirect, flash, session, url_for
from flaskext.mysql import pymysql
from functools import wraps
from server import mysql
import secrets

from routes.common.routes import get_genres, get_bindings, get_genres_count, get_bindings_count

books_bp = Blueprint('books_bp', __name__,
                     template_folder='templates', static_folder='static')

api_url = secrets.token_urlsafe(16)

@books_bp.route('/'+api_url+'/isbn/', methods=['GET'])
def query_isbn(search_query=None):
    if request.args is None:
        return redirect(url_for('common_bp.landing_page'))
    else:
        if len(request.args) == 1:
            try:
                conn = mysql.connect()
                cursor = conn.cursor()
                
                isbn = request.args['inputISBN']
                query = '''SELECT 
                    title,
                    price,
                    CONCAT(authorFirstName, ' ', authorLastName) AS author_name,
                    ISBN,
                    publisher,
                    publicationDate,
                    numPages,
                    (SELECT binding FROM binding WHERE binding.id=book.bindingID_book_FK) AS binding,
                    (SELECT genre FROM genre WHERE genre.id=book.genreID_book_FK) AS genre,
                    (SELECT type FROM product_type WHERE product_type.id=book.typeID_book_FK) AS type,
                    nile_cover_ID
                    FROM book
                    WHERE book.ISBN=%s'''
                cursor.execute(query,(isbn))
                results = cursor.fetchall()

                header = [desc[0] for desc in cursor.description]
                books = [dict(zip(header, result)) for result in results]

                genres = get_genres(cursor)
                genre_counts = get_genres_count(cursor)
                bindings = get_bindings(cursor)
                binding_counts = get_bindings_count(cursor)

                conn.close()
                return render_template('browse.html', books=books, genres=genres, genre_counts=genre_counts, bindings=bindings, binding_counts=binding_counts)

            except pymysql.Error as e:
                print(e)
                return redirect(url_for('common_bp.landing_page'))


@books_bp.route('/'+api_url, methods=['GET'])
def query_books(search_query=None):
    if request.args is None:
        return redirect(url_for('common_bp.landing_page'))
    else:
        if len(request.args) == 2:
            try:
                conn = mysql.connect()
                cursor = conn.cursor()

                search_filter = request.args['searchFilter']

                search_query = request.args['search_query']
                if search_filter == 'all':
                    query = '''SELECT 
                    title,
                    price,
                    CONCAT(authorFirstName, ' ', authorLastName) AS author_name,
                    ISBN,
                    publisher,
                    publicationDate,
                    numPages,
                    (SELECT binding FROM binding WHERE binding.id=book.bindingID_book_FK) AS binding,
                    (SELECT genre FROM genre WHERE genre.id=book.genreID_book_FK) AS genre,
                    (SELECT type FROM product_type WHERE product_type.id=book.typeID_book_FK) AS type,
                    nile_cover_ID
                    FROM book'''
                    cursor.execute(query)
                    results = cursor.fetchall()

                    header = [desc[0] for desc in cursor.description]
                    payload = [dict(zip(header, result)) for result in results]
                    books = [book for book in payload if search_query.lower() in str(book.values()).lower()]

                    if request.args['search_query'].lower() == 'test':
                        return jsonify(payload)
                elif search_filter == 'productType':
                    query = '''SELECT 
                    title,
                    price,
                    CONCAT(authorFirstName, ' ', authorLastName) AS author_name,
                    ISBN,
                    publisher,
                    publicationDate,
                    numPages,
                    (SELECT binding FROM binding WHERE binding.id=book.bindingID_book_FK) AS binding,
                    (SELECT genre FROM genre WHERE genre.id=book.genreID_book_FK) AS genre,
                    (SELECT type FROM product_type WHERE product_type.id=book.typeID_book_FK) AS type,
                    nile_cover_ID
                    FROM book
                    WHERE book.typeID_book_FK=(SELECT id FROM product_type WHERE type=%s)'''
                    cursor.execute(query, (search_query))
                    results = cursor.fetchall()

                    header = [desc[0] for desc in cursor.description]
                    books = [dict(zip(header, result)) for result in results]

                genres = get_genres(cursor)
                genre_counts = get_genres_count(cursor)
                bindings = get_bindings(cursor)
                binding_counts = get_bindings_count(cursor)

                conn.close()
                return render_template('browse.html', books=books, genres=genres, genre_counts=genre_counts, bindings=bindings, binding_counts=binding_counts)
            except pymysql.Error as e:
                print(e)
                return redirect(url_for('common_bp.landing_page'))

        else:
            print('here')
            return redirect(url_for('common_bp.landing_page'))
