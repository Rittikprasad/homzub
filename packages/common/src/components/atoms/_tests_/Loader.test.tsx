import React from 'react';
import { Platform } from 'react-native';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';

describe('Loader', () => {
  it('should match snapshot for android', () => {
    Platform.OS = 'android';
    const wrapper: ShallowWrapper = shallow(<Loader visible />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for ios', () => {
    Platform.OS = 'ios';
    const wrapper: ShallowWrapper = shallow(<Loader visible />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for visible false', () => {
    Platform.OS = 'ios';
    const wrapper: ShallowWrapper = shallow(<Loader visible={false} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
