import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { icons } from '@homzhub/common/src/assets/icon';
import { ToggleButton } from '@homzhub/common/src/components/atoms/ToggleButton';

describe('Toggle Button', () => {
  const props = {
    title: 'Badge',
    icon: icons.list,
    onToggle: jest.fn(),
  };
  const wrapper: ShallowWrapper = shallow(<ToggleButton {...props} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
