import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Portfolio } from '@homzhub/mobile/src/screens/Asset/Portfolio';
import { DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { PortfolioAssetData, TenanciesAssetData } from '@homzhub/common/src/mocks/AssetData';

const mock = jest.fn();

describe.skip('Portfolio Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
        addListener: mock,
      },
      tenancies: TenanciesAssetData,
      properties: PortfolioAssetData,
      setCurrentAsset: mock,
      setCurrentFilter: mock,
      getPropertyDetails: mock,
      getTenanciesDetails: mock,
    };
    component = shallow(<Portfolio {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call on filter select', () => {
    component.instance().onSelectFilter(Filters.ALL);
    expect(props.setCurrentFilter).toBeCalledWith(Filters.ALL);
  });

  it('should call on view property', () => {
    component.instance().onViewProperty(1, DataType.TENANCIES);
    expect(props.setCurrentAsset).toBeCalledWith({ id: 1, dataType: DataType.TENANCIES });
    expect(props.navigation.navigate).toBeCalled();
  });

  it('should call callback', () => {
    component.instance().onPropertiesCallback();
    component.instance().onTenanciesCallback();
    expect(component.instance().state.isSpinnerLoading).toBe(false);
  });
});
