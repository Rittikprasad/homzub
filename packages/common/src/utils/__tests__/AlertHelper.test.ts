import * as message from 'react-native-flash-message';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';

jest.mock('react-native-flash-message');

describe('Alert Helper', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    spy.mockRestore();
  });

  it('Should call mock hideMessage function', () => {
    spy = jest.spyOn(message, 'hideMessage');
    AlertHelper.dismiss();
    expect(spy).toHaveBeenCalled();
  });

  it('Should call mock show message function for success type', () => {
    spy = jest.spyOn(message, 'showMessage');
    AlertHelper.success({ message: 'Test Message' });
    expect(spy).toHaveBeenCalledWith({
      type: 'success',
      message: 'Test Message',
      backgroundColor: theme.colors.success,
    });
  });

  it('Should call mock hideMessage function for error', () => {
    spy = jest.spyOn(message, 'showMessage');
    AlertHelper.error({ message: 'Test Message' });
    expect(spy).toHaveBeenCalledWith({
      type: 'danger',
      duration: 5000,
      message: 'Test Message',
      backgroundColor: theme.colors.error,
    });
  });
});
