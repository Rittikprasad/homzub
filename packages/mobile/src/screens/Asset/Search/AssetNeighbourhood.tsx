/* eslint-disable react/no-unused-state */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { CustomMarker } from '@homzhub/common/src/components/atoms/CustomMarker';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import ExploreSections from '@homzhub/mobile/src/components/molecules/ExploreSections';
import { Header } from '@homzhub/mobile/src/components/molecules/Header';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { NeighborhoodTabs, PLACES_DATA } from '@homzhub/common/src/constants/AssetNeighbourhood';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { MetricSystems } from '@homzhub/common/src/domain/models/UserPreferences';
import { PlaceTypes } from '@homzhub/common/src/services/GooglePlaces/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const EXPANDED = theme.viewport.height * 0.45;

// INTERFACES & TYPES
interface IStateProps {
  asset: Asset | null;
  metricSystem: MetricSystems;
}
interface IOwnState {
  selectedTab: NeighborhoodTabs;
  selectedPlaceType: PlaceTypes;
  isBottomSheetVisible: boolean;
  pointsOfInterest: PointOfInterest[];
  selectedPlaceId: string;
  isApiActive: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.AssetNeighbourhood>;
type Props = IStateProps & libraryProps;

export class AssetNeighbourhood extends React.Component<Props, IOwnState> {
  private mapRef: MapView | null = null;

  public state = {
    isBottomSheetVisible: false,
    selectedTab: NeighborhoodTabs.Nearby,
    selectedPlaceType: Object.values(PLACES_DATA[NeighborhoodTabs.Nearby])[0].key,
    pointsOfInterest: [],
    selectedPlaceId: '',
    isApiActive: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.fetchPOIs();
    this.setState({ isBottomSheetVisible: true });
  };

  public shouldComponentUpdate = (nextProps: Props, nextState: IOwnState): boolean => {
    const { isApiActive, selectedPlaceType, selectedTab } = nextState;
    const { selectedPlaceType: oldType, selectedTab: oldTab } = this.state;
    return !(isApiActive || selectedTab !== oldTab || selectedPlaceType !== oldType);
  };

  public render = (): React.ReactNode => {
    const { asset, t, metricSystem } = this.props;
    const { selectedTab, selectedPlaceType, isBottomSheetVisible, pointsOfInterest, selectedPlaceId } = this.state;

    if (!asset) return null;
    const {
      assetLocation: { longitude, latitude },
    } = asset;
    return (
      <View style={styles.flexOne}>
        <Header type="secondary" icon={icons.leftArrow} onIconPress={this.onBackPress} title={asset.projectName} />
        <MapView
          ref={(mapRef: MapView): void => {
            this.mapRef = mapRef;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.flexOne}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker coordinate={{ latitude, longitude }}>
            <CustomMarker selected />
          </Marker>
          {this.renderMarkers()}
        </MapView>
        <View style={styles.floatingTab}>
          <SelectionPicker
            data={[
              { title: t('nearby'), value: NeighborhoodTabs.Nearby },
              { title: t('commute'), value: NeighborhoodTabs.Commute },
            ]}
            selectedItem={[selectedTab]}
            onValueChange={this.onTabChange}
          />
        </View>
        <BottomSheet
          visible={isBottomSheetVisible}
          renderHeader={false}
          sheetHeight={EXPANDED}
          onCloseSheet={this.onBottomSheetClose}
        >
          <ExploreSections
            placeTypes={Object.values(PLACES_DATA[selectedTab])}
            // @ts-ignore
            selectedPlaceType={PLACES_DATA[selectedTab][selectedPlaceType]}
            onPlaceTypePress={this.onPlaceTypeChange}
            selectedPoiId={selectedPlaceId}
            pointsOfInterest={pointsOfInterest}
            onPoiPress={this.onPoiPress}
            metricSystem={metricSystem}
          />
        </BottomSheet>
      </View>
    );
  };

  private renderMarkers = (): React.ReactNode => {
    const { pointsOfInterest, selectedPlaceId, selectedTab, selectedPlaceType } = this.state;
    // @ts-ignore
    const placeType = PLACES_DATA[selectedTab][selectedPlaceType];

    return pointsOfInterest.map((point: PointOfInterest) => (
      <Marker key={point.placeId} coordinate={{ latitude: point.latitude, longitude: point.longitude }}>
        <Icon
          name={placeType.mapMarker}
          color={selectedPlaceId === point.placeId ? theme.colors.active : theme.colors.darkTint5}
          size={24}
        />
      </Marker>
    ));
  };

  private onTabChange = (selectedTab: NeighborhoodTabs): void => {
    const { selectedTab: oldTab, selectedPlaceType } = this.state;

    let placeTypeToUpdate = selectedPlaceType;
    if (oldTab !== selectedTab) {
      placeTypeToUpdate = Object.values(PLACES_DATA[selectedTab])[0].key;
    }

    this.setState({ selectedTab, selectedPlaceType: placeTypeToUpdate, isBottomSheetVisible: true }, () => {
      this.fetchPOIs().then();
    });
  };

  private onPlaceTypeChange = (selectedPlaceType: PlaceTypes): void => {
    this.setState({ selectedPlaceType }, () => {
      this.fetchPOIs().then();
    });
  };

  private onBottomSheetClose = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  private onPoiPress = (poi: PointOfInterest): void => {
    const { latitude, longitude, placeId } = poi;
    this.setState({ selectedPlaceId: placeId });
    this.mapRef?.animateCamera({
      center: {
        latitude,
        longitude,
      },
    });
  };

  private onBackPress = (): void => {
    const {
      navigation: { goBack },
    } = this.props;
    goBack();
  };

  private fetchPOIs = async (): Promise<void> => {
    const { selectedPlaceType } = this.state;
    const { asset, metricSystem } = this.props;

    if (!asset) return;
    this.setState({ isApiActive: true });
    const { assetLocation } = asset;

    try {
      const pointsOfInterest = await GooglePlacesService.getPOIs(
        assetLocation,
        selectedPlaceType,
        undefined,
        metricSystem
      );

      this.setState({ pointsOfInterest, isApiActive: false });
    }catch (e: any) {      this.setState({ isBottomSheetVisible: false, isApiActive: false });
      AlertHelper.error({ message: e.message });
    }
  };
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  floatingTab: {
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginHorizontal: 12,
    top: 120,
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  const { getAsset } = AssetSelectors;
  const { getMetricSystem } = UserSelector;

  return {
    asset: getAsset(state),
    metricSystem: getMetricSystem(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetDescription)(AssetNeighbourhood));
