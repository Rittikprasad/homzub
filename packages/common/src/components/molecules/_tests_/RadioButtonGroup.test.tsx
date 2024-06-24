import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';

const mock = jest.fn();
const data = [
  {
    id: 1,
    label: 'Radio Button 1',
    value: '1',
  },
  {
    id: 2,
    label: 'Radio Button 2',
    value: '2',
  },
];
describe('RadioButtonGroup', () => {
  let wrapper: any;

  it('should match snapshot', () => {
    const props = {
      data,
      onToggle: mock,
      selectedValue: 1,
    };
    wrapper = shallow(<RadioButtonGroup {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call render button', () => {
    const props = {
      data,
      onToggle: mock,
      selectedValue: 1,
    };
    wrapper = shallow(<RadioButtonGroup {...props} />);
    const RenderItem = wrapper.find('[testID="ftlist"]').prop('renderItem');
    const renderItemShallowWrapper = shallow(<RenderItem item={data[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });
});
