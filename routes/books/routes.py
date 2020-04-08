from flask import Blueprint, render_template, request, jsonify, redirect, flash, session, url_for
from functools import wraps
from server import mysql

books_bp = Blueprint('books_bp', __name__,
                     template_folder='templates', static_folder='static')


@books_bp.route('/api/books/', methods=['GET'])
def query_books(search_query=None):
    if request.args is None:
        return redirect(url_for('common_bp.landing_page'))
    else:
        if len(request.args) == 1:
            # try:

            search_query = request.args['search_query']
            conn = mysql.connect()
            cursor = conn.cursor()
            query = '''SELECT ISBN, (SELECT genre from genre WHERE genre.id=book.genreID_book_FK) AS genre, title, price, CONCAT(authorFirstName, ' ', authorLastName) AS author_name FROM book'''
            cursor.execute(query)
            results = cursor.fetchall()

            print(f'results: {results}')

            payload = []
            header = [desc[0] for desc in cursor.description]
            payload = [dict(zip(header, result)) for result in results]
            books = [book for book in payload if search_query in str(
                book.values()).lower()]

            print(request.args['search_query'].lower())
            conn.close()

            if request.args['search_query'].lower() == 'test':
                return jsonify(payload)

            return jsonify(books)
            # except:
            #     return redirect(url_for('common_bp.landing_page'))

        else:
            return redirect(url_for('common_bp.landing_page'))
