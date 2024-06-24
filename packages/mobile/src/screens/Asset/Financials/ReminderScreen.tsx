import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import ReminderList from '@homzhub/mobile/src/components/organisms/ReminderList';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const ReminderScreen = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack, navigate } = useNavigation();
  const reminders = useSelector(FinancialSelectors.getReminders);
  const { reminder: remindersLoader } = useSelector(FinancialSelectors.getFinancialLoaders);

  useFocusEffect(
    useCallback(() => {
      dispatch(FinancialActions.getReminders());
      dispatch(FinancialActions.setCurrentReminderId(-1));
    }, [])
  );

  const onPlusIconClicked = (): void => {
    navigate(ScreensKeys.AddReminderScreen);
  };

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{ title: t('assetFinancial:reminders'), type: 'secondary', onIconPress: goBack }}
      onPlusIconClicked={onPlusIconClicked}
      containerStyle={styles.container}
      isLoading={remindersLoader}
    >
      <ReminderList list={reminders} />
    </Screen>
  );
};

export default ReminderScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
