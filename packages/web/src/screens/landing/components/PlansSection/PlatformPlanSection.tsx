import React, { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import PlatformPlanCard from '@homzhub/web/src/screens/landing/components/PlansSection/PlatformPlanCard';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PlatformPlanSection: FC = () => {
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const [platformPlanList, setPlatformPlanList] = useState<PlatformPlans[]>([]);
  useEffect(() => {
    ServiceRepository.getPlatformPlans()
      .then((response) => {
        setPlatformPlanList(response.sort((a, b) => Number(a.tier) - Number(b.tier)));
      })
      .catch((e) => {
        const error = ErrorUtils.getErrorMessage(e.details);
        AlertHelper.error({ message: error, statusCode: e.details.statusCode });
      });
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={isDesktop && styles.platformPageContainer}
    >
      <View style={styles.platformPage}>
        {platformPlanList &&
          platformPlanList.map((cardData, index) => {
            return <PlatformPlanCard key={index} platformPlans={cardData} />;
          })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  platformPageContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  platformPage: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 70,
    width: '100%',
    paddingHorizontal: '20%',
    alignItems: 'stretch',
  },
});

export default PlatformPlanSection;
