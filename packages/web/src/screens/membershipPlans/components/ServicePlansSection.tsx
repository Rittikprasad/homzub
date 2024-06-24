import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import ServicePlansCard from '@homzhub/web/src/screens/membershipPlans/components/ServicePlansCard';
import { ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';
import '@homzhub/web/src/screens/membershipPlans/components/ServicePlansSection.scss';

const ServicePlansSection: React.FC = () => {
  // Redux
  const dispatch = useDispatch();
  const valueAddedServices = useSelector(RecordAssetSelectors.getValueAddedServices);
  useEffect(() => {
    const serviceByIds = {
      assetGroupId: 1,
      countryId: 1,
      city: 'Pune',
    };
    dispatch(RecordAssetActions.getValueAddedServices({ ...serviceByIds }));
  }, []);
  return (
    <div className="service-plans-card-container">
      {valueAddedServices
        .sort((a, b) => Number(a.valueBundle.displayOrder) - Number(b.valueBundle.displayOrder))
        .map((servicePlan: ValueAddedService) => (
          <ServicePlansCard servicePlan={servicePlan} key={servicePlan.id} />
        ))}
    </div>
  );
};

export default ServicePlansSection;
