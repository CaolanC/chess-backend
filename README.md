# Quickstart For Now

To install dependencies:
  `npm install`

We need a secret key to sign our tokens, in prod this should remain consistent but dev doesn't need persistence, so this script will generate a basic .env file, so we don't have to hardcode anything:

  `npm run random_secret`

Then to run it's:
  `npm start`
