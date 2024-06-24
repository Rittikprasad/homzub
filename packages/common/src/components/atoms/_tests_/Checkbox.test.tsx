import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';

const mock = jest.fn();

describe('Checkbox', () => {
  it('should match snapshot for selected true', () => {
    const props = {
      selected: true,
      label: 'Some Label',
      onToggle: mock,
    };
    const wrapper: ShallowWrapper = shallow(<RNCheckbox {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for selected false', () => {
    const props = {
      selected: false,
      label: 'Some Label',
      onToggle: mock,
    };
    const wrapper: ShallowWrapper = shallow(<RNCheckbox {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
