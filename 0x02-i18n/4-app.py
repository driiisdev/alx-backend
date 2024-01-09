#!/usr/bin/env python3
"""This moduke sets up a basic Flask app"""

from flask import Flask, render_template, request
from flask_babel import Babel
app = Flask(__name__)
babel = Babel(app)


class Config(object):
    """Creates a Config class with the LANGUAGES attribute"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)


@app.route('/')
def index_page():
    """This function defines a route for the root URL ('/')"""
    return render_template('4-index.html')


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
