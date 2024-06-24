import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import VerificationSheet from '@homzhub/mobile/src/components/molecules/VerificationSheet';
import AddBankAccountForm from '@homzhub/common/src/components/organisms/AddBankAccountForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { IAddBankAccount } from '@homzhub/mobile/src/navigation/interfaces';

const AddBankAccount = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { id } = useSelector(UserSelector.getUserProfile);
  const [isLoading, setLoading] = useState(false);
  const [flags, setFlagValues] = useState({
    showConfirmationSheet: false,
    isCheckboxSelected: false,
    isConfirmed: false,
  });
  const { params } = useRoute();
  const dispatch = useDispatch();
  const navParams = params as IAddBankAccount;
  const userId = navParams && navParams.id && navParams.id > 0 ? navParams.id : id;

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

  return (
    <>
      <Screen
        backgroundColor={theme.colors.white}
        headerProps={{
          title: navParams?.isEdit ? t('assetFinancial:editDetails') : t('assetFinancial:addBankAccount'),
          type: 'secondary',
          onIconPress: goBack,
        }}
        containerStyle={styles.container}
        isLoading={isLoading}
      >
        <AddBankAccountForm
          isEditFlow={Boolean(navParams?.isEdit)}
          onSubmit={goBack}
          userId={userId}
          setLoading={setLoading}
          handleConfirmation={(): void => handleConfirmationSheet(true)}
          isConfirmed={flags.isConfirmed}
          onError={handleError}
        />
      </Screen>
      <VerificationSheet
        isVisible={flags.showConfirmationSheet}
        isCheckboxSelected={flags.isCheckboxSelected}
        onCloseSheet={(): void => handleConfirmationSheet(false)}
        handleCheckBox={handleCheckBox}
        onProceed={onProceed}
      />
    </>
  );
};

export default AddBankAccount;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
