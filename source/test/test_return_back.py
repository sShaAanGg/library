from module import Module
from playwright.sync_api import expect, sync_playwright


def test_return_back(database_connect):

    with sync_playwright() as playwright:

        # Arrange
        module = Module(playwright)
        module.open_browser()

        # Act
        module.login("user1", "12345678")
        page = module.page

        # Browse the book
        page.get_by_role("link", name="館藏查詢").click()
        page.get_by_role("button", name="借閱").nth(1).click()
        page.get_by_role("link", name="我的書櫃").click()
        page.get_by_role("button", name="還書").click()
        
        # Assert
        expect(page.get_by_role("button", name="還書")).to_be_hidden()
        expect(page.get_by_role("rowheader", name="hi2")).to_be_hidden()
        