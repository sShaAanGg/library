import login
import database
import pytest


@pytest.mark.dependency(depends=["test_register"], scope='session')
def test_login():
    # Arrange
    # Connect to the database
    cnx = database.connect_mysql()
    assert cnx is not None, "Connection is OK"
    # Create a cursor object, which is used to execute SQL statements
    cursor = cnx.cursor()

    # Act
    login.sync_playwright().start()

    # Assert
    # Check if the account is created
    cursor.execute("USE library")
    cursor.execute("SELECT * FROM account")
    accounts = cursor.fetchall()
    # TODO: add assertions
    cursor.close()
    cnx.close()
