from playwright.sync_api import Playwright, sync_playwright, expect

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:8080/#/dashboard")
    page.get_by_role("link", name="館藏查詢").click()
    page.get_by_placeholder("Search").click()
    page.get_by_placeholder("Search").fill("hi2")
    # ---------------------
    # Assert
    expect(page.get_by_role("rowheader", name="hi2")).to_be_visible()
    expect(page.get_by_role("rowheader", name="hi", exact=True)).not_to_be_visible()
    ### hi should not be found
    # get_by_role("main")
    # get_by_role("rowheader", name="hi2")
    # get_by_role("rowheader", name="hi", exact=True)
    # ---------------------
    context.close()
    browser.close()

def main():
    with sync_playwright() as playwright:
        run(playwright)
