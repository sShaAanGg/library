from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:8080/#/dashboard")
    page.get_by_label("帳號").click()
    page.get_by_label("帳號").fill("shang112522105")
    page.get_by_label("帳號").press("Tab")
    page.locator("#password").fill("112522105")
    page.get_by_role("button", name="登入").click()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    run(playwright)
