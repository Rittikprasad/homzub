import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PropertyPayment } from '@homzhub/common/src/components/organisms/PropertyPayment';
import { ISelectedValueServices } from '@homzhub/common/src/domain/models/ValueAddedService';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  onOpenModal: () => void;
  onCloseModal: () => void;
  isOpen?: boolean;
  children?: React.ReactElement;
  onSuccessCallback?: (message?: string) => void;
  contentStyle?: StyleProp<ViewStyle>;
  propertyId?: number;
}

const OrderSummaryPopover: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { navigate } = NavigationService;
  const { t } = useTranslation();
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const valueAddedServices = useSelector(RecordAssetSelectors.getValueAddedServices);
  const { popupRef, onCloseModal, contentStyle, onOpenModal, isOpen, propertyId } = props;
  const setValueAddedServices = (payload: ISelectedValueServices): void => {
    dispatch(RecordAssetActions.setValueAddedServices(payload));
  };

  const goBackToService = (): void => {
    navigate(history, { path: RouteNames.protectedRoutes.SELECT_SERVICES });
  };

  const onSuccessFullPayment = (): void => {
    onCloseModal();
    setTimeout(() => {
      navigate(history, { path: RouteNames.protectedRoutes.VALUE_ADDED_SERVICES });
    });
  };

  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography size="regular" variant="text" fontWeight="semiBold">
            {t('property:orderSummary')}
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
        <View style={[!propertyId && styles.modalContent]}>
          <PropertyPayment
            goBackToService={goBackToService}
            propertyId={propertyId}
            valueAddedServices={valueAddedServices}
            setValueAddedServices={setValueAddedServices}
            handleNextStep={onSuccessFullPayment}
            containerStyle={styles.containerStyle}
          />
        </View>
      </View>
    );
  };
  return (
    <Popover
      content={renderPopoverContent}
      popupProps={{
        open: isOpen,
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
          borderRadius: 8,
          overflow: 'auto',
          height: 600,
          ...{ contentStyle },
        },
        children: undefined,
        modal: true,
        position: 'center center',
        onOpen: onOpenModal,
        onClose: onCloseModal,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default OrderSummaryPopover;

const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
