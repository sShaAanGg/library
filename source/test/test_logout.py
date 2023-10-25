from module import Module
from playwright.sync_api import expect, sync_playwright


def test_login(database_connect):

    with sync_playwright() as playwright:

        # Arrange
        module = Module(playwright)
        module.open_browser()

        # Act
        module.login("user1", "12345678")
        module.logout()
        page = module.page
        
        # Assert
        expect(page.get_by_role("main")).not_to_have_text("Hi! user1")
        expect(page.get_by_text("帳號： user1")).not_to_be_visible()
        expect(page.get_by_role("button", name="登出")).not_to_be_visible()
        expect(page.get_by_role("button", name="登出")).not_to_be_attached()
