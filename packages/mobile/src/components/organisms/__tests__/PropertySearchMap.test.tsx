import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertySearchMap } from '@homzhub/mobile/src/components/organisms/PropertySearchMap';
import { PropertySearchData } from '@homzhub/common/src/mocks/PropertySearchData';
import { mockAsset } from '@homzhub/common/src/mocks/AssetDescription';
import { SearchFilter } from '@homzhub/common/src/mocks/FilterData';

let props: any;
let wrapper: ShallowWrapper;

describe('PropertySearchMap', () => {
  const createTestProps = (testProps: any): object => ({
    searchLocation: {
      lat: 1,
      lng: 1,
    },
    properties: PropertySearchData,
    transaction_type: 1,
    onSelectedProperty: jest.fn(),
    getPropertiesListView: jest.fn(),
    setFilter: jest.fn(),
    filters: SearchFilter,
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<PropertySearchMap {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for carouselItem', () => {
    wrapper = shallow(<PropertySearchMap {...props} t={(key: string): string => key} />);
    // @ts-ignore
    wrapper.find('[testID="assetSnap"]').prop('carouselItem')(mockAsset);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for Snap To Item', () => {
    wrapper = shallow(<PropertySearchMap {...props} t={(key: string): string => key} />);
    // @ts-ignore
    wrapper.find('[testID="assetSnap"]').prop('onSnapToItem')(1);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for carouselItem when transaction_type is 0', () => {
    props = createTestProps({
      transaction_type: 0,
    });
    wrapper = shallow(<PropertySearchMap {...props} t={(key: string): string => key} />);
    // @ts-ignore
    wrapper.find('[testID="assetSnap"]').prop('carouselItem')(mockAsset);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot when properties are empty', () => {
    props = createTestProps({
      properties: [],
    });
    wrapper = shallow(<PropertySearchMap {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
