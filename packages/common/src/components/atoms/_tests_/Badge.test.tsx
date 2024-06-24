import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { theme } from '@homzhub/common/src/styles/theme';

describe('Badge', () => {
  const props = {
    title: 'Badge',
    badgeColor: theme.colors.primaryColor,
  };
  const wrapper: ShallowWrapper = shallow(<Badge {...props} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
