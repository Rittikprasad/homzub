import React, { PureComponent } from 'react';
import { PickerItemProps, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AnalyticsHelper } from '@homzhub/common/src/utils/AnalyticsHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { GooglePlaceData, GooglePlaceDetail, Point } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, ButtonType } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { FontWeightType, Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { ToggleButton } from '@homzhub/common/src/components/atoms/ToggleButton';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Range } from '@homzhub/common/src/components/molecules/Range';
import { RoomsFilter } from '@homzhub/common/src/components/molecules/RoomsFilter';
import { BottomSheetListView, CurrentLocation } from '@homzhub/mobile/src/components';
import AssetTypeFilter from '@homzhub/common/src/components/organisms/AssetTypeFilter';
import SearchResults from '@homzhub/mobile/src/components/molecules/SearchResults';
import GoogleSearchBar from '@homzhub/mobile/src/components/molecules/GoogleSearchBar';
import PropertySearchList from '@homzhub/mobile/src/components/organisms/PropertySearchList';
import PropertySearchMap from '@homzhub/mobile/src/components/organisms/PropertySearchMap';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { CarpetArea } from '@homzhub/common/src/domain/models/CarpetArea';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { FilterDetail } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter, ITransactionRange } from '@homzhub/common/src/domain/models/Search';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

export enum OnScreenFilters {
  TYPE = 'TYPE',
  PRICE = 'PRICE',
  ROOMS = 'ROOMS',
  AREA = 'AREA',
  MORE = 'MORE',
}

interface IStateProps {
  properties: AssetSearch;
  filterData: FilterDetail | null;
  filters: IFilter;
  isLoading: boolean;
  currencyData: PickerItemProps[];
  priceRange: ITransactionRange;
  searchLocation: Point;
  countryData: Country[];
  isLoggedIn: boolean;
  defaultCurrency: Currency;
}

interface IDispatchProps {
  setFilter: (payload: IFilter) => void;
  getProperties: () => void;
  getPropertiesListView: () => void;
  setInitialFilters: () => void;
  setInitialState: () => void;
  setChangeStack: (flag: boolean) => void;
  getFilterDetails: (payload: IFilter) => void;
}

interface IPropertySearchScreenState {
  searchString: string;
  isMapView: boolean;
  isSortVisible: boolean;
  selectedOnScreenFilter: OnScreenFilters | string;
  isMenuTrayCollapsed: boolean;
  isSearchBarFocused: boolean;
  suggestions: GooglePlaceData[];
  areaUnits: IDropdownOption[];
  favouriteProperties: number[];
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.PropertySearchScreen>;
type Props = libraryProps & IStateProps & IDispatchProps;

export class AssetSearchScreen extends PureComponent<Props, IPropertySearchScreenState> {
  private focusListener: any;

  public constructor(props: Props) {
    super(props);
    const {
      filters: { search_address },
    } = props;

    this.state = {
      searchString: search_address ?? '',
      isMapView: true,
      isSortVisible: false,
      selectedOnScreenFilter: '',
      isMenuTrayCollapsed: false,
      suggestions: [],
      isSearchBarFocused: false,
      areaUnits: [],
      favouriteProperties: [],
    };
  }

  public componentDidMount = async (): Promise<void> => {
    const { filterData, filters, getFilterDetails, getProperties, navigation, setFilter, defaultCurrency } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      setFilter({ offset: 0 });
      if (!filters.currency_code) {
        setFilter({
          currency_code: defaultCurrency.currencyCode,
        });
      }

      getProperties();
    });
    if (!filterData) {
      getFilterDetails({ asset_group: filters.asset_group });
    }

    try {
      const response = await CommonRepository.getCarpetAreaUnits();
      const areaUnitsDropdown: IDropdownOption[] = [];
      response.forEach((carpetArea: CarpetArea) => {
        areaUnitsDropdown.push({
          value: carpetArea.id,
          label: carpetArea.title,
        });
      });
      this.setState({
        areaUnits: areaUnitsDropdown,
      });
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }

    if (filterData) {
      setFilter({ sort_by: filterData.filters.defaultSort });
    }
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const { filterData, setFilter } = this.props;
    if (filterData && prevProps.filterData?.filters.defaultSort !== filterData.filters.defaultSort) {
      setFilter({ sort_by: filterData.filters.defaultSort });
    }
  };

  public componentWillUnmount(): void {
    const { setChangeStack } = this.props;
    setChangeStack(true);
    this.focusListener();
  }

  public render(): React.ReactNode {
    const { isLoading } = this.props;
    return (
      <>
        <View style={styles.statusBar}>
          <StatusBar translucent backgroundColor={theme.colors.white} barStyle="dark-content" />
        </View>
        <SafeAreaView style={styles.container}>
          {this.renderFilterTray()}
          {this.renderContent()}
          {this.renderSearchContainer()}
          {this.renderBar()}
        </SafeAreaView>
        <Loader visible={isLoading} />
        {this.renderSort()}
      </>
    );
  }

  private renderMenuTray = (): React.ReactElement | null => {
    const { isMenuTrayCollapsed } = this.state;
    if (!isMenuTrayCollapsed) {
      return null;
    }
    return <View style={styles.trayContainer}>{this.renderCollapsibleTray()}</View>;
  };

  private renderContent = (): React.ReactElement | null => {
    const { isMapView, favouriteProperties } = this.state;
    const { properties, setFilter, filters, getPropertiesListView, searchLocation } = this.props;
    if (!properties) {
      return null;
    }
    return (
      <View style={styles.flexFour}>
        {isMapView ? (
          <>
            <PropertySearchMap
              properties={properties.results}
              transaction_type={filters.asset_transaction_type || 0}
              onSelectedProperty={this.navigateToAssetDetails}
              searchLocation={searchLocation}
              filters={filters}
              setFilter={setFilter}
              getPropertiesListView={getPropertiesListView}
            />
            {this.renderNoResults()}
            {this.renderMenuTray()}
          </>
        ) : (
          <>
            <PropertySearchList
              properties={properties}
              filters={filters}
              setFilter={setFilter}
              favIds={favouriteProperties}
              getPropertiesListView={getPropertiesListView}
              onSelectedProperty={this.navigateToAssetDetails}
              handleToggle={this.handleToggle}
              handleSortToggle={this.handleSortToggle}
            />
            {this.renderNoResultsListView()}
            {this.renderMenuTray()}
          </>
        )}
      </View>
    );
  };

  private renderNoResults = (): React.ReactElement | null => {
    const { properties, t } = this.props;
    if (properties.count > 0) {
      return null;
    }
    return (
      <View style={styles.noResultsContainer}>
        <Text type="small" textType="regular" style={styles.noResults}>
          {t('noResultsMapView')}
        </Text>
      </View>
    );
  };

  private renderNoResultsListView = (): React.ReactElement | null => {
    const { properties, t } = this.props;
    if (properties.count > 0) {
      return null;
    }
    return (
      <View style={styles.noResultsListContainer}>
        <Icon name={icons.search} size={30} color={theme.colors.disabledSearch} />
        <Text type="small" textType="semiBold" style={styles.noResultText}>
          {t('common:noResultsFound')}
        </Text>
        <Label type="large" textType="regular" style={styles.helperText}>
          {t('noResultHelper')}
        </Label>
        <Button
          type="primary"
          title={t('shareRequirement')}
          containerStyle={styles.button}
          onPress={this.shareRequirement}
        />
        <Label type="large" textType="semiBold" style={styles.resetFilters} onPress={this.resetFilterAndProperties}>
          {t('resetFilters')}
        </Label>
      </View>
    );
  };

  private renderCollapsibleTray = (): React.ReactElement | null => {
    const { selectedOnScreenFilter, areaUnits } = this.state;
    const {
      filterData,
      countryData,
      filters: {
        room_count,
        bath_count,
        asset_group,
        asset_type,
        min_price,
        max_price,
        min_area,
        max_area,
        area_unit,
        currency_code,
      },
      setFilter,
      currencyData,
      getProperties,
      priceRange,
      getFilterDetails,
      setInitialFilters,
    } = this.props;
    let currencySymbol = '';
    let areaRange = { min: 0, max: 10 };

    if (!filterData) {
      return null;
    }

    const {
      currency,
      filters: { carpetArea },
    } = filterData;

    // TODO: Handle Multiple currency
    const country = countryData.find((item) => item.currencies[0].currencyCode === currency_code);

    // @ts-ignore
    currencySymbol = country?.currencies[0].currencySymbol ?? currency[0].currency_symbol;

    const updateFilter = (type: string, value: number | number[]): void => {
      setFilter({ [type]: value, offset: 0 });
      if (type === 'min_price' || type === 'max_price' || type === 'min_area' || type === 'max_area') {
        setTimeout(() => {
          getProperties();
        }, 500);
      } else {
        getProperties();
        if (type === 'asset_group') {
          getFilterDetails({ asset_group: value as number });
          setInitialFilters();
        }
      }
    };

    if (carpetArea) {
      carpetArea.forEach((units: CarpetArea) => {
        if (units.id === area_unit) {
          areaRange = {
            min: units.minArea,
            max: units.maxArea,
          };
        }
      });
    }

    switch (selectedOnScreenFilter) {
      case OnScreenFilters.PRICE:
        return (
          <Range
            // @ts-ignore
            dropdownData={currencyData}
            selectedUnit={currency_code}
            isPriceRange
            range={priceRange}
            currencySymbol={currencySymbol}
            minChangedValue={min_price ?? 0}
            maxChangedValue={max_price ?? 0}
            onChangeSlide={updateFilter}
            containerStyle={styles.priceRange}
          />
        );
      case OnScreenFilters.AREA:
        return (
          <Range
            dropdownData={areaUnits}
            selectedUnit={area_unit}
            range={areaRange}
            minChangedValue={min_area ?? 0}
            maxChangedValue={max_area ?? 0}
            onChangeSlide={updateFilter}
            onDropdownValueChange={this.handleDropdownValue}
            containerStyle={styles.priceRange}
          />
        );
      case OnScreenFilters.ROOMS:
        return <RoomsFilter bedCount={room_count ?? []} bathroomCount={[bath_count ?? 0]} onSelection={updateFilter} />;
      case OnScreenFilters.TYPE:
        return (
          <AssetTypeFilter
            filterData={filterData}
            asset_group={asset_group ?? 0}
            asset_type={asset_type ?? []}
            updateAssetFilter={updateFilter}
          />
        );
      default:
        return null;
    }
  };

  private renderSearchContainer = (): React.ReactElement | null => {
    const { isSearchBarFocused, searchString } = this.state;
    const { t } = this.props;

    if (!isSearchBarFocused) {
      return null;
    }

    return (
      <View style={styles.searchLocation}>
        <GoogleSearchBar
          placeholder={t('enterLocation')}
          updateValue={this.onSearchStringUpdate}
          value={searchString}
          autoFocus
          containerStyle={styles.searchBarContainer}
          cancelButtonStyle={styles.cancelButtonStyle}
          cancelTextStyle={styles.cancelTextStyle}
          onFocusChange={this.onSearchBarFocusChange}
        />
        {this.renderSearchResults()}
      </View>
    );
  };

  private renderSort = (): React.ReactElement | null => {
    const {
      t,
      filterData,
      filters: { sort_by },
    } = this.props;
    const { isSortVisible } = this.state;
    if (!filterData) {
      return null;
    }
    const {
      filters: { sortDropDownData },
    } = filterData;

    return (
      <BottomSheetListView
        data={sortDropDownData}
        selectedValue={sort_by ?? ''}
        listTitle={t('common:sort')}
        isBottomSheetVisible={isSortVisible}
        onCloseDropDown={this.handleCloseSort}
        onSelectItem={this.onSelectSort}
      />
    );
  };

  private renderFilterTray = (): React.ReactElement | null => {
    const {
      t,
      filters: { search_address, asset_group },
      navigation: { goBack },
    } = this.props;
    const { selectedOnScreenFilter, isMenuTrayCollapsed } = this.state;
    const onScreenFilters = [
      { type: OnScreenFilters.TYPE, label: t('type') },
      { type: OnScreenFilters.PRICE, label: t('price') },
      {
        type: asset_group === 1 ? OnScreenFilters.ROOMS : OnScreenFilters.AREA, // asset_group=1 is RESIDENTIAL
        label: asset_group === 1 ? t('rooms') : t('area'),
      },
      { type: OnScreenFilters.MORE, label: icons.filter },
    ];
    return (
      <>
        <View style={styles.tray}>
          <View style={styles.addressContainer}>
            <TouchableOpacity style={styles.back} onPress={goBack}>
              <Icon name={icons.leftArrow} size={18} color={theme.colors.darkTint5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleSearchBar} style={styles.searchContent}>
              <Icon name={icons.search} size={16} color={theme.colors.darkTint5} />
              {search_address ? (
                <Text type="small" textType="regular" style={styles.address} numberOfLines={1}>
                  {search_address}
                </Text>
              ) : (
                <Label type="large" textType="regular" style={styles.placeholder} numberOfLines={1}>
                  {t('enterLocation')}
                </Label>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.menuTrayContainer}>
            {onScreenFilters.map((item: { type: OnScreenFilters; label: string }, index: number) => {
              const { type, label } = item;
              let buttonType: ButtonType = 'secondary';
              let fontWeight: FontWeightType = 'regular';
              let iconColor = theme.colors.primaryColor;
              if (selectedOnScreenFilter === type) {
                buttonType = 'primary';
                fontWeight = 'semiBold';
                iconColor = theme.colors.secondaryColor;
              }

              const onPress = (): void => {
                this.setState({ selectedOnScreenFilter: type, isMenuTrayCollapsed: true });
                if (type === selectedOnScreenFilter && isMenuTrayCollapsed) {
                  this.setState({
                    isMenuTrayCollapsed: false,
                  });
                }
              };

              const navigateToFilters = (): void => {
                const { navigation } = this.props;
                navigation.navigate(ScreensKeys.PropertyFilters);
              };

              if (index === 3) {
                return (
                  <Button
                    key={type}
                    type={buttonType}
                    icon={label}
                    iconColor={iconColor}
                    iconSize={20}
                    onPress={navigateToFilters}
                    containerStyle={styles.additionalFilterButton}
                  />
                );
              }
              return (
                <Button
                  key={type}
                  title={label}
                  type={buttonType}
                  textType="label"
                  textSize="regular"
                  fontType={fontWeight}
                  onPress={onPress}
                  containerStyle={styles.filterButtons}
                  titleStyle={styles.menuButtonText}
                />
              );
            })}
          </View>
        </View>
        <Divider />
      </>
    );
  };

  private renderSearchResults = (): React.ReactElement | null => {
    const { suggestions, searchString } = this.state;
    return (
      <>
        <CurrentLocation onGetCurrentPositionSuccess={this.onGetCurrentPositionSuccess} />
        {suggestions.length > 0 && searchString.length > 0 && (
          <SearchResults
            results={suggestions}
            onResultPress={this.onSuggestionPress}
            listTitleStyle={styles.resultListContainer}
          />
        )}
      </>
    );
  };

  private renderBar = (): React.ReactElement | null => {
    const { isMapView, isMenuTrayCollapsed, isSearchBarFocused } = this.state;
    const { t, properties } = this.props;

    if (isMenuTrayCollapsed || isSearchBarFocused || !properties || !isMapView) {
      return null;
    }

    const conditionalStyle = isMapView ? styles.flexRow : styles.flexRowReverse;
    return (
      <View style={[styles.bar, conditionalStyle]}>
        <View style={styles.propertiesFound}>
          <Label type="regular" textType="regular">
            {(properties && properties.count) ?? 0} {t('propertiesFound')}
          </Label>
        </View>
        <ToggleButton onToggle={this.handleToggle} title={t('common:list')} icon={icons.list} />
      </View>
    );
  };

  private onSearchStringUpdate = (searchString: string): void => {
    this.setState({ searchString }, this.getAutocompleteSuggestions);
  };

  private onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const { setFilter } = this.props;
    const {
      coords: { latitude, longitude },
    } = data;
    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude })
      .then((locData) => {
        const { formatted_address } = locData;
        const { primaryAddress, secondaryAddress } = GooglePlacesService.getSplitAddress(formatted_address);
        this.setState({ searchString: `${primaryAddress} ${secondaryAddress}`, isSearchBarFocused: false });
        const { lngValue, latValue } = GeolocationService.getFormattedCords(latitude, longitude);
        setFilter({
          search_address: `${primaryAddress} ${secondaryAddress}`,
          search_latitude: latValue,
          search_longitude: lngValue,
        });
      })
      .catch(this.displayError);
  };

  private onSuggestionPress = (place: GooglePlaceData): void => {
    const { setFilter, getProperties } = this.props;
    setFilter({
      offset: 0,
    });
    GooglePlacesService.getPlaceDetail(place.place_id)
      .then((placeDetail: GooglePlaceDetail) => {
        this.setSearchedPropertyCurrency(placeDetail);
        const { lat, lng } = placeDetail.geometry.location;
        const { lngValue, latValue } = GeolocationService.getFormattedCords(lat, lng);
        setFilter({
          search_address: place.description,
          search_latitude: latValue,
          search_longitude: lngValue,
          offset: 0,
        });
        getProperties();
        this.setState({ isSearchBarFocused: false, searchString: place.description });
      })
      .catch(this.displayError);
  };

  public onSearchBarFocusChange = (isSearchBarFocused: boolean): void => {
    this.setState({ isSearchBarFocused });
  };

  private onSelectSort = (value: string): void => {
    const { setFilter, getPropertiesListView } = this.props;
    setFilter({ sort_by: value, is_sorting: true, offset: 0 });
    getPropertiesListView();
    this.handleCloseSort();
  };

  private onPostRequirement = (isFromAuth: boolean): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SearchRequirement, { isFromAuth });
  };

  private shareRequirement = (): void => {
    const { navigation, isLoggedIn, setChangeStack } = this.props;
    if (!isLoggedIn) {
      setChangeStack(false);
      navigation.navigate(ScreensKeys.AuthStack, {
        screen: ScreensKeys.SignUp,
        params: { onCallback: (): void => this.onPostRequirement(true) },
      });
    } else {
      this.onPostRequirement(false);
    }
  };

  public toggleSearchBar = (): void => {
    const { isSearchBarFocused } = this.state;
    this.setState({ isSearchBarFocused: !isSearchBarFocused });
  };

  private displayError = (e: Error): void => {
    AlertHelper.error({ message: e.message });
  };

  // eslint-disable-next-line react/sort-comp
  private getAutocompleteSuggestions = debounce((): void => {
    const { searchString } = this.state;
    GooglePlacesService.autoComplete(searchString)
      .then((suggestions: GooglePlaceData[]) => {
        this.setState({ suggestions });
      })
      .catch((e: Error): void => {
        AlertHelper.error({ message: e.message });
      });
  }, 300);

  private handleToggle = (): void => {
    const { isMapView } = this.state;
    this.setState({
      isMapView: !isMapView,
    });
  };

  private handleSortToggle = (): void => {
    this.setState({
      isSortVisible: true,
    });
  };

  private handleCloseSort = (): void => {
    this.setState({
      isSortVisible: false,
    });
  };

  private handleDropdownValue = (value: string | number): void => {
    const { setFilter, getProperties } = this.props;
    setFilter({
      area_unit: value as number,
      min_area: -1,
      max_area: -1,
    });
    getProperties();
  };

  public resetFilterAndProperties = (): void => {
    const { getProperties, setInitialFilters } = this.props;
    setInitialFilters();
    getProperties();
  };

  public navigateToAssetDetails = (asset: Asset): void => {
    const { navigation, isLoggedIn } = this.props;
    const { leaseTerm, saleTerm, id } = asset;

    // For Analytics
    const trackData = AnalyticsHelper.getPropertyTrackData(asset);
    AnalyticsService.track(EventType.SearchPropertyOpen, trackData);

    // For Navigation
    const navParams = {
      screen: ScreensKeys.PropertyAssetDescription,
      params: {
        propertyTermId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
        propertyId: id,
      },
    };
    if (isLoggedIn) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.BottomTabs, {
        screen: ScreensKeys.More,
        params: navParams,
      });
    } else {
      // @ts-ignore
      navigation.navigate(ScreensKeys.SearchStack, {
        screen: ScreensKeys.Search,
        params: navParams,
      });
    }
  };

  private setSearchedPropertyCurrency = (placeDetail: GooglePlaceDetail): void => {
    const { countryData, setFilter } = this.props;
    const placeCountry = placeDetail.address_components.find((address) => address.types.includes('country'));
    const country = countryData.find((item) => item.iso2Code === placeCountry?.short_name);
    setFilter({
      currency_code: country?.currencies[0].currencyCode,
    });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const {
    getProperties,
    getFilters,
    getFilterDetail,
    getLoadingState,
    getCurrencyData,
    getPriceRange,
    getSearchLocationLatLong,
  } = SearchSelector;
  const { isLoggedIn } = UserSelector;
  const { getCountryList, getDefaultCurrency } = CommonSelectors;
  return {
    properties: getProperties(state),
    filterData: getFilterDetail(state),
    filters: getFilters(state),
    isLoading: getLoadingState(state),
    currencyData: getCurrencyData(state),
    priceRange: getPriceRange(state),
    searchLocation: getSearchLocationLatLong(state),
    isLoggedIn: isLoggedIn(state),
    countryData: getCountryList(state),
    defaultCurrency: getDefaultCurrency(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setFilter, getFilterDetails, getProperties, setInitialFilters, setInitialState, getPropertiesListView } =
    SearchActions;
  const { setChangeStack } = UserActions;
  return bindActionCreators(
    {
      setFilter,
      getProperties,
      setInitialFilters,
      setInitialState,
      getPropertiesListView,
      setChangeStack,
      getFilterDetails,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(AssetSearchScreen));

const {
  colors,
  viewport: { width, height },
  layout: { screenPadding },
  DeviceDimensions: { SMALL },
} = theme;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexFour: {
    flex: 4,
  },
  statusBar: {
    height: PlatformUtils.isIOS() ? 30 : StatusBar.currentHeight,
    backgroundColor: colors.background,
  },
  bar: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: height <= SMALL.height ? 130 : 140,
    width,
    paddingHorizontal: screenPadding,
  },
  tray: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuTrayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButtons: {
    flex: 0,
    width: (width - 68) / 4,
  },
  additionalFilterButton: {
    flex: 0,
    width: 56,
  },
  menuButtonText: {
    marginVertical: 8,
    marginHorizontal: 4,
  },
  propertiesFound: {
    backgroundColor: colors.white,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  trayContainer: {
    width: '100%',
    backgroundColor: colors.white,
    padding: 15,
    paddingTop: 10,
    position: 'absolute',
    top: 0,
    borderRadius: 4,
  },
  searchBarContainer: {
    backgroundColor: colors.white,
  },
  cancelButtonStyle: {
    backgroundColor: colors.white,
  },
  cancelTextStyle: {
    color: colors.primaryColor,
  },
  resultListContainer: {
    backgroundColor: colors.white,
  },
  searchLocation: {
    backgroundColor: colors.white,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: colors.darkTint12,
    borderWidth: 1,
    marginBottom: 12,
  },
  address: {
    marginStart: 10,
    alignSelf: 'flex-start',
    flex: 0.9,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowReverse: {
    flexDirection: 'row-reverse',
  },
  noResults: {
    textAlign: 'center',
    color: colors.darkTint4,
  },
  noResultsContainer: {
    position: 'absolute',
    bottom: 20,
    padding: 7,
    width: 250,
    alignSelf: 'center',
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  priceRange: {
    width,
    paddingRight: 30,
  },
  noResultsListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultText: {
    color: colors.darkTint3,
    marginVertical: 10,
  },
  helperText: {
    color: colors.darkTint6,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  resetFilters: {
    color: colors.primaryColor,
    marginVertical: 10,
  },
  button: {
    flex: 0,
    marginVertical: 10,
  },
  placeholder: {
    marginStart: 8,
    color: colors.darkTint7,
  },
  back: {
    padding: 8,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 0.5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderLeftColor: theme.colors.darkTint12,
  },
});
