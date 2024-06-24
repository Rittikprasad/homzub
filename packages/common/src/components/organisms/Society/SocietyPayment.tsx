import React, { useEffect } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Formik, FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { ISelectionPicker, SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { InvoiceActions } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  handlePayNow: () => void;
  onSetReminder: () => void;
}

const SocietyPayment = ({ handlePayNow, onSetReminder }: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const paymentData = useSelector(PropertyPaymentSelector.getPaymentData);
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const societyCharges = useSelector(PropertyPaymentSelector.getSocietyCharges);
  const user = useSelector(UserSelector.getUserProfile);

  useEffect(() => {
    dispatch(PropertyPaymentActions.getSocietyCharges({ id: asset.id, onCallback }));
  }, []);

  const onCallback = (status: boolean, data?: number): void => {
    if (status && data) {
      dispatch(
        PropertyPaymentActions.setPaymentData({
          ...paymentData,
          amount: data,
        })
      );
    }
  };

  const getMonthData = (): ISelectionPicker<string>[] => {
    const { getMonth, getPreviousMonth, getNextMonth } = DateUtils;
    return [
      { title: getPreviousMonth(), value: getPreviousMonth('MM') },
      { title: getMonth(), value: getMonth('MM') },
      { title: getNextMonth(), value: getNextMonth('MM') },
    ];
  };

  const handleNotify = (): void => {
    dispatch(
      PropertyPaymentActions.setPaymentData({
        ...paymentData,
        is_notify: !paymentData.is_notify,
      })
    );
  };

  const onChangeAmount = (value: string): void => {
    if (societyCharges) {
      dispatch(
        PropertyPaymentActions.setPaymentData({
          ...paymentData,
          amount: Number(value),
          currency: societyCharges.maintenance.currency.currencyCode,
        })
      );
    }
  };

  const onSelectUser = (id: number): void => {
    dispatch(
      PropertyPaymentActions.setPaymentData({
        ...paymentData,
        paid_by: id,
      })
    );
  };

  const onSelectMonth = (value: string): void => {
    dispatch(
      PropertyPaymentActions.setPaymentData({
        ...paymentData,
        month: value,
      })
    );
  };

  const onPayNow = (): void => {
    if (paymentData.amount < 1) {
      AlertHelper.error({ message: t('amountMsg') });
      return;
    }
    if (societyCharges && paymentData) {
      dispatch(
        PropertyPaymentActions.getUserInvoice({
          data: {
            action: InvoiceActions.SOCIETY_MAINTENANCE_INVOICE,
            payload: {
              asset: paymentData.asset,
              amount: paymentData.amount,
              paid_by: paymentData.paid_by,
              currency: paymentData.currency,
              is_notify_me_enabled: paymentData.is_notify,
              payment_schedule_date: `${DateUtils.getCurrentYear()}-${paymentData.month}-01`,
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

  const renderUser = (): React.ReactElement | null => {
    if (!societyCharges) return null;
    return (
      <View style={styles.userContainer}>
        <Label type="large" textType="semiBold" style={styles.label}>
          {t('propertyPayment:paidBy')}
        </Label>
        <FlatList
          data={societyCharges.users}
          numColumns={2}
          contentContainerStyle={styles.userList}
          renderItem={({ item }): React.ReactElement => {
            const isSelected = item.id === paymentData.paid_by;
            return (
              <TouchableOpacity key={item.id} onPress={(): void => onSelectUser(item.id)}>
                <Avatar
                  isOnlyAvatar
                  fullName={item.fullName}
                  imageSize={80}
                  isSelected={isSelected}
                  image={item.profilePicture}
                  initialsContainerStyle={isSelected && { borderColor: theme.colors.primaryColor }}
                />
                <Label
                  style={[styles.name, { color: isSelected ? theme.colors.primaryColor : theme.colors.darkTint3 }]}
                >
                  {item.fullName}
                </Label>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };
  if (!societyCharges) return <EmptyState />;
  const {
    maintenance: { currency },
  } = societyCharges;
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ amount: paymentData.amount.toString() }}
        enableReinitialize
        onSubmit={FunctionUtils.noop}
      >
        {(formProps: FormikProps<FormikValues>): React.ReactElement => {
          return (
            <>
              <FormTextInput
                formProps={formProps}
                inputType="number"
                name="amount"
                labelTextType="large"
                fontWeightType="semiBold"
                label={t('propertyPayment:amountPaid')}
                inputPrefixText={currency.currencySymbol}
                inputGroupSuffixText={currency.currencyCode}
                onValueChange={onChangeAmount}
              />
              {renderUser()}
              <Label textType="semiBold" type="large" style={styles.label}>
                {t('propertyPayment:selectMonth')}
              </Label>
              <SelectionPicker data={getMonthData()} selectedItem={[paymentData.month]} onValueChange={onSelectMonth} />
              <RNCheckbox
                selected={paymentData.is_notify}
                containerStyle={styles.checkbox}
                onToggle={handleNotify}
                labelType="regular"
                label={t('propertyPayment:notifyMe')}
              />
              <View style={styles.buttonContainer}>
                <Button
                  type="secondary"
                  title={t('assetFinancial:setReminder')}
                  disabled={paymentData.is_notify || paymentData.amount < 1}
                  onPress={onSetReminder}
                />
                <View style={styles.buttonSeparator} />
                <Button
                  type="primary"
                  title={t('assetFinancial:payNow')}
                  onPress={onPayNow}
                  disabled={paymentData.amount < 1 || paymentData.paid_by !== user.id}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default SocietyPayment;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
    paddingBottom: 16,
  },
  label: {
    marginBottom: 16,
    color: theme.colors.darkTint3,
  },
  checkbox: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 40,
  },
  userContainer: {
    marginVertical: 16,
  },
  userList: {
    marginHorizontal: 20,
  },
  name: {
    marginVertical: 12,
    width: 100,
    textAlign: 'center',
  },
  buttonSeparator: {
    marginHorizontal: 10,
  },
});
