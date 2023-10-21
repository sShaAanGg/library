import register
import database
from playwright.sync_api import Playwright, sync_playwright, expect
# import pytest

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:8080/#/dashboard")
    page.get_by_role("button", name="註冊").click()
    page.get_by_label("帳號:").click()
    page.get_by_label("帳號:").fill("shang112522105")
    page.get_by_label("帳號:").press("Tab")
    page.get_by_label("名稱:").fill("shang")
    page.get_by_label("名稱:").press("Tab")
    page.get_by_label("密碼:").fill("112522105")
    page.get_by_label("密碼:").press("Tab")
    page.get_by_label("密碼確認:").fill("112522105")
    page.get_by_label("密碼確認:").press("Tab")
    page.get_by_label("Email:").fill("test@someorg.com")
    page.get_by_label("Phone:").click()
    page.get_by_label("Phone:").fill("0912345678")
    page.get_by_role("button", name="Submit").click()

    # ---------------------
    context.close()
    browser.close()

with sync_playwright() as playwright:
    # browser = playwright.chromium.launch(headless=True)
    run(playwright)

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
    register.sync_playwright().start()
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
