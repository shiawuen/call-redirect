
    // Dependencies
var request = require( 'superagent' ),
    url = require( 'url' ),
    _ = require( 'lodash' )


var app = require( '../app' ),
    env = process.env
    opts = {}


// IVR URL
var ivrUrl = 'https://secure.hoiio.com/open/ivr'


opts.app_id = env.HOIIO_APP_ID

opts.access_token = env.HOIIO_ACCESS_TOKEN



exports.call = function (req, res, next) {

  transfer( req )

  // Response with OK to prevent another from waiting
  res.send( 'OK' )

  return
}

exports.hangup = function (req, res, next) {

  console.log( 'Call Hangup >> ', req.body.session )

  res.send( 'OK' )

}


exports.makecall = function (req, res, next) {

  res.render( 'call', {
    title: 'Make call'
  })

}

exports.handleMakeCall = function (req, res, next) {

  // Cancel the actiona and redirect back to call page
  if ( ! req.body.to ) {
    res.redirect( '/call' )
  }

  makecall( req, res )

}


exports.hangup = function (req, res, next) {

  console.log( req.body )

  res.send( 'OK' )

}


function makecall (req, res) {

  // Setting up data to be send out to Hoiio
  var data = _.extend( _.clone( opts ), {

    caller_id: env.HOIIO_NUMBER,
    dest1: env.DESTINATION_NUMBER,
    dest2: req.body.to,
    notify_url: getHangUpUrl( req )

  })

  // Send out request
  sendReq( 'https://secure.hoiio.com/open/voice/call', data )

  res.redirect( '/call' )

}


function hangup (req) {

  // Setting up data to be send out to Hoiio
  var data = _.extend( _.clone( opts ), {

    session: req.body.session,
    notify_url: getHangUpUrl( req )

  })

  // Send out request
  sendReq( ivrUrl + '/end/hangup', data )

}


function transfer (req) {

  // Setting up data to be send out to Hoiio
  var data = _.extend( _.clone( opts ), {

    caller_id: req.body.from,
    dest: env.DESTINATION_NUMBER,
    notify_url: getHangUpUrl( req ),
    session: req.body.session

  })

  // Send out request
  sendReq( ivrUrl + '/end/transfer', data )

}


/**
 * Using current request to get it's host URL
 **/

function getUrl (req) {

  // URL to response to
  var port = ':' + app.set( 'port' )

  if (port !== ':80') {
    port = ''
  }

  return req.protocol +'://'+ req.host + port

}

function getHangUpUrl (req) {
  return getUrl( req ) + '/on/hangup'
}


/**
 * Generalized helper to send request
 **/

function sendReq (url, data) {

  // Send out request
  request
    .post( url )
    .type( 'form' )
    .send( data )
    .end( logResp )

}


/**
 * Logging response from Hoiio
 **/

function logResp (res) {
  var status = res.ok ? 'OK' : 'ERROR'
}
