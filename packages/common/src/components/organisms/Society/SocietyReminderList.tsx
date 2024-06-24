import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';
import { InvoiceActions } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  handlePayNow: () => void;
  renderMenu?: (id: number) => React.ReactElement;
}

const SocietyReminderList = ({ renderMenu, handlePayNow }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const societyReminder = useSelector(PropertyPaymentSelector.getSocietyReminders);
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const user = useSelector(UserSelector.getUserProfile);

  if (!societyReminder) return <EmptyState />;

  const onPayNow = (item: Reminder): void => {
    const { amount, payerUser, currency, nextReminderDate, id } = item;
    if (!!amount && !!payerUser && !!currency) {
      const date = DateUtils.convertTimeFormat(nextReminderDate, 'YYYY-MM');
      dispatch(
        PropertyPaymentActions.getUserInvoice({
          data: {
            action: InvoiceActions.SOCIETY_MAINTENANCE_INVOICE,
            payload: {
              asset: asset.id,
              amount,
              paid_by: payerUser?.id,
              currency: currency?.currencyCode,
              is_notify_me_enabled: false,
              payment_schedule_date: `${date}-01`,
              reminder: id,
            },
          },
          onCallback: handleCallback,
        })
      );
    }
  };

  const handleCallback = (status: boolean): void => {
    if (status) {
      handlePayNow();
    }
  };

  const renderItem = ({ item }: { item: Reminder }): React.ReactElement => {
    const isMenuVisible = item.payerUser?.id === user.id;
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <View style={styles.itemLeftView}>
            <Icon name={icons.society} size={30} color={theme.colors.primaryColor} />
            <View style={styles.itemHeaderLabels}>
              <Label type="large" style={styles.label}>
                {t('propertyPayment:nextDueOn', {
                  date: DateUtils.getDisplayDate(item.nextReminderDate, 'Do MMM YYYY'),
                })}
              </Label>
              <Label type="large" style={styles.label}>
                {t('propertyPayment:amount', { currency: item.currency?.currencySymbol, amount: item.amount })}
              </Label>
            </View>
          </View>
          {renderMenu && isMenuVisible && <View> {renderMenu(item.id)}</View>}
        </View>
        <Text type="small" textType="semiBold" style={styles.label}>
          {t('propertyPayment:payee')}
        </Text>
        <View style={styles.userContainer}>
          <Avatar image={item.payerUser?.profilePicture} imageSize={28} fullName={item.payerUser?.fullName} />
        </View>
        <Button
          type="primary"
          title={t('assetFinancial:payNow')}
          disabled={!item.canPay}
          onPress={(): void => onPayNow(item)}
          containerStyle={styles.buttonView}
        />
      </View>
    );
  };

  const { lastPaymentTransaction, reminders } = societyReminder;
  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      {lastPaymentTransaction && lastPaymentTransaction?.paymentDate && (
        <View style={styles.header}>
          <Icon name={icons.circularFilledInfo} color={theme.colors.primaryColor} size={20} />
          <Text type="small" textType="semiBold" style={styles.headerLabel}>
            {/* @ts-ignore */}
            {t('propertyPayment:lastPaidOn', {
              date: DateUtils.getDisplayDate(lastPaymentTransaction?.paymentDate ?? '', 'Do MMM YYYY'),
            })}
          </Text>
        </View>
      )}
      <FlatList data={reminders} renderItem={renderItem} />
    </View>
  );
};

export default SocietyReminderList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    marginVertical: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLabel: {
    color: theme.colors.darkTint3,
    marginHorizontal: 12,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: theme.colors.greenLightOpacity,
    padding: 16,
    marginTop: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemHeaderLabels: {
    marginHorizontal: 10,
  },
  userContainer: {
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.darkTint10,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  buttonView: {
    marginVertical: 10,
  },
  label: {
    color: theme.colors.darkTint3,
  },
});
