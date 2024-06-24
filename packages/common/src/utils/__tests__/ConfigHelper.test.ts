import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';

describe('Config Helper', () => {
  beforeEach(() => {
    Object.assign(process.env, {
      REACT_APP_API_BASE_URL: 'https://testbaseurl.com',
      REACT_APP_PLACES_API_BASE_URL: 'https://testbaseurl.com',
      REACT_APP_PLACES_API_KEY: 'test',
      REACT_APP_RAZOR_API_KEY: 'razorpay',
      REACT_APP_OTP_LENGTH: 6,
      REACT_APP_STORAGE_SECRET: 'secret',
      REACT_APP_YOUTUBE_API_KEY: 'youtube',
    });
  });
  it('should return API base url', () => {
    const baseURL = ConfigHelper.getBaseUrl();
    expect(baseURL).toStrictEqual('https://testbaseurl.com');
  });

  it('should return places API base url', () => {
    const baseURL = ConfigHelper.getPlacesBaseUrl();
    expect(baseURL).toStrictEqual('https://testbaseurl.com');
  });

  it('should return otp length', () => {
    const otpLength = ConfigHelper.getOtpLength();
    expect(otpLength).toStrictEqual(6);
  });

  it('should return places API key', () => {
    const placesAPIKey = ConfigHelper.getPlacesApiKey();
    expect(placesAPIKey).toStrictEqual('test');
  });

  it('should return storage secret key', () => {
    const storageSecretKey = ConfigHelper.getStorageSecret();
    expect(storageSecretKey).toStrictEqual('secret');
  });

  it('should return razorpay api key', () => {
    const razorpayApiKey = ConfigHelper.getRazorApiKey();
    expect(razorpayApiKey).toStrictEqual('razorpay');
  });

  it('should return youtube api key', () => {
    const youtubeApiKey = ConfigHelper.getYoutubeApiKey();
    expect(youtubeApiKey).toStrictEqual('youtube');
  });
});
