#!/usr/bin/env python3
"""This module sets up a basic Flask app"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
app = Flask(__name__)
babel = Babel(app)


class Config(object):
    """Creates a Config class with the LANGUAGES attribute"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


@app.route('/')
def index_page():
    """This function defines a route for the root URL ('/')"""
    return render_template('5-index.html')


@babel.localeselector
def get_locale():
    """Selects a language translation to use for request.
       Detects if the incoming request contains locale argument and if its
       value is a supported locale, return it.
    """
    requested_locale = request.args.get('locale')

    if requested_locale and requested_locale in Config.LANGUAGES:
        return requested_locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


def get_user():
    """Returns a user dictionary"""
    user_id = request.args.get('login_as')

    if user_id:
        try:
            user_id = int(user_id)
            if user_id in users:
                return users[user_id]
            return None
        except Exception:
            return None


@app.before_request
def before_request():
    """Finds the user"""
    g.user = get_user()
