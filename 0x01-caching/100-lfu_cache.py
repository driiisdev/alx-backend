#!/usr/bin/env python3
"""This module defines a class `LFUCache`"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """A caching system"""

    def __init__(self):
        """Initializes the class attributes."""
        super().__init__()
        self.freq_record = {}

    def put(self, key, item):
        """Adds an item in the cache."""

        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS and\
                    key not in self.cache_data:
                discarded_key = min(self.freq_record, key=self.freq_record.get)
                del self.freq_record[discarded_key]
                del self.cache_data[discarded_key]
                print("DISCARD: {}".format(discarded_key))

            self.cache_data[key] = item
            if key in self.freq_record:
                self.freq_record[key] += 1
            else:
                self.freq_record[key] = 1

    def get(self, key):
        """Gets an item by key."""
        if key in self.freq_record:
            self.freq_record[key] += 1
        return self.cache_data.get(key, None)
