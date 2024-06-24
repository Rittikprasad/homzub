import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { GettingStarted } from '@homzhub/mobile/src/screens/GettingStarted';

const mock = jest.fn();
describe('Getting started Screen', () => {
  let component: any;
  let props: any;
  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
      },
    };
    component = shallow(<GettingStarted {...props} t={(key: string): string => key} />);
  });

  it('should render the getting started screen', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to Property Search Screen', () => {
    component.find('[testID="btnSearchProperty"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to login Screen', () => {
    component.find('[testID="btnLogin"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });

  it('should navigate to signup Screen', () => {
    component.find('[testID="lblSignup"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
