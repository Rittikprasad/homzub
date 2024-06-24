import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { ISocialLoginPayload, IVerifyAuthToken, LoginTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { SocialAuthProvider } from '@homzhub/common/src/domain/models/SocialAuthProvider';
import { User } from '@homzhub/common/src/domain/models/User';
import { ISocialUserData } from '@homzhub/common/src/constants/SocialAuthProviders';

const onSocialAuthSuccess = async (
  userData: ISocialUserData,
  navigateNewUser: () => void,
  success: (response: IUserTokens) => void
): Promise<void> => {
  const { idToken, provider, user } = userData;

  const authPayload: IVerifyAuthToken = {
    provider,
    id_token: idToken,
  };

  const trackData = {
    source: provider,
    email: user.email,
  };

  try {
    const { is_new_user } = await UserRepository.verifyAuthToken(authPayload);
    if (is_new_user) {
      navigateNewUser();
      return;
    }
    const socialLoginPayload: ISocialLoginPayload = {
      action: LoginTypes.SOCIAL_MEDIA,
      payload: {
        provider,
        id_token: idToken,
      },
    };
    const { refreshToken, accessToken } = await UserRepository.login(socialLoginPayload);

    const tokens = { refresh_token: refreshToken, access_token: accessToken };
    success(tokens);
    await StorageService.set<IUserTokens>(StorageKeys.USER, tokens);

    AnalyticsService.track(EventType.LoginSuccess, trackData);
    AnalyticsService.setUser(ObjectMapper.deserialize(User, user));
  } catch (e) {
    AnalyticsService.track(EventType.LoginFailure, { ...trackData, error: e.message });
    AlertHelper.error({ message: e.message, statusCode: e.details.statusCode }); // TODOS: Lakshit - Require clarity on usage
  }
};

const fetchSocialMedia = (success: (response: SocialAuthProvider[]) => void): void => {
  try {
    const response = CommonRepository.getSocialMedia();
    success(response);
  } catch (e) {
    AlertHelper.error({ message: e.message, statusCode: e.details.statusCode }); // TODOS: Lakshit - Require clarity on usage.
  }
};

export const SocialAuthUtils = {
  onSocialAuthSuccess,
  fetchSocialMedia,
};
