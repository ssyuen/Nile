from flask import Blueprint, request, render_template, jsonify, redirect, flash, session, url_for
from flaskext.mysql import pymysql
from functools import wraps
from server import mysql

from routes.common.routes import get_genres,get_bindings_and_types

books_bp = Blueprint('books_bp', __name__,
                     template_folder='templates', static_folder='static')


@books_bp.route('/api/books/', methods=['GET'])
def query_books(search_query=None):
    if request.args is None:
        return redirect(url_for('common_bp.landing_page'))
    else:
        if len(request.args) == 2:
            try:
                conn = mysql.connect()
                cursor = conn.cursor()

                search_filter = request.args['searchFilter']
                print(f'filtering by {search_filter}')

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

                    payload = []
                    header = [desc[0] for desc in cursor.description]
                    payload = [dict(zip(header, result)) for result in results]
                    books = [book for book in payload if search_query.lower() in str(book.values()).lower()]

                    print(books)

                    genres = get_genres(cursor)
                    bindings,product_types = get_bindings_and_types(cursor)


                    conn.close()

                    if request.args['search_query'].lower() == 'test':
                        return jsonify(payload)

                    return render_template('browse.html',books=books, genres=genres,bindings=bindings,product_types=product_types)
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
                    cursor.execute(query,(search_query))
                    results = cursor.fetchall()

                    header = [desc[0] for desc in cursor.description]
                    books = [dict(zip(header, result)) for result in results]

                    genres = get_genres(cursor)
                    bindings,product_types = get_bindings_and_types(cursor)
                    return render_template('browse.html',books=books, genres=genres,bindings=bindings,product_types=product_types)
            except pymysql.Error as e:
                print(e)
                return redirect(url_for('common_bp.landing_page'))

        else:
            return redirect(url_for('common_bp.landing_page'))
