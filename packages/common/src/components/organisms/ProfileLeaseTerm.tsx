import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import {
  IFormData,
  initialLeaseFormValues,
  LeaseFormKeys,
  LeaseFormSchema,
  LeaseTermForm,
  ModuleDependency,
} from '@homzhub/common/src/components/molecules/LeaseTermForm';
import { TransactionDetail } from '@homzhub/common/src/domain/models/TransactionDetail';
import { User } from '@homzhub/common/src/domain/models/User';
import { ILeaseTermData } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  assetGroup: string;
  leaseData: TransactionDetail;
  onSubmit: (payload: ILeaseTermData) => void;
  user?: User;
  isFromEdit: boolean;
  onCloseModal?: () => void;
}

const ProfileLeaseTerm = (props: IProps): React.ReactElement => {
  const { leaseData, onSubmit, user, assetGroup, isFromEdit, onCloseModal } = props;

  const { t } = useTranslation(LocaleConstants.namespacesKey.property);

  // FORMATTED INITIAL VALUES
  const formattedValues = (detail: TransactionDetail): IFormData => {
    return {
      ...initialLeaseFormValues,
      availableFrom: detail.leaseStartDate,
      monthlyRent: detail.rent.toString(),
      maintenanceAmount: detail.maintenanceAmount?.toString() ?? '',
      securityDeposit: detail.securityDeposit.toString(),
      minimumLeasePeriod: detail.minimumLeasePeriod,
      maximumLeasePeriod: detail.leasePeriod,
      utilityBy: detail.utilityPaidBy,
      maintenanceBy: detail.maintenancePaidBy,
      maintenanceSchedule: detail.maintenancePaymentSchedule,
      ...(detail.maintenanceUnit.id > 0 && { maintenanceUnit: detail.maintenanceUnit.id }),
      annualIncrement: detail.annualRentIncrementPercentage ? detail.annualRentIncrementPercentage.toString() : '',
    };
  };

  const handleSubmit = (values: IFormData): void => {
    if (!leaseData) return;
    const { currency } = leaseData;

    // FORMATTED PAYLOAD
    const payload = {
      rent: Number(values[LeaseFormKeys.monthlyRent]),
      security_deposit: Number(values[LeaseFormKeys.securityDeposit]),
      lease_period: Number(values[LeaseFormKeys.maximumLeasePeriod]),
      annual_rent_increment_percentage: Number(values[LeaseFormKeys.annualIncrement]),
      maintenance_paid_by: values[LeaseFormKeys.maintenanceBy],
      utility_paid_by: values[LeaseFormKeys.utilityBy],
      lease_start_date: DateUtils.convertToISO(values[LeaseFormKeys.availableFrom]),
      tentative_end_date: DateUtils.getFutureDateByUnit(
        values[LeaseFormKeys.availableFrom],
        values[LeaseFormKeys.maximumLeasePeriod],
        'months',
        DateFormats.ISO
      ),
      currency: currency.currencyCode,
      minimum_lease_period: Number(values[LeaseFormKeys.minimumLeasePeriod]),
      maintenance_amount: Number(values[LeaseFormKeys.maintenanceAmount]) || null,
      ...(values[LeaseFormKeys.maintenanceUnit] > 0 && { maintenance_unit: values[LeaseFormKeys.maintenanceUnit] }),
    };

    onSubmit(payload);
  };

  // FORM VALIDATIONS
  const formSchema = useCallback((): yup.ObjectSchema => {
    return yup.object().shape({
      ...LeaseFormSchema(t),
    });
  }, [t]);
  // FORM VALIDATIONS END

  if (!leaseData) return <Loader visible />;
  const { currency, leaseEndDate, leaseStartDate } = leaseData;
  return (
    <>
      <View style={styles.container}>
        <Avatar fullName={user?.name ?? ''} designation="Tenant" />
        <Divider containerStyles={styles.divider} />
      </View>
      <Formik
        initialValues={{ ...formattedValues(leaseData) }}
        onSubmit={handleSubmit}
        validate={FormUtils.validate(formSchema)}
      >
        {(formProps: FormikProps<IFormData>): React.ReactElement => {
          return (
            <>
              <LeaseTermForm
                isTitleRequired={false}
                isFromEdit={isFromEdit}
                isFromManage
                formProps={formProps}
                currencyData={currency}
                assetGroupType={assetGroup}
                leaseEndDate={leaseEndDate}
                leaseStartDate={leaseStartDate}
                moduleDependency={ModuleDependency.UPDATE_LEASE}
              />
              {PlatformUtils.isWeb() && onCloseModal ? (
                <View style={styles.buttonActionGroup}>
                  <Button
                    type="secondary"
                    title={t('common:cancel')}
                    onPress={(): void => onCloseModal()}
                    containerStyle={[styles.button, PlatformUtils.isWeb() && styles.buttonWeb]}
                  />
                  <FormButton
                    title={t('common:submit')}
                    type="primary"
                    formProps={formProps}
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    containerStyle={[styles.button, PlatformUtils.isWeb() && styles.buttonWeb]}
                  />
                </View>
              ) : (
                <FormButton
                  title={t('common:update')}
                  type="primary"
                  formProps={formProps}
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  containerStyle={[styles.button]}
                />
              )}
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default ProfileLeaseTerm;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 22,
  },
  divider: {
    marginTop: 14,
    borderColor: theme.colors.background,
  },
  button: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  buttonWeb: {
    width: 200,
  },
  buttonActionGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
