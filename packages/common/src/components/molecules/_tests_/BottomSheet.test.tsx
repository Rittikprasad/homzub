import React from 'react';
import { Text } from 'react-native';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BottomSheet, IBottomSheetProps } from '@homzhub/common/src/components/molecules/BottomSheet';

describe('BottomSheet', () => {
  beforeAll(() => jest.spyOn(React, 'useEffect').mockImplementation((f) => f));
  it('should render snapshot', () => {
    const testProps: IBottomSheetProps = {
      children: <Text>Bottom Sheet</Text>,
      visible: false,
      onCloseSheet: jest.fn(),
    };
    const wrapper = mount(<BottomSheet {...testProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render snapshot when visible is true', () => {
    const testProps: IBottomSheetProps = {
      children: <Text>Bottom Sheet</Text>,
      visible: true,
      onCloseSheet: jest.fn(),
    };
    const wrapper = mount(<BottomSheet {...testProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
