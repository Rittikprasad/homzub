import React, { useState, useEffect, FC } from 'react';
import { StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import ServicePlansCard from '@homzhub/web/src/screens/landing/components/PlansSection/ServicePlansCard';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  cardStyle?: ViewStyle;
  scrollStyle?: ViewStyle;
}
const ServicePlansSection: FC<IProps> = (props: IProps) => {
  const { cardStyle, scrollStyle } = props;
  const [servicePlansList, setServicePlansList] = useState([] as ServicePlans[]);
  useEffect(() => {
    ServiceRepository.getServicePlans()
      .then((response) => {
        setServicePlansList(response.sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder)));
      })
      .catch((e) => {
        const error = ErrorUtils.getErrorMessage(e.details);
        AlertHelper.error({ message: error, statusCode: e.details.statusCode });
      });
  }, []);
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);

  return (
    <>
      {!isDesktop ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.servicePlansContainer, scrollStyle]}
        >
          <ServicePlansCard
            servicePlansCardStyle={styles.servicePlansCardsContainer}
            servicePlansList={servicePlansList}
          />
        </ScrollView>
      ) : (
        <ServicePlansCard
          servicePlansCardStyle={styles.servicePlansContainerDesktop}
          servicePlansList={servicePlansList}
          cardStyle={cardStyle}
        />
      )}
    </>
  );
};
export default ServicePlansSection;

const styles = StyleSheet.create({
  servicePlansContainer: {
    backgroundColor: theme.colors.background,
    marginBottom: 60,
    width: '100%',
    paddingTop: 20,
  },
  servicePlansCardsContainer: {
    flexDirection: 'row',
    marginRight: 24,
    marginBottom: 0,
    paddingVertical: 0,
  },
  servicePlansContainerDesktop: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    flexWrap: 'wrap',
    width: '90%',
  },
});
