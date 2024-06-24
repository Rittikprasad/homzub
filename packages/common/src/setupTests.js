/* eslint-disable */
// @ts-nocheck
const { PERMISSIONS, RESULTS } = require('react-native-permissions/lib/commonjs/constants');
require('../../../setupTests');

jest.mock('@react-native-firebase/app', () => {});
jest.mock('@react-native-community/async-storage', () => {});
jest.mock('react-native-crypto-js', () => {});
jest.mock('react-native-reanimated', () => {});
jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@react-native-firebase/dynamic-links', () => {});
jest.mock('@ptomasroos/react-native-multi-slider', () => {});
jest.mock('react-native-orientation-locker', () => {});
jest.mock('react-native-geolocation-service', () => {});
jest.mock('react-native-progress', () => {});
jest.mock('react-native-razorpay', () => {});
jest.mock('rn-fetch-blob', () => {});
jest.mock('react-native-tab-view', () => {});
jest.mock('mixpanel-react-native', () => {});
jest.mock('react-native-device-info', () => {});
jest.mock('reactjs-popup', () => {});
jest.mock('@invertase/react-native-apple-authentication', () => {});
jest.mock('react-native-permissions', () => {
  return {
    request: jest.fn(),
    check: jest.fn(),
    RESULTS,
    PERMISSIONS,
  };
});
jest.mock('react-native-config', () => {
  return {
    REACT_NATIVE_APP_API_BASE_URL: 'https://testbaseurl.com',
    REACT_NATIVE_APP_PLACES_API_BASE_URL: 'https://testbaseurl.com',
    REACT_NATIVE_APP_PLACES_API_KEY: 'test',
    REACT_NATIVE_APP_RAZOR_API_KEY: 'razorpay',
    REACT_NATIVE_APP_OTP_LENGTH: 6,
    REACT_NATIVE_APP_STORAGE_SECRET: 'secret',
    REACT_NATIVE_APP_YOUTUBE_API_KEY: 'youtube',
  };
});
