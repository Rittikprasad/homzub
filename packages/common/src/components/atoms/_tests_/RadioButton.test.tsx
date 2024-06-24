import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RadioButton } from '@homzhub/common/src/components/atoms/RadioButton';

const mock = jest.fn();
describe('RadioButton', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot for selected', () => {
    const props = {
      selected: true,
      label: 'Some label',
      onToggle: mock,
    };
    wrapper = shallow(<RadioButton {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for not selected', () => {
    const props = {
      selected: false,
      label: 'Some label',
      onToggle: mock,
    };
    wrapper = shallow(<RadioButton {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call on toggle', () => {
    const props = {
      selected: false,
      label: 'Some label',
      onToggle: mock,
    };
    wrapper = shallow(<RadioButton {...props} />);
    // @ts-ignore
    wrapper.find('[testID="to"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
