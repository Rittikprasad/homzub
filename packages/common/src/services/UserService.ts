import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { IOtpVerify, OtpActionTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';

class UserService {
  public fetchOtp = async (phone_number: string, country_code: string): Promise<void> => {
    const requestBody: IOtpVerify = {
      action: OtpActionTypes.SEND,
      payload: {
        phone_code: country_code,
        phone_number,
      },
    };
    try {
      await UserRepository.Otp(requestBody);
    }catch (e: any) {      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  public fetchEmailOtp = async (email: string): Promise<void> => {
    const requestBody: IOtpVerify = {
      action: OtpActionTypes.SEND_EMAIL_OTP,
      payload: {
        email,
      },
    };
    try {
      await UserRepository.Otp(requestBody);
    }catch (e: any) {      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  public verifyOtp = async (otp: string, phone_number: string, country_code: string): Promise<void> => {
    const requestBody: IOtpVerify = {
      action: OtpActionTypes.VERIFY,
      payload: {
        otp,
        phone_code: country_code,
        phone_number,
      },
    };

    const response = await UserRepository.Otp(requestBody);
    if (!response.otp_verify) {
      throw new Error();
    }
  };
}

const userService = new UserService();
export { userService as UserService };
