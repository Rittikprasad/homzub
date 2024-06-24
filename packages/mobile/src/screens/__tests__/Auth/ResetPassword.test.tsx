import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ResetPassword } from '@homzhub/mobile/src/screens/Auth/ResetPassword';

const mock = jest.fn();

describe('Reset Password Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
      },
    };
    component = shallow(
      <ResetPassword
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

  it('should render reset password screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it.skip('should navigate on icon press', () => {
    component.find('[testID="headerIconPress"]').prop('onIconPress')();
    expect(mock).toHaveBeenCalled();
  });
});
