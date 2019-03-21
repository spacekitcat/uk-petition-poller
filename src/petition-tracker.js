import request from 'request-promise';

class PetitionTracker {
  constructor() {
    this.events = {};
  }

  on(eventKey, eventFn) {
    this.events[eventKey] = eventFn;
  }

  pollerFunction() {
    request(
      `https://petition.parliament.uk/petitions/${this.petitionCode}/count.json`
    ).then(jsonString => {
      console.log(jsonString);
      this.callOn('change', 0);
    });
  }

  start(petitionCode) {
    this.petitionCode = petitionCode;
    this.pollerFunction();
    setTimeout(this.pollerFunction.bind(this), 300000);
  }

  callOn(eventKey, timeTook) {
    const callback = this.events[eventKey];
    if (callback) {
      callback(timeTook);
    }
  }
}

export default PetitionTracker;
