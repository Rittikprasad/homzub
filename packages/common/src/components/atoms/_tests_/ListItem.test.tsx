import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ListItem } from '@homzhub/common/src/components/atoms/ListItem';

describe('ListItem', () => {
  const item = {
    label: 'Test',
    value: 'test',
  };
  const wrapper: ShallowWrapper = shallow(<ListItem listItem={item} isCheck />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
