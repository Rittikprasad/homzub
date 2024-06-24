import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Text } from 'react-native';
import { StateAwareComponent } from '@homzhub/mobile/src/components/HOC/StateAwareComponent';

const createTestProps = (testProps: any): object => ({
  loading: false,
  renderComponent: <Text>StateAwareComponent</Text>,
  ...testProps,
});
let props: any;

describe('StateAwareComponent', () => {
  it('should render snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<StateAwareComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot when loading is true', () => {
    props = createTestProps({
      loading: true,
    });
    const wrapper = mount(<StateAwareComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
