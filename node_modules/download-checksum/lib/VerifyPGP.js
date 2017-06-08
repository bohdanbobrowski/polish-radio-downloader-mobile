var readFileSync = require('fs').readFileSync
var Transform    = require('stream').Transform

var inherits = require('inherits')
var openpgp  = require('openpgp')

var readSignedContent = openpgp.message.readSignedContent
var readArmored       = openpgp.key.readArmored


function VerifyPGP(options)
{
  if(!(this instanceof VerifyPGP)) return new VerifyPGP(options)

  VerifyPGP.super_.call(this, {readableObjectMode: true})

  var content = ''
  var armedSignature = options.signatureFile
                     ? readFileSync(options.signatureFile, 'utf8')
                     : options.signature
  var armedKeys = options.keysFile
                ? readFileSync(options.keysFile, 'utf8')
                : options.keys

  this._transform = function(chunk, encoding, callback)
  {
    content += chunk
    callback()
  }
  this._flush = function(callback)
  {
    var keys = readArmored(armedKeys).keys

    this.push(readSignedContent(content, armedSignature).verify(keys))
    callback()
  }
}
inherits(VerifyPGP, Transform)


module.exports = VerifyPGP;
