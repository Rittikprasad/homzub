import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { OfferHelper } from '@homzhub/mobile/src/utils/OfferHelper';
import { ListingRepository } from '@homzhub/common/src/domain/repositories/ListingRepository';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';
import { ICounterParam, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  propertyOffer: Asset;
  onViewOffer: () => void;
  onPressMessages: () => void;
}

const OfferMade = (props: IProps): React.ReactElement => {
  const {
    propertyOffer,
    propertyOffer: { leaseNegotiation, saleNegotiation, leaseTerm, saleTerm },
    onViewOffer,
    onPressMessages,
  } = props;
  const offer = leaseNegotiation || saleNegotiation;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [pastOffers, setPastOffers] = useState<Offer[]>([]);

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

  const handleActions = (action: OfferAction): void => {
    if (offer) {
      const payload = {
        type: propertyOffer.leaseTerm ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
        listingId: propertyOffer.leaseTerm ? propertyOffer.leaseTerm.id : propertyOffer.saleTerm?.id ?? 0,
      };
      dispatch(OfferActions.getListingDetailSuccess(propertyOffer));
      dispatch(OfferActions.setCurrentOfferPayload(payload));
      dispatch(OfferActions.setCurrentOffer(offer));
    }
    OfferHelper.handleOfferActions(action);
  };

  // TODO: (Shikha) - confirm logic with BE
  const handlePropertyView = async (): Promise<void> => {
    try {
      const payload = {
        listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
        listingType: leaseTerm ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
      };
      const response = await ListingRepository.getListing(payload);
      if (response) {
        onViewOffer();
      }
    } catch (e) {
      AlertHelper.error({ message: t('property:listingNotValid'), statusCode: e.details.statusCode });
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
      onPressMessages();
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePropertyView}>
        <PropertyCard asset={propertyOffer} isExpanded containerStyle={styles.cardContainer} />
      </TouchableOpacity>
      {offer && (
        <OfferCard
          offer={offer}
          containerStyle={styles.offerCard}
          compareData={compareData()}
          onPressAction={handleActions}
          asset={propertyOffer}
          isDetailView
          isOfferDashboard
          pastOffer={pastOffers}
          onMoreInfo={handlePastOffer}
          onPressMessages={onPressMessageIcon}
        />
      )}
      <Divider containerStyles={styles.divider} />
    </View>
  );
};

export default OfferMade;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  cardContainer: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  offerCard: {
    marginTop: 16,
  },
  divider: {
    borderColor: theme.colors.darkTint9,
  },
});
