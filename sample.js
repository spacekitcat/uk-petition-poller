const PetitionTracker = require('./lib/index');
var Spinner = require('cli-spinner').Spinner;

let initialized = false;
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
  spinner.stop(!initialized);
  console.log();
  const signatureCount = data['signature_count'];
  const lastUpdate = data['last_successful_update'];
  const lastUpdateOkay = data['last_call_ok'];

  statusString = generateStatusString(
    signatureCount,
    lastUpdateOkay,
    lastUpdate
  );
  initialized = true;
  spinner.setSpinnerTitle(statusString.toString('UTF-8'));
  spinner.start();
});

petitionTracker.start('241584');
