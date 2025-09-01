# OJS Tests with Playwright

This project contains automated tests for OJS (Open Journal Systems) using Playwright.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
2. Install required Browser and Dependency for Playwright

   ```
   playwright install --with-deps chromium
   ```

3. Configure environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   BASE_URL="https://your-ojs-instance.com"
   OJS_USER="your-username"
   OJS_PASS="your-password"
   ```

   The default values are:
   - BASE_URL="https://cdatp.journals.qucosa.de/cdatp/oaipmh"
   - OJS_USER="admin"
   - OJS_PASS="password"

## Running Tests

Run all tests:
```
pytest
```

Run a specific test file:
```
pytest test_suite.py
```

Run a specific test:
```
pytest test_suite.py::TestFrontend::test_homepage_static_content
```

## Environment Variables

The tests use the following environment variables from the `.env` file:

- `BASE_URL`: The base URL of the OJS instance to test
- `OJS_USER`: The username for authentication
- `OJS_PASS`: The password for authentication
- `SYSTEM_INFO_ENABLED`: Whether to check the system info page
- `EXISTING_PLUGIN_NAME`: The name of an existing plugin to test
- `FRONTEND_THEME`: The name of a frontend theme to test, implemented are "Default" and "Immersion"

You can also override these variables by passing them as command-line options:
```
pytest --base-url="https://another-ojs-instance.com" --ojs-user="another-user" --ojs-pass="another-password"
```