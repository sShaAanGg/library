import database


def test_mysql_login():

    # Connect to the database
    cnx = database.connect_mysql()

    # Check if the connection is successful
    assert cnx is not None, "Connection is OK"
