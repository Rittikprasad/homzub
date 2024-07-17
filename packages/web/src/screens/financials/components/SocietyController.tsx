import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import Menu, { IMenu } from '@homzhub/common/src/components/molecules/Menu';
import ReminderSheet from '@homzhub/common/src/components/molecules/ReminderSheet';
import AddSocietyBank from '@homzhub/common/src/components/organisms/Society/AddSocietyBank';
import AddSocietyForm from '@homzhub/common/src/components/organisms/Society/AddSocietyForm';
import SocietyList from '@homzhub/common/src/components/organisms/Society/SocietyList';
import SocietyPayment from '@homzhub/common/src/components/organisms/Society/SocietyPayment';
import BankVerificationPopover from '@homzhub/web/src/components/organisms/BankVerificationPopover';
import { FinancialsActions } from '@homzhub/web/src/screens/financials/FinancialsPopover';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { menu, MenuEnum } from '@homzhub/common/src/constants/Society';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

enum SocietyActions {
  ReminderPopup = 'Reminder Sheet',
  InfoSheet = 'Info Sheet',
}

interface IProps {
  setFinancialsActionType: React.Dispatch<React.SetStateAction<FinancialsActions | null>>;
  isFromReminder?: boolean;
}

const SocietyController: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { setFinancialsActionType, isFromReminder } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertyPayment);
  const { getSocieties, society, societyCharges, userInvoice } = useSelector(
    PropertyPaymentSelector.getPropertyPaymentLoaders
  );
  const { payment } = useSelector(FinancialSelectors.getFinancialLoaders);
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSocietyId, setCurrentSocietyId] = useState(0);
  const [isEmptyList, toggleList] = useState(false);
  const [flags, setFlagValues] = useState({
    isAddSociety: false,
    isCheckboxSelected: false,
    isDeleteSociety: false,
    isTermsAccepted: false,
    isEditSociety: false,
    showConfirmationSheet: false,
    showReminderSheet: false,
    infoSheet: false,
  });

  const { showConfirmationSheet, showReminderSheet, infoSheet } = flags;

  useEffect(() => {
    if (asset.project) {
      dispatch(PropertyPaymentActions.getSocieties({ project_id: asset.project.id }));
    }
  }, []);

  // HANDLERS START

  const handleBackPress = (): void => {
    if (currentStep === 0 && flags.isAddSociety) {
      updateReduxState();
      setFlagValues({ ...flags, isAddSociety: false, isEditSociety: false });
    } else if (currentStep === 2 && !flags.isAddSociety) {
      // Skip 2nd step in case of existing societies
      setCurrentStep(currentStep - 2);
      dispatch(PropertyPaymentActions.clearPaymentData());
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      dispatch(PropertyPaymentActions.getSocietiesSuccess([]));
      updateReduxState();
      setFinancialsActionType(FinancialsActions.PropertyPayment_PropertyServices); // GO BACK
    }
  };

  const onProceed = (): void => {
    if (currentStep === 1) {
      setFlagValues({ ...flags, isTermsAccepted: true });
    } else {
      dispatch(
        PropertyPaymentActions.addAssetSociety({
          societyId: currentSocietyId,
          body: { asset: asset.id, is_terms_accepted: true },
        })
      );
      onProceedCallback();
    }
    onCloseVerificationModal();
  };

  const onProceedCallback = (): void => {
    // @ts-ignore
    if (isFromReminder) {
      // isFromReminder
      dispatch(PropertyPaymentActions.getSocietiesSuccess([]));
      dispatch(FinancialActions.getReminderAssets());
      updateReduxState();
      onCloseSocietyModal(); // GO BACK
    } else if (flags.isEditSociety) {
      setCurrentStep(0);
    } else {
      // Skip 2nd step in case of existing societies
      setCurrentStep(currentStep < 1 ? currentStep + 2 : currentStep + 1);
      onUpdateState();
    }
  };

  const onUpdateState = (): void => {
    setFlagValues({
      ...flags,
      showConfirmationSheet: false,
      isTermsAccepted: false,
      isCheckboxSelected: false,
      ...(flags.isEditSociety && { isAddSociety: false }),
    });
  };

  const updateReduxState = (): void => {
    dispatch(PropertyPaymentActions.clearSocietyFormData());
    dispatch(PropertyPaymentActions.clearSocietyDetail());
  };

  const onUpdateSociety = (value: boolean): void => {
    toggleList(value);
  };

  useEffect(() => {
    if (showReminderSheet || infoSheet) {
      onOpenSocietyModal();
      return;
    }
    onCloseSocietyModal();
  }, [showReminderSheet, infoSheet]);

  useEffect(() => {
    if (showConfirmationSheet) {
      onOpenVerificationModal();
      return;
    }
    onCloseVerificationModal();
  }, [showConfirmationSheet]);

  const onSetReminder = (): void => {
    setFlagValues({ ...flags, showReminderSheet: true });
    setSocietyActionType(SocietyActions.ReminderPopup);
  };

  const onCloseSheet = (): void => {
    setFlagValues({ ...flags, showReminderSheet: false });
  };

  const onDeleteSociety = (id: number): void => {
    dispatch(
      PropertyPaymentActions.updateSociety({
        action: MenuEnum.DELETE,
        societyId: id,
        onCallback: handleDeleteCallback,
      })
    );
    setFlagValues({ ...flags, isDeleteSociety: false });
  };

  const onSelectSociety = (id: number): void => {
    if (asset.society) {
      setCurrentStep(2);
    } else {
      setCurrentSocietyId(id);
      handleConfirmationSheet(true);
    }
  };

  const onPressInfo = (value: boolean): void => {
    setFlagValues({ ...flags, infoSheet: value });
    setSocietyActionType(SocietyActions.InfoSheet);
  };

  const handlePayNow = (): void => {
    setFinancialsActionType(FinancialsActions.PropertyPayment_PayNow); // Order Summary
  };

  const handleDeleteCallback = (status: boolean): void => {
    if (status && asset.project) {
      dispatch(PropertyPaymentActions.getSocieties({ project_id: asset.project.id }));
    }
  };

  const handleUpdateCallback = (status: boolean): void => {
    if (status && asset.project) {
      dispatch(PropertyPaymentActions.getSocieties({ project_id: asset.project.id }));
      onProceedCallback();
    }
  };

  const handleMenuSelection = (value: string, id: number): void => {
    if (value === MenuEnum.EDIT) {
      setFlagValues({ ...flags, isAddSociety: true, isEditSociety: true });
      dispatch(PropertyPaymentActions.setSocietyId(id));
    } else {
      setFlagValues({ ...flags, isDeleteSociety: true });
    }
  };

  const handleConfirmationSheet = (value: boolean): void => {
    setFlagValues({ ...flags, showConfirmationSheet: value });
  };

  const handleCheckBox = (): void => {
    setFlagValues({ ...flags, isCheckboxSelected: !flags.isCheckboxSelected });
  };

  const handleAddSociety = (): void => {
    setFlagValues({ ...flags, isAddSociety: true });
  };

  const getStepLabels = (): string[] => {
    return [t('selectSociety'), t('property:selectBankAccount'), t('property:payment')];
  };

  const getPageTitle = (): string => {
    switch (currentStep) {
      case 0:
        return flags.isAddSociety ? t('addSociety') : t('societies');
      case 1:
        return t('assetFinancial:addBankAccount');
      case 2:
        return t('property:payment');
      default:
        return t('propertyPayment');
    }
  };

  // HANDLERS END

  const renderIndicator = (args: { position: number; stepStatus: string }): React.ReactElement => {
    const { stepStatus } = args;
    const backgroundColor = stepStatus === 'unfinished' ? theme.colors.white : theme.colors.primaryColor;
    return (
      <>
        {stepStatus === 'finished' ? (
          <Icon name={icons.checkFilled} color={theme.colors.primaryColor} size={16} />
        ) : (
          <View style={[styles.indicatorView, { backgroundColor }]} />
        )}
      </>
    );
  };

  const renderStepLabels = (args: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }): React.ReactElement => {
    const { position, label, currentPosition } = args;
    return (
      <View style={styles.labelContainer}>
        <Label textType="semiBold" style={styles.textColor}>
          {t('common:stepIndicator', { position: position + 1 })}
        </Label>
        {position <= currentPosition && (
          <Label textType="semiBold" style={styles.textColor}>
            {label}
          </Label>
        )}
      </View>
    );
  };

  const renderStepIndicator = (): React.ReactElement => {
    const customStyles = {
      stepStrokeCurrentColor: 'transparent',
      stepIndicatorCurrentColor: theme.colors.darkTint10,
      stepIndicatorUnFinishedColor: theme.colors.primaryColor,
      separatorUnFinishedColor: theme.colors.disabled,
      stepIndicatorFinishedColor: theme.colors.darkTint10,
      separatorFinishedColor: theme.colors.disabled,
      currentStepIndicatorSize: 30,
      stepStrokeWidth: 0,
    };
    return (
      <StepIndicator
        stepCount={3}
        labels={getStepLabels()}
        customStyles={customStyles}
        currentPosition={currentStep}
        renderLabel={renderStepLabels}
        renderStepIndicator={renderIndicator}
      />
    );
  };

  const renderSteps = (): React.ReactElement => {
    switch (currentStep) {
      case 0:
        return flags.isAddSociety ? (
          <AddSocietyForm isEditFlow={flags.isEditSociety} onSubmitForm={(): void => setCurrentStep(currentStep + 1)} />
        ) : (
          <SocietyList
            onUpdateSociety={onUpdateSociety}
            onSelectSociety={onSelectSociety}
            renderMenu={renderSocietyMenu}
            onPressInfo={(): void => onPressInfo(true)}
          />
        );
      case 1:
        return (
          <AddSocietyBank
            isTermsAccepted={flags.isTermsAccepted}
            onSubmitSuccess={onUpdateState}
            onSubmit={(): void => handleConfirmationSheet(true)}
            onUpdateCallback={handleUpdateCallback}
          />
        );
      case 2:
        return <SocietyPayment handlePayNow={handlePayNow} onSetReminder={onSetReminder} />;
      default:
        return <EmptyState />;
    }
  };

  const renderSocietyMenu = (societyData: Society): React.ReactElement => {
    if (!societyData.canDelete && !societyData.canEdit) return <View />;

    const formattedMenu = menu.map((item: IMenu) => {
      if (item.value === MenuEnum.EDIT) {
        item = { ...item, isDisable: !societyData.canEdit };
      } else {
        item = { ...item, isDisable: !societyData.canDelete };
      }
      return item;
    });
    return (
      <Menu
        data={formattedMenu}
        isShadowView
        optionTitle={t('modifySociety')}
        onSelect={(value): void => handleMenuSelection(value, societyData.id)}
        extraNode={renderDeleteView(societyData)}
      />
    );
  };

  const renderDeleteView = (societyData: Society): React.ReactElement => {
    return (
      <ConfirmationSheet
        isVisible={flags.isDeleteSociety}
        onCloseSheet={(): void => handleConfirmationSheet(false)}
        onPressDelete={(): void => onDeleteSociety(societyData.id)}
      />
    );
  };

  const isPlusIconVisible = isEmptyList && currentStep === 0 && !flags.isAddSociety && !asset.society;

  const isMobile = useOnly(deviceBreakpoint.MOBILE);

  const popupRefSociety = useRef<PopupActions>(null);

  const onOpenSocietyModal = (): void => {
    if (popupRefSociety && popupRefSociety.current) {
      popupRefSociety.current.open();
    }
  };
  const onCloseSocietyModal = (): void => {
    if (popupRefSociety && popupRefSociety.current) {
      popupRefSociety.current.close();
    }
  };

  const popupVerificationRef = useRef<PopupActions>(null);

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

  const [societyActionType, setSocietyActionType] = useState<SocietyActions | null>(null);

  const onReminderSuccess = (): void => {
    onCloseSheet();
    setFinancialsActionType(FinancialsActions.PropertyPayment_PropertyServices); // Property Services
  };

  const renderInfoSheet = (): React.ReactElement => {
    return (
      <View style={styles.disclaimerContent}>
        <Typography size="small" style={styles.disclaimer}>
          {t('propertyPayment:bankInfo')}
        </Typography>
        <Button
          type="primary"
          title={t('common:proceed')}
          containerStyle={styles.buttonContainer}
          onPress={(): void => onPressInfo(false)}
        />
      </View>
    );
  };

  const renderActionsPopover = (): React.ReactNode | null => {
    switch (societyActionType) {
      case SocietyActions.ReminderPopup:
        return <ReminderSheet onReminderSuccess={onReminderSuccess} />;
      case SocietyActions.InfoSheet:
        return renderInfoSheet();
      default:
        return null;
    }
  };

  const societyPopoverTypes = {
    [SocietyActions.ReminderPopup.toString()]: {
      title: t('propertyPayment:remindMeOn'),
    },
    [SocietyActions.InfoSheet.toString()]: {
      title: t('common:disclaimer'),
    },
  };
  const financialPopoverType = societyActionType && societyPopoverTypes[societyActionType?.toString()];

  const renderPopoverContent = (): React.ReactElement => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {financialPopoverType?.title}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint7}
            onPress={onCloseSocietyModal}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.verticalStyle} />
        <View style={styles.modalContent}>{renderActionsPopover()}</View>
      </View>
    );
  };

  return (
    <View>
      <Loader visible={getSocieties || society || societyCharges || payment || userInvoice} />
      {renderStepIndicator()}
      <TouchableOpacity onPress={handleBackPress}>
        <View style={styles.backTextWithIcon}>
          <Icon name={icons.leftArrow} size={20} color={theme.colors.primaryColor} />
          <Typography variant="text" size="small" fontWeight="semiBold" style={styles.contentTitle}>
            {getPageTitle()}
          </Typography>
        </View>
      </TouchableOpacity>
      {renderSteps()}
      <BankVerificationPopover
        popupRef={popupVerificationRef}
        onCloseModal={(): void => handleConfirmationSheet(false)}
        isOpen={flags.showConfirmationSheet}
        isCheckboxSelected={flags.isCheckboxSelected}
        handleCheckBox={handleCheckBox}
        onProceed={onProceed}
      />
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
          onClose: onCloseSocietyModal,
        }}
        forwardedRef={popupRefSociety}
      />
      {isPlusIconVisible ? (
        <TouchableOpacity onPress={handleAddSociety} style={styles.addIcon}>
          <View>
            <Image
              source={{ uri: require('@homzhub/common/src/assets/images/circularPlus.svg'), height: 50, width: 50 }}
              width={50}
              height={50}
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SocietyController;

const styles = StyleSheet.create({
  pageHeader: {
    backgroundColor: theme.colors.white,
  },
  labelContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  textColor: {
    color: theme.colors.white,
  },
  indicatorView: {
    ...(theme.circleCSS(10) as object),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 0,
    height: 50,
    marginVertical: 20,
  },
  disclaimer: {
    color: theme.colors.darkTint3,
  },
  disclaimerContent: {
    margin: 30,
    flex: 1,
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
  addIcon: {
    position: 'absolute',
    bottom: 10,
    right: 0,
  },
  contentTitle: {
    marginLeft: 12,
  },
  backTextWithIcon: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});
