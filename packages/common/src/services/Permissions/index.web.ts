import { PERMISSION_TYPE } from '@homzhub/common/src/constants/PermissionTypes';

enum RESULTS {
  GRANTED = 'granted',
  DENIED = 'denied',
  PROMPT = 'prompt',
}

const isLocationAvailable = (): boolean => {
  return 'geolocation' in navigator;
};

class Permissions {
  public checkPermission = async (type: PERMISSION_TYPE): Promise<boolean> => {
    if (type === PERMISSION_TYPE.location) {
      try {
        const permissionStatus = await this.hasPermission();
        if (permissionStatus === RESULTS.GRANTED) {
          return true;
        }
        if (permissionStatus === RESULTS.PROMPT) {
          return false;
        }
        if (permissionStatus === RESULTS.DENIED) {
          return false;
        }
        return false;
      }catch (e: any) {        return false;
      }
    } else {
      return false;
    }
  };

  private hasPermission = async (): Promise<RESULTS> => {
    const status = isLocationAvailable();
    let permissionState;
    const response = await navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      permissionState = permissionStatus.state;
      permissionStatus.onchange = (): void => {
        // handle permission change Here
      };
      return permissionState;
    });
    if (response === 'granted' && status) {
      return RESULTS.GRANTED;
    }
    if (response === 'prompt' && status) {
      return RESULTS.PROMPT;
    }
    return RESULTS.DENIED;
  };
}

const permissionsService = new Permissions();
export { permissionsService as PermissionsService };
