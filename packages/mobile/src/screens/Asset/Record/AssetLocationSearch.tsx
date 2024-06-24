import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { CommonActions } from '@react-navigation/native';
import { GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import AddPropertyGraphic from '@homzhub/common/src/assets/images/addPropertyGraphic.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { CurrentLocation } from '@homzhub/mobile/src/components';
import SearchResults from '@homzhub/mobile/src/components/molecules/SearchResults';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import GoogleSearchBar from '@homzhub/mobile/src/components/molecules/GoogleSearchBar';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import {
  GoogleGeocodeData,
  GooglePlaceData,
  GooglePlaceDetail,
} from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { NavigationScreenProps, ScreensKeys, IAssetLocationMapProps } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IScreenState {
  searchString: string;
  suggestions: GooglePlaceData[];
  showAutoDetect: boolean;
}

interface IStateProps {
  isAddPropertyFlow: boolean;
}

interface IDispatchProps {
  resetState: () => void;
  setAddPropertyFlow: (payload: boolean) => void;
}

type NavigationProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AssetLocationSearch>;

type Props = WithTranslation & NavigationProps & IDispatchProps & IStateProps;

export class AssetLocationSearch extends React.PureComponent<Props, IScreenState> {
  public state = {
    searchString: '',
    suggestions: [],
    showAutoDetect: true,
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { searchString, suggestions, showAutoDetect } = this.state;
    return (
      <Screen
        headerProps={{
          barVisible: true,
          type: 'primary',
          onIconPress: this.onBackPress,
          title: t('common:location'),
          children: (
            <GoogleSearchBar
              placeholder={t('searchProject')}
              value={searchString}
              updateValue={this.onUpdateSearchString}
              onFocusChange={this.onToggleAutoDetect}
              testID="searchBar"
            />
          ),
        }}
        contentContainerStyle={styles.content}
      >
        {suggestions.length > 0 && searchString.length > 0 && (
          <SearchResults results={suggestions} onResultPress={this.onSuggestionPress} testID="searchResults" />
        )}
        {showAutoDetect && searchString.length <= 0 && (
          <CurrentLocation
            textToShow={t('common:autoDetect')}
            onGetCurrentPositionSuccess={this.onGetCurrentPositionSuccess}
            testID="currentLocation"
          />
        )}
        {!(suggestions.length > 0 && searchString.length > 0) && this.renderGraphicView()}
      </Screen>
    );
  }

  private renderGraphicView = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.graphicContainer}>
        <AddPropertyGraphic />
        <Label textType="regular" type="large" style={styles.graphicText}>
          {t('common:addLocationToStart')}
        </Label>
      </View>
    );
  };

  private onUpdateSearchString = (updatedSearchString: string): void => {
    this.setState({ searchString: updatedSearchString }, () => {
      if (updatedSearchString.length <= 0) {
        return;
      }
      this.getAutocompleteSuggestions();
    });
  };

  private onToggleAutoDetect = (showAutoDetect: boolean): void => {
    this.setState({ showAutoDetect: !showAutoDetect });
  };

  private onBackPress = (): void => {
    const { navigation, resetState, isAddPropertyFlow, setAddPropertyFlow } = this.props;

    resetState();

    if (isAddPropertyFlow) {
      setAddPropertyFlow(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreensKeys.BottomTabs }],
        })
      );
    } else {
      navigation.goBack();
    }
  };

  private onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const {
      coords: { latitude, longitude },
    } = data;

    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude })
      .then((locData) => {
        this.onSuggestionPress(locData);
      })
      .catch(this.displayError);
  };

  private onSuggestionPress = (place: GooglePlaceData | GoogleGeocodeData): void => {
    GooglePlacesService.getPlaceDetail(place.place_id)
      .then((placeData: GooglePlaceDetail) => {
        this.navigateToMapView({
          placeData,
        });
      })
      .catch(this.displayError);
  };

  // eslint-disable-next-line react/sort-comp
  private getAutocompleteSuggestions = debounce((): void => {
    const { searchString } = this.state;
    GooglePlacesService.autoComplete(searchString)
      .then((suggestions: GooglePlaceData[]) => {
        this.setState({ suggestions });
      })
      .catch(this.displayError);
  }, 300);

  private navigateToMapView = (options: IAssetLocationMapProps): void => {
    const {
      navigation: { navigate },
    } = this.props;
    const {
      geometry: {
        location: { lat, lng },
      },
    } = options.placeData;
    PropertyRepository.getProjects({ latitude: lat, longitude: lng, name: '' })
      .then((res) => {
        if (res.length > 0) {
          navigate(ScreensKeys.ProjectSelection, { options, projects: res });
        } else {
          navigate(ScreensKeys.AssetLocationMap, options);
        }
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  private displayError = (e: Error): void => {
    AlertHelper.error({ message: e.message });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    isAddPropertyFlow: UserSelector.isAddPropertyFlow(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { resetState } = RecordAssetActions;
  const { setAddPropertyFlow } = UserActions;
  return bindActionCreators(
    {
      resetState,
      setAddPropertyFlow,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetLocationSearch));

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 0,
  },
  graphicContainer: {
    flex: 1,
    marginTop: theme.viewport.height / 7,
    alignItems: 'center',
  },
  graphicText: {
    textAlign: 'center',
    marginHorizontal: 50,
  },
});
