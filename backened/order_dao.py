from datetime import datetime
from sql_connection import get_sql_connection

def insert_order(connection, order):
    cursor = connection.cursor()
    order_query = ("INSERT INTO orders (customer_name, total_cost, datetime) "
                   "VALUES (%s, %s, %s)")
    cursor.execute(order_query, (order['customer_name'], order['grand_total'], datetime.now()))
    order_id = cursor.lastrowid

    details_query = ("INSERT INTO order_details (order_id, product_id, quantity, total_price) "
                     "VALUES (%s, %s, %s, %s)")
    details_data = [
        (order_id, d['product_id'], d['quantity'], d['total_price'])
        for d in order['order_details']
    ]
    cursor.executemany(details_query, details_data)

    connection.commit()
    return order_id

def get_all_orders(connection):
    cursor = connection.cursor()
    cursor.execute("SELECT order_id, customer_name, total_cost, datetime "
                   "FROM orders ORDER BY datetime DESC")
    response = []
    for (order_id, customer_name, total_cost, dt) in cursor:
        response.append({
            'order_id': order_id,
            'customer_name': customer_name,
            'total': float(total_cost),
            'datetime': dt.strftime('%d-%m-%Y %H:%M')
        })
    return response

if __name__ == "__main__":
    connection = get_sql_connection()
    print(get_all_orders(connection))