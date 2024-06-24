import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Cross from '@homzhub/common/src/assets/images/circularCross.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { flags } from '@homzhub/common/src/components/atoms/Flag';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';

interface IProps {
  due: DueItem;
  onPressClose?: (dueId?: number) => void;
  onPayNav?: () => void;
}

const DueCard = (props: IProps): React.ReactElement => {
  const { due, onPressClose, onPayNav } = props;
  const { id, invoiceTitle, asset, totalDue, dueDate, isOverDue, createdAt, dueTitle, currency } = due;

  const { t } = useTranslation();
  const countries = useSelector(CommonSelectors.getCountryList);
  const dispatch = useDispatch();

  const onPressCrossIcon = (): void => {
    if (onPressClose) {
      onPressClose(due.id);
    }
  };

  const onPressPayNow = (): void => {
    dispatch(FinancialActions.setCurrentDueId(id));
    if (onPayNav) {
      onPayNav();
    }
  };

  const getFlag = (): React.ReactElement => {
    if (asset) return asset.country.flag;
    const dueCurrency = countries.find((item) => item.currencies.find((i) => i.currencyCode === currency.currencyCode));
    // @ts-ignore
    return flags[dueCurrency?.iso2Code ?? ''];
  };

  return (
    <View key={id} style={styles.container}>
      <View style={styles.contentContainer}>
        <PropertyAddressCountry
          primaryAddress={asset ? asset.projectName : dueTitle}
          primaryAddressTextStyles={{
            variant: 'text',
            size: 'small',
          }}
          subAddressTextStyles={{
            variant: 'label',
            size: 'large',
          }}
          containerStyle={styles.flexOne}
          countryFlag={getFlag()}
          showAddress
          subAddress={asset ? asset.formattedAddressWithCity : undefined}
        />
        {onPressClose && (
          <TouchableOpacity onPress={onPressCrossIcon}>
            <Cross />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.contentContainer, styles.marginTop]}>
        <View style={styles.dueDetailsContainer}>
          <Label type="large" style={[styles.categoryText]}>
            {invoiceTitle}
          </Label>
          <Label type="regular" style={styles.createdDate}>
            {DateUtils.getDisplayDate(createdAt, DateFormats.DoMMMYYYY)}
          </Label>
        </View>
        <Text textType="semiBold" type="small">
          {totalDue}
        </Text>
      </View>
      <View style={[styles.contentContainer, styles.marginTop]}>
        <View style={styles.bottomContainer}>
          <Icon
            name={icons.timer}
            size={30}
            color={isOverDue ? theme.colors.error : theme.colors.darkTint5}
            style={styles.icon}
          />
          <View>
            <Label
              type="regular"
              style={isOverDue ? styles.error : styles.dark}
              textType={isOverDue ? 'bold' : 'semiBold'}
            >
              {t(isOverDue ? 'assetFinancial:overdue' : 'assetFinancial:dueBy')}
            </Label>
            <Label
              type="regular"
              style={isOverDue ? styles.error : styles.dark}
              textType={isOverDue ? 'bold' : 'semiBold'}
            >
              {DateUtils.getDisplayDate(dueDate, DateFormats.DoMMMYYYY)}
            </Label>
          </View>
        </View>
        <Button
          type="primary"
          title={t('assetFinancial:payNow')}
          onPress={onPressPayNow}
          containerStyle={[styles.payNowButton, isOverDue && styles.redBackground]}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
};

export default React.memo(DueCard);

const styles = StyleSheet.create({
  divider: {
    marginVertical: 12,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
  container: {
    padding: 16,
  },
  paymentButton: {
    marginTop: 3,
    marginHorizontal: 0,
    height: 35,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginTop: {
    marginTop: 16,
  },
  dueDetailsContainer: {
    flex: 2,
  },
  dueText: {
    marginBottom: 2,
  },
  flexOne: {
    flex: 1,
  },
  error: {
    color: theme.colors.error,
  },
  categoryText: {
    color: theme.colors.darkTint3,
  },
  createdDate: {
    color: theme.colors.darkTint6,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginEnd: 10,
  },
  dark: {
    color: theme.colors.darkTint5,
  },
  redBackground: {
    backgroundColor: theme.colors.error,
  },
  payNowButton: {
    maxWidth: 120,
    maxHeight: 35,
  },
  buttonText: {
    marginVertical: 6,
  },
});
