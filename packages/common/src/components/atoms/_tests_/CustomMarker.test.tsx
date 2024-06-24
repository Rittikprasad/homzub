import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CustomMarker } from '@homzhub/common/src/components/atoms/CustomMarker';

describe('Custom Marker', () => {
  it('should match snapshot for selected true', () => {
    const props = {
      selected: true,
    };
    const wrapper: ShallowWrapper = shallow(<CustomMarker {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for selected false', () => {
    const props = {
      selected: false,
    };
    const wrapper: ShallowWrapper = shallow(<CustomMarker {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
