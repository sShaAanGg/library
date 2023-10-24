def test_mysql_login(database_connect):

    # Connect to the database
    cnx = database_connect

    # Check if the connection is successful
    assert cnx is not None, "Connection is OK"
