# Testing with HURL

Website: https://hurl.dev

## Install HURL

Install via your system package manager. See [HURL website](https://hurl.dev/docs/installation.html).

## General Usage

Run all HURL tests in the current directory:

```bash
hurl --variables-file vars.env --test .
```

Run a specific test file with default variables:

```bash
hurl --variables-file vars.env --test prio1.hurl
```

Run a test for a specific URL:

```bash
hurl --variable base_url=https://opengenderjournal.de --test prio1.hurl
```

Run a test file and create a report in HTML format:

```bash
hurl --variables-file vars.env --report-html results --test prio1.hurl
```

## Usage with authentication

Set login credentials

```Powershell
$HURL_test_password = "my_value"
hurl --variables-file vars.env --secret test_password=$HURL_test_password --test .\prio1-auth.hurl
```

## Advanced examples

### Test SSL Expiry from a Windows (Powershell) system for multiple URLs

Create a file `urls.txt` with the URLs you want to test, one per line.

```Powershell
Get-Content urls.txt | ForEach-Object { Write-Host $_; hurl --variable base_url=$_ --report-html results --test ssl-expiry.hurl }
```

#### Test SSL Expiry from a Windows (Powershell) system for multiple URLs and extract data from a JSON report

Create a file `urls.txt` with the URLs you want to test, one per line.

```Powershell
# Run the HURL test for each URL and generate a JSON report
Get-Content urls.txt | ForEach-Object { Write-Host $_; hurl --variable base_url=$_ --report-json results-json --test ssl-expiry.hurl }

# Extract the SSL expiry date from the JSON report
(Get-Content results-json\report.json -Raw | ConvertFrom-Json) | Select-Object -ExpandProperty entries | ForEach-Object {
    $_ | Select-Object -ExpandProperty calls | Select-Object -First 1 @{N='url';E={$_.request.url}},@{N='issuer';E={$_.response.certificate.issuer}},@{N='expiry';E={$_.response.certificate.expire_date}}
} | Export-Csv certificates.csv -NoTypeInformation
```
