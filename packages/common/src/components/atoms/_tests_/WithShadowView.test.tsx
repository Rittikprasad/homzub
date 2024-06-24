import React from 'react';
import { Text } from 'react-native';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';

describe('WithShadowView', () => {
  const wrapper = shallow(
    <WithShadowView>
      <Text>Shadow View</Text>
    </WithShadowView>
  );

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
