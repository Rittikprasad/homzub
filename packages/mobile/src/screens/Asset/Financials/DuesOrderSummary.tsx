import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@homzhub/common/src/styles/theme';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import ServiceOrderSummary from '@homzhub/common/src/components/organisms/ServiceOrderSummary';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const DuesOrderSummary = (): React.ReactElement | null => {
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation();
  const currentDueId = useSelector(FinancialSelectors.getCurrentDueId);
  const { dueOrderSummary } = useSelector(FinancialSelectors.getFinancialLoaders);

  const onSuccess = (): void => {
    navigate(ScreensKeys.FinancialsLandingScreen);
  };

  const onBackIconPress = (): void => {
    goBack();
  };

  return (
    <Screen
      headerProps={{
        title: t('property:orderSummary'),
        onIconPress: onBackIconPress,
      }}
      contentContainerStyle={styles.screenContentContainer}
      scrollEnabled
      isLoading={dueOrderSummary}
    >
      <ServiceOrderSummary isLabelRequired invoiceId={currentDueId} onSuccess={onSuccess} />
    </Screen>
  );
};

export default DuesOrderSummary;

const styles = StyleSheet.create({
  screenContentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    backgroundColor: theme.colors.white,
  },
});
