import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SimilarProperties } from '@homzhub/mobile/src/components/organisms/SimilarProperties';
import { PropertySearchData } from '@homzhub/common/src/mocks/PropertySearchData';

let props: any;
let wrapper: ShallowWrapper;

describe.skip('SimilarProperties', () => {
  const createTestProps = (testProps: any): object => ({
    propertyTermId: 1,
    onFavorite: jest.fn(),
    onSelectedProperty: jest.fn(),
    transaction_type: 1,
    ...testProps,
  });

  props = createTestProps({});
  wrapper = shallow(<SimilarProperties {...props} t={(key: string): string => key} />);

  it('should match snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with similar properties', () => {
    wrapper.setState({ similarProperties: PropertySearchData });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem', () => {
    const RenderItem = wrapper.find('[testID="similarPropertiesList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={PropertySearchData[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should call onFavourite', () => {
    const RenderItem = wrapper.find('[testID="similarPropertiesList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={PropertySearchData[0]} />);
    // @ts-ignore
    renderItemShallowWrapper.find('[testID="listCard"]').prop('onFavorite')();
    expect(props.onFavorite).toBeCalled();
  });

  it('should match snapshot for keyExtractor', () => {
    const KeyExtractor = wrapper.find('[testID="similarPropertiesList"]').prop('keyExtractor');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={PropertySearchData[0]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });
});
