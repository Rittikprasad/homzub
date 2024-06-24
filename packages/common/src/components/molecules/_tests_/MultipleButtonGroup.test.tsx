// @ts-noCheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MultipleButtonGroup } from '@homzhub/common/src/components/molecules/MultipleButtonGroup';

let props: any;
let wrapper: ShallowWrapper;

describe('MultipleButtonGroup', () => {
  const createTestProps = (testProps: any): object => ({
    data: [
      {
        title: '',
        value: '',
      },
    ],
    onItemSelect: jest.fn(),
    selectedItem: [''],
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<MultipleButtonGroup {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with optional props', () => {
    props = createTestProps({
      textType: 'text',
    });
    wrapper = shallow(<MultipleButtonGroup {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call function', () => {
    wrapper = shallow(<MultipleButtonGroup {...props} />);
    wrapper.find('[testID="touchableTitle"]').prop('onPress')();
    expect(props.onItemSelect).toBeCalled();
  });
});
