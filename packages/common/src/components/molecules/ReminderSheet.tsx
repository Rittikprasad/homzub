import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { IReminderPayload } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  onReminderSuccess: () => void;
}

const ReminderSheet = ({ onReminderSuccess }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentDate = DateUtils.getCurrentDate();
  const paymentData = useSelector(PropertyPaymentSelector.getPaymentData);
  const categories = useSelector(FinancialSelectors.getReminderCategories);
  const frequencies = useSelector(FinancialSelectors.getFrequenciesDropdown);
  const [date, setDate] = useState(DateUtils.getFutureDateByUnit(currentDate, 1, 'day'));
  const [checkboxValue, setCheckboxValue] = useState({
    remindOnce: false,
    recurringRemind: false,
  });
  const [frequency, setFrequency] = useState(0);

  useEffect(() => {
    dispatch(FinancialActions.getReminderCategories());
    dispatch(FinancialActions.getReminderFrequencies());
  }, []);

  const onRemindOnce = (): void => {
    setCheckboxValue({ remindOnce: !checkboxValue.remindOnce, recurringRemind: false });
    setFrequency(0);
  };

  const onRecurringRemind = (): void => {
    setCheckboxValue({ recurringRemind: !checkboxValue.recurringRemind, remindOnce: false });
  };

  const onProceed = (): void => {
    const { paid_by, amount, asset, society, currency } = paymentData;
    const data: IReminderPayload = {
      title: 'Society Maintenance',
      reminder_frequency: checkboxValue.remindOnce
        ? frequencies.find((item) => item.label === 'One-time')?.value
        : frequency,
      start_date: new Date(date).toISOString(),
      asset,
      amount,
      payer_user: paid_by,
      emails: [],
      society,
      currency,
      is_confirmed: true,
      reminder_category: categories.find((item) => item.code === 'SOCIETY_MAINTENANCE')?.id ?? -1,
    };

    const payload = {
      data,
      onCallback: handleCallback,
    };

    dispatch(FinancialActions.addReminder(payload));
  };

  const handleCallback = (status: boolean): void => {
    if (status) {
      AlertHelper.success({ message: t('assetFinancial:reminderSuccessMsg') });
      onReminderSuccess();
    }
  };

  const getButtonVisibility = (): boolean => {
    const isCheckboxEnable = Object.values(checkboxValue).some((val) => val);

    if (isCheckboxEnable) {
      if (checkboxValue.recurringRemind && frequency) {
        return true;
      }
      return checkboxValue.remindOnce;
    }

    return false;
  };

  return (
    <View style={styles.container}>
      <RNCheckbox
        label={t('propertyPayment:remindMeOnce')}
        selected={checkboxValue.remindOnce}
        onToggle={onRemindOnce}
      />
      <RNCheckbox
        label={t('propertyPayment:recurringReminder')}
        selected={checkboxValue.recurringRemind}
        onToggle={onRecurringRemind}
        containerStyle={styles.checkbox}
      />
      <FormCalendar
        textSize="small"
        label={t('helpAndSupport:date')}
        fontType="semiBold"
        selectedValue={date}
        minDate={DateUtils.getFutureDateByUnit(currentDate, 1, 'day')}
        bubbleSelectedDate={setDate}
        containerStyle={styles.calendar}
        dateContainerStyle={styles.dateContainer}
      />
      <View style={styles.frequency}>
        <Text type="small" textType="semiBold" style={styles.label}>
          {t('repeat')}
        </Text>
        <Dropdown
          data={frequencies.filter((item) => item.label !== 'One-time')}
          value={frequency}
          placeholder={t('propertyPayment:selectFrequency')}
          listHeight={300}
          onDonePress={setFrequency}
          disable={!checkboxValue.recurringRemind}
          parentContainerStyle={styles.dropdown}
          containerStyle={styles.dropdownContainer}
        />
      </View>
      <Button
        type="primary"
        title={t('proceed')}
        containerStyle={styles.button}
        disabled={!getButtonVisibility()}
        onPress={onProceed}
      />
    </View>
  );
};

export default ReminderSheet;

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  checkbox: {
    marginVertical: 16,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flex: 1,
    marginRight: 20,
    marginLeft: 32,
  },
  frequency: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    color: theme.colors.darkTint3,
  },
  dropdown: {
    flex: 1,
    marginHorizontal: 20,
  },
  dropdownContainer: {
    paddingVertical: 10,
  },
  button: {
    flex: 0,
    marginVertical: 16,
  },
});
