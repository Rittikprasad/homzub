import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet } from 'react-native';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { CurrentLocation } from '@homzhub/mobile/src/components';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import GoogleSearchBar from '@homzhub/mobile/src/components/molecules/GoogleSearchBar';
import SearchResults from '@homzhub/mobile/src/components/molecules/SearchResults';
import { GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { GooglePlaceData, GooglePlaceDetail } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { ILocationParam } from '@homzhub/common/src/domain/repositories/interfaces';

const LocalitiesSelection = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const [searchString, setSearchString] = useState('');
  const [isLocationPress, setLocationPress] = useState(false);
  const [suggestions, setSuggestions] = useState<GooglePlaceData[]>([]);
  const [localities, setLocalities] = useState<ILocationParam[]>([]);

  useEffect(() => {
    getAutoSuggestion();
  }, [searchString]);

  const getAutoSuggestion = debounce((): void => {
    GooglePlacesService.autoComplete(searchString)
      .then((data: GooglePlaceData[]) => {
        setSuggestions(data);
      })
      .catch((e: Error): void => {
        AlertHelper.error({ message: e.message });
      });
  }, 500);

  const onAdd = (): void => {
    dispatch(SearchActions.setLocalities(localities));
    goBack();
  };

  const onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const {
      coords: { latitude, longitude },
    } = data;
    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude }).then((locData) => {
      const { formatted_address } = locData;
      const { primaryAddress, secondaryAddress } = GooglePlacesService.getSplitAddress(formatted_address);
      setLocationPress(true);
      setLocalities([
        {
          latitude,
          longitude,
          name: `${primaryAddress} ${secondaryAddress}`,
        },
      ]);
      setSearchString(`${primaryAddress} ${secondaryAddress}`);
    });
  };

  const onSuggestionPress = (place: GooglePlaceData): void => {
    GooglePlacesService.getPlaceDetail(place.place_id)
      .then((placeDetail: GooglePlaceDetail) => {
        setLocationPress(true);
        setLocalities([
          {
            latitude: placeDetail.geometry.location.lat,
            longitude: placeDetail.geometry.location.lng,
            name: place.description,
          },
        ]);
        setSearchString(place.description);
      })
      .catch((e) => {
        AlertHelper.error({ message: e.message });
      });
  };

  const renderSearchResults = (): React.ReactNode => {
    return (
      <>
        {suggestions.length > 0 && searchString.length > 0 && (
          <SearchResults results={suggestions} onResultPress={onSuggestionPress} listTitleStyle={styles.listTitle} />
        )}
      </>
    );
  };

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{
        type: 'secondary',
        title: t('propertySearch:localities'),
        icon: icons.close,
        onIconPress: goBack,
      }}
    >
      <GoogleSearchBar
        placeholder={t('propertySearch:enterLocation')}
        updateValue={setSearchString}
        value={searchString}
        isCancelVisible={false}
        containerStyle={styles.searchBarContainer}
        onFocusChange={(): void => setLocationPress(false)}
      />
      <CurrentLocation onGetCurrentPositionSuccess={onGetCurrentPositionSuccess} />
      {!isLocationPress && renderSearchResults()}
      <Button type="primary" title={t('addLocation')} containerStyle={styles.buttonContainer} onPress={onAdd} />
    </Screen>
  );
};

export default LocalitiesSelection;

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    marginTop: 30,
    paddingBottom: 0,
    borderRadius: 4,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  listTitle: {
    backgroundColor: theme.colors.white,
  },
});
