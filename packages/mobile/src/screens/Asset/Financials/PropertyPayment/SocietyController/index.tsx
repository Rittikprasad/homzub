import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import Menu, { IMenu } from '@homzhub/common/src/components/molecules/Menu';
import ReminderSheet from '@homzhub/common/src/components/molecules/ReminderSheet';
import VerificationSheet from '@homzhub/mobile/src/components/molecules/VerificationSheet';
import AddSocietyBank from '@homzhub/common/src/components/organisms/Society/AddSocietyBank';
import AddSocietyForm from '@homzhub/common/src/components/organisms/Society/AddSocietyForm';
import SocietyList from '@homzhub/common/src/components/organisms/Society/SocietyList';
import SocietyPayment from '@homzhub/common/src/components/organisms/Society/SocietyPayment';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { menu, MenuEnum } from '@homzhub/common/src/constants/Society';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SocietyController = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();
  const { params } = useRoute();
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
    showConfirmationSheet: false,
    isCheckboxSelected: false,
    isDeleteSociety: false,
    isTermsAccepted: false,
    isEditSociety: false,
    showReminderSheet: false,
    infoSheet: false,
  });

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
      goBack();
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
  };

  const onProceedCallback = (): void => {
    // @ts-ignore
    if (params && params.fromReminder) {
      dispatch(PropertyPaymentActions.getSocietiesSuccess([]));
      dispatch(FinancialActions.getReminderAssets());
      updateReduxState();
      goBack();
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

  const onSetReminder = (): void => {
    setFlagValues({ ...flags, showReminderSheet: true });
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

  const onReminderSuccess = (): void => {
    onCloseSheet();
    navigate(ScreensKeys.PaymentServices);
  };

  const onPressInfo = (value: boolean): void => {
    setFlagValues({ ...flags, infoSheet: value });
  };

  const handlePayNow = (): void => {
    navigate(ScreensKeys.SocietyOrderSummary);
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
      stepIndicatorCurrentColor: theme.colors.white,
      stepIndicatorUnFinishedColor: theme.colors.blueTint15,
      stepIndicatorFinishedColor: theme.colors.white,
      separatorFinishedColor: theme.colors.white,
      separatorUnFinishedColor: theme.colors.blueTint16,
      stepStrokeCurrentColor: 'transparent',
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

  const renderConfirmationSheet = (): React.ReactElement => {
    return (
      <VerificationSheet
        isVisible={flags.showConfirmationSheet}
        isCheckboxSelected={flags.isCheckboxSelected}
        onCloseSheet={(): void => handleConfirmationSheet(false)}
        handleCheckBox={handleCheckBox}
        onProceed={onProceed}
      />
    );
  };

  const isPlusIconVisible = isEmptyList && currentStep === 0 && !flags.isAddSociety && !asset.society;

  return (
    <UserScreen
      isGradient
      loading={getSocieties || society || societyCharges || payment || userInvoice}
      pageTitle={getPageTitle()}
      onBackPress={handleBackPress}
      headerStyle={styles.pageHeader}
      title={t('propertyPayment')}
      backgroundColor={theme.colors.white}
      renderExtraContent={renderStepIndicator()}
      onPlusIconClicked={isPlusIconVisible ? handleAddSociety : undefined}
    >
      {renderSteps()}
      {renderConfirmationSheet()}
      <BottomSheet
        visible={flags.showReminderSheet}
        sheetHeight={400}
        headerTitle={t('remindMeOn')}
        onCloseSheet={onCloseSheet}
      >
        <ReminderSheet onReminderSuccess={onReminderSuccess} />
      </BottomSheet>
      <BottomSheet
        visible={flags.infoSheet}
        sheetHeight={400}
        isShadowView
        headerTitle={t('common:disclaimer')}
        onCloseSheet={(): void => onPressInfo(false)}
      >
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
      </BottomSheet>
    </UserScreen>
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
});
