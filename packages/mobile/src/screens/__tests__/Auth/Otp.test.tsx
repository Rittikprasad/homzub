import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { IEmailLoginPayload, LoginTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { initialCommonState } from '@homzhub/common/src/modules/common/reducer';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { initialAssetState } from '@homzhub/common/src/modules/asset/reducer';
import { initialPortfolioState } from '@homzhub/common/src/modules/portfolio/reducer';
import { initialRecordAssetState } from '@homzhub/common/src/modules/recordAsset/reducer';
import { OtpNavTypes } from '@homzhub/mobile/src/navigation/interfaces';
import { OtpInputs } from '@homzhub/common/src/components/molecules/OtpInputs';
import { Otp, mapDispatchToProps, mapStateToProps } from '@homzhub/mobile/src/screens/Auth/Otp';

const mock = jest.fn();

describe('OTP Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      isLoading: false,
      login: mock,
      loginSuccess: mock,
      navigation: {
        navigate: mock,
        goBack: mock,
      },
    };
    component = shallow(
      <Otp
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            title: 'Otp',
            otpSentTo: '99999999999',
            type: OtpNavTypes.Login,
            countryCode: 'INR',
            onCallback: mock,
          },
        }}
      />
    );
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot with userData', () => {
    component = shallow(
      <Otp
        {...props}
        t={(key: string): string => key}
        route={{
          params: {
            type: OtpNavTypes.SignUp,
            countryCode: 'INR',
            userData: {
              full_name: '',
              country_code: 'INR',
              email: '',
              phone_number: '',
              password: '',
            },
            onCallback: mock,
          },
        }}
      />
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should match snapshot in error', () => {
    component.find(OtpInputs).prop('toggleError')();
    component.setState({ error: 'Error' });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should verify otp', () => {
    component.find(OtpInputs).prop('bubbleOtp')('123456');
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should handle mapStateToProps', () => {
    const mockedState = {
      user: {
        ...initialUserState,
        isLoading: false,
      },
      search: {
        ...initialSearchState,
      },
      asset: {
        ...initialAssetState,
      },
      portfolio: {
        ...initialPortfolioState,
      },
      common: {
        ...initialCommonState,
      },
      recordAsset: {
        ...initialRecordAssetState,
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state.isLoading).toStrictEqual(false);
  });

  it('should handle mapDispatchToProps', () => {
    const dispatch = jest.fn();
    const payload = {
      data: {
        action: LoginTypes.EMAIL,
        payload: {
          email: 'johndoe@gmail.com',
          password: 'Johndoe123!',
        },
      } as IEmailLoginPayload,
      onCallback: mock,
    };
    mapDispatchToProps(dispatch).login(payload);
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN,
      payload,
    });
  });
});
