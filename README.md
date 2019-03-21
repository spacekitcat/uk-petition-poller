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
 ◐  NEXT UPDATE 47s :: SIGNATURES 2002343 :: UPDATE SUCCESS true ::
```

## Adding to your project

First, add the dependency to your project like so:

```bash
/your-rad-project ‹master*› % yarn add uk-petition-poller
```

And then you just use the library like the example below (use import syntax if you have Babel configured for it).
I was experimenting with a little bit of ascii animation, so it's a little messy and complex, but I think it's clear enough to illustrate how to use this library.

```javascript
const PetitionTracker = require('uk-petition-poller');
const process = require('process');

const petitionTracker = new PetitionTracker();
const terminalWidth = 120;

const generateStatusString = (signatureCount, lastUpdateSuccess) => {
  let output = Buffer.alloc(terminalWidth, ' ');
  let separator = Buffer.from(' :: ');

  let updatedStatus = Buffer.concat(
    [
      Buffer.from(`SIGNATURES \x1b[31m${signatureCount}\x1b[0m`),
      separator,
      Buffer.from(`UPDATE SUCCESS \x1b[31m${lastUpdateSuccess}\x1b[0m`),
      separator,
      output
    ],
    terminalWidth - 1
  );

  return Buffer.concat([updatedStatus, Buffer.from('\r')], terminalWidth);
};

let statusString = '';
let lastUpdate;
petitionTracker.on('change', data => {
  const signatureCount = data['signature_count'];
  lastUpdate = data['last_successful_update'];
  const lastUpdateOkay = data['last_call_ok'];

  statusString = generateStatusString(signatureCount, lastUpdateOkay);
});

const frames = ['◐', '◒', '◐', '◓'];
let index = 0;
setInterval(() => {
  let loadingStatus = Buffer.concat(
    [
      Buffer.from(`  ${frames[index]}  `),
      Buffer.from(
        `NEXT UPDATE \x1b[31m${Math.round(
          (60000 - (new Date() - lastUpdate)) / 1000
        )}s\x1b[0m :: `
      ),
      statusString
    ],
    terminalWidth - 1
  );
  process.stdout.write(
    Buffer.concat([loadingStatus, Buffer.from('\r')], terminalWidth)
  );
  index = index >= frames.length - 1 ? 0 : index + 1;
}, 1000);

// https://petition.parliament.uk/petitions/241584
petitionTracker.start('241584');
```
