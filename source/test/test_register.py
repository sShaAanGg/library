from module import Module
from playwright.sync_api import expect, sync_playwright


def test_register(database_connect):

    with sync_playwright() as playwright:
        # Arrange
        # Connect to the database
        # cnx = connect_mysql()

        # Create a cursor object, which is used to execute SQL statements
        # cursor = cnx.cursor()
        cnx, cursor = database_connect

        module = Module(playwright)
        module.open_browser()
        
        # Act
        # Create an account
        module.register("shang112522105", "Shang", "112522105", "test@someorg.com", "0912345678")
        cursor.execute("USE library")
        cursor.execute("SELECT * FROM account")
        cnx.commit()
        accounts = cursor.fetchall()

        # Assert
        # Check if the account is created
        assert len(accounts) == 3, "The number of accounts is correct"
        assert accounts[2][1] == "shang112522105", "The account is correct"
