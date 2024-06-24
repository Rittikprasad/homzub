/* eslint-disable */
// @ts-nocheck
require('../../../setupTests');

// To prevent errors from cross platform imports
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('mixpanel-react-native', () => {});
jest.mock('react-native-device-info', () => {});
jest.mock('react-native-maps', () => 'MapView');
jest.mock('@react-navigation/material-top-tabs', () => {
  return {
    createMaterialTopTabNavigator: jest.fn(),
  };
});
jest.mock('react-native-config', () => {
  return {
    REACT_NATIVE_APP_API_BASE_URL: 'https://dev.homzhub.com/api/',
    REACT_NATIVE_APP_PLACES_API_BASE_URL: 'https://dev.homzhub.com/api/',
    REACT_NATIVE_APP_PLACES_API_KEY: 'test',
    REACT_NATIVE_APP_OTP_LENGTH: 6,
    REACT_NATIVE_APP_STORAGE_SECRET: 'secret',
    REACT_NATIVE_APP_YOUTUBE_API_KEY: 'youtube',
  };
});

// jest.mock('react-native-config', () => {
//   return {
//     REACT_NATIVE_APP_API_BASE_URL: 'https://api.homzhub.com/',
//     REACT_NATIVE_APP_PLACES_API_BASE_URL: 'https://api.homzhub.com/',
//     REACT_NATIVE_APP_PLACES_API_KEY: 'test',
//     REACT_NATIVE_APP_OTP_LENGTH: 6,
//     REACT_NATIVE_APP_STORAGE_SECRET: 'secret',
//     REACT_NATIVE_APP_YOUTUBE_API_KEY: 'youtube',
//   };
// });

// jest.mock('react-native-config', () => {
//   return {
//     REACT_NATIVE_APP_API_BASE_URL: 'https://testbaseurl.com',
//     REACT_NATIVE_APP_PLACES_API_BASE_URL: 'https://testbaseurl.com',
//     REACT_NATIVE_APP_PLACES_API_KEY: 'test',
//     REACT_NATIVE_APP_OTP_LENGTH: 6,
//     REACT_NATIVE_APP_STORAGE_SECRET: 'secret',
//     REACT_NATIVE_APP_YOUTUBE_API_KEY: 'youtube',
//   };
// });
