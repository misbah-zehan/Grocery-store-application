from flask import Flask, json, request, jsonify
import products_dao
from sql_connection import get_sql_connection
import unit_table_dao
import order_dao

app =Flask(__name__)
connection = get_sql_connection()

@app.route('/get_all_orders', methods=['GET'])
def get_all_orders():
    orders = order_dao.get_all_orders(connection)
    response = jsonify(orders)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/insert_order', methods=['POST'])
def insert_order():
    request_payload = json.loads(request.form['data'])
    order_id = order_dao.insert_order(connection, request_payload)
    response = jsonify({'order_id': order_id})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/get_products', methods=['GET'])
def get_products():
    products = products_dao.get_all_products(connection)
    response=jsonify(products)
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/get_uoms', methods=['GET'])
def get_uoms():
    response = unit_table_dao.get_umos(connection)
    response=jsonify(response)
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/delete_product', methods=['POST'])
def delete_product():
    return_id = products_dao.delete_product(connection,request.form['product_id'])
    response=jsonify({'product_id': return_id})
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/insert_product', methods=['POST'])
def insert_product():
    request_payload =json.loads(request.form['data'])
    product_id = products_dao.insert_new_product(connection, request_payload)
    response=jsonify({'product_id': product_id})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__=="__main__":
    print("Starting Python Flask Server For Grocery Store")
    app.run(port=5000)