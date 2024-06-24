import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';

const mock = jest.fn();
const data = [
  {
    title: 'Title 1',
    value: 0,
  },
  {
    title: 'Title 2',
    value: 1,
  },
];
describe('SelectionPicker', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      data,
      selectedItem: [0],
      onValueChange: mock,
    };
    wrapper = shallow(<SelectionPicker {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for optional width', () => {
    const props = {
      data,
      selectedItem: [0],
      onValueChange: mock,
      optionWidth: 20,
    };
    wrapper = shallow(<SelectionPicker {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
