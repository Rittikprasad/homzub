import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ExploreSections } from '@homzhub/mobile/src/components/molecules/ExploreSections';
import { PlacesTypeData, PointsOfInterest } from '@homzhub/common/src/mocks/GooglePlacesMocks';

let props: any;

describe('ExploreSections', () => {
  const createTestProps = (testProps: any): object => ({
    placeTypes: [],
    selectedPlaceType: {},
    onPlaceTypePress: jest.fn(),
    pointsOfInterest: [],
    selectedPoiId: '',
    onPoiPress: jest.fn(),
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    const wrapper = shallow(<ExploreSections {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot with additional props', () => {
    props = createTestProps({
      pointsOfInterest: PointsOfInterest,
    });
    const wrapper = shallow(<ExploreSections {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for places renderItem', () => {
    const wrapper = shallow(<ExploreSections {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="placesList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={PlacesTypeData[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();

    // @ts-ignore
    renderItemShallowWrapper.find('[testID="iconPress"]').prop('onPress')();
    expect(props.onPlaceTypePress).toBeCalled();
  });

  it('should match snapshot for places keyExtractor', () => {
    const wrapper = shallow(<ExploreSections {...props} t={(key: string): string => key} />);
    const KeyExtractor = wrapper.find('[testID="placesList"]').prop('keyExtractor');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={PlacesTypeData[0]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for point of interest renderItem', () => {
    const wrapper = shallow(<ExploreSections {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="interestList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={PointsOfInterest[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();

    // @ts-ignore
    renderItemShallowWrapper.find('[testID="resultPress"]').prop('onPress')();
    expect(props.onPoiPress).toBeCalled();
  });

  it('should match snapshot for poi keyExtractor', () => {
    const wrapper = shallow(<ExploreSections {...props} t={(key: string): string => key} />);
    const KeyExtractor = wrapper.find('[testID="interestList"]').prop('keyExtractor');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={PointsOfInterest[0]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for point of interest header', () => {
    const wrapper = shallow(<ExploreSections {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="interestList"]').prop('ListHeaderComponent');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for places renderItem with selectedPlaces', () => {
    props = createTestProps({
      selectedPlaceType: PlacesTypeData[0],
    });
    const wrapper = shallow(<ExploreSections {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="placesList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={PlacesTypeData[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for point of interest renderItem with selectedPoi', () => {
    props = createTestProps({
      selectedPoiId: 'ChIJkbeSa_BfYzARphNChaFPjNc',
      pointsOfInterest: PointsOfInterest,
    });
    const wrapper = shallow(<ExploreSections {...props} t={(key: string): string => key} />);
    const RenderItem = wrapper.find('[testID="interestList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={PointsOfInterest[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });
});
