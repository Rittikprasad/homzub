import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ShieldGroup } from '@homzhub/mobile/src/components/molecules/ShieldGroup';

let props: any;

describe('ShieldGroup', () => {
  const createTestProps = (testProps: any): object => ({
    ...testProps,
  });

  it('should match snapshot', () => {
    const wrapper = shallow(<ShieldGroup />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with props', () => {
    props = createTestProps({ propertyType: 'Villa' });
    const wrapper = shallow(<ShieldGroup {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
