import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { acceptOffer } from '@homzhub/common/src/constants/ProspectProfile';
import {
  INegotiationPayload,
  ListingType,
  NegotiationAction,
  NegotiationType,
} from '@homzhub/common/src/domain/repositories/interfaces';

export interface IContinuePopupProps {
  title?: string;
  subTitle?: string;
  onClosePopover: () => void;
  handleOfferAction: (value: OfferAction) => void;
}

interface IOwner {
  text: string;
}

type Props = IContinuePopupProps;

const AcceptOfferPopOver: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { onClosePopover, handleOfferAction } = props;
  const listing = useSelector(OfferSelectors.getListingDetail);
  const offer: Offer | null = useSelector(OfferSelectors.getCurrentOffer);

  const handlePopupClose = (): void => {
    onClosePopover();
  };

  const info = acceptOffer.owner;
  const isLease = true;

  const handleClose = (): void => {
    handlePopupClose();
  };

  const handleAcceptOffer = async (): Promise<void> => {
    if (!listing || !offer) return;
    const { saleTerm, leaseTerm } = listing;
    const payload: INegotiationPayload = {
      param: {
        listingType: saleTerm ? ListingType.SALE_LISTING : ListingType.LEASE_LISTING,
        listingId: saleTerm ? saleTerm.id : leaseTerm?.id ?? 0,
        negotiationType: saleTerm ? NegotiationType.SALE_NEGOTIATIONS : NegotiationType.LEASE_NEGOTIATIONS,
        negotiationId: offer.id,
      },
      data: {
        action: NegotiationAction.ACCEPT,
        payload: {},
      },
    };
    try {
      await OffersRepository.updateNegotiation(payload);
      AlertHelper.success({ message: t('offers:offerAcceptedSuccess') });
      handleOfferAction(OfferAction.CREATE_LEASE);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      onClosePopover();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomSheetContainer}>
        <Text textType="semiBold" type="large">
          {t('common:congratulations')}
        </Text>
        <Text textType="regular" type="small" style={styles.marginVertical}>
          {t('offers:aboutToRent')}
        </Text>
        <View style={styles.icon}>
          <Icon name={icons.doubleCheck} size={60} color={theme.colors.completed} />
        </View>

        <Label type="large" textType="semiBold" style={styles.marginVertical}>
          {t('offers:keepInMind')}
        </Label>
        <View style={styles.textView}>
          {info.map((item: IOwner, index: number) => (
            <Label key={index} type="large" textType="regular" style={styles.text} textBreakStrategy="simple">
              {item.text}
            </Label>
          ))}
        </View>
      </View>
      <Button
        type="primary"
        title={isLease ? t('offers:acceptAndLease') : t('offers:acceptOffer')}
        containerStyle={[styles.button, styles.marginVertical]}
        onPress={handleAcceptOffer}
      />
      <Button
        type="text"
        title={t('common:cancel')}
        containerStyle={[styles.button]}
        textStyle={styles.textButton}
        onPress={handleClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 42,
  },

  container: {
    marginHorizontal: '5%',
    marginVertical: 30,
    height: 372,
  },
  header: {
    flexDirection: 'row-reverse',
  },

  image: {
    height: 120,
    width: 120,
  },
  acceptButton: {
    marginHorizontal: 16,
    flexDirection: 'row-reverse',
    backgroundColor: theme.colors.greenOpacity,
    marginVertical: 60,
  },
  acceptText: {
    marginHorizontal: 8,
    color: theme.colors.green,
  },
  text: {
    color: theme.colors.darkTint4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    textAlign: 'center',
  },
  bottomSheetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginVertical: {
    marginVertical: 16,
  },
  textView: {
    paddingHorizontal: 24,
  },
  button: {
    marginHorizontal: 16,
  },
  icon: {
    borderWidth: 10,
    borderRadius: 120 / 2,
    backgroundColor: theme.colors.greenOpacity,
    borderColor: theme.colors.greenOpacity,
  },
  textButton: {
    color: theme.colors.active,
  },
});
export default AcceptOfferPopOver;
