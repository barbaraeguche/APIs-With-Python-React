from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client['groceries']
collections = db['items']

def retrieve_items():
    items: list[dict] = list(collections.find({}, {'_id': False}))
    return items

def add_item(to_add: str) -> str:
    items: list[dict] = retrieve_items()

    for item in items:
        if item.get('item') == to_add:
            return f'Item {to_add} already exists in you shopping list'

    collections.insert_one({'item': to_add})
    return f'Item {to_add} has been added to your shopping list'

def update_item(prev_item: str, next_item: str) -> str:
    collections.update_one({'item': prev_item}, {'$set': {'item': next_item}})
    return f'Item {prev_item} has been updated to {next_item}'

def delete_item(delete_item: str) -> str:
    collections.delete_one({'item': delete_item})
    return f'Item {delete_item} has been removed from your shopping list'
