from flask import Blueprint, request, render_template, jsonify, redirect, flash, session, url_for
from flaskext.mysql import pymysql
from functools import wraps
from server import mysql
import secrets

from routes.common.routes import get_genres, get_bindings, get_genres_count, get_bindings_count, generate_cursor

api_bp = Blueprint('api_bp', __name__,
                   template_folder='templates', static_folder='static')

api_url = secrets.token_urlsafe(16)

@api_bp.route('/price', methods=['POST'])
def price():
    conn = mysql.connect()
    cursor = conn.cursor()

    min_price = float(request.form.get('min_price'))
    max_price = float(request.form.get('max_price'))

    print(min_price,max_price)

    query = '''SELECT
                title,
                price,
                CONCAT(authorFirstName, ' ', authorLastName) AS author_name,
                ISBN,
                summary,
                publisher,
                publicationDate,
                numPages,
                (SELECT binding FROM binding WHERE binding.id=book.bindingID_book_FK) AS binding,
                (SELECT genre FROM genre WHERE genre.id=book.genreID_book_FK) AS genre,
                (SELECT type FROM product_type WHERE product_type.id=book.typeID_book_FK) AS type,
                nile_cover_ID
                FROM book
                WHERE %s < price AND %s > price'''

    try:
        cursor.execute(query, (min_price, max_price))

        results = cursor.fetchall()
        print(results)

        header = [desc[0] for desc in cursor.description]
        books = [dict(zip(header, result)) for result in results]

        print(books)


        genres = get_genres(cursor)
        genre_counts = get_genres_count(cursor)
        bindings = get_bindings(cursor)
        binding_counts = get_bindings_count(cursor)

        conn.close()
        return render_template('browse.html', books=books, genres=genres, genre_counts=genre_counts, bindings=bindings, binding_counts=binding_counts)
    
    except pymysql.Error as e:
        print(e)
        return redirect(url_for('common_bp.landing_page'))


@api_bp.route('/promo', methods=['POST'])
def validate_promo():
    PROMO_ID = request.form.get('PROMO_IDENT')
    cursor = generate_cursor(mysql)
    cursor.execute('SELECT * FROM promotion WHERE code=%s', PROMO_ID)

    if cursor.rowcount:
        results = cursor.fetchall()[0]
        return jsonify({'code': PROMO_ID, 'value': results[3]})
    else:
        print('promo doesnt exist')
        return jsonify({"code": False})


@api_bp.route('/'+api_url+'/isbn/', methods=['GET'])
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
                    summary,
                    publisher,
                    publicationDate,
                    numPages,
                    (SELECT binding FROM binding WHERE binding.id=book.bindingID_book_FK) AS binding,
                    (SELECT genre FROM genre WHERE genre.id=book.genreID_book_FK) AS genre,
                    (SELECT type FROM product_type WHERE product_type.id=book.typeID_book_FK) AS type,
                    nile_cover_ID
                    FROM book
                    WHERE book.ISBN=%s ORDER BY title'''
                cursor.execute(query, (isbn))
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


@api_bp.route('/'+api_url, methods=['GET'])
def query_books(search_query=None):
    if request.args is None:
        return redirect(url_for('common_bp.landing_page'))
    else:
        conn = mysql.connect()
        cursor = conn.cursor()

        # searching using nav search (search filter + query)
        if len(request.args) == 2:
            try:
                search_filter = request.args['searchFilter']

                if search_filter == 'all':
                    books = general_search(
                        request.args['search_query'], cursor)

                elif search_filter == 'productType':
                    query = '''SELECT 
                    title,
                    price,
                    CONCAT(authorFirstName, ' ', authorLastName) AS author_name,
                    ISBN,
                    summary,
                    publisher,
                    publicationDate,
                    numPages,
                    (SELECT binding FROM binding WHERE binding.id=book.bindingID_book_FK) AS binding,
                    (SELECT genre FROM genre WHERE genre.id=book.genreID_book_FK) AS genre,
                    (SELECT type FROM product_type WHERE product_type.id=book.typeID_book_FK) AS type,
                    nile_cover_ID
                    FROM book
                    WHERE book.typeID_book_FK=(SELECT id FROM product_type WHERE type=%s) ORDER BY title'''
                    cursor.execute(query, (search_query))
                    results = cursor.fetchall()

                    header = [desc[0] for desc in cursor.description]
                    books = [dict(zip(header, result)) for result in results]
                    print(books)

                genres = get_genres(cursor)
                genre_counts = get_genres_count(cursor)
                bindings = get_bindings(cursor)
                binding_counts = get_bindings_count(cursor)

                conn.close()
                return render_template('browse.html', books=books, genres=genres, genre_counts=genre_counts, bindings=bindings, binding_counts=binding_counts)
            except pymysql.Error as e:
                print(e)
                return redirect(url_for('common_bp.landing_page'))

        # using footer search (search query)
        elif len(request.args) == 1:
            books = general_search(request.args['search_query'], cursor)
            genres = get_genres(cursor)
            genre_counts = get_genres_count(cursor)
            bindings = get_bindings(cursor)
            binding_counts = get_bindings_count(cursor)

            conn.close()
            return render_template('browse.html', books=books, genres=genres, genre_counts=genre_counts, bindings=bindings, binding_counts=binding_counts)
        else:
            return redirect(url_for('common_bp.landing_page'))


def general_search(search_query, cursor):
    search_query = request.args['search_query']

    query = '''SELECT 
                    title,
                    price,
                    CONCAT(authorFirstName, ' ', authorLastName) AS author_name,
                    ISBN,
                    summary,
                    publisher,
                    publicationDate,
                    numPages,
                    (SELECT binding FROM binding WHERE binding.id=book.bindingID_book_FK) AS binding,
                    (SELECT genre FROM genre WHERE genre.id=book.genreID_book_FK) AS genre,
                    (SELECT type FROM product_type WHERE product_type.id=book.typeID_book_FK) AS type,
                    nile_cover_ID
                    FROM book ORDER BY title'''
    cursor.execute(query)
    results = cursor.fetchall()

    header = [desc[0] for desc in cursor.description]
    payload = [dict(zip(header, result)) for result in results]
    books = [book for book in payload if search_query.lower() in str(
        book.values()).lower()]

    return books
