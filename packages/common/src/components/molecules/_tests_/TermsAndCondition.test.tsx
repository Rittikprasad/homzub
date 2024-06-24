import React from 'react';
import renderer from 'react-test-renderer';
import { TermsCondition } from '@homzhub/common/src/components/molecules/TermsAndCondition';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe.skip('Test cases for TermsAndCondition', () => {
  const props = {
    onPressLink: jest.fn(),
  };
  it('should render snapshot', () => {
    const tree = renderer.create(<TermsCondition {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
