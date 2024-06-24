import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { History } from 'history';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useIsIpadPro, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import OffersOverview from '@homzhub/web/src/screens/offers/components/OffersOverview';
import PropertyDataCard from '@homzhub/web/src/screens/offers/components/PropertyDataCard';
import OffersDropdown, { OffersDropdownType } from '@homzhub/web/src/screens/offers/components/OffersDropDown';
import OffersMade from '@homzhub/web/src/screens/offers/components/OffersMade';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { OfferFilter } from '@homzhub/common/src/domain/models/OfferFilter';
import { OfferManagement } from '@homzhub/common/src/domain/models/OfferManagement';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NegotiationOfferType, OfferFilterType, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { MadeSort, offerMadeSortBy } from '@homzhub/common/src/constants/Offers';

// TODO -- saved property metrics integration :Shagun
export enum OfferType {
  OFFER_RECEIVED = 'Offer Received',
  OFFER_MADE = 'Offer Made',
}

interface IDispatchProps {
  setCurrentOfferPayload: (payload: ICurrentOffer) => void;
  setFilter: (payload: IFilter) => void;
}
interface IStateProps {
  assetCount: number;
}
interface IRouteProps {
  offerType: string;
}
interface IHistory {
  history: History<IRouteProps>;
}

type IProps = IDispatchProps & IStateProps & IHistory;

const Offers: FC<IProps> = (props: IProps) => {
  const [offerReceivedInfoRead, setOfferRecievedInfoRead] = useState(false);
  const [offerMadeInfoRead, setOfferMadeInfoRead] = useState(false);
  const history = useHistory();
  const { location } = history;
  const { state } = location;
  const { setCurrentOfferPayload } = props;
  const getInitialOfferType = (): OfferType => {
    const { assetCount } = props;
    // @ts-ignore
    if (state === undefined) return OfferType.OFFER_RECEIVED;
    // @ts-ignore
    if (state.offerType)
      // @ts-ignore
      return state.isReceivedFlow ? OfferType.OFFER_RECEIVED : OfferType.OFFER_MADE;
    return assetCount > 0 ? OfferType.OFFER_RECEIVED : OfferType.OFFER_MADE;
  };
  const [offerType, setOfferType] = useState(getInitialOfferType());
  const [offerCountData, setOfferCountData] = useState<OfferManagement>();
  const [propertyListingData, setPropertyListingData] = useState<Asset[]>([]);
  const [offerFilters, setOfferFilters] = useState(new OfferFilter());
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const [close, setClose] = useState(false);
  const isIPadPro = useIsIpadPro();
  const [selectedFilters, setSelectedFilters] = useState({
    countary_id: Number(),
    type: '',
    asset_id: Number(),
    filter_by: '',
    sort_by: MadeSort.NEWEST,
  });

  const { t } = useTranslation();

  const title = offerType === 'Offer Received' ? t('offers:noOfferReceived') : t('offers:noOfferMade');
  useEffect(() => {
    getOfferDetails();
    getOfferFilters();
  }, [offerType, close]);

  const getOfferDetails = async (): Promise<void> => {
    try {
      const offerCount = await OffersRepository.getOfferData();
      setOfferCountData(offerCount);
      const isOfferReceivedInfoRead: boolean =
        (await StorageService.get(StorageKeys.IS_OFFER_RECEIVED_INFO_READ)) || false;
      const isOfferMadeInfoRead: boolean = (await StorageService.get(StorageKeys.IS_OFFER_MADE_INFO_READ)) || false;
      setOfferRecievedInfoRead(isOfferReceivedInfoRead);
      setOfferMadeInfoRead(isOfferMadeInfoRead);
      getPropertyListData();
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  const getOfferFilters = async (): Promise<void> => {
    try {
      const response: OfferFilter = await OffersRepository.getOfferFilters(
        offerType === OfferType.OFFER_RECEIVED ? OfferFilterType.RECEIVED : OfferFilterType.CREATED
      );
      setOfferFilters(response);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };
  const getPropertyListData = async (): Promise<void> => {
    let propertyListingDatas: Asset[] = [];
    let currencies: string[] = [];
    const dynamicFilters = {
      ...(selectedFilters.countary_id && { countary_id: selectedFilters.countary_id }),
      ...(selectedFilters.type.length && { type: selectedFilters.type }),
      ...(selectedFilters.asset_id && { asset_id: selectedFilters.asset_id }),
      ...(selectedFilters.filter_by && { filter_by: selectedFilters.filter_by }),
      ...(selectedFilters.sort_by && { sort_by: selectedFilters.sort_by }),
    };
    const payload = {
      type: offerType === OfferType.OFFER_RECEIVED ? NegotiationOfferType.RECEIVED : NegotiationOfferType.CREATED,
      params: {
        ...dynamicFilters,
      },
    };
    try {
      propertyListingDatas = await OffersRepository.getOffers(payload);
      // For hiding sorting during multiple currencies
      propertyListingDatas.forEach((item) => {
        item.country.currencies.forEach((currency) => {
          if (!currencies.includes(currency.currencyCode)) {
            currencies = [...currencies, currency.currencyCode];
          }
        });
      });

      setPropertyListingData(propertyListingDatas);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  const onSelectFilter = (selectedFilterType: OffersDropdownType, value: string | number): void => {
    setSelectedFilters((prevState) => {
      return {
        ...prevState,
        [selectedFilterType]: value,
      };
    });
  };

  useEffect(() => {
    getPropertyListData();
  }, [
    selectedFilters.countary_id,
    selectedFilters.type,
    selectedFilters.asset_id,
    selectedFilters.filter_by,
    selectedFilters.sort_by,
  ]);

  const refreshOffersData = async (): Promise<void> => {
    let currencies: string[] = [];
    const payload = {
      type: offerType === OfferType.OFFER_RECEIVED ? NegotiationOfferType.RECEIVED : NegotiationOfferType.CREATED,
    };
    try {
      const propertyListingDatas = await OffersRepository.getOffers(payload);
      // For hiding sorting during multiple currencies
      propertyListingDatas.forEach((item) => {
        item.country.currencies.forEach((currency) => {
          if (!currencies.includes(currency.currencyCode)) {
            currencies = [...currencies, currency.currencyCode];
          }
        });
      });

      setPropertyListingData(propertyListingDatas);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  const onMetricsClicked = (name: string): void => {
    setOfferType(name as OfferType);
  };

  const onCloseOfferInfo = (): void => {
    if (offerType === OfferType.OFFER_RECEIVED) {
      setOfferRecievedInfoRead(true);
      StorageService.set(StorageKeys.IS_OFFER_RECEIVED_INFO_READ, true);
    }

    if (offerType === OfferType.OFFER_MADE) {
      setOfferMadeInfoRead(true);
      StorageService.set(StorageKeys.IS_OFFER_MADE_INFO_READ, true);
    }
  };
  const isInfoRead = offerType === OfferType.OFFER_RECEIVED ? offerReceivedInfoRead : offerMadeInfoRead;
  const infoText = offerType === OfferType.OFFER_RECEIVED ? t('offers:offerInfo') : t('offers:offerMadeInfo');
  if (!offerCountData) {
    return null;
  }

  const viewOffers = (payload: ICurrentOffer | null, assetId: number, offerCount: number | null): void => {
    const count = offerCount;
    const isValidListing = payload && payload.listingId > 0;
    if (!isValidListing) {
      AlertHelper.error({ message: t('property:listingNotValid') });
      return;
    }

    if (offerType === OfferType.OFFER_MADE) {
      // TODO : Handle offers made scenario - Shagun
    } else {
      if (payload) {
        setCurrentOfferPayload(payload);
      }
      // @ts-ignore
      NavigationService.navigate(history, {
        path: RouteNames.protectedRoutes.OFFERS_LISTED_PROPERTY.replace(':listingId', `${assetId}`),
        params: {
          offerCountData,
          offerType,
          count,
          listingPayload: { ...payload },
          params: {
            listingId: assetId,
          },
        },
      });
    }
  };
  const onPressMessages = (): void => {
    // TODO : handle message flow : Shagun
  };

  const handleClose = (): void => {
    setClose(!close);
  };

  const renderPropertyOffer = (item: Asset, index: number): React.ReactElement => {
    const isCardExpanded = index === 0;
    const { offerCount } = item;
    let payload: ICurrentOffer | null = null;
    const { saleTerm, leaseTerm, id } = item;
    if (saleTerm) {
      payload = {
        type: ListingType.SALE_LISTING,
        listingId: saleTerm.id,
      };
    } else if (leaseTerm) {
      payload = {
        type: ListingType.LEASE_LISTING,
        listingId: leaseTerm.id,
      };
    }
    switch (offerType) {
      case OfferType.OFFER_RECEIVED:
        return (
          <PropertyDataCard
            property={item}
            isCardExpanded={isCardExpanded}
            onViewOffer={(): void => viewOffers(payload, id, offerCount)}
          />
        );
      case OfferType.OFFER_MADE:
      default:
        return (
          <OffersMade
            property={item}
            onPressMessages={onPressMessages}
            handleClose={handleClose}
            refreshOffersData={refreshOffersData}
          />
        );
    }
  };
  return (
    <View
      style={[
        !isTablet ? (isIPadPro ? styles.containerIPadPro : styles.container) : styles.containerTab,
        isMobile && styles.containerTab,
      ]}
    >
      <OffersOverview onMetricsClicked={onMetricsClicked} offerCountData={offerCountData} isActive={offerType} />
      {!isInfoRead && propertyListingData && propertyListingData.length > 0 && (
        <View style={styles.infoContainer}>
          <View style={styles.infoSubContainer}>
            <View style={[styles.iconTextContainer, (isTablet || isMobile) && styles.iconTextContainerMobile]}>
              <Icon name={icons.circularFilledInfo} size={15} color={theme.colors.darkTint4} />
              <Typography variant="label" size="large" style={styles.infoText}>
                {infoText}
              </Typography>
            </View>
            <Icon name={icons.close} onPress={onCloseOfferInfo} />
          </View>
        </View>
      )}
      {offerType === OfferType.OFFER_RECEIVED && (
        <View style={[styles.filtersContainer, isMobile && styles.filtersContainerMobile]}>
          <OffersDropdown // TODO: Replace this with map function- Shagun
            filterData={offerFilters.countryDropdownData}
            defaultTitle={t('assetPortfolio:selectCountry')}
            onSelectFilter={onSelectFilter}
            offerType={OffersDropdownType.Country}
          />
          <OffersDropdown
            filterData={offerFilters.listingDropdownData}
            defaultTitle={t('offers:selectType')}
            onSelectFilter={onSelectFilter}
            offerType={OffersDropdownType.Listing}
          />
          <OffersDropdown
            filterData={offerFilters.assetsDropdownData}
            defaultTitle={t('offers:selectProperty')}
            onSelectFilter={onSelectFilter}
            offerType={OffersDropdownType.Assets}
          />
        </View>
      )}
      {offerType === OfferType.OFFER_MADE && (
        <View style={[styles.offerHeading, isMobile && styles.filtersContainerMobile]}>
          <Typography variant="text" size="small" fontWeight="semiBold" style={styles.heading}>
            {`${t('common:offers')} (${offerCountData.offerMade})`}
          </Typography>
          <View style={[styles.rowStyle, styles.heading]}>
            <OffersDropdown // TODO: Replace this with map function - Shagun
              filterData={offerMadeSortBy}
              defaultTitle={t('offers:sort')}
              onSelectFilter={onSelectFilter}
              offerType={OffersDropdownType.Sort}
            />
            <OffersDropdown
              filterData={offerFilters.filterDropdownData}
              defaultTitle={t('offers:filterBy')}
              onSelectFilter={onSelectFilter}
              offerType={OffersDropdownType.Filter}
            />
          </View>
        </View>
      )}
      {propertyListingData && propertyListingData.length > 0 ? (
        <>
          {propertyListingData.map((property: Asset, index: number) => {
            return (
              <View key={index} style={styles.marginTop}>
                {renderPropertyOffer(property, index)}
              </View>
            );
          })}
        </>
      ) : (
        <EmptyState title={title} containerStyle={styles.emptyView} />
      )}
    </View>
  );
};

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserAssetsCount } = UserSelector;
  return {
    assetCount: getUserAssetsCount(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentOfferPayload } = OfferActions;
  const { setFilter } = SearchActions;
  return bindActionCreators(
    {
      setCurrentOfferPayload,
      setFilter,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Offers);

const styles = StyleSheet.create({
  container: {
    width: '93%',
  },
  containerTab: {
    width: '100%',
  },
  containerIPadPro: {
    width: '91%',
  },
  infoContainer: {
    backgroundColor: theme.colors.white,
    top: 12,
    borderRadius: 4,
  },
  infoSubContainer: {
    marginHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    alignItems: 'center',
  },
  marginTop: { marginTop: 16 },
  infoText: { marginLeft: 8, color: theme.colors.darkTint4 },
  iconTextContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconTextContainerMobile: {
    width: '80%',
  },
  emptyView: {
    marginTop: 12,
    height: '60vh',
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filtersContainerMobile: {
    overflow: 'scroll',
    top: 10,
  },
  commingSoon: {
    marginTop: 24,
  },
  filtersMadeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowStyle: {
    flexDirection: 'row',
  },
  offerHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
