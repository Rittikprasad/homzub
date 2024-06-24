import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Button, ButtonType, IButtonProps } from '@homzhub/common/src/components/atoms/Button';

describe('Button', () => {
  const wrapper: ShallowWrapper<IButtonProps, {}, Button> = shallow(
    <Button onPress={jest.fn} type="primary" title="Test" />
  );

  ['primary' as ButtonType, 'secondary' as ButtonType].forEach((item: ButtonType) => {
    it(`should match snapshot for ${item}`, () => {
      wrapper.setProps({ type: item });
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should match snapshot for disabled', () => {
    wrapper.setProps({ disabled: true });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render with icon', () => {
    wrapper.setProps({ icon: 'search', textType: 'label' });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
