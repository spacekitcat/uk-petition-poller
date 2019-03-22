# UK Petition poller

Polls a given petition on `https://petition.parliament.uk` for the current signature count. It reads the signature count every 60 seconds.
Made during what you might describe as a one person hackathon on a Thursday.

## Building

```javascript
/uk-petition-poller <master> % yarn install
/uk-petition-poller <master> % yarn build
```

## Unit tests

The unit tests use Jest via the Yarn `test` command like so:

```bash
/uk-petition-poller ‹master*› % yarn test
```

## The example script

Run the example like so:

```bash
git clone https://github.com/spacekitcat/uk-petition-poller
cd uk-petition-poller
/uk-petition-poller <master> % yarn install
/uk-petition-poller <master> % yarn build
/uk-petition-poller <master> % node sample.js
☆   SIGNATURES 3047041 :: UPDATE SUCCESS true :: LAST UPDATE 12:44
★   SIGNATURES 3047041 :: UPDATE SUCCESS true :: LAST UPDATE 12:45
```

## Adding to your project

First, add the dependency to your project like so:

```bash
/your-rad-project ‹master*› % yarn add uk-petition-poller
```

And then you just use the library like the example below (use import syntax if you have Babel configured for it).
I was experimenting with a little bit of ascii animation, so it's a little messy and complex, but I think it's clear enough to illustrate how to use this library.

```javascript
const PetitionTracker = require('./lib/index');
var Spinner = require('cli-spinner').Spinner;

var spinner = new Spinner('%s');
spinner.setSpinnerString('★☆');
spinner.setSpinnerDelay(500);
spinner.setSpinnerTitle('\x1b[31m  AWAITING DATA \x1b[0m');
spinner.start();

const petitionTracker = new PetitionTracker();

const generateStatusString = (
  signatureCount,
  lastUpdateSuccess,
  lastUpdate
) => {
  let separator = Buffer.from(' :: ');

  let lastUpdateDate = new Date(lastUpdate);
  let updatedStatus = Buffer.concat([
    Buffer.from('  '),
    Buffer.from(`SIGNATURES \x1b[31m${signatureCount}\x1b[0m`),
    separator,
    Buffer.from(`UPDATE SUCCESS \x1b[31m${lastUpdateSuccess}\x1b[0m`),
    separator,
    Buffer.from(
      `LAST UPDATE \x1b[31m${lastUpdateDate.getHours()}:${lastUpdateDate.getMinutes()}\x1b[0m`
    )
  ]);

  return updatedStatus;
};

petitionTracker.on('change', data => {
  spinner.stop(true);
  const signatureCount = data['signature_count'];
  const lastUpdate = data['last_successful_update'];
  const lastUpdateOkay = data['last_call_ok'];

  statusString = generateStatusString(
    signatureCount,
    lastUpdateOkay,
    lastUpdate
  );
  spinner.setSpinnerTitle(statusString.toString('UTF-8'));
  spinner.start();
});

petitionTracker.start('241584');
```
