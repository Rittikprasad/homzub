import React, { FC, useState, createRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import ConfirmationPopup from '@homzhub/web/src/components/molecules/ConfirmationPopup';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import ChatScreenPopover from '@homzhub/web/src/components/organisms/ChatScreenPopover';
import TenancyFormPopover from '@homzhub/web/src/screens/propertyDetails/components/TenancyFormPopover';
import { OffersCard } from '@homzhub/web/src/screens/offers/components/OffersCard';
import OfferActionsPopover from '@homzhub/web/src/screens/offers/components/OfferActionsPopover';
import PropertyOfferDetails from '@homzhub/web/src/screens/offers/components/PropertyOfferDetails';
import { renderPopUpTypes as tenancyPopupTypes } from '@homzhub/web/src/screens/propertyDetails/components/PropertyCardDetails';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';
import { ICounterParam, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  property: Asset;
  onPressMessages: () => void;
  handleClose: () => void;
  refreshOffersData: () => void;
}
const OffersMade: FC<IProps> = (props: IProps) => {
  const {
    property,
    property: { leaseNegotiation, saleNegotiation, leaseTerm, saleTerm },
    handleClose,
    refreshOffersData,
  } = props;
  const { t } = useTranslation();
  const offer = leaseNegotiation || saleNegotiation;
  const dispatch = useDispatch();
  const [pastOffers, setPastOffers] = useState<Offer[]>([]);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const popupRef = createRef<PopupActions>();
  const popupRefCounter = createRef<PopupActions>();
  const [offerActionType, setOfferActionType] = useState<OfferAction | null>(null);
  const [currentOffer, setCurrentOffer] = useState<Offer>(new Offer());
  const userData = useSelector(UserSelector.getUserProfile);
  const [propertyLeaseType, setPropertyLeaseType] = useState<string>(tenancyPopupTypes.tenancy);

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

  const changePopUpStatus = (tenancyPopoverType: string): void => {
    setPropertyLeaseType(tenancyPopoverType);
  };

  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
      handleClose();
    }
  };

  const compareData = (): IOfferCompare => {
    if (leaseTerm) {
      return {
        rent: leaseTerm.expectedPrice,
        deposit: leaseTerm.securityDeposit,
        incrementPercentage: Number(leaseTerm.annualRentIncrementPercentage),
      };
    }
    return {
      price: saleTerm ? Number(saleTerm.expectedPrice) : 0,
      bookingAmount: saleTerm ? Number(saleTerm.expectedBookingAmount) : 0,
    };
  };
  const handlePastOffer = async (payload: ICounterParam): Promise<void> => {
    try {
      const response = await OffersRepository.getCounterOffer(payload);
      setPastOffers(response);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };
  const onViewReasonWeb = (action: OfferAction, offers: Offer): void => {
    setCurrentOffer(offers);
    setOfferActionType(action);
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onPressAction = (action: OfferAction, offers: Offer): void => {
    dispatch(OfferActions.setCurrentOffer(offers));
    dispatch(OfferActions.getListingDetailSuccess(property));
    setOfferActionType(action);
    if (action === OfferAction.COUNTER) {
      if (popupRefCounter && popupRefCounter.current) {
        popupRefCounter.current.open();
      }
    } else if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  const onPressMessageIcon = (): void => {
    if (offer) {
      dispatch(
        OfferActions.setCurrentOfferPayload({
          type: leaseTerm ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
          listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
          threadId: offer.threadId,
        })
      );
    }
    onOpenChatModal();
  };

  const handleOfferAction = (value: OfferAction): void => {
    setOfferActionType(value);
  };

  const popupDetails = {
    title: t('offers:offerSucessHeader'),
    subTitle: t('offers:offerSucessSubHeader'),
  };

  const onCreateLease = (argOffer: Offer): void => {
    setCurrentOffer(argOffer);
    setOfferActionType(OfferAction.CREATE_LEASE);
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  const popupRefChatScreen = React.useRef<PopupActions>(null);

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
      <View style={styles.background}>
        <PropertyOfferDetails property={property} isExpanded containerStyles={styles.innerContainer} />
      </View>

      {!isMobile && offer && (
        <OffersCard
          offer={offer}
          compareData={compareData}
          asset={property}
          isDetailView
          onPressMessages={onPressMessageIcon}
          isOfferDashboard
          pastOffer={pastOffers}
          onMoreInfo={handlePastOffer}
          onPressAction={(action: OfferAction): void => onPressAction(action, offer)}
          onViewReasonWeb={(action: OfferAction): void => onViewReasonWeb(action, offer)}
          onCreateLease={(): void => onCreateLease(offer)}
        />
      )}
      {isMobile && offer && (
        <OfferCard
          offer={offer}
          compareData={compareData()}
          asset={property}
          isDetailView
          onPressMessages={onPressMessageIcon}
          isOfferDashboard
          pastOffer={pastOffers}
          onMoreInfo={handlePastOffer}
          onPressAction={(action: OfferAction): void => onPressAction(action, offer)}
          onViewReasonWeb={(action: OfferAction): void => onViewReasonWeb(action, offer)}
          onCreateLease={(): void => onCreateLease(offer)}
        />
      )}
      <TenancyFormPopover
        userData={userData}
        propertyLeaseType={propertyLeaseType}
        popupRef={popupRefCounter}
        changePopUpStatus={changePopUpStatus}
        asset={property}
      />
      {propertyLeaseType === tenancyPopupTypes.confirm && (
        <ConfirmationPopup {...popupDetails} refreshPage={refreshOffersData} />
      )}
      <OfferActionsPopover
        offerActionType={offerActionType}
        popupRef={popupRef}
        offer={currentOffer}
        asset={property}
        compareData={compareData()}
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
export default OffersMade;
const styles = StyleSheet.create({
  innerContainer: {
    top: 12,
    left: 12,
    paddingBottom: 12,
    width: '93%',
  },
  heading: {
    marginTop: 25,
    marginBottom: 20,
  },
  background: {
    backgroundColor: theme.colors.white,
    marginBottom: 24,
  },
});
