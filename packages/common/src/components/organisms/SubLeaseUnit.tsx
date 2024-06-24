import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { cloneDeep, isEmpty } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';

import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { CheckboxGroup, ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';
import { FurnishingSelection } from '@homzhub/common/src/components/atoms/FurnishingSelection';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import {
  IFormData,
  initialLeaseFormValues,
  LeaseFormSchema,
  LeaseTermForm,
  ModuleDependency,
} from '@homzhub/common/src/components/molecules/LeaseTermForm';
import { FlowTypes, PropertySpaces } from '@homzhub/common/src/components/organisms/PropertySpaces';
import { AssetListingSection } from '@homzhub/common/src/components/HOC/AssetListingSection';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { FurnishingTypes } from '@homzhub/common/src/constants/Terms';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILeaseTermParams } from '@homzhub/common/src/domain/models/LeaseTerm';
import { LeaseSpaceUnit } from '@homzhub/common/src/domain/models/LeaseSpaceUnit';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { TenantPreference } from '@homzhub/common/src/domain/models/TenantInfo';

// CONSTANTS
const LEASE_UNIT = 'Lease Unit';

export interface ILeaseFormData extends IFormData {
  selectedPreferences: TenantPreference[];
  spaces: LeaseSpaceUnit[];
  status: string;
}

export const initialLeaseFormData: ILeaseFormData = {
  ...initialLeaseFormValues,
  spaces: [],
  selectedPreferences: [],
  status: '',
};

interface IProps {
  assetGroupType: AssetGroupTypes;
  currencyData: Currency;
  furnishing: FurnishingTypes;
  availableSpaces: SpaceType[];
  preferences: TenantPreference[];
  onSubmit: (values: ILeaseTermParams, key?: string, proceed?: boolean) => void;
  initialValues: ILeaseFormData;
  singleLeaseUnitKey?: number;
  route?: { key: string; title: string; id?: number };
  leaseUnit?: number;
  startDate?: string;
}

const SubLeaseUnit = (props: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const {
    singleLeaseUnitKey,
    assetGroupType,
    currencyData,
    furnishing,
    preferences,
    availableSpaces,
    onSubmit,
    route,
    initialValues,
    leaseUnit,
    startDate,
  } = props;

  // HOOKS
  const [tenantPreferences, setPreferences] = useState<ICheckboxGroupData[]>([]);
  const [spaces, setSpaces] = useState<SpaceType[]>([]);
  const [furnishingType, setFurnishingType] = useState(furnishing);
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  useEffect(() => {
    const toSet = preferences.map((detail: TenantPreference) => {
      const match = initialValues.selectedPreferences.find((preference) => preference.id === detail.id);
      return {
        id: detail.id,
        label: detail.name,
        isSelected: !!match,
      };
    });
    if (initialValues.status === 'APPROVED') {
      AlertHelper.info({
        message: t('property:propertyEditMsg'),
      });
    }
    setPreferences(toSet);
  }, [preferences, initialValues.selectedPreferences, initialValues.status]);

  useEffect(() => {
    if (spaces.length <= 0 || (spaces.length > 0 && !route?.id)) {
      const toSet = cloneDeep(availableSpaces).map((space) => {
        const match = initialValues.spaces.find((parentSpace) => parentSpace.spaceType === space.id);
        space.unitCount = match?.count ?? space.unitCount;
        space.count = space.unitCount + space.count;

        if (space.fieldType === 'CHECKBOX' && space.count === 0 && space.unitCount === 0) {
          space.isDisabled = true;
        }

        return space;
      });
      setSpaces(toSet);
    }
    if (spaces.length > 0 && route?.id) {
      const newSpaces = spaces.map((space) => {
        const newSpace = availableSpaces.find((obj) => obj.id === space.id);
        space.count = space.unitCount + (newSpace?.count ?? 0);

        if (space.fieldType === 'CHECKBOX') {
          space.isDisabled = space.unitCount === 0 && newSpace?.count === 0;
        }

        return space;
      });
      setSpaces(newSpaces);
    }
  }, [availableSpaces, initialValues.spaces]);
  // HOOKS END

  // USER INTERACTION CALLBACKS
  const handlePreferences = useCallback(
    (id: number | string, isChecked: boolean): void => {
      const toUpdate = [...tenantPreferences];

      toUpdate.forEach((detail: ICheckboxGroupData) => {
        if (detail.id === id) {
          detail.isSelected = isChecked;
        }
      });

      setPreferences(toUpdate);
    },
    [tenantPreferences]
  );

  const handleSpaceFormChange = useCallback(
    (id: number, count: number): void => {
      const nextState = spaces.map((space) => {
        if (space.id === id) {
          space.unitCount = count;
        }
        return space;
      });
      setSpaces(nextState);
    },
    [spaces]
  );

  const onSubmitPress = useCallback(
    (values: IFormData, formikHelpers: any, proceed?: boolean) => {
      const params = {
        ...AssetService.extractLeaseParams(values, assetGroupType),
        tenant_preferences: tenantPreferences
          .filter((pref: ICheckboxGroupData) => pref.isSelected)
          .map((pref: ICheckboxGroupData) => pref.id),
        furnishing: furnishingType,
        is_edited: true,
        ...(!leaseUnit && {
          lease_unit: {
            name: route?.title ?? LEASE_UNIT,
            spaces: spaces
              .map((space) => (route ? space.spaceList : space.spaceListEntire))
              .filter((data) => data.count > 0),
          },
        }),
      };

      if (route && route.id) {
        params.lease_listing = route.id;
      } else if (singleLeaseUnitKey && singleLeaseUnitKey !== -1) {
        params.lease_listing = singleLeaseUnitKey;
      }
      if (!isEmpty(formikHelpers)) {
        formikHelpers.setSubmitting(true);
      }
      onSubmit(params, route?.key, proceed);
      if (!isEmpty(formikHelpers)) {
        formikHelpers?.setSubmitting(false);
      }
    },
    [assetGroupType, onSubmit, tenantPreferences, route, furnishingType, spaces, availableSpaces, singleLeaseUnitKey]
  );
  // USER INTERACTION CALLBACKS END

  // FORM VALIDATIONS
  const formSchema = useCallback((): yup.ObjectSchema => {
    return yup.object().shape({
      ...LeaseFormSchema(t),
    });
  }, [t]);
  // FORM VALIDATIONS END

  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmitPress}
      initialValues={{ ...initialValues }}
      validate={FormUtils.validate(formSchema)}
    >
      {(formProps: FormikProps<IFormData>): React.ReactElement => {
        const onAddUnit = async (): Promise<void> => {
          const errors = await formProps.validateForm(formProps.values);
          if (!ObjectUtils.isEmpty(errors)) {
            formProps.setErrors(errors);
            Object.keys(errors).forEach((key) => {
              formProps.setFieldTouched(key);
            });
            return;
          }
          // @ts-ignore
          onSubmitPress(formProps.values, {}, false);
        };
        return (
          <>
            {route && availableSpaces.length > 0 && (
              <>
                <Text type="small" textType="semiBold" style={styles.title}>
                  {t('spacesText')}
                </Text>
                <PropertySpaces flowType={FlowTypes.LeaseFlow} spacesTypes={spaces} onChange={handleSpaceFormChange} />
                <FurnishingSelection
                  value={furnishingType}
                  onFurnishingChange={setFurnishingType}
                  containerStyle={styles.furnishingContainer}
                />
              </>
            )}
            <LeaseTermForm
              formProps={formProps}
              currencyData={currencyData}
              isSplitAsUnits={!!route}
              assetGroupType={assetGroupType}
              leaseStartDate={startDate}
              isLeaseUnitAvailable={!!leaseUnit}
              moduleDependency={ModuleDependency.LEASE_LISTING}
            >
              {preferences.length > 0 && (
                <AssetListingSection title={t('tenantPreferences')} containerStyles={styles.descriptionContainer}>
                  <CheckboxGroup data={tenantPreferences} onToggle={handlePreferences} />
                </AssetListingSection>
              )}
            </LeaseTermForm>
            <View
              style={[
                styles.buttonContainer,
                PlatformUtils.isWeb() && !isMobile && styles.buttonContainerWeb,
                PlatformUtils.isWeb() && isMobile && styles.buttonContainerMobile,
              ]}
            >
              {route && (
                <Button
                  type="primary"
                  title={t('saveUnit')}
                  titleStyle={styles.buttonTitle}
                  onPress={onAddUnit}
                  containerStyle={[
                    styles.continue,
                    styles.saveUnit,
                    PlatformUtils.isWeb() && !isMobile && styles.continueWeb,
                    PlatformUtils.isWeb() && isMobile && styles.continueMobile,
                  ]}
                />
              )}
              <FormButton
                title={t('common:proceed')}
                type="primary"
                formProps={formProps}
                // @ts-ignore
                onPress={formProps.handleSubmit}
                titleStyle={styles.buttonTitle}
                containerStyle={[
                  styles.continue,
                  PlatformUtils.isWeb() && !isMobile && styles.continueWeb,
                  route && PlatformUtils.isWeb() && isMobile && styles.continueMobile,
                  !route && PlatformUtils.isWeb() && isMobile && styles.continueMobileEntire,
                ]}
                disabled={formProps.isSubmitting}
              />
            </View>
          </>
        );
      }}
    </Formik>
  );
};

const memoizedComponent = React.memo(SubLeaseUnit);
export { memoizedComponent as SubLeaseUnit };

const styles = StyleSheet.create({
  continue: {
    marginTop: 20,
    marginBottom: 50,
  },
  continueWeb: {
    width: 251,
  },
  continueMobile: {
    width: '48%',
  },
  continueMobileEntire: {
    width: '100%',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  title: {
    padding: 16,
    backgroundColor: theme.colors.white,
    color: theme.colors.darkTint3,
  },
  furnishingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingBottom: 12,
  },
  buttonContainerWeb: {
    marginLeft: 'auto',
  },
  buttonContainerMobile: {
    width: '100%',
    alignItems: 'center',
  },
  saveUnit: {
    marginEnd: 16,
  },
  buttonTitle: {
    marginHorizontal: 0,
  },
});
