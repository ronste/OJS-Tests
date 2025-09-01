from unittest import case

import pytest
from playwright.sync_api import Page, expect


@pytest.fixture
def article_url(page: Page, base_url: str, theme: str):

    page.goto(f"{base_url}/issue/current")
    url = None
    match theme:
        case "Immersion":
            url = page.locator('.article__title > a').first.get_attribute('href')
        case _:
            url = page.locator('[id^="article-"]').first.get_attribute('href')

    assert url is not None, "Article URL not found"
    return url

class TestFrontend:
    def test_homepage_static_content(self, page: Page, base_url: str, theme: str):
        response = page.goto(base_url)
        assert response.status == 200, "Homepage returned status code other than 200"
        match theme:
            case "Immersion":
                expect(page.locator("main#immersion_content_main")).to_be_visible()
            case _:
                expect(page.locator("div.pkp_structure_page")).to_be_visible()

    def test_current_issue_page(self, page: Page, base_url: str):
        response = page.goto(f"{base_url}/issue/current")
        assert response.status == 200, "Current Issue Page returned status code other than 200"

    def test_article_page(self, page: Page, base_url: str, article_url: str):
        response = page.goto(article_url)
        assert response.status == 200, "Article Page returned status code other than 200"

    def test_archive_page(self, page: Page, base_url: str):
        response = page.goto(f"{base_url}/issue/archive")
        assert response.status == 200, "Archive Page returned status code other than 200"

    def test_article_galley(self, page: Page, base_url: str, article_url: str, theme: str):
        response = page.goto(f"{article_url}")
        assert response.status == 200, "Article Page returned status code other than 200"
        galley_url = None
        match theme:
            case "Immersion":
                galley_url = page.locator("a.article__btn").first.get_attribute("href")
            case _:
                galley_url = page.locator("a.obj_galley_link").get_attribute("href")
        assert galley_url is not None, "Article Galley URL not found"

        galley_response = page.goto(galley_url)
        assert galley_response.status == 200, "Article Galley returned status code other than 200"

    def test_navigation_bar(self, page: Page, base_url: str, theme: str):
        response = page.goto(base_url)
        assert response.status == 200, "Homepage returned status code other than 200"
        match theme:
            case "Immersion":
                expect(page.locator("div#main-menu")).to_be_visible()
            case _:
                expect(page.locator("div.pkp_navigation_primary_wrapper")).to_be_visible()

    def test_sidebar(self, page: Page, article_url: str, theme: str):
        response = page.goto(article_url)
        assert response.status == 200, "Homepage returned status code other than 200"
        match theme:
            case "Immersion":
                expect(page.locator("aside.article-sidebar")).to_be_visible()
            case _:
                expect(page.locator("div.pkp_structure_sidebar")).to_be_visible()

    def test_footer(self, page: Page, base_url: str, theme: str):
        response = page.goto(base_url)
        assert response.status == 200, "Homepage returned status code other than 200"
        match theme:
            case "Immersion":
                expect(page.locator("footer#immersion_content_footer")).to_be_visible()
            case _:
                expect(page.locator("div.pkp_structure_footer_wrapper")).to_be_visible()

    def test_search(self, page: Page, base_url: str, theme: str):
        response = page.goto(f"{base_url}/search")
        assert response.status == 200, "Search returned status code other than 200"
        match theme:
            case "Immersion":
                expect(page.locator("form.search__form")).to_be_visible()
            case _:
                expect(page.locator("div.search_input")).to_be_visible()