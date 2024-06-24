// @ts-nocheck
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { LoginForm } from '@homzhub/mobile/src/components';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe.skip('Test cases for LoginForm', () => {
  const testProps = (Props: any): any => ({
    ...Props,
    onLoginSuccess: jest.fn(),
  });

  let props: any;

  it('should render snapshot', () => {
    props = testProps({});
    const wrapper = shallow(<LoginForm {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot for dropdown selection', () => {
    props = testProps({});
    const wrapper = shallow(<LoginForm {...props} t={(key: string): string => key} />);
    const instance = wrapper.dive().instance();
    expect(instance).toMatchSnapshot();
  });
});
