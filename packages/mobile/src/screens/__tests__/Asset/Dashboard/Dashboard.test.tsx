import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PortfolioActionTypes } from '@homzhub/common/src/modules/portfolio/actions';
import { Dashboard, mapDispatchToProps } from '@homzhub/mobile/src/screens/Asset/Dashboard';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';

describe('Dashboard Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        goBack: jest.fn(),
        addListener: jest.fn(),
        navigate: jest.fn(),
        dispatch: jest.fn(),
      },
      setCurrentFilter: jest.fn(),
    };
    component = shallow(<Dashboard {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should navigate to view all', () => {
    component.instance().onViewAll();
    expect(props.navigation.navigate).toBeCalled();
  });

  it('should navigate to notifications', () => {
    component.instance().handleNotification();
    expect(props.navigation.navigate).toBeCalled();
  });

  it('should handle metrics navigation', () => {
    component.instance().handleMetricsNavigation();
    expect(props.navigation.navigate).toBeCalled();
  });

  it('should handle mapDispatchToProps', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).setCurrentFilter(Filters.ALL);
    expect(dispatch.mock.calls[0][0]).toStrictEqual({
      type: PortfolioActionTypes.SET.CURRENT_FILTER,
      payload: Filters.ALL,
    });
  });
});
