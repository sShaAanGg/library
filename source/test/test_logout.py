import logout, database

def test_logout():
    # Arrange
    # Connect to the database
    cnx = database.connect_mysql()
    assert cnx is not None, "Connection is OK"
    # Create a cursor object, which is used to execute SQL statements
    cursor = cnx.cursor()

    # Act & Assert
    logout.main()

    # The following elements should not show up
    # get_by_role("main").get_by_text("Hi! shang")
    # get_by_text("帳號： shang112522105")
    # get_by_role("button", name="登出")

    cursor.close()
    cnx.close()
