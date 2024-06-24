import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MobileVerificationScreen } from '@homzhub/mobile/src/screens/Auth/MobileVerificationScreen';
import { SocialAuthKeys } from '@homzhub/common/src/constants/SocialAuthProviders';

const mock = jest.fn();

describe.skip('Mobile verification Screen', () => {
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
      <MobileVerificationScreen
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            isFromLogin: true,
            provider: SocialAuthKeys.Google,
            userData: {
              user: {
                first_name: 'Test',
                last_name: 'User',
                email: 'test@yopmail.com',
              },
            },
            onCallback: mock,
          },
        }}
      />
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot when its not from login', () => {
    component = shallow(
      <MobileVerificationScreen
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            isFromLogin: false,
            userData: {
              provider: SocialAuthKeys.Google,
              user: {
                first_name: 'Test',
                last_name: 'User',
                email: 'test@yopmail.com',
              },
            },
            onCallback: mock,
          },
        }}
      />
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
