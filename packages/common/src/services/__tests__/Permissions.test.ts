// @ts-nocheck
import { request, check } from 'react-native-permissions';
import { PermissionsService } from '@homzhub/common/src/services/Permissions/PermissionService';
import { PERMISSION_TYPE } from '@homzhub/common/src/constants/PermissionTypes';

jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    IOS: {
      LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE',
    },
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
  },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    BLOCKED: 'blocked',
    GRANTED: 'granted',
  },
  check: jest.fn(),
  request: jest.fn(),
}));

jest.mock('@homzhub/common/src/utils/PlatformUtils', () => {
  return {
    PlatformUtils: {
      getPlatform: jest.fn().mockImplementation(() => 'ios'),
    },
  };
});

describe('Permissions Tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should check permissions and return true for granted permission', async () => {
    check.mockImplementation(() => 'granted');
    const permission = await PermissionsService.checkPermission(PERMISSION_TYPE.location);
    expect(permission).toBeTruthy();
  });

  it('should check permissions and return false for denied/blocked permissions', async () => {
    check.mockImplementation(() => {
      throw new Error('Test Error');
    });
    const permission = await PermissionsService.checkPermission(PERMISSION_TYPE.location);
    expect(permission).toBeFalsy();
  });

  it('should call request for denied permissions and return true upon accepting', async () => {
    check.mockImplementation(() => 'denied');
    request.mockImplementation(() => 'granted');
    const permission = await PermissionsService.checkPermission(PERMISSION_TYPE.location);
    expect(permission).toBeTruthy();
  });

  it('should call request for denied permissions and return false upon rejecting', async () => {
    check.mockImplementation(() => 'denied');
    request.mockImplementation(() => 'denied');
    const permission = await PermissionsService.checkPermission(PERMISSION_TYPE.location);
    expect(permission).toBeFalsy();
  });

  it('should call request for denied permissions and return false upon some error', async () => {
    check.mockImplementation(() => 'denied');
    request.mockImplementation(() => {
      throw new Error('Test Error');
    });
    const permission = await PermissionsService.checkPermission(PERMISSION_TYPE.location);
    expect(permission).toBeFalsy();
  });
});
