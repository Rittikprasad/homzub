// @ts-nocheck
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { FormTextInput, IFormTextInputProps } from '@homzhub/common/src/components/molecules/FormTextInput';

jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');

describe.skip('Test cases for FormTextInput', () => {
  const formValues = {
    values: {
      name: 'test',
    },
    touched: {
      name: 'test',
    },
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
  };

  const mockFunction = jest.fn();

  const testProps = (Props: IFormTextInputProps): IFormTextInputProps => ({
    ...Props,
    name: 'test',
    children: null,
    formProps: formValues,
  });

  let props: IFormTextInputProps;
  it('should render snapshot', () => {
    props = testProps({
      inputType: 'name',
    });
    const wrapper = shallow(<FormTextInput {...props} />);
    wrapper.instance().handleTextChange('abc');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot when input type is email', () => {
    props = testProps({
      inputType: 'email',
      helpText: 'Help',
    });

    const wrapper = shallow(<FormTextInput {...props} />);
    wrapper.instance().handleTextChange('abc@yopmail.com');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot when input type is phone', () => {
    props = testProps({
      inputType: 'phone',
      inputPrefixText: '+91',
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot when input type is decimal', () => {
    props = testProps({
      inputType: 'decimal',
      inputPrefixText: '1.09',
      inputGroupSuffixText: 'INR',
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render snapshot and call handleChange when inputPrefixText is not there', () => {
    props = testProps({
      inputType: 'phone',
      onBlur: mockFunction,
    });

    const wrapper = shallow(<FormTextInput {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot and call handleChange when input type is number', () => {
    props = testProps({
      inputType: 'number',
      onValueChange: mockFunction,
    });

    const wrapper = shallow(<FormTextInput {...props} />);
    wrapper.instance().handleTextChange('123');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot when input type is password', () => {
    props = testProps({
      inputType: 'password',
      onValueChange: jest.fn(),
    });

    const wrapper = shallow(<FormTextInput {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render snapshot when password revealer is hide', () => {
    props = testProps({
      inputType: 'password',
      hidePasswordRevealer: true,
    });

    const tree = renderer.create(<FormTextInput {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should test showPassword state', () => {
    props = testProps({});
    const wrapper = shallow(<FormTextInput {...props} />);
    const instance = wrapper.instance();
    expect(instance.state.showPassword).toBe(false);
    instance.toggleShowPassword();
    expect(instance.state.showPassword).toBe(true);
  });

  it('should test isFocused state', () => {
    props = testProps({});
    const wrapper = shallow(<FormTextInput {...props} />);
    const instance = wrapper.instance();
    instance.focus();
    instance.handleBlur();
    wrapper.instance().handleTextChange('abc');
    expect(instance.state.isFocused).toBe(false);
    instance.handleFocus();
    expect(instance.state.isFocused).toBe(true);
  });
});
