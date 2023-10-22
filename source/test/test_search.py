import search
import database

def test_login():
    # Arrange
    # Connect to the database
    cnx = database.connect_mysql()
    assert cnx is not None, "Connection is OK"
    # Create a cursor object, which is used to execute SQL statements
    cursor = cnx.cursor()

    # Act & Assert
    search.main()

    ### hi should not be found
    # get_by_role("main")
    # get_by_role("rowheader", name="hi2")
    # get_by_role("rowheader", name="hi", exact=True)

    cursor.close()
    cnx.close()
