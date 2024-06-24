import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Text } from 'react-native';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components/HOC/AnimatedProfileHeader';

const createTestProps = (testProps: any): object => ({
  children: <Text>Testing Element</Text>,
  title: 'Service',
  onIconPress: jest.fn(),
  ...testProps,
});
let props: any;

describe.skip('AnimatedProfileHeader', () => {
  it('should render snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<AnimatedProfileHeader {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
