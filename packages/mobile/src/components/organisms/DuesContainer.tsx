import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import DueList from '@homzhub/mobile/src/components/organisms/DueList';
import SectionContainer from '@homzhub/common/src/components/organisms/SectionContainer';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const DuesContainer = (): React.ReactElement | null => {
  // HOOKS START
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dueItems = useSelector(FinancialSelectors.getDueItems);
  const { navigate } = useNavigation();
  // HOOKS END

  // Todo (Praharsh) : Try moving to onFocusCallback
  useFocusEffect(
    useCallback(() => {
      dispatch(FinancialActions.getDues());
    }, [])
  );

  if (!dueItems.length) return null;

  const onSelectViewAll = (): void => {
    navigate(ScreensKeys.DuesScreen);
  };

  return (
    <>
      <SectionContainer
        containerStyle={styles.container}
        sectionTitle={t('assetDashboard:dues')}
        sectionIcon={icons.wallet}
        {...(dueItems.length > 3 && { rightIcon: icons.list })}
        rightIconColor={theme.colors.dark}
        onPressRightContent={onSelectViewAll}
      >
        <DueList numOfDues={3} />
      </SectionContainer>
    </>
  );
};

export default DuesContainer;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
  },
});
