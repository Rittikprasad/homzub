import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import DetailCard, { ICardProp } from '@homzhub/common/src/components/molecules/DetailCard';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { BottomSheetListView } from '@homzhub/mobile/src/components';
import { BankAccountActions } from '@homzhub/common/src/domain/models/BankInfo';
import { IListItem } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const BankDetails = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();

  const bankDetails = useSelector(UserSelector.getBankInfo);
  const { bankInfo: bankInfoLoading } = useSelector(UserSelector.getUserLoaders);
  const currentBank = useSelector(UserSelector.getCurrentBankAccountSelected);
  const currentBankId = useSelector(UserSelector.getCurrentBankId);
  const { id: userId } = useSelector(UserSelector.getUserProfile);

  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showConfirmationSheet, setShowConfirmationSheet] = useState(false);
  const [localLoader, setLocalLoader] = useState(false);
  const [isDeactivateFlow, setIsDeactivateFlow] = useState(false);

  const setOptionsSheet = (): void => setShowOptionsSheet(true);

  const resetOptionsSheet = (): void => setShowOptionsSheet(false);

  const setConfirmationSheet = (): void => setShowConfirmationSheet(true);

  const resetConfirmationSheet = (): void => setShowConfirmationSheet(false);

  const onPressPlusIcon = (): void => navigate(ScreensKeys.AddBankAccount);

  useFocusEffect(
    useCallback(() => {
      dispatch(UserActions.getBankInfo(userId));
      dispatch(UserActions.setCurrentBankAccountId(-1));
    }, [])
  );

  const handleAccountActivation = async (action: BankAccountActions): Promise<void> => {
    try {
      const payload = {
        action,
      };
      setLocalLoader(true);
      await UserRepository.handleBankDetailsActivation(userId, currentBankId, payload);
      setLocalLoader(false);
      setIsDeactivateFlow(false);
      dispatch(UserActions.setCurrentBankAccountId(-1));
      dispatch(UserActions.getBankInfo(userId));
      AlertHelper.success({
        message: t(
          `assetFinancial:${
            action === BankAccountActions.ACTIVATE ? 'bankAccountActivationSuccess' : 'bankAccountDeactivationSuccess'
          }`
        ),
      });
    }catch (e: any) {      setLocalLoader(false);
      setIsDeactivateFlow(false);
      AlertHelper.error({
        message: ErrorUtils.getErrorMessage(e.details),
        statusCode: e.details.statusCode,
      });
    }
  };

  const BankAccountsList = (): React.ReactElement => {
    const renderItem = ({ item }: { item: ICardProp }): React.ReactElement => {
      const onPressItemMenu = (): void => {
        dispatch(UserActions.setCurrentBankAccountId(item.id));
        setOptionsSheet();
      };
      const renderMenuIcon = (): React.ReactElement => {
        return (
          <TouchableOpacity onPress={onPressItemMenu}>
            <Icon name={icons.verticalDots} size={18} color={theme.colors.darkTint3} />
          </TouchableOpacity>
        );
      };

      const hasGrayBackground = (showOptionsSheet || showConfirmationSheet) && item.id === currentBankId;

      return (
        <DetailCard
          heading={item.heading}
          label={item.label}
          description={item.description}
          containerStyle={styles.accountItem}
          rightNode={renderMenuIcon()}
          outerContainerStyle={[styles.detailCard, hasGrayBackground && styles.detailCardContainer]}
        />
      );
    };

    const EmptyComponent = (): React.ReactElement => (
      <EmptyState title={t('assetFinancial:noBankAccsAdded')} containerStyle={styles.centered} />
    );

    const keyExtractor = (item: ICardProp, index: number): string => index.toString();

    return (
      <FlatList
        ListEmptyComponent={EmptyComponent}
        keyExtractor={keyExtractor}
        data={bankDetails.map((i) => i.bankDetail)}
        renderItem={renderItem}
      />
    );
  };

  const OptionsSheet = (): React.ReactElement => {
    const returnOptions = (): IListItem[] => {
      const options: IListItem[] = [
        {
          label: t('assetFinancial:editAccount'),
          value: BankAccountActions.EDIT,
          isDisable: !currentBank?.canEdit ?? false,
        },
        {
          label: t('assetFinancial:deleteAccount'),
          value: BankAccountActions.DELETE,
          isNegative: true,
          isDisable: !currentBank?.canDelete ?? false,
        },
      ];
      if (!currentBank?.isActive) {
        options.splice(1, 0, {
          label: t('assetFinancial:activateAccount'),
          value: BankAccountActions.ACTIVATE,
        });
      } else {
        options.splice(1, 0, {
          label: t('moreSettings:deactivateAccount'),
          value: BankAccountActions.DEACTIVATE,
          isDisable: !currentBank?.canDeactivate ?? false,
        });
      }
      return options;
    };

    const onPressEdit = (): void => {
      if (currentBank) {
        if (!currentBank.canEdit) {
          AlertHelper.error({ message: t('assetFinancial:bankDetailsCantBeEdited') });
          return;
        }
        navigate(ScreensKeys.AddBankAccount, { isEdit: true });
      }
    };

    const handleBankAccountActions = (action: string): void => {
      resetOptionsSheet();
      switch (action) {
        case BankAccountActions.EDIT:
          onPressEdit();
          return;
        case BankAccountActions.DELETE:
          setConfirmationSheet();
          return;
        case BankAccountActions.DEACTIVATE:
          setIsDeactivateFlow(true);
          setConfirmationSheet();
          return;
        case BankAccountActions.ACTIVATE:
          handleAccountActivation(BankAccountActions.ACTIVATE).then();
          return;

        default:
          FunctionUtils.noop();
      }
    };

    return (
      <BottomSheetListView
        selectedValue=""
        data={returnOptions()}
        listTitle={t('assetFinancial:bankAccountOptions')}
        isBottomSheetVisible={showOptionsSheet}
        onSelectItem={handleBankAccountActions}
        onCloseDropDown={resetOptionsSheet}
        showDivider={false}
        listHeight={theme.viewport.height / 2.5}
        hasFullySpannedItems
      />
    );
  };

  const ConfirmationBottomSheet = (): React.ReactElement => {
    const onConfirmDeactivate = async (): Promise<void> => {
      await handleAccountActivation(BankAccountActions.DEACTIVATE);
    };

    const onConfirmDelete = async (): Promise<void> => {
      try {
        setLocalLoader(true);
        await UserRepository.deleteBankDetails(userId, currentBankId);
        dispatch(UserActions.getBankInfo(userId));
        dispatch(UserActions.setCurrentBankAccountId(-1));
        setLocalLoader(false);
        AlertHelper.success({ message: t('assetFinancial:bankAccountDeletedSuccessfully') });
      }catch (e: any) {        setLocalLoader(false);
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      }
    };

    const onPressDeactivate = async (): Promise<void> => {
      resetConfirmationSheet();
      if (currentBank) {
        if (currentBank.canDeactivate) {
          await onConfirmDeactivate();
          return;
        }
        AlertHelper.error({ message: t('assetFinancial:bankAccountCantBeDeactivated') });
      }
    };

    const onPressDelete = async (): Promise<void> => {
      resetConfirmationSheet();
      if (currentBank) {
        if (currentBank.canDelete) {
          await onConfirmDelete();
          return;
        }
        AlertHelper.error({ message: t('assetFinancial:bankAccountCantBeDeleted') });
      }
    };

    const getConfirmationMessage = (): string => {
      if (isDeactivateFlow) {
        return t('assetFinancial:deactivateConfirmation');
      }
      return t(
        currentBank?.isActive ? 'assetFinancial:youCanDeactivate' : 'assetFinancial:bankAccountDeleteConfirmation'
      );
    };

    return (
      <ConfirmationSheet
        message={getConfirmationMessage()}
        isVisible={showConfirmationSheet}
        onCloseSheet={resetConfirmationSheet}
        onPressDelete={isDeactivateFlow ? onPressDeactivate : onPressDelete}
        sheetHeight={theme.viewport.height / 2.5}
        buttonTitles={isDeactivateFlow ? [t('common:cancel'), t('assetFinancial:deactivate')] : undefined}
      />
    );
  };

  return (
    <UserScreen
      title={t('assetMore:more')}
      pageTitle={t('assetMore:bankDetails')}
      onBackPress={goBack}
      loading={bankInfoLoading || localLoader}
      contentContainerStyle={styles.content}
      onPlusIconClicked={onPressPlusIcon}
    >
      <BankAccountsList />
      <OptionsSheet />
      <ConfirmationBottomSheet />
    </UserScreen>
  );
};
export default React.memo(BankDetails);

const styles = StyleSheet.create({
  accountItem: {
    marginVertical: 20,
  },
  content: {
    paddingBottom: 30,
  },
  centered: {
    paddingVertical: '50%',
  },
  detailCardContainer: {
    backgroundColor: theme.colors.darkTint10,
  },
  detailCard: {
    paddingHorizontal: 16,
  },
});
