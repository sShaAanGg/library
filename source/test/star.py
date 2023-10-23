from playwright.sync_api import Playwright, sync_playwright, expect

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:8080/#/dashboard")
    page.get_by_label("帳號").click()
    page.get_by_label("帳號").fill("user1")
    page.get_by_label("帳號").press("Tab")
    page.locator("#password").fill("12345678")
    page.get_by_role("button", name="登入").click()
    page.get_by_role("link", name="館藏查詢").click()
    page.get_by_role("button", name="收藏").nth(1).click()
    page.goto("http://localhost:8080/#/my-books")
    page.get_by_role("tab", name="收藏書籍").click()
    # ---------------------
    # Assert
    page.reload()
    expect(page.get_by_role("rowheader", name="hi2")).to_be_visible()
    expect(page.get_by_role("button", name="取消收藏")).to_be_visible()
    ### The button should show up in the page
    # get_by_role("button", name="取消收藏")
    # ---------------------
    page.get_by_role("button", name="取消收藏").click()
    context.close()
    browser.close()

def main():
    with sync_playwright() as playwright:
        run(playwright)
