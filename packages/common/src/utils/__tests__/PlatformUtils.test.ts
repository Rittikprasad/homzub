import { Platform } from 'react-native';
import { PlatformUtils, OSTypes } from '@homzhub/common/src/utils/PlatformUtils';

describe('Platform Util', () => {
  it('should return true if Platform is android', () => {
    Platform.OS = 'android';
    expect(PlatformUtils.isAndroid()).toEqual(true);
  });

  it('should return true if Platform is ios', () => {
    Platform.OS = 'ios';
    expect(PlatformUtils.isIOS()).toEqual(true);
  });

  it('should return true if Platform is web', () => {
    Platform.OS = 'web';
    expect(PlatformUtils.isWeb()).toEqual(true);
  });

  it('should return true if Platform is mobile', () => {
    Platform.OS = 'ios';
    expect(PlatformUtils.isMobile()).toEqual(true);
  });

  it('should return false if Platform is not android', () => {
    Platform.OS = 'ios';
    expect(PlatformUtils.isAndroid()).toEqual(false);
  });

  it('should return false if Platform is not ios', () => {
    Platform.OS = 'android';
    expect(PlatformUtils.isIOS()).toEqual(false);
  });

  it('should return false if Platform is not web', () => {
    Platform.OS = 'ios';
    expect(PlatformUtils.isWeb()).toEqual(false);
  });

  it('should return false if Platform is not mobile', () => {
    Platform.OS = 'web';
    expect(PlatformUtils.isMobile()).toEqual(false);
  });

  ['ios', 'android', 'windows', 'macos', 'web'].forEach((platform: string) => {
    it(`should return the current Platform for ${platform}`, () => {
      Platform.OS = platform as OSTypes;
      expect(PlatformUtils.getPlatform()).toEqual(platform);
    });
  });
});
