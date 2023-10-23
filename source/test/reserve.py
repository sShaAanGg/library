from playwright.sync_api import Playwright, sync_playwright, expect

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:8080/#/dashboard")
    page.get_by_label("帳號").click()
    page.get_by_label("帳號").fill("user1")
    page.get_by_label("帳號").press("Tab")
    page.locator("#password").fill("12345678")
    page.get_by_role("button", name="登入").click()
    page.get_by_role("link", name="館藏查詢").click()
    page.get_by_role("button", name="借閱").nth(1).click()
    page.get_by_role("button", name="預約").click()
    page.goto("http://localhost:8080/#/my-books")
    page.get_by_role("tab", name="預約書籍").click()
    # ---------------------
    # Assert
    page.set_default_timeout(timeout=10000)
    expect(page.get_by_role("button", name="取消預約")).to_be_visible()
    expect(page.get_by_role("rowheader", name="hi2")).to_be_visible()
    # ---------------------
    page.get_by_role("button", name="取消預約").click()
    page.reload()
    page.goto("http://localhost:8080/#/my-books")
    page.get_by_role("button", name="還書").click()
    context.close()
    browser.close()

def main():
    with sync_playwright() as playwright:
        run(playwright)
