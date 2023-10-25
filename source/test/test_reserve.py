from module import Module
from playwright.sync_api import expect, sync_playwright


def test_reserve(database_connect):

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
        page.get_by_role("button", name="預約").click()
        page.get_by_role("link", name="我的書櫃").click()

        # Move mouse
        page.mouse.move(0, 0)
        
        page.get_by_role("tab", name="預約書籍").click()
        
        # Assert
        expect(page.get_by_role("button", name="取消預約")).to_be_visible()
        expect(page.get_by_role("rowheader", name="hi2")).to_be_visible()

        # Cancel the reservation
        page.get_by_role("button", name="取消預約").click()
        page.reload()
        page.get_by_role("link", name="我的書櫃").click()
        page.get_by_role("button", name="還書").click()
        