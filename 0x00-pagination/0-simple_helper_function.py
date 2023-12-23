#!/usr/bin/env python3
"""This module defines the function `index_range`"""


def index_range(page, page_size):
    """Returns a tuple of size two containing a start index and an end index"""
    start_index = page_size * (page - 1)
    end_index = page_size * page

    return (start_index, end_index)
