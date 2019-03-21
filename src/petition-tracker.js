import request from 'request-promise';

class PetitionTracker {
  constructor() {
    this.events = {};
    this.lastSignatureCount = 0;
    this.lastSuccessfulUpdate = null;
    this.lastUpdateSuccessful = null;
  }

  on(eventKey, eventFn) {
    this.events[eventKey] = eventFn;
  }

  pollerFunction() {
    request(
      `https://petition.parliament.uk/petitions/${this.petitionCode}/count.json`
    )
      .then(jsonString => {
        const json = JSON.parse(jsonString);
        this.lastSignatureCount = json['signature_count'];
        this.lastSuccessfulUpdate = Date.now();
        this.lastUpdateSuccessful = true;

        this.callOn('change', {
          signature_count: json['signature_count'],
          last_successful_update: this.lastSuccessfulUpdate,
          last_call_ok: this.lastUpdateSuccessful
        });
      })
      .catch(() => {
        this.lastUpdateSuccessful = false;

        return this.callOn('change', {
          signature_count: this.lastSignatureCount,
          last_successful_update: this.lastSuccessfulUpdate,
          last_call_ok: this.lastUpdateSuccessful
        });
      });
  }

  async start(petitionCode) {
    this.petitionCode = petitionCode;
    await this.pollerFunction();
    setInterval(this.pollerFunction.bind(this), 60000);
  }

  callOn(eventKey, data) {
    const callback = this.events[eventKey];
    if (callback) {
      callback(data);
    }
  }
}

export default PetitionTracker;
