import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ScrollableDropdownList, {
  IDropdownData,
  ISelectedValue,
} from '@homzhub/common/src/components/molecules/ScrollableDropdownList';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { OfferFilter } from '@homzhub/common/src/domain/models/OfferFilter';
import {
  ICounterParam,
  INegotiationParam,
  ListingType,
  NegotiationType,
  OfferFilterType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { OfferSort, offerSortBy } from '@homzhub/common/src/constants/Offers';

interface IFilters {
  filter_by: string;
  sort_by: string;
}

interface IProps {
  onPressAction: (action: OfferAction) => void;
  onCreateLease: () => void;
  onSelectOffer?: (id: number) => void;
  onPressMessages: () => void;
  selectedOffers?: number[];
  isDetailView?: boolean;
}

const initialObj = {
  filter_by: '',
  sort_by: OfferSort.NEWEST,
};

const OfferView = (props: IProps): React.ReactElement => {
  const { onPressAction, isDetailView = false, onCreateLease, onSelectOffer, selectedOffers, onPressMessages } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);
  const negotiations = useSelector(OfferSelectors.getNegotiations);
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const offerPayload = useSelector(OfferSelectors.getOfferPayload);
  const compareData = useSelector(OfferSelectors.getOfferCompareData);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [pastOffers, setPastOffers] = useState<Offer[]>([]);
  const [offerFilter, setOfferFilter] = useState<OfferFilter>();
  const [filters, setFilters] = useState<IFilters>({ filter_by: '', sort_by: OfferSort.NEWEST });

  useFocusEffect(
    useCallback(() => {
      getData();
      getFilters().then();
      return (): void => {
        setFilters({ filter_by: '', sort_by: OfferSort.NEWEST });
      };
    }, [])
  );

  useEffect(() => {
    setOffers(OfferUtils.getSortedOffer(filters.sort_by, negotiations));
  }, [negotiations]);

  const getData = (filter_by?: string): void => {
    if (offerPayload) {
      const payload: INegotiationParam = {
        listingType: offerPayload.type,
        listingId: offerPayload.listingId,
        negotiationType:
          offerPayload.type === ListingType.LEASE_LISTING
            ? NegotiationType.LEASE_NEGOTIATIONS
            : NegotiationType.SALE_NEGOTIATIONS,
      };

      dispatch(OfferActions.getNegotiations({ param: payload, filter_by }));
    }
  };

  const getFilters = async (): Promise<void> => {
    try {
      const detailFilter = await OffersRepository.getOfferFilters(OfferFilterType.DETAIL);
      setOfferFilter(detailFilter);
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  const onSelectFromDropdown = (selectedValues: (ISelectedValue | undefined)[]): void => {
    const filtersObj = initialObj;

    selectedValues.forEach((selectedValue: ISelectedValue | undefined) => {
      if (!selectedValue) {
        return;
      }
      const { key, value } = selectedValue;
      // @ts-ignore
      filtersObj[key] = value;
    });
    getData(filtersObj.filter_by);
    setFilters(filtersObj);
  };

  const handlePastOffer = async (payload: ICounterParam): Promise<void> => {
    try {
      const response = await OffersRepository.getCounterOffer(payload);
      setPastOffers(response);
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  const handleAction = (action: OfferAction, offer: Offer): void => {
    dispatch(OfferActions.setCurrentOffer(offer));
    onPressAction(action);
  };

  const handleLeaseCreation = (offer: Offer): void => {
    dispatch(OfferActions.setCurrentOffer(offer));
    onCreateLease();
  };

  const getDropdownData = (): IDropdownData[] => {
    if (!offerFilter) return [];
    return [
      {
        dropdownData: offerSortBy,
        key: 'sort_by',
        selectedValue: filters?.sort_by ?? '',
        placeholder: t('sort'),
      },
      {
        dropdownData: offerFilter.filterDropdownData,
        key: 'filter_by',
        selectedValue: filters?.filter_by ?? '',
        placeholder: t('filterBy'),
      },
    ];
  };

  return (
    <>
      <ScrollableDropdownList
        isScrollable={false}
        dropDownTitle={!isDetailView ? `${offers.length} Offers` : 'Offers'}
        dropDownTitleType={!isDetailView ? 'large' : 'regular'}
        dropDownFieldType={!isDetailView ? 'label' : 'text'}
        isOutlineView={!isDetailView}
        data={getDropdownData()}
        onDropdown={onSelectFromDropdown}
        mainContainerStyle={[styles.dropDownContainer, !isDetailView && styles.dropDownView]}
        containerStyle={styles.filterStyle}
        dropDownTitleStyle={styles.titleStyle}
      />
      {offers.length > 0 && listingDetail ? (
        offers.map((offer, index) => {
          const { saleTerm, leaseTerm } = listingDetail;
          const onPressMessageIcon = (): void => {
            dispatch(
              OfferActions.setCurrentOfferPayload({
                type: leaseTerm ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
                listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
                threadId: offer.threadId,
              })
            );
            onPressMessages();
          };
          return (
            <OfferCard
              key={index}
              offer={offer}
              pastOffer={pastOffers}
              onPressAction={(action): void => handleAction(action, offer)}
              compareData={compareData}
              asset={listingDetail}
              isDetailView
              onCreateLease={(): void => handleLeaseCreation(offer)}
              onMoreInfo={handlePastOffer}
              onPressMessages={onPressMessageIcon}
              onSelectOffer={onSelectOffer}
              selectedOffers={selectedOffers}
            />
          );
        })
      ) : (
        <EmptyState title={t('noOfferFound')} />
      )}
    </>
  );
};

export default OfferView;

const styles = StyleSheet.create({
  dropDownContainer: {
    paddingVertical: 20,
  },
  dropDownView: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
  },
  filterStyle: {
    width: 130,
  },
  titleStyle: {
    color: theme.colors.darkTint6,
  },
});
