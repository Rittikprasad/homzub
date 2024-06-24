import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ProfileLeaseTerm from '@homzhub/common/src/components/organisms/ProfileLeaseTerm';
import { ITransactionDetail, TransactionDetail } from '@homzhub/common/src/domain/models/TransactionDetail';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { DetailType, ILeaseTermData } from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { ScheduleTypes } from '@homzhub/common/src/constants/Terms';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const CreateLease = (): React.ReactElement => {
  // HOOKS START
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();
  const listingData = useSelector(OfferSelectors.getListingDetail);
  const offerData: Offer | null = useSelector(OfferSelectors.getCurrentOffer);
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);
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
        navigate(ScreensKeys.PropertyDetailScreen);
        AlertHelper.success({ message: t('property:leaseUpdated') });
      } catch (e) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  if (!leaseData || !listingData) return <Loader visible />;
  return (
    <UserScreen title={t('common:Offers')} pageTitle={t('createLease')} onBackPress={goBack}>
      <ProfileLeaseTerm
        user={offerData?.user}
        assetGroup={listingData.assetGroup.code}
        leaseData={leaseData}
        onSubmit={onSubmit}
        isFromEdit={false}
      />
    </UserScreen>
  );
};

export default CreateLease;
