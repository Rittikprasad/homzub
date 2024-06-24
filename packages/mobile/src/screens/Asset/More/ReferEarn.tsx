import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import ReferEarnIcon from '@homzhub/common/src/assets/images/referEarn.svg';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { AssetMetricsList, IMetricsData } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ReferralShare from '@homzhub/mobile/src/components/molecules/ReferralShare';
import { TransactionType } from '@homzhub/common/src/domain/models/CoinTransaction';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ReferEarn = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);
  const code = useSelector(UserSelector.getReferralCode);
  const transaction = useSelector(UserSelector.getUserCoinTransaction);
  const [management, setManagementData] = useState<IMetricsData[]>([]);
  const [totalInvite, setTotalInvite] = useState('');
  const [loading, setLoading] = useState(false);
  const { params } = useRoute();
  const { setParams } = useNavigation();

  const getCoinsCount = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await UserRepository.getCoinManagement();
      setTotalInvite(res.invites.totalAccepted.toString());
      setManagementData([
        { name: t('coinBalance'), count: res.coins.coinsBalance, colorCode: theme.colors.greenTint8 },
        { name: t('coinsEarned'), count: res.coins.coinsEarned, colorCode: theme.colors.yellowTint2 },
      ]);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  }, []);

  useEffect(() => {
    getCoinsCount().then();
  }, []);

  // Reload the component when foreground push notification related to Refer&Earn-Coins is clicked
  useEffect(() => {
    // @ts-ignore
    if (params && params?.shouldReload) {
      setParams({ shouldReload: false });
      getCoinsCount().then();
    }
  }, [params]);

  useEffect(() => {
    dispatch(UserActions.getUserCoinTransaction());
  }, [code, t]);

  const onCopyToClipboard = useCallback((): void => {
    Clipboard.setString(code);
    AlertHelper.info({ message: t('copiedCode') });
    trackEvent(t('common:codeCopy'));
  }, [code, t]);

  const trackEvent = (source: string): void => {
    AnalyticsService.track(EventType.Refer, {
      source,
      code,
    });
  };

  return (
    <UserScreen loading={loading} title={t('referEarn')} backgroundColor={theme.colors.background}>
      <AssetMetricsList
        data={management}
        showBackIcon
        title={totalInvite}
        numOfElements={2}
        subTitleText={t('acceptedInvites')}
      />
      <View style={styles.container}>
        <ReferEarnIcon style={styles.icon} />
        <Text type="small" textType="semiBold" style={styles.refer}>
          {t('referMore')}
        </Text>
        <Text type="large" textType="semiBold" style={styles.reward}>
          {t('getRewarded')}
        </Text>
        <Label type="regular" style={styles.copy}>
          {t('clickCopy')}
        </Label>
        <TouchableOpacity activeOpacity={0.5} onPress={onCopyToClipboard} style={styles.touchContainer}>
          <View style={styles.dashed}>
            <Label type="large" style={styles.codeText}>
              {t('refCode')}
            </Label>
            <Label type="large" textType="semiBold" style={styles.code}>
              {code}
            </Label>
          </View>
        </TouchableOpacity>
        <Label type="large" textType="semiBold" style={styles.friend}>
          {t('refWith')}
        </Label>
        <ReferralShare setLoading={setLoading} />
      </View>
      {transaction.length > 0 && (
        <View style={styles.transactionContainer}>
          <View style={styles.transactionHeader}>
            <Text type="small" textType="semiBold" style={styles.title}>
              {t('common:activities')}
            </Text>
            <Text type="small" textType="semiBold" style={styles.title}>
              {t('common:score')}
            </Text>
          </View>
          <Divider />
          {transaction.map((item, index) => {
            const isCredit = item.transactionType === TransactionType.CREDIT;
            return (
              <>
                <View key={index} style={styles.transactionItem}>
                  <View>
                    <Text type="small" textType="semiBold" style={styles.itemTitle}>
                      {item.title}
                    </Text>
                    <Label type="large" style={styles.itemLabel}>
                      {isCredit ? t('creditedOn') : t('debitOn')}{' '}
                      {DateUtils.getDisplayDate(item.transactionDate, 'DD MMM YYYY')}
                    </Label>
                  </View>
                  <View style={styles.itemValue}>
                    <Text
                      type="small"
                      textType="semiBold"
                      style={[styles.statusIcon, isCredit ? styles.credit : styles.debit]}
                    >
                      {isCredit ? '+' : '-'}
                    </Text>
                    <Text type="small" textType="semiBold" style={isCredit ? styles.credit : styles.debit}>
                      {item.coins}
                    </Text>
                  </View>
                </View>
                {index !== transaction.length - 1 && <Divider containerStyles={styles.divider} />}
              </>
            );
          })}
        </View>
      )}
    </UserScreen>
  );
};

const memoizedComponent = React.memo(ReferEarn);
export { memoizedComponent as ReferEarn };

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  icon: {
    alignSelf: 'center',
  },
  touchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.completed,
  },
  dashed: {
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  refer: {
    marginTop: 24,
    marginBottom: 12,
    color: theme.colors.referGreen,
    textAlign: 'center',
  },
  reward: {
    marginBottom: 24,
    textAlign: 'center',
    color: theme.colors.active,
  },
  copy: {
    marginBottom: 8,
    textAlign: 'center',
    color: theme.colors.darkTint5,
  },
  friend: {
    marginTop: 40,
    marginBottom: 28,
    textAlign: 'center',
    color: theme.colors.darkTint4,
  },
  codeText: {
    color: theme.colors.white,
  },
  code: {
    marginStart: 8,
    color: theme.colors.white,
  },
  transactionContainer: {
    marginVertical: 16,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    color: theme.colors.darkTint3,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  divider: {
    marginHorizontal: 16,
    borderColor: theme.colors.darkTint10,
  },
  statusIcon: {
    marginHorizontal: 6,
  },
  credit: {
    color: theme.colors.green,
  },
  debit: {
    color: theme.colors.red,
  },
  itemLabel: {
    color: theme.colors.darkTint3,
    marginTop: 4,
  },
  itemValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    color: theme.colors.darkTint1,
  },
});
