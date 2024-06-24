import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertySearchList } from '@homzhub/mobile/src/components/organisms/PropertySearchList';
import { SearchFilter } from '@homzhub/common/src/mocks/FilterData';
import { PropertySearchData } from '@homzhub/common/src/mocks/PropertySearchData';

let props: any;
let wrapper: ShallowWrapper;

describe('PropertySearchList', () => {
  const createTestProps = (testProps: any): object => ({
    properties: {
      count: 1,
      links: {
        next: '',
        previous: '',
      },
      results: PropertySearchData,
    },
    onFavorite: jest.fn(),
    getPropertiesListView: jest.fn(),
    setFilter: jest.fn(),
    filters: SearchFilter,
    onSelectedProperty: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<PropertySearchList {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem', () => {
    wrapper = shallow(<PropertySearchList {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="resultList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={props.properties.results[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it.skip('should call onFavourite', () => {
    wrapper = shallow(<PropertySearchList {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="resultList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={props.properties.results[0]} />);
    // @ts-ignore
    renderItemShallowWrapper.find('[testID="listCard"]').prop('onFavorite')();
    expect(props.onFavorite).toBeCalled();
  });

  it('should match snapshot for keyExtractor', () => {
    wrapper = shallow(<PropertySearchList {...props} t={(key: string): string => key} />);
    const KeyExtractor = wrapper.find('[testID="resultList"]').prop('keyExtractor');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={props.properties.results[0]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });

  it('should call function when reached to end', () => {
    wrapper = shallow(<PropertySearchList {...props} t={(key: string): string => key} />);
    // @ts-ignore
    wrapper.find('[testID="resultList"]').prop('onEndReached')();
    expect(props.getPropertiesListView).toBeCalled();
  });

  it('should match snapshot for footer', () => {
    wrapper = shallow(<PropertySearchList {...props} t={(key: string): string => key} />);
    const RenderFooter = wrapper.find('[testID="resultList"]').prop('ListFooterComponent');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<RenderFooter />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for footer when count is same as results', () => {
    props = createTestProps({
      properties: {
        count: 2,
        links: {
          next: '',
          previous: '',
        },
        results: PropertySearchData,
      },
    });
    wrapper = shallow(<PropertySearchList {...props} t={(key: string): string => key} />);
    const RenderFooter = wrapper.find('[testID="resultList"]').prop('ListFooterComponent');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<RenderFooter />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot when count is 0', () => {
    props = createTestProps({
      properties: {
        count: 0,
        links: {
          next: '',
          previous: '',
        },
        results: PropertySearchData,
      },
    });
    wrapper = shallow(<PropertySearchList {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot when count is not there', () => {
    props = createTestProps({
      properties: {
        links: {
          next: '',
          previous: '',
        },
        results: PropertySearchData,
      },
    });
    wrapper = shallow(<PropertySearchList {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
