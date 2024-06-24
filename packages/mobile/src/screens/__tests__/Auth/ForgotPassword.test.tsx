import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ForgotPassword } from '@homzhub/mobile/src/screens/Auth/ForgotPassword';

const mock = jest.fn();

describe('Forgot Password Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <ForgotPassword
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            onCallback: mock,
          },
        }}
      />
    );
  });

  it('should render forgot password screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to login screen', () => {
    component.find('[testID="txtLogin"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
