#!/usr/bin/env python3
"""This module defines the function `index_range`"""

import csv
import math
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Returns a tuple of size two containing a start index and an end index"""
    start_index = page_size * (page - 1)
    end_index = page_size * page

    return (start_index, end_index)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        """Initializes the instance of Server"""
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Retrieve a specific "page" of data from the dataset"""
        assert isinstance(page, int) and isinstance(page_size, int)
        assert page > 0 and page_size > 0

        start_index, end_index = index_range(page, page_size)

        return self.dataset()[start_index: end_index]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
        """Get a dictionary containing information about the current page
           and pagination details
        """
        total_pages = math.ceil(len(self.dataset()) / page_size)

        return {
                        "page_size": page_size,
                        "page": page,
                        "data": self.get_page(page, page_size),
                        "next_page": page + 1 if page < total_pages else None,
                        "prev_page": page - 1 if page > 1 else None,
                        "total_pages": total_pages
            }
