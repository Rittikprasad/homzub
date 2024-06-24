import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Notifications } from '@homzhub/mobile/src/screens/Asset/Dashboard/Notifications';

describe('Asset Notifications Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: jest.fn(),
      },
      route: {
        params: {
          isFromDashboard: true,
        },
      },
    };
    component = shallow(<Notifications {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    component.setState({ notifications: { results: [{}] } });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot with empty notifications', () => {
    component.setState({ notifications: { results: [] } });
    expect(toJson(component)).toMatchSnapshot();
  });
});
