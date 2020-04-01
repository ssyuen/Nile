from flask import Blueprint, render_template, request, jsonify, redirect, flash, session, url_for


common_bp = Blueprint('common_bp', __name__,
                    template_folder='templates', static_folder='static')


@common_bp.route('/about/')
def about():
    return render_template('about.html')