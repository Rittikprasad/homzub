import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';

let props: any;
let wrapper: ShallowWrapper;

describe('PropertyAmenities', () => {
  const createTestProps = (testProps: any): object => ({
    data: [
      {
        icon: '',
        label: '',
      },
    ],
    direction: 'row',
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<PropertyAmenities {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
