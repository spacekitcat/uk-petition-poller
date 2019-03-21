import request from 'request-promise';

class PetitionTracker {
  constructor() {
    this.events = {};
  }

  on(eventKey, eventFn) {
    this.events[eventKey] = eventFn;
  }

  pollerFunction() {
    request(`https://petition.parliament.uk/petitions/241584/count.json`).then(
      () => {
        this.callOn('change', 0);
      }
    );
  }

  start() {
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
