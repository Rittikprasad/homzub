import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';

describe('PropertyAddressCountry', () => {
  const props = {
    primaryAddress: '2 BHK',
    subAddress: 'Delhi',
    countryFlag: '',
  };
  it('should match snapshot', () => {
    const wrapper = shallow(<PropertyAddressCountry {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
