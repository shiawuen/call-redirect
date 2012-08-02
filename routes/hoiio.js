
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


exports.onhangup = function (req, res) {
  res.send('OK')
};


exports.logs = function (req, res, nex) {

  getLogs(function (resp) {
    var withResults = resp.ok && resp.body && resp.body.entries;

    res.send( withResults ? resp.body.entries : [] )

  })

}


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

exports.handleMakeCall = function (req, res, next) {

  // Cancel the actiona and redirect back to call page
  if ( ! req.body.to ) {
    return res.send({ error: 'Need to specify a number to call' });
  }

  makecall( req, res )

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

  res.send({ message: 'OK' })

}


function getLogs (next) {

  var url = 'https://secure.hoiio.com/open/voice/get_history'


  sendReq( url, _.clone( opts ), next )
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

function sendReq (url, data, next) {

  // Send out request
  request
    .post( url )
    .type( 'form' )
    .send( data )
    .end( next || noop )

}

function noop () {}

