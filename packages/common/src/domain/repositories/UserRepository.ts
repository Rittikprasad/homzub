import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IEmailLoginPayload,
  IForgotPasswordPayload,
  IOtpLoginPayload,
  IOtpVerify,
  IOtpVerifyResponse,
  ISignUpPayload,
  ISocialLogin,
  ISocialLoginPayload,
  ISocialSignUpPayload,
  IRefreshTokenPayload,
  IUserExistsData,
  IUpdateWorkInfo,
  IUpdateEmergencyContact,
  IUpdatePassword,
  IUpdateProfile,
  IUpdateProfileResponse,
  IUpdateUserPreferences,
  IProfileImage,
  IEmailVerification,
  IReferralResponse,
  IVerifyAuthToken,
  IVerifyAuthTokenResponse,
  IUpdatePlanPayload,
  IBankAccountPayload,
  IPayloadWithAction,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { BankInfo } from '@homzhub/common/src/domain/models/BankInfo';
import { CoinsManagement } from '@homzhub/common/src/domain/models/CoinsManagement';
import { CoinTransaction } from '@homzhub/common/src/domain/models/CoinTransaction';
import { PanNumber } from '@homzhub/common/src/domain/models/PanNumber';
import { SettingsData } from '@homzhub/common/src/domain/models/SettingsData';
import { SettingsDropdownValues } from '@homzhub/common/src/domain/models/SettingsDropdownValues';
import { User } from '@homzhub/common/src/domain/models/User';
import { UserProfile, IUserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { UserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';
import { UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';
import { UserInteraction } from '@homzhub/common/src/domain/models/UserInteraction';
import { SettingsScreenData } from '@homzhub/common/src/constants/Settings';

const ENDPOINTS = {
  signUp: 'v1/users/',
  socialSignUp: 'v1/users/social-signup/',
  login: 'v1/users/login/',
  socialLogin: 'v1/users/social-login/',
  otp: 'v1/otp/verifications/',
  forgotPasswordEmail: 'v1/users/reset-password/',
  logout: 'v1/users/logout/',
  deactivateUserAccount: 'v1/users/deactivate/',
  getUserSubscription: 'v1/user/service-plan/',
  getUserProfile: 'v1/users/profile/',
  updateEmergencyContact: 'v1/users/emergency-contact/',
  updateWorkInfo: 'v1/users/work-info/',
  changePassword: 'v1/users/reset-password/',
  updateBasicProfile: 'v1/users/basic-profile/',
  getUserPreferences: 'v1/users/settings/',
  settingDropdownValues: 'v1/user-settings/values/',
  updateUserPreferences: 'v1/users/settings/',
  updateProfileImage: 'v1/users/profile-pictures/',
  sendOrVerifyEmail: 'v1/users/verifications/',
  wishlist: 'v1/wishlists/',
  KYCDocuments: 'v1/kyc-documents/',
  verifyAuthToken: 'v1/users/verify-token/',
  userServicePlan: 'v1/users/user-service-plans/',
  coinManagement: 'v1/user-coins/management-tab/',
  coinTransaction: 'v1/user-coins/transactions/',
  emailExists: (emailId: string): string => `v1/users/emails/${emailId}/`,
  phoneExists: (phone: string): string => `v1/users/phone-numbers/${phone}/`,
  interactions: (userId: number): string => `v1/users/${userId}/interactions/`,
  verifyReferralCode: (code: string): string => `v1/users/referrals/${code}/`,
  verifyWorkEmail: (email: string): string => `v1/users/work-info/emails/${email}/`,
  bankInfo: (id: number): string => `v1/users/${id}/user-bank-info/`,
  bankInfoById: (userId: number, bankAccId: number): string => `v1/users/${userId}/user-bank-info/${bankAccId}/`,
  panNumbers: (userId: number): string => `v1/users/${userId}/pan-numbers/`,
};

class UserRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public signUp = async (payload: ISignUpPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.signUp, payload);
  };

  public socialSignUp = async (payload: ISocialSignUpPayload): Promise<User> => {
    const response = await this.apiClient.post(ENDPOINTS.socialSignUp, payload);
    return ObjectMapper.deserialize(User, {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
  };

  public login = async (payload: IEmailLoginPayload | IOtpLoginPayload | ISocialLoginPayload): Promise<User> => {
    const response = await this.apiClient.post(ENDPOINTS.login, payload);
    return ObjectMapper.deserialize(User, {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
  };

  public socialLogin = async (payload: ISocialLoginPayload): Promise<User | { is_new_user: boolean }> => {
    const response: ISocialLogin = await this.apiClient.post(ENDPOINTS.socialLogin, payload);
    if (!response.user) {
      return {
        is_new_user: response.is_new_user ?? true,
      } as { is_new_user: boolean };
    }

    return ObjectMapper.deserialize(User, {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
  };

  public Otp = async (requestPayload: IOtpVerify): Promise<IOtpVerifyResponse> => {
    return await this.apiClient.post(ENDPOINTS.otp, requestPayload);
  };

  public resetPassword = async (payload: IForgotPasswordPayload): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.forgotPasswordEmail, payload);
  };

  public emailExists = async (emailId: string): Promise<IUserExistsData> => {
    return await this.apiClient.get(ENDPOINTS.emailExists(emailId));
  };

  public phoneExists = async (phone: string): Promise<IUserExistsData> => {
    return await this.apiClient.get(ENDPOINTS.phoneExists(phone));
  };

  public logout = async (payload: IRefreshTokenPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.logout, payload);
  };

  public deactivateUserAccount = async (payload: IRefreshTokenPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.deactivateUserAccount, payload);
  };

  public getUserSubscription = async (): Promise<UserSubscription> => {
    const response = await this.apiClient.get(ENDPOINTS.getUserSubscription);
    return ObjectMapper.deserialize(UserSubscription, response);
  };

  public getUserProfile = async (): Promise<UserProfile> => {
    const response = await this.apiClient.get(ENDPOINTS.getUserProfile);
    return ObjectMapper.deserialize(UserProfile, response);
  };

  public updateEmergencyContact = async (payload: IUpdateEmergencyContact): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateEmergencyContact, payload);
  };

  public updateWorkInfo = async (payload: IUpdateWorkInfo): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.updateWorkInfo, payload);
  };

  public updatePassword = async (payload: IUpdatePassword): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.changePassword, payload);
  };

  public updateUserProfileByActions = async (payload: IUpdateProfile): Promise<IUpdateProfileResponse> => {
    return await this.apiClient.put(ENDPOINTS.updateBasicProfile, payload);
  };

  public getSettingDropDownValues = async (): Promise<SettingsDropdownValues> => {
    const response = await this.apiClient.get(ENDPOINTS.settingDropdownValues);
    return ObjectMapper.deserialize(SettingsDropdownValues, response);
  };

  public getUserPreferences = async (): Promise<UserPreferences> => {
    const response = await this.apiClient.get(ENDPOINTS.getUserPreferences);
    return ObjectMapper.deserialize(UserPreferences, response);
  };

  public updateUserPreferences = async (payload: IUpdateUserPreferences): Promise<UserPreferences> => {
    const response = await this.apiClient.patch(ENDPOINTS.updateUserPreferences, payload);
    return ObjectMapper.deserialize(UserPreferences, response);
  };

  public getSettingScreenData = (): SettingsData[] => {
    return ObjectMapper.deserializeArray(SettingsData, SettingsScreenData);
  };

  public updateProfileImage = async (payload: IProfileImage): Promise<IUserProfile> => {
    return await this.apiClient.put(ENDPOINTS.updateProfileImage, payload);
  };

  public sendOrVerifyEmail = async (payload: IEmailVerification): Promise<void> => {
    await this.apiClient.patch(ENDPOINTS.sendOrVerifyEmail, payload);
  };

  public getWishlistProperties = async (): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.wishlist);
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getUserInteractions = async (id: number): Promise<UserInteraction> => {
    const response = await this.apiClient.get(ENDPOINTS.interactions(id));
    return ObjectMapper.deserialize(UserInteraction, response);
  };

  public getKYCDocuments = async (): Promise<AssetDocument[]> => {
    const response = await this.apiClient.get(ENDPOINTS.KYCDocuments);
    return ObjectMapper.deserializeArray(AssetDocument, response);
  };

  public verifyReferalCode = async (code: string): Promise<IReferralResponse> => {
    return await this.apiClient.get(ENDPOINTS.verifyReferralCode(code));
  };

  public verifyAuthToken = async (payload: IVerifyAuthToken): Promise<IVerifyAuthTokenResponse> => {
    return await this.apiClient.post(ENDPOINTS.verifyAuthToken, payload);
  };

  public workEmailExists = async (emailId: string): Promise<IUserExistsData> => {
    return await this.apiClient.get(ENDPOINTS.verifyWorkEmail(emailId));
  };

  public updateUserServicePlan = async (payload: IUpdatePlanPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.userServicePlan, payload);
  };

  public getCoinManagement = async (): Promise<CoinsManagement> => {
    const response = await this.apiClient.get(ENDPOINTS.coinManagement);
    return ObjectMapper.deserialize(CoinsManagement, response);
  };

  public getCoinTransaction = async (): Promise<CoinTransaction[]> => {
    const response = await this.apiClient.get(ENDPOINTS.coinTransaction);
    return ObjectMapper.deserializeArray(CoinTransaction, response);
  };

  public getUserBankInfo = async (id: number): Promise<BankInfo[]> => {
    const response = await this.apiClient.get(ENDPOINTS.bankInfo(id));
    return ObjectMapper.deserializeArray(BankInfo, response);
  };

  public addBankDetails = async (userId: number, payload: IBankAccountPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.bankInfo(userId), payload);
  };

  public getPanDetails = async (userId: number): Promise<PanNumber> => {
    const response = await this.apiClient.get(ENDPOINTS.panNumbers(userId));
    return ObjectMapper.deserialize(PanNumber, response);
  };

  public editBankDetails = async (userId: number, bankAccId: number, payload: IBankAccountPayload): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.bankInfoById(userId, bankAccId), payload);
  };

  public deleteBankDetails = async (userId: number, bankAccId: number): Promise<void> => {
    return await this.apiClient.delete(ENDPOINTS.bankInfoById(userId, bankAccId));
  };

  public handleBankDetailsActivation = async (
    userId: number,
    bankAccId: number,
    payload: IPayloadWithAction
  ): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.bankInfoById(userId, bankAccId), payload);
  };
}

const userRepository = new UserRepository();
export { userRepository as UserRepository };
