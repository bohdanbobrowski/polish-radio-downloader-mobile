var crypto      = require('crypto')
var strictEqual = require('assert').strictEqual

var applyEach = require('async').applyEach

var VerifyPGP = require('./VerifyPGP')


const hashes = crypto.getHashes().map(function(hash)
{
  return addChecksum.bind(null, hash)
})
.concat(addPGP)


function onerror(error)
{
  throw error
}


function addChecksum(hashName, response, download, callback)
{
  var expected = download[hashName]
  if(!expected) return callback()

  response.pipe(crypto.createHash(hashName)).on('data', function(data)
  {
    // Checksum is valid
    if(data.toString('hex') === expected) return callback()

    // Checksum failed
    var url = download.url

    var error = new Error('Checksum failed for url "'+url+'"')
        error.url = url

    callback(error)
  })
}

function addPGP(response, download, callback)
{
  var pgp = download.pgp
  if(!pgp) return callback()

  response.pipe(VerifyPGP(pgp)).on('data', function(data)
  {
    // There could be several PGP signatures, iterate over all of them
    for(var index in data)
    {
      var verification = data[index]
      if(verification.valid) continue

      // One of the signatures is invalid
      var url = download.url

      var error = new Error('Invalid signature for url "'+url+'"')
          error.url = url

      return callback(error)
    }

    // All signatures are valid
    callback()
  })
}


const checksums = applyEach.bind(null, hashes)

/**
 * Plugin for `download` module
 */
function plugin(downloads)
{
  return function(response, url, next)
  {
    function addChecksums(download)
    {
      if(download.url === url) checksums(response, download, onerror)
    }

    if(downloads instanceof Array)
      downloads.forEach(addChecksums)
    else
    {
      if(!downloads.url) downloads.url = url

      addChecksums(downloads)
    }

    next()
  }
}


module.exports = plugin
plugin.checksums = checksums
