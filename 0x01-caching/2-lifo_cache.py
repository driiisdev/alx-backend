#!/usr/bin/env python3
"""This module defines a class `LIFOCache`"""

from base_caching import BaseCaching
from collections import deque


class LIFOCache(BaseCaching):
    """A caching system"""

    def __init__(self):
        """Initializes the class attributes."""
        super().__init__()
        self.fifo_queue = deque()

    def put(self, key, item):
        """Adds an item in the cache."""

        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS and\
                    key not in self.cache_data:
                discarded_key = self.fifo_queue.pop()
                del self.cache_data[discarded_key]
                print("DISCARD: {}".format(discarded_key))

            self.cache_data[key] = item
            self.fifo_queue.append(key)

    def get(self, key):
        """Gets an item by key."""
        return self.cache_data.get(key, None)
