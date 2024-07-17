import React, { createRef, useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import AddBankAccountForm from '@homzhub/common/src/components/organisms/AddBankAccountForm';
import BankVerificationPopover from '@homzhub/web/src/components/organisms/BankVerificationPopover';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export enum BankAccoutAction {
  BANK_ACCOUNT_FORM = 'BANK_ACCOUNT_FORM',
  RESCHEDULE_VISIT = 'RESCHEDULE_VISIT',
}

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  onCloseModal: () => void;
  onOpenModal?: () => void;
  isOpen?: boolean;
  children?: React.ReactElement;
  onSuccessCallback?: (message?: string) => void;
  title?: string;
  contentStyle?: StyleProp<ViewStyle>;
  isEdit?: boolean;
  id?: number;
}

const AddBankAccountPopover: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const userProfile = useSelector(UserSelector.getUserProfile);
  const [isLoading, setLoading] = useState(false);
  const [flags, setFlagValues] = useState({
    showConfirmationSheet: false,
    isCheckboxSelected: false,
    isConfirmed: false,
  });
  const dispatch = useDispatch();
  const { id: props_id, isEdit, onCloseModal, popupRef } = props;
  const userId = props_id && props_id > 0 ? props_id : userProfile?.id ?? 0;
  const { showConfirmationSheet } = flags;
  useEffect(() => {
    if (showConfirmationSheet) {
      onOpenVerificationModal();
    } else {
      onCloseVerificationModal();
    }
  }, [showConfirmationSheet]);

  useEffect(() => {
    return (): void => {
      dispatch(CommonActions.clearIfscDetail());
    };
  }, []);

  const handleConfirmationSheet = (value: boolean): void => {
    setFlagValues({ ...flags, showConfirmationSheet: value });
    if (!value) {
      setFlagValues({ ...flags, isCheckboxSelected: false });
    }
  };

  const handleCheckBox = (): void => {
    setFlagValues({ ...flags, isCheckboxSelected: !flags.isCheckboxSelected });
  };

  const onProceed = (): void => {
    setFlagValues({ ...flags, isConfirmed: true, showConfirmationSheet: false });
  };

  const handleError = (isConfirm: boolean): void => {
    setFlagValues({ ...flags, isConfirmed: isConfirm, isCheckboxSelected: false });
  };
  const popupVerificationRef = createRef<PopupActions>();
  const onOpenVerificationModal = (): void => {
    if (popupVerificationRef && popupVerificationRef.current) {
      popupVerificationRef.current.open();
    }
  };
  const onCloseVerificationModal = (): void => {
    if (popupVerificationRef && popupVerificationRef.current) {
      popupVerificationRef.current.close();
    }
  };
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography size="small" variant="text" fontWeight="bold">
            {isEdit ? t('assetFinancial:editDetails') : t('assetFinancial:addBankAccount')}
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
          <Loader visible={isLoading} />
          <AddBankAccountForm
            isEditFlow={Boolean(isEdit)}
            onSubmit={onCloseModal} // Success Callback
            userId={userId}
            setLoading={setLoading}
            handleConfirmation={(): void => handleConfirmationSheet(true)}
            isConfirmed={flags.isConfirmed}
            onError={handleError}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
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
          },
          children: undefined,
          modal: true,
          position: 'center center',
          onClose: onCloseModal,
        }}
        forwardedRef={popupRef}
      />
      <BankVerificationPopover
        popupRef={popupVerificationRef}
        onCloseModal={(): void => handleConfirmationSheet(false)}
        isOpen={flags.showConfirmationSheet}
        isCheckboxSelected={flags.isCheckboxSelected}
        handleCheckBox={handleCheckBox}
        onProceed={onProceed}
      />
    </View>
  );
};

export default AddBankAccountPopover;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
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
  containerContent: {},
});
