import React from 'react';
import { Text } from 'react-native';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ModalView, IModalProps } from '@homzhub/common/src/components/atoms/ModalView';

describe('Dropdown', () => {
  const wrapper: ShallowWrapper<IModalProps, {}, ModalView> = shallow(
    <ModalView visible modalContainerStyle={{}} onClose={jest.fn()}>
      <Text>Test</Text>
    </ModalView>
  );

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
