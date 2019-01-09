const fetch = require('node-fetch');

const ORIGIN  = 'https://api.mlab.com/api/1/databases/fresh';
const API_KEY = `?apiKey=${process.env.API_KEY}`;

const getURL = path => `${ORIGIN}${path}${API_KEY}`;

const POST_OPTIONS = { // Insert
    method:  'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};
const PUT_OPTIONS  = { // Replace
    method:  'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
};

function fetchFromDB(path, options) {
    return fetch(getURL(path), options);
}

module.exports = {
    PUT_OPTIONS,
    POST_OPTIONS,
    fetchFromDB
};