import PetitionTracker from '../src/petition-tracker';
import request from 'request-promise';

jest.mock('request-promise');

jest.useFakeTimers();

const generateJson = count => JSON.stringify({ signature_count: count });

const setupHttpMock = signatureCount => {
  request.mockResolvedValue(generateJson(signatureCount));
};

const instantiateSut = signatureCount => {
  setupHttpMock(signatureCount);

  const petitionTracker = new PetitionTracker();

  return petitionTracker;
};

const setupOnChangeMock = petitionTracker => {
  const changeHandlerMock = jest.fn();
  petitionTracker.on('change', changeHandlerMock);
  return changeHandlerMock;
};

describe('The `PetitionTracker` class', () => {
  describe('the `start` method', () => {
    describe('when valid props are provided', () => {
      it('starts tracking', async () => {
        setInterval.mockClear();
        const expectedSignatureCount = 12345333;
        const expectedPetitionCode = '241584';

        const petitionTracker = instantiateSut(expectedSignatureCount);
        const changeHandlerMock = setupOnChangeMock(petitionTracker);

        await petitionTracker.start(expectedPetitionCode);
        expect(changeHandlerMock).toHaveBeenCalledTimes(1);
        expect(changeHandlerMock).toHaveBeenCalledWith({
          signature_count: expectedSignatureCount,
          last_call_ok: true,
          last_successful_update: expect.any(Number)
        });
        expect(request).toHaveBeenCalledWith(
          `https://petition.parliament.uk/petitions/${expectedPetitionCode}/count.json`
        );
      });
    });

    describe('when valid props are provided (alt)', async () => {
      it('starts tracking', async () => {
        setInterval.mockClear();
        const expectedSignatureCount = 33345637;
        const expectedPetitionCode = '182329';

        const petitionTracker = instantiateSut(expectedSignatureCount);
        const changeHandlerMock = setupOnChangeMock(petitionTracker);

        await petitionTracker.start(expectedPetitionCode);
        expect(changeHandlerMock).toHaveBeenCalledTimes(1);
        expect(changeHandlerMock).toHaveBeenCalledWith({
          signature_count: expectedSignatureCount,
          last_call_ok: true,
          last_successful_update: expect.any(Number)
        });
        expect(request).toHaveBeenCalledWith(
          `https://petition.parliament.uk/petitions/${expectedPetitionCode}/count.json`
        );
      });
    });

    describe('when the http call fails', async () => {
      it('should do ', async () => {
        request.mockRejectedValue(new Error('502'));
        const petitionTracker = new PetitionTracker();

        const changeHandlerMock = jest.fn();
        petitionTracker.on('change', changeHandlerMock);

        await petitionTracker.start();
        expect(changeHandlerMock).toHaveBeenCalledTimes(1);
        expect(changeHandlerMock).toHaveBeenCalledWith({
          signature_count: 0,
          last_call_ok: false,
          last_successful_update: null
        });

        setInterval.mockClear();
      });
    });
  });

  describe('the `start` method timeout code', () => {
    describe('valid props are provided', () => {
      it('starts tracking', async () => {
        setInterval.mockClear();
        const expectedPetitionCode = '199911';

        const petitionTracker = instantiateSut(expectedPetitionCode);
        const changeHandlerMock = setupOnChangeMock(petitionTracker);

        await petitionTracker.start(expectedPetitionCode);
        await jest.runOnlyPendingTimers();
        expect(changeHandlerMock).toHaveBeenCalledTimes(2);
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(setInterval).toHaveBeenLastCalledWith(
          expect.any(Function),
          60000
        );
        expect(request).toHaveBeenCalledWith(
          `https://petition.parliament.uk/petitions/${expectedPetitionCode}/count.json`
        );
      });
    });

    describe('valid props are provided (alt)', async () => {
      it('starts tracking', async () => {
        setInterval.mockClear();
        const expectedPetitionCode = '434343';

        const petitionTracker = instantiateSut(expectedPetitionCode);
        const changeHandlerMock = setupOnChangeMock(petitionTracker);

        await petitionTracker.start(expectedPetitionCode);
        await jest.runOnlyPendingTimers();
        expect(changeHandlerMock).toHaveBeenCalledTimes(2);
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(setInterval).toHaveBeenLastCalledWith(
          expect.any(Function),
          60000
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
