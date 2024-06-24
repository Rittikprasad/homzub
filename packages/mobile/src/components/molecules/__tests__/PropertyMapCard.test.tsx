import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyMapCard } from '@homzhub/mobile/src/components/molecules/PropertyMapCard';
import { PropertyMapData } from '@homzhub/common/src/mocks/PropertyMapData';

let props: any;
let wrapper: ShallowWrapper;

describe('PropertyMapCard', () => {
  const createTestProps = (testProps: any): object => ({
    amenitiesData: PropertyMapData,
    source: {},
    name: '',
    price: 0,
    currency: '',
    priceUnit: '',
    isFavorite: false,
    onFavorite: jest.fn(),
    onSelectedProperty: jest.fn(),
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<PropertyMapCard {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot when isFavourite is true', () => {
    props = createTestProps({
      isFavorite: true,
    });
    wrapper = shallow(<PropertyMapCard {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
