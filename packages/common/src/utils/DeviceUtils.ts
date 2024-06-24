import DeviceInfo from 'react-native-device-info';

class DeviceUtils {
  get appVersion(): string {
    return DeviceInfo.getVersion();
  }

  public getDeviceId = (): string => {
    return DeviceInfo.getUniqueId();
  };

  public getAppVersion = (): string => {
    const appBuildNumber = DeviceInfo.getBuildNumber();
    return `App Version v${DeviceInfo.getVersion()} (${appBuildNumber})`;
  };

  public getDeviceName = async (): Promise<string> => {
    return await DeviceInfo.getDeviceName();
  };

  public getDeviceOs = (): Promise<string> => {
    const Os = DeviceInfo.getBaseOs().then((res) => {
      return res;
    });
    return Os;
  };
}

const deviceUtils = new DeviceUtils();
export { deviceUtils as DeviceUtils };
