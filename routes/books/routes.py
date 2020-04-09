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
        if len(request.args) == 1:
            try:

                search_query = request.args['search_query']
                conn = mysql.connect()
                cursor = conn.cursor()
                query = '''SELECT 
                title,
                price,
                CONCAT(authorFirstName, ' ', authorLastName) AS author_name,
                ISBN,
                summary,
                publicationDate,
                numPages,
                (SELECT binding FROM binding WHERE binding.id=book.bindingID_book_FK) AS binding,
                (SELECT genre from genre WHERE genre.id=book.genreID_book_FK) AS genre,
                nile_cover_ID
                FROM book'''
                cursor.execute(query)
                results = cursor.fetchall()

                payload = []
                header = [desc[0] for desc in cursor.description]
                payload = [dict(zip(header, result)) for result in results]
                books = [book for book in payload if search_query in str(
                    book.values()).lower()]

                print(request.args['search_query'].lower())
                genres = get_genres(cursor)
                bindings,product_types = get_bindings_and_types(cursor)
                conn.close()

                if request.args['search_query'].lower() == 'test':
                    return jsonify(payload)

                return render_template('browse.html',books=books, genres=genres,bindings=bindings,product_types=product_types)
            except pymysql.Error:
                return redirect(url_for('common_bp.landing_page'))

        else:
            return redirect(url_for('common_bp.landing_page'))
