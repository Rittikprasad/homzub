import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetSearchScreen } from '@homzhub/mobile/src/screens/Asset/Search/AssetSearchScreen';
import { FilterData, SearchFilter } from '@homzhub/common/src/mocks/FilterData';

describe.skip('Asset Search Screen', () => {
  let component: ShallowWrapper;
  let props: any;
  const mock = jest.fn();

  beforeEach(() => {
    props = {
      filterData: null,
      filters: SearchFilter,
      currencyData: [],
      priceRange: {},
      isLoading: false,
      searchLocation: {},
      properties: {},
      getFilterDetails: mock,
      setFilter: mock,
      getProperties: mock,
      getPropertiesListView: mock,
      setInitialFilters: mock,
      setInitialState: mock,
      setChangeStack: mock,
      navigation: {
        goBack: mock,
      },
    };
  });

  it('should render snapshot', () => {
    component = shallow(<AssetSearchScreen {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for Map view', () => {
    component = shallow(<AssetSearchScreen {...props} t={(key: string): string => key} />);
    component.setState({ isMapView: true });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot with filterData', () => {
    props = {
      ...props,
      filterData: FilterData,
    };
    component = shallow(<AssetSearchScreen {...props} t={(key: string): string => key} />);
    component.setState({ isMenuTrayCollapsed: true });
    expect(toJson(component)).toMatchSnapshot();
  });
});
