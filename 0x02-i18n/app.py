#!/usr/bin/env python3
"""This module sets up a basic Flask app"""

from flask import Flask, render_template, request, g
from flask_babel import Babel, format_datetime, _
from datetime import datetime
import pytz

app = Flask(__name__)
babel = Babel(app)


class Config(object):
    """Creates a Config class with the LANGUAGES attribute"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


@app.route('/')
def index_page():
    """This function defines a route for the root URL ('/')"""
    return render_template('index.html')


@babel.localeselector
def get_locale():
    """Selects a language translation to use for request by order of priority
    """
    locales = [
        request.args.get('locale'),
        g.user.get('locale', None) if g.user else None,
        request.accept_languages.best_match(Config.LANGUAGES),
        Config.BABEL_DEFAULT_LOCALE
    ]

    for locale in locales:
        if locale and locale in Config.LANGUAGES:
            return locale


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
    g.time = format_datetime(datetime.now())

@babel.timezoneselector
def get_timezone():
    """Returns a timezone for the request"""
    timezones = [
        request.args.get('timezone'),
        g.user.get('timezone', None) if g.user else None,
        Config.BABEL_DEFAULT_TIMEZONE
    ]
    for timezone in timezones:
        if timezone:
            locale_timezone = timezone
            break

    try:
        return pytz.timezone(locale_timezone).zone
    except pytz.exceptions.UnknownTimeZoneError:
        return Config.BABEL_DEFAULT_TIMEZONE
