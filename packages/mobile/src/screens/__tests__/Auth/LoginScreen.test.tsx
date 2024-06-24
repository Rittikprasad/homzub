import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { LoginScreen } from '@homzhub/mobile/src/screens/Auth/LoginScreen';

const mock = jest.fn();

describe('Login Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
        goBack: mock,
      },
      loginSuccess: mock,
    };
    component = shallow(
      <LoginScreen
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

  it('should render login screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to email login', () => {
    component.find('[testID="socialEmailLogin"]').prop('onEmailLogin')();
    expect(mock).toHaveBeenCalled();
  });

  it('should login on otp press', () => {
    const values = {
      email: 'john@gmail.com',
      password: 'password',
      country_code: '_91',
      phone_number: '9876543210',
    };
    component.find('[testID="loginForm"]').prop('onLoginSuccess')(values);
    expect(mock).toHaveBeenCalled();
  });
});
