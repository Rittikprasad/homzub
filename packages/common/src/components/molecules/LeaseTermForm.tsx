import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import * as yup from "yup";
import { DateFormats, DateUtils } from "@homzhub/common/src/utils/DateUtils";
import { FormUtils } from "@homzhub/common/src/utils/FormUtils";
import { PlatformUtils } from "@homzhub/common/src/utils/PlatformUtils";
import { useDown } from "@homzhub/common/src/utils/MediaQueryUtils";
import { RecordAssetActions } from "@homzhub/common/src/modules/recordAsset/actions";
import { RecordAssetSelectors } from "@homzhub/common/src/modules/recordAsset/selectors";
import { theme } from "@homzhub/common/src/styles/theme";
import { Slider } from "@homzhub/common/src/components/atoms/Slider";
import { Text } from "@homzhub/common/src/components/atoms/Text";
import { TextArea } from "@homzhub/common/src/components/atoms/TextArea";
import { ButtonGroup } from "@homzhub/mobile/src/components/molecules/ButtonGroup";
import { FormTextInput } from "@homzhub/common/src/components/molecules/FormTextInput";
import { FormCalendar } from "@homzhub/common/src/components/molecules/FormCalendar";
import { MaintenanceDetails } from "@homzhub/common/src/components/molecules/MaintenanceDetails";
import { WithFieldError } from "@homzhub/common/src/components/molecules/WithFieldError";
import { AssetListingSection } from "@homzhub/common/src/components/HOC/AssetListingSection";
import { Currency } from "@homzhub/common/src/domain/models/Currency";
import { AssetGroupTypes } from "@homzhub/common/src/constants/AssetGroup";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";
import {
  PaidByTypes,
  ScheduleTypes,
} from "@homzhub/common/src/constants/Terms";
import { deviceBreakpoint } from "@homzhub/common/src/constants/DeviceBreakpoints";

export interface IFormData {
  [LeaseFormKeys.showMore]: boolean;
  [LeaseFormKeys.monthlyRent]: string;
  [LeaseFormKeys.securityDeposit]: string;
  [LeaseFormKeys.annualIncrement]: string;
  [LeaseFormKeys.availableFrom]: string;
  [LeaseFormKeys.maintenanceBy]: PaidByTypes;
  [LeaseFormKeys.maintenanceAmount]: string;
  [LeaseFormKeys.maintenanceSchedule]: ScheduleTypes;
  [LeaseFormKeys.maintenanceUnit]: number;
  [LeaseFormKeys.minimumLeasePeriod]: number;
  [LeaseFormKeys.maximumLeasePeriod]: number;
  [LeaseFormKeys.utilityBy]: PaidByTypes;
  [LeaseFormKeys.rentFreePeriod]: string;
  [LeaseFormKeys.description]: string;
}

enum LeaseFormKeys {
  monthlyRent = "monthlyRent",
  securityDeposit = "securityDeposit",
  showMore = "showMore",
  annualIncrement = "annualIncrement",
  maintenanceAmount = "maintenanceAmount",
  maintenanceSchedule = "maintenanceSchedule",
  maintenanceBy = "maintenanceBy",
  maintenanceUnit = "maintenanceUnit",
  availableFrom = "availableFrom",
  utilityBy = "utilityBy",
  minimumLeasePeriod = "minimumLeasePeriod",
  maximumLeasePeriod = "maximumLeasePeriod",
  rentFreePeriod = "rentFreePeriod",
  description = "description",
}

export enum ModuleDependency { //  To validate the use of Component in various flows.
  MANAGE_LISING = "MANAGE_LISTING",
  LEASE_LISTING = "LEASE_LISTING",
  UPDATE_LEASE = "UPDATE_LEASE",
}

interface IProps {
  formProps: any;
  currencyData: Currency;
  assetGroupType: string;
  leaseEndDate?: string;
  leaseStartDate?: string;
  isFromManage?: boolean;
  isSplitAsUnits?: boolean;
  isTitleRequired?: boolean;
  isFromEdit?: boolean;
  isLeaseUnitAvailable?: boolean;
  children?: React.ReactNode;
  moduleDependency: ModuleDependency;
}

const MINIMUM_LEASE_PERIOD = 1;
const MAXIMUM_LEASE_PERIOD = 24;
const MINIMUM_TOTAL_LEASE_PERIOD = 0;
const MAXIMUM_TOTAL_LEASE_PERIOD = 60;
const DEFAULT_LEASE_PERIOD = 11;

export const initialLeaseFormValues = {
  showMore: false,
  monthlyRent: "",
  securityDeposit: "",
  annualIncrement: "",
  description: "",
  minimumLeasePeriod: DEFAULT_LEASE_PERIOD,
  maximumLeasePeriod: DEFAULT_LEASE_PERIOD,
  availableFrom: DateUtils.getCurrentDate(),
  utilityBy: PaidByTypes.TENANT,
  rentFreePeriod: "",
  maintenanceBy: PaidByTypes.OWNER,
  maintenanceAmount: "",
  maintenanceSchedule: ScheduleTypes.MONTHLY,
  maintenanceUnit: -1,
};
const MAX_DESCRIPTION_LENGTH = 600;

const LeaseTermForm = ({
  formProps,
  currencyData,
  assetGroupType,
  children,
  leaseEndDate,
  leaseStartDate,
  isSplitAsUnits = false,
  isFromManage = false,
  isFromEdit = false,
  isTitleRequired = true,
  isLeaseUnitAvailable = false,
  moduleDependency,
}: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const { setFieldValue, setFieldTouched, values } = formProps;
  const dispatch = useDispatch();
  const maintenanceUnits = useSelector(
    RecordAssetSelectors.getMaintenanceUnits
  );
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  // CONSTANTS
  const PAID_BY_OPTIONS = [
    { title: t("owner"), value: PaidByTypes.OWNER },
    { title: t("tenant"), value: PaidByTypes.TENANT },
  ];
  const futureDate = DateUtils.getFutureDate(
    assetGroupType === AssetGroupTypes.COM ? 180 : 60
  );
  console.log("this is future date", futureDate);
  console.log("this is future date", leaseEndDate);
  let dateLabel;
  let minDate;
  let maxDate: string | undefined =
    leaseEndDate || DateUtils.getDisplayDate(futureDate, DateFormats.YYYYMMDD);
  if (isFromEdit && leaseStartDate) {
    minDate = leaseStartDate;
  }
  if (isLeaseUnitAvailable && leaseStartDate) {
    minDate = leaseStartDate;
  }
  if (isFromManage) {
    maxDate = DateUtils.getFutureYearLastDate(5);
    minDate = DateUtils.getPreviousYearStartDate(5);
    dateLabel = t("common:startingFrom");
  }
  // CONSTANTS END
  console.log("77777777777777777777777777777777777777777", maxDate);
  // EFFECT
  useEffect(() => {
    if (maintenanceUnits.length <= 0) {
      dispatch(RecordAssetActions.getMaintenanceUnits());
    }
  }, []);

  // INTERACTION HANDLERS
  const onShowMorePress = useCallback((): void => {
    setFieldValue(LeaseFormKeys.showMore, !values.showMore);
    if (!values.showMore) {
      setFieldTouched(LeaseFormKeys.annualIncrement, false);
    }
  }, [values.showMore]);

  const onSliderChange = useCallback((value: number): void => {
    setFieldValue(LeaseFormKeys.minimumLeasePeriod, Math.round(value));
  }, []);

  const onTotalSliderChange = useCallback((value: number): void => {
    setFieldValue(LeaseFormKeys.maximumLeasePeriod, Math.round(value));
  }, []);

  const onUtilityChanged = useCallback((value: string): void => {
    setFieldValue(LeaseFormKeys.utilityBy, value);
  }, []);

  const onMaintenanceChanged = useCallback((value: PaidByTypes): void => {
    setFieldValue(LeaseFormKeys.maintenanceBy, value);
    if (value === PaidByTypes.TENANT) {
      setFieldTouched(LeaseFormKeys.maintenanceAmount, false);
    }
  }, []);

  const onDescriptionChange = useCallback((value: string) => {
    setFieldValue(LeaseFormKeys.description, value);
  }, []);
  // INTERACTION HANDLERS END

  const isCreateLeaseWeb =
    moduleDependency === ModuleDependency.UPDATE_LEASE && PlatformUtils.isWeb();

  return (
    <>
      <AssetListingSection title={isTitleRequired ? t("leaseTerms") : ""}>
        <>
          {isFromManage && children}
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {t("rentAndSecurity")}
          </Text>

          <View style={PlatformUtils.isWeb() && !isMobile && styles.leaseTerms}>
            <View
              style={[
                PlatformUtils.isWeb() && !isMobile && styles.textInput1,
                PlatformUtils.isWeb() &&
                  isTablet &&
                  !isMobile &&
                  styles.textInputTab1,
              ]}
            >
              <FormTextInput
                inputType="number"
                name={LeaseFormKeys.monthlyRent}
                label={t("monthlyRent")}
                placeholder={t("monthlyRentPlaceholder")}
                maxLength={formProps.values.monthlyRent.includes(".") ? 13 : 12}
                formProps={formProps}
                inputPrefixText={currencyData.currencySymbol}
                inputGroupSuffixText={currencyData.currencyCode}
                isMandatory
                containerStyle={[
                  PlatformUtils.isWeb() && !isMobile && styles.textInput,
                ]}
              />
            </View>

            <View
              style={[
                PlatformUtils.isWeb() && !isMobile && styles.textInput1,
                PlatformUtils.isWeb() &&
                  isTablet &&
                  !isMobile &&
                  styles.textInputTab1,
              ]}
            >
              <FormTextInput
                inputType="number"
                name={LeaseFormKeys.securityDeposit}
                label={t("securityDeposit")}
                placeholder={t("securityDepositPlaceholder")}
                maxLength={
                  formProps.values.securityDeposit.includes(".") ? 13 : 12
                }
                formProps={formProps}
                inputPrefixText={currencyData.currencySymbol}
                inputGroupSuffixText={currencyData.currencyCode}
                isMandatory
                containerStyle={
                  PlatformUtils.isWeb() && !isMobile && styles.textInput
                }
              />
            </View>

            {isMobile && (
              <Text
                type="small"
                textType="semiBold"
                style={styles.showMore}
                onPress={onShowMorePress}
              >
                {values.showMore ? t("showLess") : t("showMore")}
              </Text>
            )}
            {(!isMobile || (isMobile && values.showMore)) && (
              <View
                style={[
                  PlatformUtils.isWeb() && !isMobile && styles.textInput1,
                  PlatformUtils.isWeb() &&
                    isTablet &&
                    !isMobile &&
                    styles.textInputTab1,
                ]}
              >
                <FormTextInput
                  inputType="decimal"
                  name={LeaseFormKeys.annualIncrement}
                  label={t("annualIncrement")}
                  placeholder={t("annualIncrementPlaceholder")}
                  maxLength={4}
                  formProps={formProps}
                  inputGroupSuffixText={t("annualIncrementSuffix")}
                  containerStyle={[
                    PlatformUtils.isWeb() && !isMobile && styles.textInput,
                  ]}
                />
              </View>
            )}
          </View>

          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {t("duration")}
          </Text>
          <View
            style={[
              PlatformUtils.isWeb() && !isMobile && styles.textInput1,
              PlatformUtils.isWeb() &&
                isTablet &&
                !isMobile &&
                styles.textInputTab1,
            ]}
          >
            <FormCalendar
              calendarTitle={dateLabel}
              formProps={formProps}
              label={dateLabel}
              allowPastDates={isFromManage}
              maxDate={maxDate}
              minDate={minDate}
              name={LeaseFormKeys.availableFrom}
              textType="label"
              textSize="regular"
              isMandatory
              containerStyle={[
                PlatformUtils.isWeb() && !isMobile && styles.textInput,
              ]}
            />
          </View>

          <>
            <View
              style={[
                PlatformUtils.isWeb() && !isMobile && styles.leasePeriod,
                isCreateLeaseWeb && styles.createLeaseWeb,
              ]}
            >
              <View>
                <Text
                  type="small"
                  textType="semiBold"
                  style={styles.sliderTitle}
                >
                  {t("minimumLeasePeriod")}
                </Text>
                <Slider
                  onSliderChange={onSliderChange}
                  minSliderRange={MINIMUM_LEASE_PERIOD}
                  maxSliderRange={MAXIMUM_LEASE_PERIOD}
                  minSliderValue={
                    formProps.values[LeaseFormKeys.minimumLeasePeriod]
                  }
                  isLabelRequired
                  labelText="Months"
                  sliderLength={isCreateLeaseWeb ? 250 : 0}
                />
              </View>
              <View
                style={
                  PlatformUtils.isWeb() &&
                  !isMobile &&
                  !isTablet &&
                  styles.leasePeriodMax
                }
              >
                <Text
                  type="small"
                  textType="semiBold"
                  style={styles.sliderTitle}
                >
                  {t("maximumLeasePeriod")}
                </Text>
                <WithFieldError
                  error={formProps.errors[LeaseFormKeys.maximumLeasePeriod]}
                >
                  <Slider
                    onSliderChange={onTotalSliderChange}
                    minSliderRange={MINIMUM_TOTAL_LEASE_PERIOD}
                    maxSliderRange={MAXIMUM_TOTAL_LEASE_PERIOD}
                    minSliderValue={
                      formProps.values[LeaseFormKeys.maximumLeasePeriod]
                    }
                    isLabelRequired
                    labelText="Months"
                    sliderLength={isCreateLeaseWeb ? 250 : 0}
                  />
                </WithFieldError>
              </View>
            </View>

            <Text type="small" textType="semiBold" style={styles.headerTitle}>
              {t("utilityBy")}
            </Text>
            <ButtonGroup<PaidByTypes>
              data={PAID_BY_OPTIONS}
              onItemSelect={onUtilityChanged}
              selectedItem={values[LeaseFormKeys.utilityBy]}
              containerStyle={[
                styles.buttonGroup,
                PlatformUtils.isWeb() && !isMobile && styles.buttonGroupWeb,
              ]}
            />
            <View
              pointerEvents={isSplitAsUnits ? "none" : undefined}
              style={isSplitAsUnits ? styles.disabled : undefined}
            >
              <Text type="small" textType="semiBold" style={styles.headerTitle}>
                {t("maintenanceBy")}
              </Text>
              <ButtonGroup<PaidByTypes>
                data={PAID_BY_OPTIONS}
                onItemSelect={onMaintenanceChanged}
                selectedItem={values.maintenanceBy}
                containerStyle={[
                  styles.buttonGroup,
                  PlatformUtils.isWeb() && !isMobile && styles.buttonGroupWeb,
                ]}
              />
            </View>
          </>
          <View
            style={
              PlatformUtils.isWeb() && !isMobile && styles.maintenanceStyle
            }
          >
            {values.maintenanceBy === PaidByTypes.TENANT && (
              <View
                style={
                  PlatformUtils.isWeb() &&
                  !isMobile &&
                  styles.maintenanceDetails
                }
              >
                <MaintenanceDetails
                  formProps={formProps}
                  currencyData={currencyData}
                  assetGroupType={assetGroupType}
                  maintenanceAmountKey={LeaseFormKeys.maintenanceAmount}
                  maintenanceScheduleKey={LeaseFormKeys.maintenanceSchedule}
                  maintenanceUnitKey={LeaseFormKeys.maintenanceUnit}
                />
              </View>
            )}
            {assetGroupType === AssetGroupTypes.COM && (
              <View
                style={[
                  PlatformUtils.isWeb() && !isMobile && styles.rentFreeStyle,
                  PlatformUtils.isWeb() &&
                    !isMobile &&
                    isTablet &&
                    styles.rentFreeStyleTab,
                ]}
              >
                <FormTextInput
                  inputType="number"
                  name={LeaseFormKeys.rentFreePeriod}
                  label={t("rentFreePeriod")}
                  placeholder={t("common:enter")}
                  maxLength={2}
                  formProps={formProps}
                  inputGroupSuffixText={t("common:days")}
                  containerStyle={[
                    PlatformUtils.isWeb() && !isMobile && styles.textInput,
                  ]}
                />
              </View>
            )}
          </View>
        </>
      </AssetListingSection>
      {!isFromManage && children}
      {!isFromEdit && (
        <AssetListingSection
          title={t("assetDescription:description")}
          contentContainerStyles={styles.paddingTop}
        >
          <TextArea
            value={formProps.values[LeaseFormKeys.description]}
            wordCountLimit={MAX_DESCRIPTION_LENGTH}
            placeholder={
              isFromManage
                ? t("property:manageFlowFormDescription")
                : t("property:rentFlowFormDescription")
            }
            onMessageChange={onDescriptionChange}
            containerStyle={styles.descriptionContainer}
            inputContainerStyle={PlatformUtils.isWeb() && styles.textAreaStyle}
          />
        </AssetListingSection>
      )}
    </>
  );
};

const LeaseFormSchema = (t: TFunction): object => {
  return {
    [LeaseFormKeys.maintenanceBy]: yup.string(),
    [LeaseFormKeys.showMore]: yup.boolean(),
    [LeaseFormKeys.monthlyRent]: yup
      .string()
      .matches(FormUtils.decimalRegex, t("common:onlyNumeric"))
      .test({
        name: "nonZeroTest",
        message: t("common:onlyNonZero"),
        test: FormUtils.validateNonZeroCase,
      })
      .required(t("monthlyRentRequired")),
    [LeaseFormKeys.securityDeposit]: yup
      .string()
      .matches(FormUtils.decimalRegex, t("common:onlyNumeric"))
      .test({
        name: "nonZeroTest",
        message: t("common:onlyNonZero"),
        test: FormUtils.validateNonZeroCase,
      })
      .required(t("securityDepositRequired")),
    [LeaseFormKeys.annualIncrement]: yup.string().when("showMore", {
      is: true,
      then: yup
        .string()
        .matches(FormUtils.percentageRegex, t("common:onlyNumeric"))
        .required(t("annualIncrementRequired")),
    }),
    [LeaseFormKeys.maintenanceAmount]: yup.string().when("maintenanceBy", {
      is: PaidByTypes.TENANT,
      then: yup
        .string()
        .matches(FormUtils.decimalRegex, t("common:onlyNumeric"))
        .required(t("maintenanceAmountRequired")),
    }),
    [LeaseFormKeys.maintenanceSchedule]: yup
      .string<ScheduleTypes>()
      .required(t("maintenanceScheduleRequired")),
    [LeaseFormKeys.availableFrom]: yup.string(),
    [LeaseFormKeys.minimumLeasePeriod]: yup.number(),
    [LeaseFormKeys.maximumLeasePeriod]: yup
      .number()
      .when(
        LeaseFormKeys.minimumLeasePeriod,
        (min: number, schema: yup.MixedSchema<any>) => {
          return schema.test({
            test: (value: number) => value >= min,
            message: t("maximumLeaseError"),
          });
        }
      ),
  };
};

const memoizedComponent = React.memo(LeaseTermForm);
export {
  memoizedComponent as LeaseTermForm,
  DEFAULT_LEASE_PERIOD,
  LeaseFormKeys,
  LeaseFormSchema,
};

const styles = StyleSheet.create({
  headerTitle: {
    marginTop: PlatformUtils.isWeb() ? 25 : 12,
    color: theme.colors.darkTint3,
  },
  showMore: {
    marginTop: 8,
    alignSelf: "flex-end",
    color: theme.colors.active,
  },
  buttonGroup: {
    marginTop: 14,
  },
  buttonGroupWeb: {
    width: 344,
  },
  sliderTitle: {
    marginTop: 28,
    color: theme.colors.darkTint3,
    marginBottom: 18,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  paddingTop: {
    paddingTop: 0,
  },
  leaseTerms: {
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    flex: 1,
  },
  textInput: {
    width: "100%",
  },
  textInput1: {
    width: "31.5%",
    margin: 10,
  },
  textInputTab1: {
    width: "47.5%",
    margin: 8,
  },
  leasePeriod: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  createLeaseWeb: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  leasePeriodMax: {
    left: 30,
  },
  textAreaStyle: {
    height: 200,
    padding: 16,
  },
  maintenanceStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rentFreeStyle: {
    top: 4,
    width: "31.5%",
  },
  rentFreeStyleTab: {
    width: "45%",
  },
  maintenanceDetails: {
    paddingRight: 15,
  },
});
