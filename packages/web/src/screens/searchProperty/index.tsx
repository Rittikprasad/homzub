import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import GoogleSearchBar from '@homzhub/web/src/components/molecules/GoogleSearchBar';
import { IPopupOptions } from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import AssetFilters from '@homzhub/web/src/screens/searchProperty/components/AssetFilters';
import PropertiesView from '@homzhub/web/src/screens/searchProperty/components/PropertiesView';
import { SortByFilter } from '@homzhub/web/src/screens/searchProperty/components/SortByFilter';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { FilterDetail } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IState } from '@homzhub/common/src/modules/interfaces';

// TODO : Replace Dummy Data with Api Data;
interface IStateProps {
  properties: AssetSearch;
  filters: IFilter;
  filterData: FilterDetail | null;
  loader: boolean;
}
interface IDispatchProps {
  getPropertiesListView: () => void;
  getFilterDetails: (payload: IFilter) => void;
  setInitialState: () => void;
  setFilter: (payload: IFilter) => void;
  clearProperties: () => void;
  setInitialMiscellaneous: () => void;
  setInitialFilters: () => void;
}

type SearchPropertyProps = IStateProps & IDispatchProps;
const SearchProperty = (props: SearchPropertyProps): React.ReactElement | null => {
  const [isListView, setIsListView] = useState(false);
  const {
    properties,
    getPropertiesListView,
    setFilter,
    filters,
    clearProperties,
    filterData,
    getFilterDetails,
    loader,
    setInitialFilters,
  } = props;

  const toggleGridView = (): void => {
    setIsListView(false);
  };
  const toggleListView = (): void => {
    setIsListView(true);
  };

  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTab = useDown(deviceBreakpoint.TABLET);
  const { t } = useTranslation();
  const buttonTitle = t('propertySearch:resetFilters');
  const empyStateButtonProps = (): IButtonProps => ({
    title: buttonTitle,
    titleStyle: styles.reset,
    textSize: 'small',
    fontType: 'semiBold',
    type: 'text',
    onPress: clearForm,
  });

  const history = useHistory();
  const initialCount = properties.results.length === 0 ? 0 : 1;
  const limit = isListView ? 5 : 9;
  const hasMore = !(properties.results.length === properties.count);

  useEffect(() => {
    clearProperties();
    setFilter({
      offset: 0,
      limit,
    });
    getPropertiesListView();
  }, [isListView]);

  useEffect(() => {
    if (!filterData) {
      getFilterDetails({ asset_group: filters.asset_group });
    }
    return (): void => {
      setFilter({
        search_latitude: 0,
        search_longitude: 0,
        search_address: '',
      });
    };
  }, []);

  const clearForm = (): void => {
    const { setInitialMiscellaneous } = props;
    const { search_longitude, search_latitude } = filters;
    setInitialMiscellaneous();
    setInitialFilters();
    getPropertiesListView();
    const locationParams = `?search_latitude=${search_latitude}&search_longitude=${search_longitude}`;
    NavigationService.navigate(history, { path: `${RouteNames.protectedRoutes.SEARCH_PROPERTY}${locationParams}` });
  };

  const fetchMoreData = (value: number): void | null => {
    setFilter({
      offset: value,
      limit,
    });
    getPropertiesListView();
  };

  const onSelectSort = (value: IPopupOptions): void => {
    setFilter({ sort_by: value.value as string, is_sorting: true, offset: 0 });
    getPropertiesListView();
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.searchAndFilters}>
        <View style={[styles.searchBarContainer, isMobile && styles.searchBarMobileContainer]}>
          <View style={[styles.googleSearchBar, isMobile && styles.googleSearchBarMobile]}>
            <GoogleSearchBar />
          </View>
          <Button type="primary" containerStyle={styles.searchButton}>
            {isMobile ? <Icon name={icons.search} color={theme.colors.white} /> : t('search')}
          </Button>
        </View>
        <View style={styles.filters}>
          <AssetFilters history={history} />
        </View>
      </View>
      <View style={[styles.sortAndToggleButtons, isMobile && styles.sortAndToggleButtonsMobile]}>
        <View style={[styles.sortByContainer]}>
          <Text type="small" textType="regular" style={styles.textStyle}>
            {t('propertySearch:sortBy')}
          </Text>
          <SortByFilter filters={filters} filterData={filterData} onSelectSort={onSelectSort} />
        </View>
        <View
          style={[styles.toggleContainer, isTab && styles.toggleContainerTab, isMobile && styles.toggleContainerMobile]}
        >
          <View>
            <Label type="large" textType="regular" style={[styles.label, isMobile && styles.labelMobile]}>
              {t('propertySearch:filterCount', {
                intialCount: initialCount as number,
                resultLength: properties.results.length,
                count: properties.count as number,
              })}
            </Label>
          </View>
          {!isMobile && (
            <View style={styles.toggleButtons}>
              <Icon
                name={icons.grid}
                onPress={toggleGridView}
                size={22}
                color={isListView ? theme.colors.disabled : theme.colors.primaryColor}
                style={styles.toggleIcons}
              />
              <Icon
                name={icons.doubleBar}
                onPress={toggleListView}
                size={22}
                color={!isListView ? theme.colors.disabled : theme.colors.primaryColor}
                style={styles.toggleIcons}
              />
            </View>
          )}
        </View>
      </View>
      {properties.results.length > 0 ? (
        <PropertiesView
          isListView={isListView}
          property={properties}
          fetchData={fetchMoreData}
          hasMore={hasMore}
          limit={limit}
          transaction_type={filters.asset_transaction_type || 0}
          loader={loader}
        />
      ) : (
        <View style={styles.emptyState}>
          <EmptyState
            textType="regular"
            textStyle={styles.emptyStateTextStyle}
            containerStyle={styles.emptyStateContainer}
            iconSize={20}
            title={t('propertySearch:noResultsTitle')}
            subTitle={t('propertySearch:noResultsSubTitle')}
            buttonProps={empyStateButtonProps()}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  sortAndToggleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  sortAndToggleButtonsMobile: {
    flexDirection: 'column',
  },
  toggleButtons: {
    flexDirection: 'row',
  },
  toggleIcons: {
    marginHorizontal: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '79%',
  },
  toggleContainerTab: {
    width: '66%',
  },
  toggleContainerMobile: {
    width: '100%',
  },
  sortByContainer: {
    flexDirection: 'row',
  },
  searchAndFilters: {
    paddingLeft: 24,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '70%',
    justifyContent: 'flex-start',
  },
  searchBarMobileContainer: {
    width: '100%',
    paddingRight: 24,
  },
  googleSearchBarMobile: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.gray13,
    marginRight: 12,
  },
  googleSearchBar: {
    width: '80%',
    marginRight: 16,
  },
  searchButton: {
    height: 33,
    color: theme.colors.white,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
  },
  filters: {
    marginVertical: 20,
    paddingRight: 24,
    paddingLeft: 0,
  },
  cardMobile: {
    width: '100%',
    marginLeft: 0,
  },
  cardTablet: {
    width: '47%',
  },

  reset: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
    alignSelf: 'center',
  },
  emptyState: {
    height: 400,
    marginTop: 20,
  },
  emptyStateContainer: {
    backgroundColor: theme.colors.background,
  },
  emptyStateTextStyle: {
    color: theme.colors.darkTint3,
  },
  textStyle: {
    marginRight: 8,
    marginTop: 4,
  },

  label: {
    marginLeft: 24,
    marginTop: 2,
  },
  labelMobile: {
    marginLeft: 0,
  },
});
const mapStateToProps = (state: IState): IStateProps => {
  const { getProperties, getFilters, getFilterDetail, getLoadingState } = SearchSelector;
  return {
    properties: getProperties(state),
    filters: getFilters(state),
    filterData: getFilterDetail(state),
    loader: getLoadingState(state),
  };
};
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const {
    setInitialState,
    getPropertiesListView,
    getFilterDetails,
    setFilter,
    clearProperties,
    setInitialMiscellaneous,
    setInitialFilters,
  } = SearchActions;
  return bindActionCreators(
    {
      getPropertiesListView,
      setInitialState,
      getFilterDetails,
      setFilter,
      clearProperties,
      setInitialMiscellaneous,
      setInitialFilters,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchProperty);
