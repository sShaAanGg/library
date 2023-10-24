from module import Module
from playwright.sync_api import expect, sync_playwright


def test_star(database_connect):

    with sync_playwright() as playwright:

        # Arrange
        module = Module(playwright)
        module.open_browser()

        # Act
        module.login("user1", "12345678")
        page = module.page
        page.get_by_role("link", name="館藏查詢").click()
        page.get_by_role("button", name="收藏").nth(1).click()
        page.goto("http://localhost:8080/#/my-books")
        page.get_by_role("tab", name="收藏書籍").click()
        
        # Assert
        expect(page.get_by_role("button", name="取消收藏")).to_be_visible()

        # Cleanup
        page.get_by_role("button", name="取消收藏").click()
        