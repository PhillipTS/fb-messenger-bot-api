/* eslint-disable semi */
'use strict';

const request = require('request');

const requestOptions = {
  url: 'https://graph.facebook.com/v2.6/',
  qs: {
    access_token: undefined
  },
  method: undefined
};

const greetingSettingPayload = {
  'setting_type': 'greeting',
  'greeting': {
    'text': undefined
  }
};

const getStartedSettingPayload = {
  'setting_type': 'call_to_actions',
  'thread_state': 'new_thread',
  'call_to_actions': [
    {
      'payload': undefined
    }
  ]
};

const deepCopyPayload = function deepCopyPayload (payloadType) {
  return JSON.parse(JSON.stringify(payloadType));
};

const sendMessage = function sendMessage (options, token, cb) {
  options.qs.access_token = token;

  if (typeof cb !== 'function') {
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          if (!((!!body) && (body.constructor === Object))) {
            let bodyObject = JSON.parse(body);
            if (bodyObject.error) {
              reject(bodyObject.error.message);
            } else {
              resolve(body);
            }
          } else {
            resolve(body);
          }
        }
      })
    })
  } else {
    request(options, (err, res, body) => {
      if (err) return cb(err);
      if (body.error) return cb(body.error);
      cb(null, body);
    });
  }
};

const sendConfigurationMessage = function sendConfigurationMessage (payload, token, cb) {
  const options = deepCopyPayload(requestOptions);
  options.url += 'me/thread_settings';
  options.method = 'POST';
  options.json = payload;
  return sendMessage(options, token, cb);
};

class FbMessengerAPI {
  constructor (token) {
    this._token = token;
  }

  setGreetingMessage (greetingMessage, cb) {
    const jsonPayload = deepCopyPayload(greetingSettingPayload);
    jsonPayload.greeting.text = greetingMessage;
    return sendConfigurationMessage(jsonPayload, this._token, cb);
  }

  setGetStartedAction (getStartedPayload, cb) {
    const jsonPayload = deepCopyPayload(getStartedSettingPayload);
    jsonPayload.call_to_actions[0].payload = getStartedPayload;
    return sendConfigurationMessage(jsonPayload, this._token, cb);
  }
}

module.exports = FbMessengerAPI;
