import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import ReminderList from '@homzhub/mobile/src/components/organisms/ReminderList';
import SectionContainer from '@homzhub/common/src/components/organisms/SectionContainer';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const RemindersContainer = (): React.ReactElement | null => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const reminders = useSelector(FinancialSelectors.getReminders);

  useFocusEffect(
    useCallback(() => {
      dispatch(FinancialActions.getReminders());
    }, [])
  );

  const onViewAll = (): void => {
    navigate(ScreensKeys.ReminderScreen);
  };

  if (!reminders.length) return null;

  return (
    <SectionContainer
      sectionTitle={t('assetFinancial:reminders')}
      sectionIcon={icons.reminder}
      containerStyle={styles.container}
      onPressRightContent={onViewAll}
      rightIcon={reminders.length > 3 ? icons.list : undefined}
      rightIconColor={theme.colors.dark}
    >
      <ReminderList list={reminders.slice(0, 3)} />
    </SectionContainer>
  );
};

export default React.memo(RemindersContainer);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
  },
});
