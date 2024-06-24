import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';

describe('EmptyState', () => {
  it('should match snapshot', () => {
    const wrapper: ShallowWrapper = shallow(<EmptyState />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
