#!/usr/bin/env python3
"""This moduke sets up a basic Flask app"""

from flask import Flask, render_template
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
    return render_template('1-index.html')
