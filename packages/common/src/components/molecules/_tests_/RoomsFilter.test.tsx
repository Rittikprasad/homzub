// @ts-noCheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RoomsFilter } from '@homzhub/common/src/components/molecules/RoomsFilter';

let props: any;
let wrapper: ShallowWrapper;

describe('RoomsFilter', () => {
  const createTestProps = (testProps: any): object => ({
    bedCount: [1],
    bathroomCount: [1],
    onSelection: jest.fn(),
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<RoomsFilter {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call onSelection function ', () => {
    wrapper = shallow(<RoomsFilter {...props} />);
    wrapper.find('[testID="bedPicker"]').prop('onValueChange')(-1);
    wrapper.find('[testID="bedPicker"]').prop('onValueChange')(1);
    wrapper.find('[testID="bedPicker"]').prop('onValueChange')();
    expect(props.onSelection).toBeCalled();
  });

  it('should call onSelection function ', () => {
    wrapper = shallow(<RoomsFilter {...props} />);
    wrapper.find('[testID="bathPicker"]').prop('onValueChange')();
    expect(props.onSelection).toBeCalled();
  });
});
