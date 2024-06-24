import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SignUpScreen } from '@homzhub/mobile/src/screens/Auth/SignUpScreen';

const mock = jest.fn();

describe('SignUp Screen', () => {
  let component: any;
  let props: any;
  beforeEach(() => {
    props = {
      loginSuccess: mock,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <SignUpScreen
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

  it('should render signup screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
