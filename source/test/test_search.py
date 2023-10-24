from module import Module
from playwright.sync_api import expect, sync_playwright


def test_search(database_connect):

    with sync_playwright() as playwright:
        # Arrange
        module = Module(playwright)
        module.open_browser()
        
        # Act
        module.login("user1", "12345678")
        module.search("hi2")
        page = module.page

        # Assert
        expect(page.get_by_role("rowheader", name="hi2")).to_be_visible()
        expect(page.get_by_role("rowheader", name="hi", exact=True)).not_to_be_visible()
