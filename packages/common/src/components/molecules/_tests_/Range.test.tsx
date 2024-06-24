// @ts-noCheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Range } from '@homzhub/common/src/components/molecules/Range';
import { AreaUnit } from '@homzhub/common/src/mocks/AreaUnit';

let props: any;
let wrapper: ShallowWrapper;

describe.skip('Range', () => {
  const createTestProps = (testProps: any): object => ({
    dropdownData: AreaUnit,
    range: { min: 0, max: 5 },
    maxChangedValue: 10,
    minChangedValue: 2,
    onChangeSlide: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<Range {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call function on unit select', () => {
    wrapper = shallow(<Range {...props} />);
    wrapper.find('[testID="areaUnit"]').prop('onDonePress')(1);
    expect(props.onDropdownValueChange).toBeUndefined();
    props = createTestProps({
      onDropdownValueChange: jest.fn(),
    });
    wrapper = shallow(<Range {...props} />);
    wrapper.find('[testID="areaUnit"]').prop('onDonePress')(1);
    expect(props.onDropdownValueChange).toBeCalled();
  });

  it('should match snapshot of priceRange', () => {
    props = createTestProps({
      isPriceRange: true,
      range: { min: 3, max: 15 },
    });
    wrapper = shallow(<Range {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call function on slider change', () => {
    wrapper = shallow(<Range {...props} />);
    wrapper.find('[testID="slider"]').prop('onSliderChange')(1);
    expect(props.onChangeSlide).toBeCalled();
    props = createTestProps({
      isPriceRange: false,
    });
    wrapper = shallow(<Range {...props} />);
    wrapper.find('[testID="slider"]').prop('onSliderChange')(1);
    expect(props.onChangeSlide).toBeCalled();
  });
});
