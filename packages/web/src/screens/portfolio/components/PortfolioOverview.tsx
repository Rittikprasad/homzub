import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import OverviewCarousel, { IOverviewCarousalData } from '@homzhub/web/src/components/molecules/OverviewCarousel';
import EstPortfolioValue from '@homzhub/web/src/components/molecules/EstPortfolioValue';
import { Asset, Data } from '@homzhub/common/src/domain/models/Asset';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  onMetricsClicked: (name: string) => void;
}

const PortfolioOverview: React.FC<IProps> = (props: IProps) => {
  const { onMetricsClicked } = props;
  const [portfolioMetrics, setPortfolioMetrics] = useState<IOverviewCarousalData[]>([]);
  const [portfolioDetailsList, setPortfolioDetailsList] = useState<Asset[]>([]);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);
  const transformData = (arrayObject: Data[]): IOverviewCarousalData[] => {
    const newArrayOfObj = arrayObject.map(({ name: label, colorCode, count, ...rest }) => ({
      label,
      colorCode,
      count,
      ...rest,
    }));
    return newArrayOfObj as IOverviewCarousalData[];
  };
  useEffect(() => {
    getPorfolioMetrics((response) => setPortfolioMetrics(transformData(response.assetMetrics.assetGroups))).then();
    getPorfolioAssetDetails((response) => setPortfolioDetailsList(response)).then();
  }, []);
  const total = portfolioMetrics?.length ?? 0;
  return (
    <View style={styles.container}>
      <EstPortfolioValue propertiesCount={portfolioDetailsList.length} />
      {total > 0 ? <OverviewCarousel isVisible data={portfolioMetrics} onMetricsClicked={onMetricsClicked} /> : null}
    </View>
  );
};
const getPorfolioMetrics = async (callback: (response: AssetMetrics) => void): Promise<void> => {
  try {
    const response: AssetMetrics = await PortfolioRepository.getAssetMetrics();
    callback(response);
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
  }
};
const getPorfolioAssetDetails = async (callback: (response: Asset[]) => void): Promise<void> => {
  try {
    const response: Asset[] = await PortfolioRepository.getUserAssetDetails('ALL');
    callback(response);
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
  }
};

interface IPropertyOverviewStyle {
  container: ViewStyle;
  upArrow: ViewStyle;
  valueContainer: ViewStyle;
  valueChange: ViewStyle;
  valueChangeTime: ViewStyle;
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
    upArrow: {
      transform: [{ rotate: '-90deg' }],
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    valueChange: {
      color: theme.colors.lightGreen,
      marginRight: 8,
    },
    valueChangeTime: {
      color: theme.colors.darkTint6,
    },
  });

export default PortfolioOverview;
