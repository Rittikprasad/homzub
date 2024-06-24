import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import GoogleSearchBar from '@homzhub/mobile/src/components/molecules/GoogleSearchBar';
import SearchResults from '@homzhub/mobile/src/components/molecules/SearchResults';
import { IWorkLocation } from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { Role } from '@homzhub/common/src/constants/Signup';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import {
  AddressComponent,
  GooglePlaceData,
  GooglePlaceDetail,
} from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { IOtpNavProps } from '@homzhub/mobile/src/navigation/interfaces';

const LocationKeysToMatch = {
  sublocality_level_1: 'LOCALITY',
  sublocality: 'LOCALITY',
  locality: 'CITY',
  administrative_area_level_2: 'CITY',
  administrative_area_level_1: 'STATE',
  country: 'COUNTRY',
};

const WorkLocations = (props: { props: number }): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const locations = useSelector(FFMSelector.getWorkLocations);
  const [searchString, setSearchString] = useState('');
  const [suggestions, setSuggestions] = useState<GooglePlaceData[]>([]);

  const selectedRole = useSelector(FFMSelector.getSelectedRole);

  useEffect(() => {
    getAutoSuggestion();
  }, [searchString]);

  const onUpdateSearchString = (value: string): void => {
    if (locations.length < 5) {
      setSearchString(value);
    } else {
      AlertHelper.error({ message: t('common:maxSelected') });
    }
  };

  const getAutoSuggestion = debounce((): void => {
    GooglePlacesService.autoComplete(searchString)
      .then((data: GooglePlaceData[]) => {
        setSuggestions(data);
      })
      .catch((e: Error): void => {
        AlertHelper.error({ message: e.message });
      });
  }, 500);

  const onSuggestionPress = (place: GooglePlaceData): void => {
    GooglePlacesService.getPlaceDetail(place.place_id)
      .then((placeDetail: GooglePlaceDetail) => {
        const locationData = [...locations];
        const localityType = getLocalityType(placeDetail.address_components);
        const { state, city, country, pincode } = ResponseHelper.getLocationDetails(placeDetail);
        const payload: IWorkLocation = {
          latitude: placeDetail.geometry.location.lat,
          longitude: placeDetail.geometry.location.lng,
          name: place.description,
          city_name: city,
          ...(state && { state_name: state }),
          ...(pincode && { postal_code: pincode }),
          country_name: country,
          location_type: localityType,
        };
        locationData.push(payload);
        dispatch(FFMActions.setWorkLocations(locationData));
        setSearchString(place.description);
        setSearchString('');
      })
      .catch((e) => {
        AlertHelper.error({ message: e.message });
      });
  };

  const onNext = (): void => {
    if (params) {
      const verificationData = params as IOtpNavProps;
      navigate(ScreenKeys.MobileVerification, {
        ...verificationData,
        userData: { ...verificationData.userData, work_locations: locations },
      });
    } else {
      var data = {
        data: {
          work_locations: locations,
          role: selectedRole.id,
          company: {
            name: '',
          },
        },
      };
      FFMRepository.updateUserRole(data).then((res) => {
        navigate(ScreenKeys.AppStack);
      });
      return;
    }
  };

  const onRemove = (location: IWorkLocation): void => {
    const formattedData = locations.filter((item) => item.name !== location.name);
    dispatch(FFMActions.setWorkLocations(formattedData));
  };

  const getLocalityType = (address: AddressComponent[]): string => {
    const localities: string[] = [];
    address.forEach((item) => {
      Object.keys(LocationKeysToMatch).forEach((key: string) => {
        if (item.types[0] === key) {
          // @ts-ignore
          localities.push(LocationKeysToMatch[key]);
        }
      });
    });

    return localities.length > 0 ? localities[0] : 'LOCALITY';
  };

  const handleGoBack = (): void => {
    goBack();
    setSuggestions([]);
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
    <>
      <GradientScreen screenTitle={t('addWorkLocation')}>
        <Label type="large" textType="semiBold">
          {t('common:search')} <Label style={styles.required}>*</Label>
        </Label>
        <GoogleSearchBar
          placeholder={t('common:searchLocation')}
          updateValue={onUpdateSearchString}
          value={searchString}
          isCancelVisible={false}
          containerStyle={styles.searchBarContainer}
        />
        {renderSearchResults()}
        {locations.length > 0 && (
          <Label type="large" textType="semiBold" style={styles.workTitle}>
            {t('common:workLocation', { count: locations.length })}
          </Label>
        )}
        <View style={styles.locationContainer}>
          {locations.map((item, index) => (
            <View style={styles.chip} key={index}>
              <Label type="large" style={styles.chipLabel} numberOfLines={1} maxLength={40}>
                {item.name}
              </Label>
              <TouchableOpacity onPress={(): void => onRemove(item)}>
                <Icon name={icons.close} size={16} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </GradientScreen>
      <WithShadowView outerViewStyle={styles.shadowView}>
        <View style={styles.buttonContainer}>
          <Button type="secondary" title={t('common:backText')} onPress={handleGoBack} />
          <View style={styles.separator} />
          <Button type="primary" title={t('common:next')} disabled={locations.length < 1} onPress={onNext} />
        </View>
      </WithShadowView>
    </>
  );
};

export default WorkLocations;

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    marginVertical: 10,
    paddingBottom: 0,
    borderRadius: 4,
  },
  listTitle: {
    backgroundColor: theme.colors.white,
  },
  chip: {
    backgroundColor: theme.colors.primaryColor,
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginVertical: 6,
  },
  chipLabel: {
    color: theme.colors.white,
    marginHorizontal: 8,
  },
  required: {
    color: theme.colors.error,
  },
  workTitle: {
    marginTop: 20,
  },
  locationContainer: {
    marginVertical: 16,
  },
  shadowView: {
    paddingBottom: 0,
    paddingTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: 20,
  },
  separator: {
    marginHorizontal: 16,
  },
});
