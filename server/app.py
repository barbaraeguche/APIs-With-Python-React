from flask import Flask, jsonify, request, redirect, url_for
from flask_cors import CORS
import grocery_list as gl

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():  # put application's code here
    return 'Hello World!'

@app.route('/groceries', methods=['GET'])
def get_groceries():
    items: list[dict] = gl.retrieve_items()
    return jsonify({'all_items': items}), 200

@app.route('/groceries/add', methods=['POST'])
def add_grocery():
    item_to_add: str = request.get_json().get('newItem')
    add_response: str = gl.add_item(item_to_add)
    return jsonify({'msg': add_response}), 201

@app.route('/groceries/update', methods=['PUT'])
def update_grocery():
    gotten_json: dict = request.get_json()
    prev_item = gotten_json.get('prevItem')
    next_item = gotten_json.get('nextItem')

    update_response = gl.update_item(prev_item, next_item)
    return jsonify({'msg': update_response}), 200

@app.route('/groceries/delete/<item_to_delete>', methods=['DELETE'])
def delete_grocery(item_to_delete: str):
    delete_response = gl.delete_item(item_to_delete)
    return jsonify({'msg': delete_response}), 200


if __name__ == '__main__':
    app.run(port=3000)
