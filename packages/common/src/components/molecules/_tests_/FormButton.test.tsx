import React from 'react';
import renderer from 'react-test-renderer';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe.skip('Test cases for FormButton', () => {
  it('should render snapshot for invalid', () => {
    const props = {
      type: 'primary',
      formProps: {
        isValid: false,
        dirty: false,
      },
    };

    // @ts-ignore
    const tree = renderer.create(<FormButton {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot for valid', () => {
    const props = {
      type: 'primary',
      formProps: {
        isValid: true,
        dirty: false,
      },
    };

    // @ts-ignore
    const tree = renderer.create(<FormButton {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
