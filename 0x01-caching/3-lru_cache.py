#!/usr/bin/env python3
"""This module defines a class `LRUCache`"""

from base_caching import BaseCaching
from collections import deque


class LRUCache(BaseCaching):
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
                discarded_key = self.fifo_queue.popleft()
                del self.cache_data[discarded_key]
                print("DISCARD: {}".format(discarded_key))
            elif key in self.cache_data:
                self.fifo_queue.remove(key)

            self.cache_data[key] = item
            self.fifo_queue.append(key)

    def get(self, key):
        """Gets an item by key."""
        if key in self.cache_data:
            self.fifo_queue.remove(key)
            self.fifo_queue.append(key)
        return self.cache_data.get(key, None)
