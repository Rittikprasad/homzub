import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetLocationSearch } from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationSearch';
import { AutocompleteMock } from '@homzhub/common/src/mocks/GooglePlacesMocks';

const mock = jest.fn();
describe.skip('Asset Location Search', () => {
  let component: any;
  let props: any;

  const navigationParam = {
    initialLatitude: 1,
    initialLongitude: 1,
    primaryTitle: 'location',
    secondaryTitle: 'location2',
  };

  beforeEach(() => {
    props = {
      navigation: {
        navigate: mock,
        goBack: mock,
      },
      resetState: mock,
    };
    component = shallow(<AssetLocationSearch {...props} t={(key: string): string => key} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should update state', () => {
    component.find('[testID="searchBar"]').prop('updateValue')('Kochi');
    expect(component.instance().state.searchString).toBe('Kochi');
    component.find('[testID="searchBar"]').prop('updateValue')('');
    expect(component.instance().state.searchString).toBe('');
  });

  it('should update state on Toggle', () => {
    component.find('[testID="searchBar"]').prop('onFocusChange')(false);
    expect(component.instance().state.showAutoDetect).toBe(true);
  });

  it('should call on press results', () => {
    component.find('[testID="searchBar"]').prop('updateValue')('');
    component.find('[testID="currentLocation"]').prop('onGetCurrentPositionSuccess')({
      coords: { latitude: 1, longitude: 1 },
    });
    component.instance().navigateToMapView(navigationParam);
    expect(mock).toHaveBeenCalled();
  });

  it('should call on press results', () => {
    component.find('[testID="searchBar"]').prop('updateValue')('Kochi');
    component.setState({ suggestions: AutocompleteMock.predictions });
    component.find('[testID="searchResults"]').prop('onResultPress')({ place_id: 1 });
    component.instance().navigateToMapView(navigationParam);
    expect(mock).toHaveBeenCalled();
    component.instance().displayError('Error');
  });

  it('should navigate to previous screen', () => {
    component.find('[testID="header"]').prop('onIconPress')();
    expect(props.navigation.goBack).toBeCalled();
    expect(props.resetState).toBeCalled();
  });
});
