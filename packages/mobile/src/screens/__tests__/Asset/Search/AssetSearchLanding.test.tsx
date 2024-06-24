import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetSearchLanding } from '@homzhub/mobile/src/screens/Asset/Search/AssetSearchLanding';
import { FilterData, SearchFilter } from '@homzhub/common/src/mocks/FilterData';

describe.skip('Asset Search Landing Screen', () => {
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
      getFilterDetails: mock,
      setFilter: mock,
      getProperties: mock,
      setInitialState: mock,
      navigation: {
        goBack: mock,
      },
    };
  });

  it('should render snapshot', () => {
    component = shallow(<AssetSearchLanding {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot with filterData', () => {
    props = {
      ...props,
      filterData: FilterData,
    };
    component = shallow(<AssetSearchLanding {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot for search bar focused', () => {
    component = shallow(<AssetSearchLanding {...props} t={(key: string): string => key} />);
    component.setState({ isSearchBarFocused: true });
    expect(toJson(component)).toMatchSnapshot();
  });
});
