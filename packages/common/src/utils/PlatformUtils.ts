import { Platform } from 'react-native';

export type OSTypes = 'ios' | 'android' | 'windows' | 'macos' | 'web';

const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

const isWeb = (): boolean => {
  return Platform.OS === 'web';
};

const isMobile = (): boolean => {
  return isAndroid() || isIOS();
};

const getPlatform = (): OSTypes => Platform.OS;

export const PlatformUtils = {
  isAndroid,
  isIOS,
  isWeb,
  isMobile,
  getPlatform,
};
