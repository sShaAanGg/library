from module import Module
from playwright.sync_api import expect, sync_playwright


def test_login(database_connect):

    with sync_playwright() as playwright:

        # Arrange
        module = Module(playwright)
        module.open_browser()

        # Act
        module.login("user1", "12345678")
        page = module.page
        
        # Assert
        expect(page.get_by_role("main").get_by_text("Hi! user1")).to_be_visible()
        expect(page.get_by_text("帳號： user1")).to_be_visible()
        expect(page.get_by_role("button", name="登出")).to_be_enabled()
        expect(page.get_by_role("button", name="登出")).to_be_visible()
