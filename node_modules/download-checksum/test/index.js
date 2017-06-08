var notEqual = require('assert').notEqual
var Readable = require('stream').Readable

var checksums = require('..').checksums


const downloads =
[
  {
    url: '',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    url: 'hello world',
    sha256: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
  },
  {
    url: 'splitted',
    sha256: '4c002331eeef56ff91890b777426ed3b3d5291b35892041191e04df2b4fc8499'
  },
  {
    url: 'pgp',
    pgp:
    {
      keysFile: __dirname+'/fixtures/public.key',
      signatureFile: __dirname+'/fixtures/signature.asc'
    }
  },
  {
    url: 'failure',
    sha256: 'failure'
  }
]


function noop(){}


it('<empty>', function(done)
{
  var download = downloads[0]

  var response = new Readable
  checksums(response, download, done)

  response.push('')
  response.push(null)
})

it('hello world', function(done)
{
  var download = downloads[1]

  var response = new Readable
  checksums(response, download, done)

  response.push('hello world')
  response.push(null)
})

it('splitted', function(done)
{
  var download = downloads[2]

  var response = new Readable
  checksums(response, download, done)

  response.push('split')
  response.push('ted')
  response.push(null)
})

it('pgp', function(done)
{
  var download = downloads[3]

  var response = new Readable
  checksums(response, download, done)

  response.push('pgp')
  response.push(null)
})

it('failure', function(done)
{
  var download = downloads[4]

  var response = new Readable
  checksums(response, download, function(error)
  {
    notEqual(error, null)

    done()
  })

  response.push('failure')
  response.push(null)
})
