import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { LeaseProgress } from '@homzhub/mobile/src/components/molecules/LeaseProgress';

describe('Lease Progress', () => {
  it('should match snapshot', () => {
    const props = {
      progress: 70,
      isPropertyCompleted: true,
    };
    const wrapper = shallow(<LeaseProgress {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('should match snapshot', () => {
    const props = {
      progress: 70,
      isPropertyCompleted: false,
    };
    const wrapper = shallow(<LeaseProgress {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
