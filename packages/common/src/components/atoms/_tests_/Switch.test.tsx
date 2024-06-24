import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';

const mock = jest.fn();
describe('Switch', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot for selected', () => {
    const props = {
      selected: true,
      onToggle: mock,
    };
    wrapper = shallow(<RNSwitch {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for not selected', () => {
    const props = {
      selected: false,
      onToggle: mock,
    };
    wrapper = shallow(<RNSwitch {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
