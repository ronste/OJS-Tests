# prio 1 test for OJS 3.3 that require authentication

# Get the (redirected) query_url
GET {{base_url}}
[Options]
location:true # follow redirects
HTTP 200
[Captures]
query_url: url # we store the url returned by the server so rewrites on the server side will be considered
[Asserts]
variable "query_url" != ""

# Get csrf_token
GET {{query_url}}/login
[Options]
location:true # follow redirects
HTTP 200
[Captures]
csrf_token: xpath "string(//input[@name='csrfToken']/@value)"
[Asserts]
variable "csrf_token" != ""

# ID 17
# Login
POST {{query_url}}/login/signIn
X-CSRF-TOKEN: {{csrf_token}}
[Options]
location:true # follow redirects
[Form]
username: {{test_username}}
password: {{test_password}}
HTTP 200

# Check we are logged in
GET {{query_url}}/submissions
X-CSRF-TOKEN: {{csrf_token}}
[Options]
location:true # follow redirects
HTTP 200
[Asserts]
xpath "string(//body/@class)" startsWith "pkp_page_submissions" # This will work work generally as it does compare string values

# ID 20
# Plugin Gallery
GET {{query_url}}/$$$call$$$/grid/plugins/plugin-gallery-grid/fetch-grid
X-CSRF-TOKEN: {{csrf_token}}
[Options]
location:true # follow redirects
HTTP 200
[Asserts]
jsonpath "$..content" nth 0 contains "component-grid-plugins-plugingallerygrid-row-0"

# ID 21
# Ausgabenseite lässt sich aufrufen
GET {{query_url}}/manageIssues
X-CSRF-TOKEN: {{csrf_token}}
[Options]
location:true # follow redirects
HTTP 200
[Asserts]
xpath "string(//body/@class)" startsWith "pkp_page_manageIssues"

# ID 22/23
# Liste der plugins lässt sich aufrufen
GET {{query_url}}/$$$call$$$/grid/settings/plugins/settings-plugin-grid/fetch-grid
X-CSRF-TOKEN: {{csrf_token}}
[Options]
location:true # follow redirects
HTTP 200
[Asserts]
jsonpath "$..content" nth 0 contains "component-grid-settings-plugins-settingsplugingrid-category-themes-row-defaultthemeplugin"

# ID 24
# # Ein spezifisches Plugin lässt sich aktivieren/deaktivieren
# POST {{query_url}}/$$$call$$$/grid/settings/plugins/settings-plugin-grid/enable?csrfToken={{csrf_token}}&plugin=developedbyblockplugin&category=blocks
# X-CSRF-TOKEN: {{csrf_token}}
# [Options]
# location:true # follow redirects
# HTTP 200
# POST {{query_url}}/$$$call$$$/grid/settings/plugins/settings-plugin-grid/disable?csrfToken={{csrf_token}}&plugin=developedbyblockplugin&category=blocks
# X-CSRF-TOKEN: {{csrf_token}}
# [Options]
# location:true # follow redirects
# HTTP 200

# ID 25
# Artikelstatistik lässt sich aufrufen
GET {{query_url}}/stats/publications/publications
X-CSRF-TOKEN: {{csrf_token}}
[Options]
location:true # follow redirects
HTTP 200
[Asserts]
xpath "//div[@class='pkpStats']" exists
GET {{query_url}}/api/v1/stats/publications?count=30&offset=0&dateStart=2025-05-01
X-CSRF-TOKEN: {{csrf_token}}
[Options]
location:true # follow redirects
HTTP 200
[Asserts]
jsonpath "$.items" count > 0 # we check that there are items in the response

# ID 26
# Einreichungsübersicht lässt sich aufrufen
GET {{query_url}}/submissions
X-CSRF-TOKEN: {{csrf_token}}
[Options]
location:true # follow redirects
HTTP 200
[Asserts]
xpath "//div[@class='app__page']" exists