# UK Petition signature change rate tracker

Tracks the change in signatures for a petition on `https://petition.parliament.uk`

## Building

```javascript
/uk-petition-signature-change-rate <master> % yarn install
/uk-petition-signature-change-rate <master> % yarn build
```

## Unit tests

The unit tests use Jest and the Yarn command below runs them.

```bash
/uk-petition-signature-change-rate ‹master*› % yarn test
```

## Adding to your project

First, add the dependency to your project like so:

```bash
/your-rad-project ‹master*› % yarn add uk-petition-signature-change-rate
```

And then you just use the library like the example below (use import syntax if you have Babel configured for it):

```javascript
const PetitionTracker = require('uk-petition-signature-change-rate');
```
