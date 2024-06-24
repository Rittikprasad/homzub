import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AmenitiesIcon } from '@homzhub/common/src/components/atoms/AmenitiesIcon';
import { icons } from '@homzhub/common/src/assets/icon';

describe('AmenitiesIcon', () => {
  it('should match snapshot', () => {
    const props = {
      direction: 'row',
      icon: icons.balcony,
      label: 'Some Label',
    };
    // @ts-ignore
    const wrapper: ShallowWrapper = shallow(<AmenitiesIcon {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot', () => {
    const props = {
      direction: 'column',
      icon: icons.balcony,
      label: 'Some Label',
    };
    // @ts-ignore
    const wrapper: ShallowWrapper = shallow(<AmenitiesIcon {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
