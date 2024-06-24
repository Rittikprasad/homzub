import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Society } from '@homzhub/common/src/domain/models/Society';

interface ISocietyCardProp {
  society: Society;
  renderMenu?: React.ReactElement;
  onPressInfo?: () => void;
}

const SocietyInfoCard = ({ society, renderMenu, onPressInfo }: ISocietyCardProp): React.ReactElement => {
  const { t } = useTranslation();
  const isWeb = PlatformUtils.isWeb();
  const {
    societyBankInfo: { beneficiaryName, ifscCode, accountNumber, isVerified },
  } = society;

  const getFormattedBankData = (): { label: string; value: string }[] => {
    return [
      { label: t('accountHolder'), value: beneficiaryName },
      { label: t('accountNumber'), value: accountNumber },
      { label: t('assetFinancial:ifscCode'), value: ifscCode },
    ];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="label" size="large" fontWeight="semiBold">
          {society.name}
        </Typography>
        {renderMenu}
      </View>
      <Divider containerStyles={styles.divider} />
      <Typography variant="label" size="large" fontWeight="semiBold">
        {t('propertyPayment:accountInfo')}
        <Typography
          variant="label"
          size="large"
          style={{ color: isVerified ? theme.colors.green : theme.colors.error }}
        >
          {`  (${isVerified ? t('propertyPayment:verified') : t('propertyPayment:unverified')}) `}
        </Typography>
        {!isVerified && onPressInfo && (
          <TouchableOpacity onPress={onPressInfo}>
            <Icon name={icons.circularFilledInfo} size={isWeb ? 20 : 16} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </Typography>
      <View style={styles.infoContainer}>
        {getFormattedBankData().map((item, index) => {
          return (
            <View key={index} style={styles.info}>
              <Typography variant="label" size="large" style={styles.textStyle}>
                {item.label}
              </Typography>
              <Typography variant="label" size="large" style={styles.textStyle}>
                {item.value}
              </Typography>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default SocietyInfoCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 16,
    borderColor: theme.colors.darkTint10,
    marginVertical: 16,
  },
  divider: {
    marginVertical: 12,
    borderColor: theme.colors.darkTint10,
  },
  infoContainer: {
    marginTop: 20,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  textStyle: {
    color: theme.colors.darkTint3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
