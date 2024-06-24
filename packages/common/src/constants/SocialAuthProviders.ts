import { ISocialAuthProvider } from '@homzhub/common/src/domain/models/SocialAuthProvider';

export enum SocialAuthKeys {
  Google = 'GOOGLE',
  Facebook = 'FACEBOOK',
  LinkedIn = 'LINKEDIN',
  Apple = 'APPLE',
}

export interface ISocialUserData {
  provider: SocialAuthKeys;
  idToken: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export const SocialAuthProviders: ISocialAuthProvider[] = [
  {
    provider: SocialAuthKeys.Google,
    description: 'Google',
    visible: true,
  },
  {
    provider: SocialAuthKeys.Facebook,
    description: 'Facebook',
    visible: true,
  },
  {
    provider: SocialAuthKeys.LinkedIn,
    description: 'Linkedin',
    visible: false,
  },
];
