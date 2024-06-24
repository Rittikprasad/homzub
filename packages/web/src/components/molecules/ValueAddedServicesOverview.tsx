import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import EstPortfolioValue from '@homzhub/web/src/components/molecules/EstPortfolioValue';
import OverviewCard from '@homzhub/web/src/components/molecules/OverviewCard';

interface IProps {
  propertiesCount: number;
  propertySelected?: number;
  servicesAvailable?: number;
}

const ValueAddedServicesOverview: React.FC<IProps> = ({
  propertiesCount,
  propertySelected,
  servicesAvailable,
}: IProps) => {
  return (
    <View style={styles.container}>
      <EstPortfolioValue propertiesCount={propertiesCount} />
      {propertySelected && <OverviewCard icon={icons.portfolio} count={propertySelected} title="Property Selected" />}
      {!!servicesAvailable && (
        <OverviewCard icon={icons.settingOutline} count={servicesAvailable} title="Services Available" />
      )}
    </View>
  );
};

export default ValueAddedServicesOverview;

interface IServicesOverviewStyle {
  container: ViewStyle;
}

const styles = StyleSheet.create<IServicesOverviewStyle>({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
});
