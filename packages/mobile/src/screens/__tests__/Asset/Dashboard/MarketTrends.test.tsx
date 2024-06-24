import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MarketTrends } from '@homzhub/mobile/src/screens/Asset/Dashboard/MarketTrends';

describe('Market Trends Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: jest.fn(),
      },
      route: {
        params: {
          isFromDashboard: false,
        },
      },
    };
    component = shallow(<MarketTrends {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
