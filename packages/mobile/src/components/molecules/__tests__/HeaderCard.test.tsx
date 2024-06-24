import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { HeaderCard } from '@homzhub/mobile/src/components/molecules/HeaderCard';

const createTestProps = (testProps: any): object => ({
  title: 'Header',
  onIconPress: jest.fn(),
  ...testProps,
});
let props: any;

describe('Header Card', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<HeaderCard {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
