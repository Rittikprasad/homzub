import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { icons } from '@homzhub/common/src/assets/icon';
import { Header } from '@homzhub/mobile/src/components/molecules/Header';

const createTestProps = (testProps: any): object => ({
  icon: icons.leftArrow,
  onIconPress: jest.fn(),
  ...testProps,
});
let props: any;

describe.skip('Header', () => {
  it('should match snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<Header {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot without title', () => {
    props = createTestProps({
      isHeadingVisible: true,
      title: 'Header',
    });
    const wrapper = mount(<Header {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for secondary theme', () => {
    props = createTestProps({
      isHeadingVisible: true,
      title: 'Header',
      type: 'secondary',
    });
    const wrapper = mount(<Header {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
