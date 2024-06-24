import React, { useState } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Script from 'react-load-script';
import { useHistory } from 'react-router-dom';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import AutoCompletionSearchBar from '@homzhub/web/src/components/atoms/AutoCompletionSearchBar';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { ILatLng } from '@homzhub/common/src/modules/search/interface';

interface IDispatchProps {
  setFilter: (payload: IFilter) => void;
  getProperties: () => void;
  getPropertiesListView: () => void;
}
interface IAddressComponent {
  long_name: string;
  short_name: string;
  types: Array<string>;
}
interface IStateProps {
  countryData: Country[];
}
type SearchBarProps = IDispatchProps & IStateProps;
const GoogleSearchBar = (props: SearchBarProps): React.ReactElement => {
  const [hasScriptLoaded, setHasScriptLoaded] = useState(false);
  const history = useHistory();
  const updateLatLng = (result: IAddressComponent[], formatedAddress: string, { lat, lng }: ILatLng): void => {
    const { lngValue, latValue } = GeolocationService.getFormattedCords(lat, lng);
    const { setFilter, getProperties } = props;
    setSearchedPropertyCurrency(result);
    setFilter({
      search_address: formatedAddress,
      search_latitude: latValue,
      search_longitude: lngValue,
    });

    const locationParams = `?search_latitude=${latValue}&search_longitude=${lngValue}`;
    NavigationService.navigate(history, { path: `${RouteNames.protectedRoutes.SEARCH_PROPERTY}${locationParams}` });
    getProperties();
  };
  const setSearchedPropertyCurrency = (placeDetail: IAddressComponent[]): void => {
    const { countryData, setFilter } = props;
    const placeCountry = placeDetail.find((address) => address.types.includes('country'));
    const country = countryData.find((item) => item.iso2Code === placeCountry?.short_name);
    setFilter({
      currency_code: country?.currencies[0].currencyCode,
    });
  };
  return (
    <>
      <AutoCompletionSearchBar hasScriptLoaded={hasScriptLoaded} onSuggestionPress={updateLatLng} />
      <Script
        url={`https://maps.googleapis.com/maps/api/js?key=${ConfigHelper.getPlacesApiKey()}&libraries=places`}
        onLoad={(): void => setHasScriptLoaded(true)}
      />
    </>
  );
};
const mapStateToProps = (state: any): IStateProps => {
  const { getCountryList } = CommonSelectors;
  return {
    countryData: getCountryList(state),
  };
};
export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setFilter, getProperties, getPropertiesListView } = SearchActions;
  return bindActionCreators(
    {
      setFilter,
      getProperties,
      getPropertiesListView,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(GoogleSearchBar);
