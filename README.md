# For Reviewers wanting to run the code:

`npm run init`
`npm run run`

It will tell you which port the server is running on ( localhost:your_port )

# Quickstart For Now

Quick-Install Script:

  `npm run init` <- This will recursively pull submodules, and run all the basic initialization stuff that the submodules are in charge of, like compiling ts to js, scss to css etc.

Using this, you can run the server then with:

  `npm start`

Otherwise your gonna have to run `git submodule init` and then `git submodule update` 

To install dependencies:

  `npm install`

We need a secret key to sign our tokens, in prod this should remain consistent but dev doesn't need persistence, so this script will generate a basic .env file, so we don't have to hardcode anything:

  `npm run random_secret` (this isn't used as of yet)

Then to run it's:
  `npm start`
