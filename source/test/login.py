from playwright.sync_api import Playwright, sync_playwright, expect

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:8080/#/dashboard")
    page.get_by_label("帳號").click()
    # page.get_by_label("帳號").fill("shang112522105")
    # page.get_by_label("帳號").press("Tab")
    # page.locator("#password").fill("112522105")
    page.get_by_label("帳號").fill("user1")
    page.get_by_label("帳號").press("Tab")
    page.locator("#password").fill("12345678")
    page.get_by_role("button", name="登入").click()
    # ---------------------
    # Assert
    expect(page.get_by_role("main").get_by_text("Hi! user1")).to_be_visible()
    expect(page.get_by_text("帳號： user1")).to_be_visible()
    expect(page.get_by_role("button", name="登出")).to_be_enabled()
    expect(page.get_by_role("button", name="登出")).to_be_visible()
    # ---------------------
    context.close()
    browser.close()


def main():
    with sync_playwright() as playwright:
        run(playwright)
