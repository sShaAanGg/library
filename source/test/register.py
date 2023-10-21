from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:8080/#/dashboard")
    page.get_by_role("button", name="註冊").click()
    page.get_by_label("帳號:").click()
    page.get_by_label("帳號:").fill("shang112522105")
    page.get_by_label("帳號:").press("Tab")
    page.get_by_label("名稱:").fill("shang")
    page.get_by_label("名稱:").press("Tab")
    page.get_by_label("密碼:").fill("112522105")
    page.get_by_label("密碼:").press("Tab")
    page.get_by_label("密碼確認:").fill("112522105")
    page.get_by_label("密碼確認:").press("Tab")
    page.get_by_label("Email:").fill("test@someorg.com")
    page.get_by_label("Phone:").click()
    page.get_by_label("Phone:").fill("0912345678")
    page.get_by_role("button", name="Submit").click()
    # ---------------------
    context.close()
    browser.close()


def main():
    with sync_playwright() as playwright:
        run(playwright)
