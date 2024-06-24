import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TimeSlotGroup } from '@homzhub/common/src/components/molecules/TimeSlotGroup';
import { TimeSlot } from '@homzhub/common/src/constants/ContactFormData';

let props: any;

describe('Time Slot Group', () => {
  const createTestProps = (testProps: any): object => ({
    data: TimeSlot,
    onItemSelect: jest.fn(),
    selectedItem: [1],
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    const wrapper = shallow(<TimeSlotGroup {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it.skip('should call function', () => {
    const wrapper = shallow(<TimeSlotGroup {...props} />);
    wrapper.find('[testID="selectSlot"]').at(0).simulate('press');
    expect(props.onItemSelect).toBeCalled();
  });
});
