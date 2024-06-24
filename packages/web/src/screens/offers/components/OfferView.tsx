import React, { FC, useEffect, useState, createRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ConfirmationPopup from '@homzhub/web/src/components/molecules/ConfirmationPopup';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import ChatScreenPopover from '@homzhub/web/src/components/organisms/ChatScreenPopover';
import TenancyFormPopover from '@homzhub/web/src/screens/propertyDetails/components/TenancyFormPopover';
import { OffersCard } from '@homzhub/web/src/screens/offers/components/OffersCard';
import OfferActionsPopover from '@homzhub/web/src/screens/offers/components/OfferActionsPopover';
import { renderPopUpTypes as tenancyPopupTypes } from '@homzhub/web/src/screens/propertyDetails/components/PropertyCardDetails';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { OfferSort } from '@homzhub/common/src/constants/Offers';
import {
  ICounterParam,
  INegotiationParam,
  ListingType,
  NegotiationType,
} from '@homzhub/common/src/domain/repositories/interfaces';

interface IFilters {
  filter_by: string;
  sort_by: string;
}

interface IProps {
  selectedFilters?: IFilters;
}
const OfferView: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);
  const negotiations = useSelector(OfferSelectors.getNegotiations);
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const offerPayload = useSelector(OfferSelectors.getOfferPayload);
  const [currentOffer, setCurrentOffer] = useState<Offer>(new Offer());
  const compareData = useSelector(OfferSelectors.getOfferCompareData);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offerActionType, setOfferActionType] = useState<OfferAction | null>(null);
  const popupRef = createRef<PopupActions>();
  const popupRefCounter = createRef<PopupActions>();
  const [pastOffers, setPastOffers] = useState<Offer[]>([]);
  const { selectedFilters = { filter_by: '', sort_by: OfferSort.NEWEST } } = props;
  const [close, setClose] = useState(false);
  const userData = useSelector(UserSelector.getUserProfile);
  const [propertyLeaseType, setPropertyLeaseType] = useState<string>(tenancyPopupTypes.tenancy);

  useEffect(() => {
    getData(selectedFilters?.filter_by);
  }, [selectedFilters, close]);

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

  useEffect(() => {
    setOffers(OfferUtils.getSortedOffer(selectedFilters.sort_by, negotiations));
  }, [negotiations]);

  const getProspectProfile = async (): Promise<void> => {
    try {
      const prospectsData = await OffersRepository.getProspectsInfo();
      if (prospectsData.id) {
        setPropertyLeaseType(tenancyPopupTypes.offer);
      }
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  useEffect(() => {
    getProspectProfile();
  }, []);

  if (!(offers.length > 0 && listingDetail)) {
    return <EmptyState title={t('noOfferFound')} />;
  }

  const { saleTerm, leaseTerm } = listingDetail;

  const onViewReasonWeb = (action: OfferAction, offer: Offer): void => {
    setCurrentOffer(offer);
    setOfferActionType(action);
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  const onPressAction = (action: OfferAction, offer: Offer): void => {
    dispatch(OfferActions.setCurrentOffer(offer));
    setOfferActionType(action);
    if (action === OfferAction.COUNTER) {
      if (popupRefCounter && popupRefCounter.current) {
        popupRefCounter.current.open();
      }
    } else if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  const onPressMessageIcon = (threadId: string): void => {
    dispatch(
      OfferActions.setCurrentOfferPayload({
        type: leaseTerm ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
        listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
        threadId,
      })
    );
    onOpenChatModal();
  };
  const handleOfferAction = (value: OfferAction): void => {
    setOfferActionType(value);
  };

  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      setClose(!close);
      popupRef.current.close();
    }
  };

  const handlePastOffer = async (payload: ICounterParam): Promise<void> => {
    try {
      const response = await OffersRepository.getCounterOffer(payload);
      setPastOffers(response);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };
  const changePopUpStatus = (tenancyPopoverType: string): void => {
    setPropertyLeaseType(tenancyPopoverType);
  };

  const popupDetails = {
    title: t('offers:offerSucessHeader'),
    subTitle: t('offers:offerSucessSubHeader'),
  };

  const refreshOffersData = (): void => {
    setPropertyLeaseType(tenancyPopupTypes.tenancy);
    getData();
  };

  const onCreateLease = (offer: Offer): void => {
    setCurrentOffer(offer);
    setOfferActionType(OfferAction.CREATE_LEASE);
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  const popupRefChatScreen = createRef<PopupActions>();

  const onOpenChatModal = (): void => {
    if (popupRefChatScreen.current && popupRefChatScreen.current.open) {
      popupRefChatScreen.current.open();
    }
  };

  const onCloseChatModal = (): void => {
    if (popupRefChatScreen.current && popupRefChatScreen.current.close) {
      popupRefChatScreen.current.close();
    }
  };

  return (
    <View>
      {!isMobile &&
        offers.length &&
        Object.values(listingDetail).length &&
        offers.map((offer, index) => (
          <OffersCard
            key={index}
            offer={offer}
            compareData={compareData}
            asset={listingDetail}
            isDetailView
            onPressMessages={(): void => onPressMessageIcon(offer.threadId)}
            onPressAction={(action: OfferAction): void => onPressAction(action, offer)}
            onViewReasonWeb={(action: OfferAction): void => onViewReasonWeb(action, offer)}
            onCreateLease={(): void => onCreateLease(offer)}
            pastOffer={pastOffers}
            onMoreInfo={handlePastOffer}
          />
        ))}
      {isMobile &&
        offers.map((offer, index) => (
          <OfferCard
            key={index}
            offer={offer}
            compareData={compareData}
            asset={listingDetail}
            isDetailView
            onPressMessages={(): void => onPressMessageIcon(offer.threadId)}
            onPressAction={(action: OfferAction): void => onPressAction(action, offer)}
            onViewReasonWeb={(action: OfferAction): void => onViewReasonWeb(action, offer)}
            onCreateLease={(): void => onCreateLease(offer)}
            pastOffer={pastOffers}
            onMoreInfo={handlePastOffer}
          />
        ))}
      <TenancyFormPopover
        userData={userData}
        propertyLeaseType={propertyLeaseType}
        popupRef={popupRefCounter}
        changePopUpStatus={changePopUpStatus}
        asset={listingDetail}
      />
      {propertyLeaseType === tenancyPopupTypes.confirm && (
        <ConfirmationPopup {...popupDetails} refreshPage={refreshOffersData} />
      )}
      <OfferActionsPopover
        offerActionType={offerActionType}
        popupRef={popupRef}
        offer={currentOffer}
        compareData={compareData}
        asset={listingDetail}
        handleOfferAction={handleOfferAction}
        onCloseModal={onCloseModal}
      />
      <ChatScreenPopover
        isFromOffers
        popupRef={popupRefChatScreen}
        onOpenModal={onOpenChatModal}
        onCloseModal={onCloseChatModal}
      />
    </View>
  );
};
export default OfferView;
