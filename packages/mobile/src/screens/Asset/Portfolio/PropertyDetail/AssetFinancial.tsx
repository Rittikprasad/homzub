import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import TransactionsContainer from '@homzhub/mobile/src/components/organisms/TransactionsContainer';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { ICommonNavProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const AssetFinancial = (): React.ReactElement => {
  const { params } = useRoute();
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigation();
  const dispatch = useDispatch();
  const { transactions: transactionsLoading } = useSelector(FinancialSelectors.getFinancialLoaders);
  const [loading, setLoading] = useState<boolean>(false);
  const param = params as ICommonNavProps;

  const onToggleLoading = (): void => {
    setLoading((prevLoading) => !prevLoading);
  };

  const onRecordAdd = (): void => {
    navigate(ScreensKeys.AddRecordScreen, { assetId: param.propertyId, screenTitle: param.screenTitle });
  };

  const onBackPress = (): void => {
    dispatch(FinancialActions.clearFinancials());
    goBack();
  };

  return (
    <UserScreen
      title={param?.screenTitle ?? t('assetPortfolio:portfolio')}
      pageTitle={t('assetFinancial:financial')}
      onBackPress={onBackPress}
      loading={loading || transactionsLoading}
    >
      <View style={styles.container}>
        <Button
          type="secondary"
          title={t('assetFinancial:addNewRecord')}
          containerStyle={styles.addRecordButton}
          onPress={onRecordAdd}
        />
        <TransactionsContainer toggleLoader={onToggleLoading} isFromPortfolio />
      </View>
    </UserScreen>
  );
};

export default AssetFinancial;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  addRecordButton: {
    flex: 0,
    marginTop: 16,
    borderStyle: 'dashed',
  },
});
