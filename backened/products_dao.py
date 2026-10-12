from sql_connection import get_sql_connection
def get_all_products(connection):

    cursor = connection.cursor()
    query = """
        SELECT
            manage_products.product_id,
            manage_products.name,
            manage_products.unit_id,
            manage_products.price_per_unit,
            unit_table.unit_name
        FROM manage_products
        INNER JOIN unit_table
            ON manage_products.unit_id = unit_table.unit_id
        """
    cursor.execute(query)

    response=[]
    for (product_id, product_name, unit_id, price_per_unit, unit_name) in cursor:
        response.append({
            "product_id": product_id,
            "product_name": product_name,
            "unit_id": unit_id,
            "price_per_unit": price_per_unit,
            "unit_name": unit_name
        })

    return response

def insert_new_product(connection,product):
    cursor = connection.cursor()
    query = ("INSERT INTO manage_products "
             "(name, unit_id, price_per_unit) "
             "VALUES (%s, %s, %s)")
    data = (product['product_name'], product['unit_id'], product['price_per_unit'])
    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

def delete_product(connection,product_id):
    cursor = connection.cursor()
    query = ("DELETE FROM manage_products WHERE product_id = %s")
    cursor.execute(query,(product_id,))
    connection.commit()
    return product_id

if __name__=="__main__":
    connection = get_sql_connection()
    print(get_all_products(connection))