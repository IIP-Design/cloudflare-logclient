# CloudFlare Log Client

A simple tool for downloading log files from CloudFlare's Enterprise Log Share REST API. See CloudFlare's Enterprise Log Share [documentation](https://support.cloudflare.com/hc/en-us/articles/216672448-Enterprise-Log-Share-REST-API).

## Usage

```
$ node index.js email='example@example.com' key='xxxxxxxxxxxxxxxxxx' zone='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' destination='path/to/file.gz' start='1459782073620' end='1459782058543' count='1000'

email: string
  Your authorization email

key: string
  Your authorization key

zone: string
  32 character zone identifier tag

destination: string
  Optional: Output directory. Defaults to current directory. Filename output: logs_1460033679360.json.gz

start: integer
  Unix epoch timestamp (UTC) in seconds. See [note](#generating-timestamp) below.

end: integer
  Unix epoch timestamp (UTC) in seconds. See [note](#generating-timestamp) below.

count: integer
  Optional number of records to return before stopping

```

### Generating Timestamps

With Node.js, for example:

```js
var datestring = 'Wed Apr 06 2016 12:47:06 GMT-0400 (EDT)';

function getUtcTime(datestring) {
  var time = new Date(datestring);
  var converted = Math.floor(time.getTime() / 1000);
  return converted;
}

> getUtcTime(datestring);
1459961226

```
