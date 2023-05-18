const express = require('express');
const app = express();
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
require('dotenv').config();

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: 'INSERT YOUR API IDENTIFIER FROM AUTH0',    // To fill
  issuerBaseURL: 'INSERT YOUR AUTH0 DOMAIN',            // To fill
  tokenSigningAlg: 'HS256',
  secret: process.env.SECRET                            // Add your API's signing secret to the .env file
});

// For local testing purposes
app.use(function(req, res, next) {
    if (req.headers.origin.match(/^http:\/\/localhost(:[0-9]+)?(\/.*)?$/)) {
      res.header("Access-Control-Allow-Origin", req.headers.origin); 
      res.header("Access-Control-Allow-Headers", "*");
    }
    next();
  });

// This route doesn't need authentication
app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

// This route needs authentication
app.get('/api/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

const checkScopes = requiredScopes('read:messages');

// This route needs authentication and certain scope
app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

// Runs on port 3001 by default
app.listen(3001, function() {
  console.log('Listening on http://localhost:3001');
});
