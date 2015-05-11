# Matches Example

This example provides a simple implementation for doing a login with a user and then getting job matches for that user.

## Libraries used
* JQuery. Mostly for doing the ajax calls to the Viridis REST API
* Crypto JS, HMAC-SHA1 rollup. Needed for authenthication
* Bootstrap, only for basic ui flavors. It has no functional implicancies

## Overview

The example is really simple and does basically 2 things, it allows a user to do a login and then gets job matches for that user.

### Login

The login is done against the /actors/login endpoint with the email and password provided. Note that the response is saved in a variable as we need the authenthication data included for later.

Reference: [ViridisAPI-DocumentationBasics.pdf](https://staging.viridislearning.com/api-documentation/ViridisAPI-DocumentationBasics.pdf)

### Job Matches

The job matches are obtained doing a POST request to /jobs/matches/{actorId}/{page}. There are some filtering options available, but for keeping the example simple, those options are sent with default values only.

We also need to authenthicate the request. For doing so we add to the AJAX request the authenthication headers: x-authtoken, x-signature and x-request-timestamp. The timestamp is the current date in [ISO format](http://en.wikipedia.org/wiki/ISO_8601), the authtoken was previously obtained from the login response, and the signature is the timestamp encrypted by HMAC-SHA1 with the secret key that was also obtained from the login response.

Reference: [ViridisAPI-JobMatches.pdf](https://staging.viridislearning.com/api-documentation/ViridisAPI-JobMatches.pdf)
