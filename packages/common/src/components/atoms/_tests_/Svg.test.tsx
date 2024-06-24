import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';

describe('Svg', () => {
  it('should match snapshot', () => {
    const props = {
      uri: 'https://socion-s3-bucket.s3.amazonaws.com/Search_Onboarding.svg',
      width: '100%',
      height: '100%',
    };
    const wrapper = shallow(<SVGUri {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
