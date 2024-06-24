import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CurrentLocation } from '@homzhub/mobile/src/components/molecules/CurrentLocation';

let props: any;

describe('CurrentLocation', () => {
  const createTestProps = (testProps: any): object => ({
    onGetCurrentPositionSuccess: jest.fn(),
    ...testProps,
  });
  props = createTestProps({});
  it('should match snapshot', () => {
    const wrapper = shallow(<CurrentLocation {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with props', () => {
    const wrapper = shallow(<CurrentLocation {...props} />);
    wrapper.find('[testID="touchableNearMe"]').simulate('press');
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
