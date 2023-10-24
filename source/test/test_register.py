from module import Module
from playwright.sync_api import expect, sync_playwright
from database import connect_mysql


def test_register(database_connect):

    with sync_playwright() as playwright:
        # Arrange
        # Connect to the database
        cnx = connect_mysql()
        assert cnx is not None, "Connection is OK"

        # Create a cursor object, which is used to execute SQL statements
        cursor = cnx.cursor()

        module = Module(playwright)
        module.open_browser()
        
        # Act
        # Create an account
        module.register("shang112522105", "Shang", "112522105", "test@someorg.com", "0912345678")

        # Assert
        # Check if the account is created
        cursor.execute("USE library")
        cursor.execute("SELECT * FROM account")
        accounts = cursor.fetchall()
        assert len(accounts) == 3, "The number of accounts is correct"
        assert accounts[2][1] == "shang112522105", "The account is correct"
        cursor.close()
        cnx.close()
