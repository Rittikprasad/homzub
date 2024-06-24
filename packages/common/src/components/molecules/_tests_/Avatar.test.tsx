import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';

describe.skip('Avatar', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      fullName: 'John Doe',
      designation: 'CEO',
    };
    wrapper = shallow(<Avatar {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with phone number', () => {
    const props = {
      fullName: 'John Doe',
      designation: 'CEO',
      phoneNumber: '9876543210',
    };
    wrapper = shallow(<Avatar {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
