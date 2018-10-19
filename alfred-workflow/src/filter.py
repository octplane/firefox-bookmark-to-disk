#!/usr/bin/env python
import json

def bk_to_alfred(bk):
    it = {
        'uid': bk['id'],
        'title': bk['title'],
        'arg': bk['url']
    }
    return it


with open('/tmp/bookmarks.json', 'r') as b:
    ff_bookmarks = json.load(b)
    items = [bk_to_alfred(it) for it in ff_bookmarks]
    print(json.dumps({'items': items}, indent=2))
