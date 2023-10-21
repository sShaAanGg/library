import pytest
import database
from pathlib import Path


class TestMySQL:

    # Define a fixture to import the .sql file
    @pytest.fixture(scope="session")
    def setup(self):

        # Connect to the database
        cnx = database.connect_mysql()
        assert cnx is not None, "Connection is OK"

        # Create a cursor object, which is used to execute SQL statements
        cursor = cnx.cursor()

        # Open the .sql file and read the content
        p = Path(__file__).parent.parent.parent
        with open(p.joinpath("./init.sql"), "r") as f:
            sql_content = f.read()
            sql_list = sql_content.split(";")

        # Execute the SQL statements
        for sql in sql_list:
            # If the SQL statement is not empty, execute it
            if sql.strip():
                cursor.execute(sql)
                # If the SQL statement is a CREATE statement, commit the changes
                if sql.startswith("CREATE"):
                    cnx.commit()
        
        yield cnx, cursor

        cursor.close()
        cnx.close()

    
    # Test if the database is created
    def test_import_sql(self, setup):

        # Get the cursor object
        cnx, cursor = setup
        
        # Check if the database is created
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        assert len(tables) == 5, "The number of tables is correct"
        
        # Check if the table "account" is created
        cursor.execute("SELECT * FROM account")
        accounts = cursor.fetchall()
        assert len(accounts) == 2, "The number of accounts is correct"
