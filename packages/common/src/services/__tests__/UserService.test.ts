import { UserService } from '@homzhub/common/src/services/UserService';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { OtpActionTypes } from '@homzhub/common/src/domain/repositories/interfaces';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('UserService', () => {
  it('Should call fetch Otp Repo call', async () => {
    // @ts-ignore
    const repoSpy = jest.spyOn(UserRepository, 'Otp').mockImplementation(() => Promise.resolve({ data: 1 }));
    await UserService.fetchOtp('9000000000', '+01');
    expect(repoSpy).toHaveBeenCalledWith({
      action: OtpActionTypes.SEND,
      payload: {
        phone_code: '+01',
        phone_number: '9000000000',
      },
    });
    repoSpy.mockRestore();
  });

  it('Should call verify Otp Repo call', async () => {
    // @ts-ignore
    const repoSpy = jest.spyOn(UserRepository, 'Otp').mockImplementation(() => Promise.resolve({ otp_verify: true }));
    await UserService.verifyOtp('123456', '9000000000', '+01');
    expect(repoSpy).toHaveBeenCalledWith({
      action: OtpActionTypes.VERIFY,
      payload: {
        otp: '123456',
        phone_code: '+01',
        phone_number: '9000000000',
      },
    });
    repoSpy.mockRestore();
  });

  it('Should call OtpVerify and throw error if otp_verify field is missing', async () => {
    // @ts-ignore
    const repoSpy = jest.spyOn(UserRepository, 'Otp').mockImplementation(() => Promise.resolve(1));
    try {
      await UserService.verifyOtp('123456', '9000000000', '+01');
    }catch (e: any) {      expect(e).toBeTruthy();
    }
    repoSpy.mockRestore();
  });
});
