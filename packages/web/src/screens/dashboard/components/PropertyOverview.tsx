import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import EstPortfolioValue from '@homzhub/web/src/components/molecules/EstPortfolioValue';
import OverviewCarousel, { IOverviewCarousalData } from '@homzhub/web/src/components/molecules/OverviewCarousel';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  data: IOverviewCarousalData[];
  propertyCount: number;
}

const PropertyOverview: FC<IProps> = ({ data, propertyCount }: IProps) => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);
  const total = data?.length ?? 0;
  return (
    <View style={styles.container}>
      <EstPortfolioValue propertiesCount={propertyCount} />
      {total > 0 ? <OverviewCarousel data={data} isVisible /> : null}
    </View>
  );
};

// const EstPortfolioValue: FC = () => {
//   const isMobile = useDown(deviceBreakpoint.MOBILE);
//   const styles = propertyOverviewStyle(isMobile);
//   return (
//     <View style={styles.portfolioContainer}>
//       <Typography variant="text" size="small" fontWeight="regular" style={styles.heading}>
//         Est. Portfolio Value
//       </Typography>
//       <View style={styles.propertiesValueWrapper}>
//         <HomzhubDashboard width={61} height={64} />
//         <View style={styles.propertiesValueContainer}>
//           <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.valuation}>
//             &#x20B9; 50 Lacs
//           </Typography>
//           <View style={styles.valueContainer}>
//             <Icon name={icons.dart} size={16} color={theme.colors.lightGreen} style={styles.upArrow} />
//             <Typography variant="label" size="large" fontWeight="semiBold" style={styles.valueChange}>
//               5%
//             </Typography>
//             <Typography variant="label" size="regular" fontWeight="semiBold" style={styles.valueChangeTime}>
//               Since last week
//             </Typography>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

interface IPropertyOverviewStyle {
  container: ViewStyle;
  heading: ViewStyle;
  portfolioContainer: ViewStyle;
  upArrow: ViewStyle;
  propertiesValueWrapper: ViewStyle;
  propertiesValueContainer: ViewStyle;
  valueContainer: ViewStyle;
  valuation: ViewStyle;
  valueChange: ViewStyle;
  valueChangeTime: ViewStyle;
  changeOpacity: ViewStyle;
}
const propertyOverviewStyle = (isMobile?: boolean): StyleSheet.NamedStyles<IPropertyOverviewStyle> =>
  StyleSheet.create<IPropertyOverviewStyle>({
    container: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      borderRadius: 4,
      backgroundColor: theme.colors.white,
    },
    heading: {
      color: theme.colors.darkTint1,
    },
    portfolioContainer: {
      flex: 1,
      height: isMobile ? undefined : '100%',
    },
    upArrow: {
      transform: [{ rotate: '-90deg' }],
    },
    propertiesValueWrapper: {
      flexDirection: 'row',
      marginVertical: 'auto',
    },
    propertiesValueContainer: {
      marginLeft: 8,
      justifyContent: 'space-evenly',
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    valuation: {
      color: theme.colors.primaryColor,
    },
    valueChange: {
      color: theme.colors.lightGreen,
      marginRight: 8,
    },
    valueChangeTime: {
      color: theme.colors.darkTint6,
    },
    changeOpacity: {
      opacity: 0,
    },
  });

// endregion

export default PropertyOverview;
