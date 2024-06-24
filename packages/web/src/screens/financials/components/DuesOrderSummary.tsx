import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ServiceOrderSummary from '@homzhub/common/src/components/organisms/ServiceOrderSummary';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  popupRef: React.RefObject<PopupActions>;
  onCloseModal: () => void;
}

const DuesOrderSummary: React.FC<IProps> = (props: IProps) => {
  const { popupRef, onCloseModal } = props;
  const { t } = useTranslation();
  const currentDueId = useSelector(FinancialSelectors.getCurrentDueId);
  const { dueOrderSummary: dueOrderLoading } = useSelector(FinancialSelectors.getFinancialLoaders);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const onSuccess = (): void => {
    onCloseModal(); // Close Modal
  };

  const renderPopoverContent = (): React.ReactElement => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
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
        <View style={styles.modalContent}>
          <Loader visible={dueOrderLoading} />
          <ServiceOrderSummary isLabelRequired invoiceId={currentDueId} onSuccess={onSuccess} />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.screenContentContainer}>
      <Popover
        content={renderPopoverContent}
        popupProps={{
          closeOnDocumentClick: false,
          arrow: false,
          contentStyle: {
            maxHeight: '100%',
            width: isMobile ? 320 : 400,
            borderRadius: 8,
            overflow: 'auto',
            height: 600,
          },
          children: undefined,
          modal: true,
          position: 'center center',
          onClose: onCloseModal,
        }}
        forwardedRef={popupRef}
      />
    </View>
  );
};

export default DuesOrderSummary;

const styles = StyleSheet.create({
  screenContentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    backgroundColor: theme.colors.white,
  },
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
