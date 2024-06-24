import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { MaintenanceDetails } from '@homzhub/common/src/components/molecules/MaintenanceDetails';
import { AssetListingSection } from '@homzhub/common/src/components/HOC/AssetListingSection';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ScheduleTypes } from '@homzhub/common/src/constants/Terms';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ICreateSaleTermParams } from '@homzhub/common/src/domain/models/SaleTerm';
import { IExtraTrackData, ListingType } from '@homzhub/common/src/services/Analytics/interfaces';

interface IProps extends WithTranslation {
  currentAssetId: number;
  onNextStep: (type: TypeOfPlan, trackParam?: IExtraTrackData) => Promise<void>;
  assetGroupType: string;
  currencyData: Currency;
  startDate?: string;
}

interface IFormData {
  expectedPrice: string;
  bookingAmount: string;
  availableFrom: string;
  maintenanceAmount: string;
  maintenanceUnit: number;
  maintenanceSchedule: ScheduleTypes;
}

interface IOwnState {
  formData: IFormData;
  description: string;
  currentTermId: number;
  loading: boolean;
}

type Props = IProps & IWithMediaQuery;
const MAX_DESCRIPTION_LENGTH = 600;

class SaleTermController extends React.PureComponent<Props, IOwnState> {
  public state = {
    formData: {
      expectedPrice: '',
      bookingAmount: '',
      availableFrom: DateUtils.getCurrentDate(),
      maintenanceAmount: '',
      maintenanceSchedule: ScheduleTypes.MONTHLY,
      maintenanceUnit: -1,
    },
    description: '',
    currentTermId: -1,
    loading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    const { currentAssetId, t } = this.props;

    try {
      const response = await AssetRepository.getSaleTerms(currentAssetId);

      if (response.length <= 0) return;
      this.setState({
        currentTermId: response[0].id,
        description: response[0].description,
        formData: {
          expectedPrice: response[0].expectedPrice,
          availableFrom: DateUtils.getDisplayDate(response[0].availableFromDate, DateFormats.YYYYMMDD),
          bookingAmount: response[0].expectedBookingAmount,
          maintenanceAmount: response[0].maintenanceAmount,
          maintenanceSchedule: response[0].maintenanceSchedule ?? ScheduleTypes.MONTHLY,
          maintenanceUnit: response[0].maintenanceUnit ?? -1,
        },
      });
      if (response[0].status === 'APPROVED') {
        AlertHelper.info({
          message: t('property:propertyEditMsg'),
        });
      }
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
    }
  };

  public render = (): React.ReactNode => {
    const { t, currencyData, assetGroupType, isMobile, isTablet, startDate } = this.props;
    const { description, formData, loading } = this.state;

    return (
      <>
        <Loader visible={loading} />
        <Formik
          enableReinitialize
          onSubmit={this.onSubmit}
          initialValues={{ ...formData }}
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<IFormData>): React.ReactElement => {
            return (
              <>
                <AssetListingSection title={t('resaleTerms')}>
                  <>
                    {PlatformUtils.isWeb() && (
                      <Text type="small" textType="semiBold" style={styles.headerTitle}>
                        {t('headerTitle')}
                      </Text>
                    )}
                    <View style={PlatformUtils.isWeb() && !isMobile && styles.detailsContainer}>
                      <View
                        style={[
                          PlatformUtils.isWeb() && !isMobile && styles.inputContainer,
                          PlatformUtils.isWeb() && isTablet && !isMobile && styles.inputContainerTab,
                        ]}
                      >
                        <FormTextInput
                          inputType="number"
                          name="expectedPrice"
                          label={t('expectedPrice')}
                          placeholder={t('expectedPricePlaceholder')}
                          maxLength={formProps.values.expectedPrice.includes('.') ? 13 : 12}
                          formProps={formProps}
                          inputPrefixText={currencyData.currencySymbol}
                          inputGroupSuffixText={currencyData.currencyCode}
                          isMandatory
                          containerStyle={PlatformUtils.isWeb() && !isMobile && styles.input}
                        />
                      </View>
                      <View
                        style={[
                          PlatformUtils.isWeb() && !isMobile && styles.inputContainer,
                          PlatformUtils.isWeb() && isTablet && !isMobile && styles.inputContainerTab,
                        ]}
                      >
                        <FormTextInput
                          inputType="number"
                          name="bookingAmount"
                          label={t('bookingAmount')}
                          placeholder={t('bookingAmountPlaceholder')}
                          maxLength={formProps.values.bookingAmount.includes('.') ? 13 : 12}
                          formProps={formProps}
                          inputPrefixText={currencyData.currencySymbol}
                          inputGroupSuffixText={currencyData.currencyCode}
                          isMandatory
                          containerStyle={PlatformUtils.isWeb() && !isMobile && styles.input}
                        />
                      </View>
                      <View
                        style={[
                          PlatformUtils.isWeb() && !isMobile && styles.inputContainer,
                          PlatformUtils.isWeb() && isTablet && !isMobile && styles.inputContainerTab,
                        ]}
                      >
                        <FormCalendar
                          formProps={formProps}
                          name="availableFrom"
                          textType="label"
                          textSize="regular"
                          isMandatory
                          minDate={startDate}
                          containerStyle={PlatformUtils.isWeb() && !isMobile && styles.input}
                        />
                      </View>
                    </View>
                    <Text type="small" textType="semiBold" style={styles.headerTitle}>
                      {t('maintenance')}
                    </Text>
                    <MaintenanceDetails
                      formProps={formProps}
                      currencyData={currencyData}
                      assetGroupType={assetGroupType}
                      maintenanceUnitKey="maintenanceUnit"
                      maintenanceAmountKey="maintenanceAmount"
                      maintenanceScheduleKey="maintenanceSchedule"
                    />
                  </>
                </AssetListingSection>
                <AssetListingSection
                  title={t('assetDescription:description')}
                  containerStyles={styles.descriptionContainer}
                >
                  <TextArea
                    value={description}
                    wordCountLimit={MAX_DESCRIPTION_LENGTH}
                    placeholder={t('property:sellFlowFormDescription')}
                    onMessageChange={this.onDescriptionChange}
                    inputContainerStyle={styles.description}
                  />
                </AssetListingSection>
                <View style={PlatformUtils.isWeb && !isMobile && styles.buttonContainer}>
                  <FormButton
                    title={t('common:continue')}
                    type="primary"
                    formProps={formProps}
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    disabled={loading}
                    containerStyle={[styles.continue, PlatformUtils.isWeb && !isMobile && styles.continueWeb]}
                  />
                </View>
              </>
            );
          }}
        </Formik>
      </>
    );
  };

  private onDescriptionChange = (description: string): void => {
    this.setState({ description });
  };

  private onSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    formActions.setSubmitting(true);
    this.setState({ loading: true });
    const { description, currentTermId } = this.state;
    const { onNextStep, currentAssetId, assetGroupType } = this.props;

    const params: ICreateSaleTermParams = {
      expected_price: parseInt(values.expectedPrice, 10),
      expected_booking_amount: parseInt(values.bookingAmount, 10),
      available_from_date: values.availableFrom,
      maintenance_amount: parseInt(values.maintenanceAmount, 10),
      maintenance_payment_schedule: values.maintenanceSchedule,
      maintenance_unit: values.maintenanceUnit,
      description,
      is_edited: true,
    };

    // Removing un-required field as per the flow
    if (assetGroupType === AssetGroupTypes.COM) {
      delete params.maintenance_payment_schedule;
    } else if (assetGroupType === AssetGroupTypes.RES) {
      delete params.maintenance_unit;
    }

    try {
      if (currentTermId <= -1) {
        const response = await AssetRepository.createSaleTerm(currentAssetId, params);
        this.setState({ currentTermId: response.id });
      } else {
        await AssetRepository.updateSaleTerm(currentAssetId, currentTermId, params);
      }
      await onNextStep(TypeOfPlan.SELL, { listing_type: ListingType.SELL, price: parseInt(values.expectedPrice, 10) });
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
    }
    formActions.setSubmitting(false);
  };

  private formSchema = (): yup.ObjectSchema => {
    const { t } = this.props;
    return yup.object().shape({
      expectedPrice: yup
        .string()
        .min(3, t('minimumAmount'))
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('expectedPriceRequired')),
      bookingAmount: yup
        .string()
        .test({
          name: 'test-bookingAmount-greater',
          exclusive: true,
          test(bookingAmount: string) {
            const { expectedPrice } = this.parent;
            return parseInt(bookingAmount, 10) <= parseInt(expectedPrice, 10);
          },
          message: t('bookingAmountExceeded'),
        })
        .min(3, t('minimumAmount'))
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('bookingAmountRequired')),
      maintenanceAmount: yup
        .string()
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('maintenanceAmountRequired')),
      maintenanceSchedule: yup.string<ScheduleTypes>().required(t('maintenanceScheduleRequired')),
      availableFrom: yup.string(),
      description: yup.string(),
    });
  };
}

const HOC = withTranslation(LocaleConstants.namespacesKey.property)(SaleTermController);
const saleTermController = withMediaQuery<any>(HOC);
export { saleTermController as SaleTermController };

const styles = StyleSheet.create({
  continue: {
    flex: 0,
    marginVertical: 20,
  },
  continueWeb: {
    width: 251,
  },
  headerTitle: {
    marginTop: 28,
    color: theme.colors.darkTint3,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  inputContainer: {
    width: '31.5%',
    margin: 10,
  },
  inputContainerTab: {
    width: '47%',
    margin: 9,
  },

  input: {
    width: '100%',
  },
  description: {
    height: 200,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
});
