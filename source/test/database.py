import os
import pymysql
from dotenv import load_dotenv
from pathlib import Path


def connect_mysql():
    """Connect to MySQL database and return connection object"""
    # Load environment variables from .env
    # Get the test directory
    p = Path(__file__).parent
    dotenv_path = p.parent.joinpath("back-end/.env")
    if load_dotenv(dotenv_path=dotenv_path) == False:
        raise Exception("Can't load .env file")

    # Set connection parameters
    config = {
        'user': os.getenv('DB_USER'),
        'passwd': os.getenv('DB_PASS'),
        'host': os.getenv('DB_HOST'),
        'port': int(os.getenv('DB_PORT')),
    }
    
    # Connect to the database
    try:
        cnx = pymysql.connect(**config)
    except pymysql.err.OperationalError as e:
        print(f"Can't connect to MySQL database: {e}")
        return None
    else:
        return cnx


if __name__ == "__main__":
    cnx = connect_mysql()
    print("Connection is OK")
    cnx.close()
