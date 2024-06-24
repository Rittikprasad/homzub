import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Slider } from '@homzhub/common/src/components/atoms/Slider';

const mock = jest.fn();
describe('Slider', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      onSliderChange: mock,
    };
    wrapper = shallow(<Slider {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for multiple slider', () => {
    const props = {
      onSliderChange: mock,
      isMultipleSlider: true,
    };
    wrapper = shallow(<Slider {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for max value to be 0', () => {
    const props = {
      onSliderChange: mock,
      isMultipleSlider: true,
      maxSliderValue: 0,
    };
    wrapper = shallow(<Slider {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
