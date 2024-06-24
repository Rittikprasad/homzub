import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

describe('Divider', () => {
  const wrapper: ShallowWrapper = shallow(<Divider />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
