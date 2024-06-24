import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetDescription } from '@homzhub/mobile/src/screens/Asset/Search/AssetDescription';
import { mockAsset } from '@homzhub/common/src/mocks/AssetDescription';
import { SearchFilter } from '@homzhub/common/src/mocks/FilterData';

describe.skip('Markdown View', () => {
  let component: ShallowWrapper;
  let props: any;
  const mock = jest.fn();

  beforeEach(() => {
    props = {
      reviews: [],
      assetDetails: null,
      isLoading: false,
      filters: null,
      isLoggedIn: false,
      getAssetReviews: mock,
      getAsset: mock,
      setChangeStack: mock,
      assetLoaders: mock,
      navigation: {
        goBack: mock,
        addListener: mock,
      },
      route: {
        params: {
          propertyTermId: 1,
        },
      },
    };
  });

  it('should render snapshot', () => {
    component = shallow(<AssetDescription {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot with assetDetails', () => {
    props = {
      ...props,
      assetDetails: mockAsset,
      filters: SearchFilter,
    };
    component = shallow(<AssetDescription {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
