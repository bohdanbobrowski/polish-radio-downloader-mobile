# download-checksum
Checksums plugin for [download](https://github.com/kevva/download)

Allow to check the downloads by using any of the accepted checksums of the
Node.js [crypto](https://nodejs.org/api/crypto.html) module and PGP signatures.
It allow to check several algorythms for a single file, too.

## Usage

```Javascript
var Download = require('download')
var checksum = require('download-checksum')

var downloads =
[
  {
    url: 'http://example.com/foo.zip',
    sha256: '<hex string>'
  },
  {
    url: 'http://example.com/cat.jpg',
    md5: '<hex string>'
  },
  {
    url: 'http://example.com/Windows_10.tar.gz',
    pgp:
    {
      keys: '<armed PGP string>',
      signature: '<armed PGP string>'
    }
  },
  {
    url: 'http://example.com/Area_51.zip',
    pgp:
    {
      keysFile: 'path/to/publicKey.pub',
      signatureFile: 'path/to/signature.asc'
    }
  }
]

Download()
  .get(downloads[0].url)
  .get(downloads[1].url)
  .get(downloads[2].url)
  .get(downloads[3].url)
  .dest('dest')
  .use(checksum(downloads))
  .run()
```
