def test_mysql(database_connect):

    # Arrange
    # Connect to the database
    # cnx = database.connect_mysql()
    # cursor = cnx.cursor()
    cnx, cursor = database_connect

    # Act
    # Check if the database is created
    cursor.execute("use library")
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    cursor.execute("SELECT * FROM account")
    cnx.commit()
    accounts = cursor.fetchall()

    # Assert
    # Check if the connection is successful
    assert cnx is not None, "Connection is OK"

    # Check if the database is created
    assert len(tables) == 5, "The number of tables is correct"
    assert len(accounts) == 2, "The number of accounts is correct"
