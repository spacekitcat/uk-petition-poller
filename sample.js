const PetitionTracker = require('./lib/index');
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

petitionTracker.start('241584');
