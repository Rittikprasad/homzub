import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { countryCodes, carpetAreaUnits, currencyCodes } from '@homzhub/common/src/mocks/CommonRepositoryMocks';
import { OnboardingData } from '@homzhub/common/src/mocks/Onboarding';
import { SocialMediaData } from '@homzhub/common/src/mocks/SocialMedia';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe.skip('CommonRepository', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should fetch a list of county codes', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(countryCodes));
    const response = await CommonRepository.getCountryCodes();
    expect(response).toMatchSnapshot();
  });

  it('should fetch a list of unit areas', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(carpetAreaUnits));
    const response = await CommonRepository.getCarpetAreaUnits();
    expect(response).toMatchSnapshot();
  });

  it('should fetch a list of currency codes', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(currencyCodes));
    const response = await CommonRepository.getCurrencyCodes();
    expect(response).toMatchSnapshot();
  });

  it('should fetch social media data', () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(SocialMediaData));
    const response = CommonRepository.getSocialMedia();
    expect(response).toMatchSnapshot();
  });

  it('should fetch OnBoarding screen data', async () => {
    jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => Promise.resolve(OnboardingData));
    const response = await CommonRepository.getOnBoarding();
    expect(response).toMatchSnapshot();
  });

  ['getCountryCodes', 'getCarpetAreaUnits', 'getOnboarding', 'getCurrencyCodes', 'getSocialMedia'].forEach(
    (api: string) => {
      it(`should throw an error in case of ${api} API failure`, async () => {
        jest.spyOn(BootstrapAppService.clientInstance, 'get').mockImplementation(() => {
          throw new Error('Test Error');
        });
        try {
          // @ts-ignore
          await CommonRepository[api]();
        } catch (e) {
          expect(e).toBeTruthy();
        }
      });
    }
  );
});
