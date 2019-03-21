import PetitionTracker from '../src/petition-tracker';
import request from 'request-promise';

jest.mock('request-promise');

jest.useFakeTimers();

const setupHttpMock = () => {
  request.mockResolvedValueOnce({});
};

describe('The `PetitionTracker` class', () => {
  describe('the `start` method', () => {
    describe('valid props are provided', () => {
      it('starts tracking', () => {
        const expectedPetitionCode = '241584';
        const petitionTracker = new PetitionTracker();
        const changeHandlerMock = jest.fn();

        setupHttpMock();

        petitionTracker.on('change', changeHandlerMock);

        petitionTracker.start(
          `https://petition.parliament.uk/petitions/${expectedPetitionCode}`
        );

        jest.runAllTimers();
        expect(changeHandlerMock).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(
          expect.any(Function),
          300000
        );

        expect(request).toHaveBeenCalledWith(
          `https://petition.parliament.uk/petitions/${expectedPetitionCode}/count.json`
        );
      });
    });
  });

  describe('An unrecognized event is registered via `on`', () => {
    it('should register nothing', () => {
      const petitionTracker = new PetitionTracker();
      const fakeCallback = jest.fn();

      petitionTracker.callOn('fake');
      expect(fakeCallback).not.toBeCalled();
    });
  });
});
