import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { flags } from '@homzhub/common/src/components/atoms/Flag';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';

interface IProps {
  dueItem: DueItem;
}

const DuesCard = (props: IProps): React.ReactElement => {
  const { dueItem } = props;
  const { invoiceTitle, totalDue } = dueItem;
  const { t } = useTranslation();
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const styles = duesCardStyle(isMobile);
  const addressTextStyle: ITypographyProps = {
    size: 'small',
    fontWeight: 'semiBold',
    variant: 'text',
  };
  const subAddressTextStyle: ITypographyProps = {
    size: 'regular',
    fontWeight: 'regular',
    variant: 'label',
  };
  return (
    <>
      <Divider containerStyles={styles.divider} />
      <View style={styles.container}>
        <View style={styles.propertyDetails}>
          <PropertyAddressCountry
            primaryAddress="2BHK - Godrej Prime"
            countryFlag={flags.IN}
            primaryAddressTextStyles={addressTextStyle}
            subAddressTextStyles={subAddressTextStyle}
            subAddress="Sindhi Society, Chembur, Mumbai- 400071"
          />
        </View>
        <View style={styles.actions}>
          <View style={styles.charges}>
            <Text type="small" textType="semiBold" style={styles.text}>
              {invoiceTitle}
            </Text>
            <Text type="small" textType="semiBold" style={styles.amount}>
              {totalDue}
            </Text>
          </View>
          <Button
            title={t('assetFinancial:payNow')}
            type="primary"
            containerStyle={styles.button}
            titleStyle={styles.buttonTitle}
            disabled
          />
        </View>
      </View>
    </>
  );
};

interface IAddRecrdsItemStyle {
  container: ViewStyle;
  propertyDetails: ViewStyle;
  actions: ViewStyle;
  buttonTitle: ViewStyle;
  text: ViewStyle;
  button: ViewStyle;
  charges: ViewStyle;
  amount: ViewStyle;
  divider: ViewStyle;
}

const duesCardStyle = (isMobile: boolean): StyleSheet.NamedStyles<IAddRecrdsItemStyle> =>
  StyleSheet.create<IAddRecrdsItemStyle>({
    container: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      margin: 12,
    },
    propertyDetails: {
      width: 400,
    },
    actions: {
      flexDirection: 'row',
      marginTop: isMobile ? 8 : 0,
    },
    buttonTitle: {
      width: 100,
      margin: 0,
    },
    text: {
      color: theme.colors.darkTint3,
    },
    button: {
      width: 107,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    charges: {
      marginRight: 40,
    },
    amount: {
      color: theme.colors.darkTint3,
    },
    divider: {
      borderColor: theme.colors.background,
    },
  });

export default DuesCard;
