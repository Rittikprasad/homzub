import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { OtpInputs } from '@homzhub/common/src/components/molecules/OtpInputs';

let props: any;
const mockFunction = jest.fn();

describe.skip('OtpInputs', () => {
  const createTestProps = (testProps: any): object => ({
    bubbleOtp: mockFunction,
    toggleError: mockFunction,
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    const wrapper = shallow(<OtpInputs {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for error', () => {
    props = createTestProps({
      error: 'Error',
    });
    const wrapper = shallow(<OtpInputs {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call focus next function ', () => {
    const wrapper = shallow(<OtpInputs {...props} />);
    // @ts-ignore
    wrapper.instance().renderInputs();
    // @ts-ignore
    wrapper.find('[testID="otpInput"]').at(0).prop('onChangeText')();
    // @ts-ignore
    wrapper.find('[testID="otpInput"]').at(0).prop('onChangeText')(1);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call focus previous function ', () => {
    const wrapper = shallow(<OtpInputs {...props} />);
    // @ts-ignore
    wrapper.instance().renderInputs();
    wrapper
      .find('[testID="otpInput"]')
      .at(0)
      .simulate('keyPress', { nativeEvent: { key: '' } });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call otp handler function ', () => {
    const wrapper = shallow(<OtpInputs {...props} />);
    // @ts-ignore
    wrapper.instance().otpHandler('message');
    expect(toJson(wrapper)).toMatchSnapshot();

    // @ts-ignore
    wrapper.instance().otpHandler('123456');
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
