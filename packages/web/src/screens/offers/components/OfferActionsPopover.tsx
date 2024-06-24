import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import AcceptOffer from '@homzhub/web/src/screens/offers/components/AcceptOffer';
import AcceptOfferPopOver from '@homzhub/web/src/screens/offers/components/AcceptOfferPopOver';
import CreateLeasePopover from '@homzhub/web/src/screens/offers/components/CreateLeasePopover';
import RejectOfferForm from '@homzhub/common/src/components/organisms/RejectOfferForm';
import OfferReasonView from '@homzhub/web/src/screens/offers/components/OfferReasonView';
import WithdrawOffer from '@homzhub/web/src/screens/offers/components/WithdrawOffer';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';

interface IProps {
  popupRef: React.RefObject<PopupActions>;
  offerActionType: OfferAction | null;
  handleOfferAction: (value: OfferAction) => void;
  onCloseModal: () => void;
  offer?: Offer;
  asset?: Asset;
  compareData?: IOfferCompare;
}

const OfferActionsPopover: React.FC<IProps> = (props: IProps) => {
  const { popupRef, offerActionType, offer, compareData = {}, handleOfferAction, onCloseModal, asset } = props;
  const renderActionsPopover = (): React.ReactNode | null => {
    switch (offerActionType) {
      case OfferAction.ACCEPT:
        return <AcceptOffer handleOfferAction={handleOfferAction} compareData={compareData} />;
      case OfferAction.REJECT:
        return <RejectOfferForm onClosePopover={onCloseModal} />;
      case OfferAction.REASON:
        return <OfferReasonView offer={offer} />;
      case OfferAction.CANCEL:
        return <WithdrawOffer onClosePopover={onCloseModal} />;
      case OfferAction.CONFIRMARION:
        return <AcceptOfferPopOver onClosePopover={onCloseModal} handleOfferAction={handleOfferAction} />;
      case OfferAction.CREATE_LEASE:
        return <CreateLeasePopover assetDetail={asset} onClosePopover={onCloseModal} offer={offer as Offer} />;
      default:
        return null;
    }
  };
  const isDesktop = useOnly(deviceBreakpoint.DESKTOP);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();

  const offerPopoverTypes = {
    [OfferAction.REJECT.toString()]: {
      title: t('offers:rejectOffer'),
      styles: {
        height: '620px',
      },
    },
    [OfferAction.REASON.toString()]: {
      title: t('offers:rejectionReason'),
      styles: {
        height: '425px',
      },
    },
    [OfferAction.CANCEL.toString()]: {
      title: t('offers:cancelOffer'),
      styles: {
        height: '620px',
      },
    },
    [OfferAction.ACCEPT.toString()]: {
      title: t('offers:acceptOffer'),
      styles: {
        height: '620px',
      },
    },
    [OfferAction.CONFIRMARION.toString()]: {
      title: '',
      styles: {
        height: '620px',
      },
    },
    [OfferAction.CREATE_LEASE.toString()]: {
      title: '',
      styles: {
        width: isDesktop ? '55%' : isTablet ? 400 : 320,
        height: '620px',
      },
    },
  };
  const offerPopoverType = offerActionType && offerPopoverTypes[offerActionType?.toString()];
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {offerPopoverType?.title}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint7}
            onPress={onCloseModal}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.verticalStyle} />
        {renderActionsPopover()}
      </View>
    );
  };

  return (
    <Popover
      content={renderPopoverContent}
      popupProps={{
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
          borderRadius: 8,
          overflow: 'auto',
          ...offerPopoverType?.styles,
        },
        children: undefined,
        modal: true,
        position: 'center center',
        onClose: onCloseModal,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default OfferActionsPopover;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  verticalStyle: {
    marginVertical: 20,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: 12,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
});
