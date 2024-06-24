import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';

describe('PropertyAddress', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot without icon', () => {
    const props = {
      primaryAddress: 'Primary Address',
      subAddress: 'Sub Address',
    };
    wrapper = shallow(<PropertyAddress {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with icon', () => {
    const props = {
      primaryAddress: 'Primary Address',
      subAddress: 'Sub Address',
      isIcon: true,
    };
    wrapper = shallow(<PropertyAddress {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
