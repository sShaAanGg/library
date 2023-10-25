from playwright.sync_api import Playwright


class Module:
    def __init__(self, playwright: Playwright):
        self.playwright = playwright
        self._context = None
        self._browser = None
        self._page = None
        self.headless = True

    @property
    def page(self):
        return self._page
    
    @property
    def context(self):
        return self._context
    
    @property
    def browser(self):
        return self._browser

    def open_browser(self):
        self._browser = self.playwright.chromium.launch(headless=self.headless)
        self._context = self.browser.new_context()
        self._page = self.context.new_page()

    def login(self, username, password):
        self.page.goto("http://localhost:8080/#/dashboard")

        self.page.get_by_label("帳號").click()
        self.page.get_by_label("帳號").fill(username)
        self.page.get_by_label("帳號").press("Tab")
        self.page.locator("#password").fill(password)
        self.page.get_by_role("button", name="登入").click()

    def logout(self):
        self.page.get_by_role("button", name="登出").click()

    def register(self, username, name, password, email, phone):
        self.page.goto("http://localhost:8080/#/dashboard")
        self.page.get_by_role("button", name="註冊").click()
        self.page.get_by_label("帳號:").click()
        self.page.get_by_label("帳號:").fill(username)
        self.page.get_by_label("帳號:").press("Tab")
        self.page.get_by_label("名稱:").fill(name)
        self.page.get_by_label("名稱:").press("Tab")
        self.page.get_by_label("密碼:").fill(password)
        self.page.get_by_label("密碼:").press("Tab")
        self.page.get_by_label("密碼確認:").fill(password)
        self.page.get_by_label("密碼確認:").press("Tab")
        self.page.get_by_label("Email:").fill(email)
        self.page.get_by_label("Phone:").click()
        self.page.get_by_label("Phone:").fill(phone)
        self.page.get_by_role("button", name="Submit").click()

    def search(self, keyword):
        self.page.get_by_role("link", name="館藏查詢").click()
        self.page.get_by_placeholder("Search").click()
        self.page.get_by_placeholder("Search").fill(keyword)

    def close_browser(self):
        self.page.close()
        self.context.close()
        self.browser.close()
