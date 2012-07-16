
// Dependencies
var request = require('superagent');
var _ = require('lodash');
var url = require('url')


var app = require('../app');


// Destination number
var dest_number = 'DESTONATION_NUMBER';

// Hoiio Number
var HOIIO_NUMBER = '+6566028213';


var settings = {

  // App ID of HOIIO
  app_id: process.env.hoiio_app_id

  // Access Token
, access_token: process.env.hoiio_access_token

};


// IVR URL
var ivrUrl = 'https://secure.hoiio.com/open/ivr';


exports.call = function call (req, res, next) {

  console.log('On Call >>>>>>>>>>>>>>>>>>>>>>');
  console.log(req.body);

  transfer(req);

  // Response with OK to prevent another from waiting
  res.send('OK');
  console.log('On Call >>>>>>>>>>>>>>>>>>>>>>');

}

exports.hangup = function hangup (req, res, next) {

  console.log('Call Hangup', req.body.session)
  console.log(req.body);

  res.send('OK');

}


exports.makecall = function (req, res, next) {

  res.render('call', { title: 'Make call' });

}

exports.handleMakeCall = function (req, res, next) {

  // Cancel the actiona and redirect back to call page
  if (!req.body.to) { res.redirect('/call'); }

  makecall(req, res);

}


exports.hangup = function (req, res, next) {

  console.log(req.body);

  res.send('OK')

}


function makecall(req, res) {

  var root = getUrl(req);

  // Setting up data to be send out to Hoiio
  var data = _.extend(_.clone(settings), {

    notify_url: root + '/on/hangup'

  , dest1: dest_number

  , dest2: req.body.to

  , caller_id: HOIIO_NUMBER

  });

  console.log(data)

  // Send out request
  request
    .post('https://secure.hoiio.com/open/voice/call')
    .type('form')
    .send(data)
    .end(function(res) {
      console.log('Make Call Reply >>>>>>>>>>>>>>>>>>>>>>');
      var status = res.ok ? 'OK' : 'ERROR';

      console.log(status, res.body)
      console.log('Make call Reply >>>>>>>>>>>>>>>>>>>>>>');
    });

  res.redirect('/call');

}


function getUrl(req) {

  // URL to response to
  var port = ':' + app.set('port');

  if (port !== ':80') {
    port = '';
  }

  return req.protocol +'://'+ req.host + port;

}

function hangup (req) {

  var root = getUrl(req);

  // Setting up data to be send out to Hoiio
  var data = _.extend(_.clone(settings), {

    session: req.body.session

  , notify_url: root + '/on/hangup'
  });

  // Send out request
  request
    .post(ivrUrl + '/end/hangup')
    .type('form')
    .send(data)
    .end(function(res) {
      console.log('Hangup Reply >>>>>>>>>>>>>>>>>>>>>>');
      var status = res.ok ? 'OK' : 'ERROR';

      console.log(status, res.body)
      console.log('hangup reply >>>>>>>>>>>>>>>>>>>>>>');
    });

}

function transfer (req) {

  var root = getUrl(req);

  // Setting up data to be send out to Hoiio
  var data = _.extend(_.clone(settings), {

    session: req.body.session

  , notify_url: root + '/on/hangup'

  , dest: dest_number

  , caller_id: req.body.from

  });

  console.log('Transfering >>>>>>>>>>>>>>>>>>>>>>');
  console.log(data)
  console.log('Transfering >>>>>>>>>>>>>>>>>>>>>>');

  // Send out request
  request
    .post(ivrUrl + '/end/transfer')
    .type('form')
    .send(data)
    .end(function(res) {
      console.log('Transfer Reply >>>>>>>>>>>>>>>>>>>>>>');
      var status = res.ok ? 'OK' : 'ERROR';

      console.log(status, res.body)
      console.log('Transfer Reply >>>>>>>>>>>>>>>>>>>>>>');
    });

}