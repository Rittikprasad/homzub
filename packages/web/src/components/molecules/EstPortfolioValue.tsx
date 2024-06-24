import React from 'react';
import { ImageStyle, View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import HomzhubDashboard from '@homzhub/common/src/assets/images/homzhubDashboard.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IEstPortfolioProps {
  title?: string;
  icon?: string;
  iconColor?: string;
  headerText?: string;
  propertiesCount: number;
  isHeaderText?: boolean;
}

const EstPortfolioValue: React.FC<IEstPortfolioProps> = (props: IEstPortfolioProps) => {
  const { propertiesCount, icon, iconColor, title, headerText, isHeaderText = true } = props;
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);
  return (
    <View style={styles.portfolioContainer}>
      {isHeaderText && (
        <Typography variant="text" size="small" fontWeight="semiBold" style={styles.heading}>
          {headerText || t('common:properties')}
        </Typography>
      )}
      <View style={[styles.propertiesValueWrapper, !isHeaderText && styles.propertiesValueWrapperTab]}>
        {icon ? (
          <View style={[styles.iconWrapper, styles.roundIcon as ImageStyle]}>
            <Icon name={icon} size={30} color={iconColor} />
          </View>
        ) : (
          <HomzhubDashboard width={61} height={64} />
        )}
        <View style={styles.propertiesValueContainer}>
          <Typography variant="text" size="regular" fontWeight="bold" style={styles.valuation}>
            {propertiesCount}
          </Typography>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.heading}>
            {title || t('assetPortfolio:yourPortfolio')}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default EstPortfolioValue;

interface IEstPortfolioValueStyle {
  heading: ViewStyle;
  portfolioContainer: ViewStyle;
  propertiesValueWrapper: ViewStyle;
  propertiesValueContainer: ViewStyle;
  valuation: ViewStyle;
  iconWrapper: ViewStyle;
  roundIcon: ViewStyle;
  propertiesValueWrapperTab: ViewStyle;
}

const propertyOverviewStyle = (isMobile?: boolean): StyleSheet.NamedStyles<IEstPortfolioValueStyle> =>
  StyleSheet.create<IEstPortfolioValueStyle>({
    propertiesValueWrapper: {
      flexDirection: 'row',
      marginVertical: 'auto',
      paddingTop: '4%',
    },
    propertiesValueWrapperTab: {
      paddingTop: '0%',
    },
    portfolioContainer: {
      flex: 1,
      height: isMobile ? undefined : '100%',
    },
    heading: {
      color: theme.colors.darkTint1,
    },
    propertiesValueContainer: {
      marginLeft: 8,
      justifyContent: 'space-evenly',
    },
    valuation: {
      color: theme.colors.darkTint3,
    },
    iconWrapper: {
      overflow: 'hidden',
      borderRadius: 54,
      height: 54,
      width: 54,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    roundIcon: {
      marginRight: 8,
    },
  });
