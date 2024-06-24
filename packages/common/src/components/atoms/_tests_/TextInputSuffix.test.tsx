import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TextInputSuffix } from '../TextInputSuffix';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('TextInputSuffix', () => {
  const props = {
    text: 'Suffix',
  };
  const wrapper: ShallowWrapper = shallow(<TextInputSuffix {...props} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
