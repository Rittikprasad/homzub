import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import ProfileLeaseTerm from '@homzhub/common/src/components/organisms/ProfileLeaseTerm';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { DetailType, ILeaseTermData } from '@homzhub/common/src/domain/repositories/interfaces';
import { TransactionDetail, ITransactionDetail } from '@homzhub/common/src/domain/models/TransactionDetail';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { ScheduleTypes } from '@homzhub/common/src/constants/Terms';

interface IProps {
  assetDetail: Asset | undefined;
  onClosePopover: () => void;
  offer: Offer;
}

const CreateLeasePopover: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { assetDetail: listingData, offer: offerData, onClosePopover } = props;
  const { user } = { ...offerData, user: offerData.user || {} };
  const {
    assetGroup: { code },
  } = { ...listingData, assetGroup: listingData?.assetGroup || {} };
  const [leaseData, setLeaseData] = useState<TransactionDetail>();

  useEffect(() => {
    if (offerData && listingData && listingData.leaseTerm) {
      const { rent, securityDeposit, annualRentIncrementPercentage, leasePeriod, minLockInPeriod, moveInDate } =
        offerData;
      const {
        leaseTerm: { maintenanceAmount, maintenanceSchedule, maintenancePaidBy, utilityPaidBy },
        country: { currencies },
      } = listingData;

      const formattedData: ITransactionDetail = {
        rent,
        security_deposit: securityDeposit,
        total_lease_period: leasePeriod.toString(),
        lease_period: leasePeriod,
        minimum_lease_period: minLockInPeriod,
        annual_rent_increment_percentage: annualRentIncrementPercentage,
        lease_start_date: moveInDate,
        lease_end_date: DateUtils.getFutureDateByUnit(moveInDate, leasePeriod, 'months'),
        tentative_end_date: DateUtils.getFutureDateByUnit(moveInDate, leasePeriod, 'months', DateFormats.ISO),
        maintenance_amount: maintenanceAmount ?? 0,
        maintenance_paid_by: maintenancePaidBy,
        maintenance_payment_schedule: maintenanceSchedule || ScheduleTypes.MONTHLY,
        utility_paid_by: utilityPaidBy,
        currency: ObjectMapper.serialize(currencies[0]),
      };
      setLeaseData(ObjectMapper.deserialize(TransactionDetail, formattedData));
    }
  }, []);

  const onSubmit = async (payload: ILeaseTermData): Promise<void> => {
    if (offerData && listingData) {
      try {
        await OffersRepository.createLease({ negotiationId: offerData.id, body: payload });
        dispatch(
          PortfolioActions.setCurrentAsset({
            asset_id: listingData.id,
            listing_id: listingData.leaseTerm ? listingData.leaseTerm.leaseUnit.id : 0,
            assetType: DetailType.LEASE_UNIT,
          })
        );
        onClosePopover();
        AlertHelper.success({ message: t('property:leaseUpdated') });
      } catch (e) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  return (
    <View>
      <ProfileLeaseTerm
        user={user}
        assetGroup={code as string}
        leaseData={leaseData as TransactionDetail}
        onSubmit={onSubmit}
        isFromEdit={false}
        onCloseModal={onClosePopover}
      />
    </View>
  );
};

export default CreateLeasePopover;
