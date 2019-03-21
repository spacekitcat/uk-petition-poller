import PetitionTracker from '../src/petition-tracker';
import request from 'request-promise';

jest.mock('request-promise');

jest.useFakeTimers();

const generateJson = count => ({ signature_count: count });

const setupHttpMock = () => {
  request.mockResolvedValue(generateJson(1000000));
};

const instantiateSut = () => {
  setupHttpMock();

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
    describe('valid props are provided', () => {
      it('starts tracking', async () => {
        const expectedPetitionCode = '241584';

        const petitionTracker = instantiateSut(expectedPetitionCode);
        const changeHandlerMock = setupOnChangeMock(petitionTracker);

        await petitionTracker.start(expectedPetitionCode);
        expect(changeHandlerMock).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
          `https://petition.parliament.uk/petitions/${expectedPetitionCode}/count.json`
        );
        setTimeout.mockClear();
      });
    });

    describe('valid props are provided (alt)', async () => {
      it('starts tracking', async () => {
        const expectedPetitionCode = '182329';

        const petitionTracker = instantiateSut(expectedPetitionCode);
        const changeHandlerMock = setupOnChangeMock(petitionTracker);

        await petitionTracker.start(expectedPetitionCode);
        expect(changeHandlerMock).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
          `https://petition.parliament.uk/petitions/${expectedPetitionCode}/count.json`
        );
        setTimeout.mockClear();
      });
    });
  });

  describe('the `start` method timeout code', () => {
    describe('valid props are provided', () => {
      it('starts tracking', async () => {
        const expectedPetitionCode = '199911';

        const petitionTracker = instantiateSut(expectedPetitionCode);
        const changeHandlerMock = setupOnChangeMock(petitionTracker);

        await petitionTracker.start(expectedPetitionCode);
        await jest.runAllTimers();
        expect(changeHandlerMock).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(
          expect.any(Function),
          300000
        );
        expect(request).toHaveBeenCalledWith(
          `https://petition.parliament.uk/petitions/${expectedPetitionCode}/count.json`
        );

        setTimeout.mockClear();
      });
    });

    describe('valid props are provided (alt)', async () => {
      it('starts tracking', async () => {
        const expectedPetitionCode = '434343';

        const petitionTracker = instantiateSut(expectedPetitionCode);
        const changeHandlerMock = setupOnChangeMock(petitionTracker);

        await petitionTracker.start(expectedPetitionCode);
        await jest.runAllTimers();
        expect(changeHandlerMock).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(
          expect.any(Function),
          300000
        );
        expect(request).toHaveBeenCalledWith(
          `https://petition.parliament.uk/petitions/${expectedPetitionCode}/count.json`
        );

        setTimeout.mockClear();
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
