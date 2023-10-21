import register
import database
import asyncio


def test_register():
    # Arrange
    # Connect to the database
    cnx = database.connect_mysql()
    assert cnx is not None, "Connection is OK"
    # Create a cursor object, which is used to execute SQL statements
    cursor = cnx.cursor()

    # Act
    # await register.main()
    # asyncio.run(register.main())
    register.main()
    # await register.async_playwright().start()

    # Assert
    # Check if the account is created
    cursor.execute("USE library")
    cursor.execute("SELECT * FROM account")
    accounts = cursor.fetchall()
    assert len(accounts) == 3, "The number of accounts is correct"
    assert accounts[2][1] == "shang112522105", "The account is correct"
    cursor.close()
    cnx.close()
