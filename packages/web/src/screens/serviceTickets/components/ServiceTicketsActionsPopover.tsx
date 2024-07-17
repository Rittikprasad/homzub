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
import AddServiceTicket from '@homzhub/web/src/screens/serviceTickets/components/AddServiceTicket';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export enum ServiceTicketAction {
  ADD_REQUEST = 'ADD_REQUEST',
}

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  serviceTicketActionType: ServiceTicketAction | null;
  onCloseModal: () => void;
  handleServiceTicketsAction?: (value: ServiceTicketAction) => void;
}

const ServiceTicketsActionsPopover: React.FC<IProps> = (props: IProps) => {
  const { serviceTicketActionType, popupRef, onCloseModal } = props;

  const renderActionsPopover = (): React.ReactNode | null => {
    switch (serviceTicketActionType) {
      case ServiceTicketAction.ADD_REQUEST:
        return <AddServiceTicket onCloseModal={onCloseModal} />;
      default:
        return null;
    }
  };
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();

  const serviceTicketsPopoverTypes = {
    [ServiceTicketAction.ADD_REQUEST.toString()]: {
      title: t('serviceTickets:newTicket'),
      styles: {
        height: '620px',
      },
    },
  };
  const ServiceTicketsPopoverType =
    serviceTicketActionType && serviceTicketsPopoverTypes[serviceTicketActionType?.toString()];
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {ServiceTicketsPopoverType?.title}
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
        <View style={styles.modalContent}>{renderActionsPopover()}</View>
      </View>
    );
  };
  return (
    <Popover
      content={renderPopoverContent()}
      popupProps={{
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
          borderRadius: 8,
          overflow: 'auto',
          ...ServiceTicketsPopoverType?.styles,
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

export default ServiceTicketsActionsPopover;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    padding: 24,
  },
  verticalStyle: {
    marginTop: 20,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: 12,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
});
