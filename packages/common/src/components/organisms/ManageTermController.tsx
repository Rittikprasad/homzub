import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { withMediaQuery, IWithMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput, IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import {
  IFormData,
  initialLeaseFormValues,
  LeaseFormSchema,
  LeaseTermForm,
  ModuleDependency,
} from '@homzhub/common/src/components/molecules/LeaseTermForm';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IManageTerm } from '@homzhub/common/src/domain/models/ManageTerm';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { IExtraTrackData } from '@homzhub/common/src/services/Analytics/interfaces';

interface IFormFields extends IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCode: string;
}
interface IOwnState {
  currentTermId: number;
  isPropertyOccupied: boolean;
  formData: IFormFields;
  loading: boolean;
}
interface IProps extends WithTranslation {
  currencyData: Currency;
  phoneCode: string;
  assetGroupType: AssetGroupTypes;
  currentAssetId: number;
  onNextStep: (type: TypeOfPlan, params?: IUpdateAssetParams, trackParam?: IExtraTrackData) => Promise<void>;
  webGroupPrefix?: (params: IWebProps) => React.ReactElement;
  leaseUnit?: number;
  startDate?: string;
}
type Props = IProps & IWithMediaQuery;
class ManageTermController extends React.PureComponent<Props, IOwnState> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      isPropertyOccupied: false,
      currentTermId: -1,
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        phoneCode: props.phoneCode,
        ...initialLeaseFormValues,
      },
      loading: false,
    };
  }

  public render = (): React.ReactNode => {
    const { isPropertyOccupied } = this.state;
    const { t, isMobile } = this.props;
    return (
      <>
        {this.renderCard()}
        {this.renderForm()}
        {!isPropertyOccupied && (
          <View style={PlatformUtils.isWeb() && !isMobile && styles.buttonContainer}>
            <Button
              type="primary"
              title={t('common:continue')}
              containerStyle={[styles.continue, PlatformUtils.isWeb() && !isMobile && styles.continueWeb]}
              onPress={this.onNextStep}
            />
          </View>
        )}
      </>
    );
  };

  private renderCard = (): React.ReactNode => {
    const { t, isMobile } = this.props;
    const { isPropertyOccupied } = this.state;
    return (
      <View style={styles.card}>
        <Text type="small" textType="semiBold" style={styles.textColor}>
          {t('propertyOccupied')}
        </Text>
        <Label type="large" textType="regular" style={[styles.textColor, styles.descriptionText]}>
          {t('propertyOccupiedDescription')}
        </Label>
        <View style={styles.optionContainer}>
          {[
            { title: t('common:yes'), isSelected: isPropertyOccupied },
            { title: t('common:no'), isSelected: !isPropertyOccupied },
          ].map(({ title, isSelected }) => (
            <View
              style={[(!PlatformUtils.isWeb() || isMobile) && styles.option, PlatformUtils.isWeb() && styles.optionWeb]}
              key={title}
            >
              <TouchableOpacity onPress={this.onOccupancyChanged}>
                <Icon
                  name={isSelected ? icons.circleFilled : icons.circleOutline}
                  color={isSelected ? theme.colors.primaryColor : theme.colors.disabled}
                  size={20}
                />
              </TouchableOpacity>
              <Label type="large" textType="regular" style={[styles.textColor, styles.optionText]}>
                {title}
              </Label>
            </View>
          ))}
        </View>
      </View>
    );
  };

  private renderForm = (): React.ReactNode => {
    const { t, currencyData, assetGroupType, isMobile, startDate, leaseUnit } = this.props;
    const { isPropertyOccupied, formData, loading } = this.state;
    return (
      <Formik
        enableReinitialize
        onSubmit={this.onSubmit}
        initialValues={{ ...formData }}
        validate={FormUtils.validate(this.formSchema)}
      >
        {isPropertyOccupied ? (
          (formProps: FormikProps<IFormFields>): React.ReactElement => {
            return (
              <>
                <LeaseTermForm
                  isFromManage
                  formProps={formProps}
                  currencyData={currencyData}
                  assetGroupType={assetGroupType}
                  leaseStartDate={startDate}
                  isLeaseUnitAvailable={!!leaseUnit}
                  moduleDependency={ModuleDependency.MANAGE_LISING}
                >
                  {this.renderTenantForm(formProps)}
                </LeaseTermForm>
                <View style={PlatformUtils.isWeb() && !isMobile && styles.buttonContainer}>
                  <FormButton
                    title={t('common:continue')}
                    type="primary"
                    formProps={formProps}
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    containerStyle={[styles.continue, PlatformUtils.isWeb() && !isMobile && styles.continueWeb]}
                    disabled={loading}
                  />
                </View>
              </>
            );
          }
        ) : (
          <></>
        )}
      </Formik>
    );
  };

  private renderTenantForm = (formProps: FormikProps<IFormFields>): React.ReactNode => {
    const { t, isMobile, isTablet, webGroupPrefix } = this.props;

    return (
      <>
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('tenantDetails')}
        </Text>
        <View style={PlatformUtils.isWeb() && !isMobile && styles.tenantDetail}>
          {(!PlatformUtils.isWeb() || isMobile) && (
            <View style={styles.optionContainer}>
              <View style={styles.firstName}>
                <FormTextInput
                  name="firstName"
                  inputType="name"
                  label={t('firstName')}
                  placeholder={t('firstName')}
                  formProps={formProps}
                  isMandatory
                />
              </View>
              <View style={styles.lastName}>
                <FormTextInput
                  name="lastName"
                  inputType="name"
                  label={t('lastName')}
                  placeholder={t('lastName')}
                  formProps={formProps}
                />
              </View>
            </View>
          )}
          {PlatformUtils.isWeb() && !isMobile && (
            <>
              <View style={[styles.inputContainer, isTablet && styles.inputContainerTab]}>
                <FormTextInput
                  name="firstName"
                  inputType="name"
                  label={t('firstName')}
                  placeholder={t('firstName')}
                  formProps={formProps}
                  isMandatory
                  containerStyle={styles.input}
                />
              </View>
              <View style={[styles.inputContainer, isTablet && styles.inputContainerTab]}>
                <FormTextInput
                  name="lastName"
                  inputType="name"
                  label={t('lastName')}
                  placeholder={t('lastName')}
                  formProps={formProps}
                  containerStyle={styles.input}
                />
              </View>
            </>
          )}
          <View
            style={[
              PlatformUtils.isWeb() && !isMobile && styles.inputContainer,
              PlatformUtils.isWeb() && !isMobile && isTablet && styles.inputContainerTab,
            ]}
          >
            <FormTextInput
              name="email"
              label={t('common:email')}
              placeholder={t('tenantEmail')}
              inputType="email"
              formProps={formProps}
              isMandatory
              containerStyle={PlatformUtils.isWeb() && !isMobile && styles.input}
            />
          </View>
          <View
            style={[
              PlatformUtils.isWeb() && !isMobile && styles.inputContainer,
              PlatformUtils.isWeb() && !isMobile && isTablet && styles.inputContainerTab,
            ]}
          >
            <FormTextInput
              name="phone"
              label={t('common:phone')}
              placeholder={t('tenantPhone')}
              inputType="phone"
              isMandatory
              inputPrefixText={formProps.values.phoneCode}
              phoneFieldDropdownText={t('auth:countryRegion')}
              formProps={formProps}
              containerStyle={PlatformUtils.isWeb() && !isMobile && styles.input}
              webGroupPrefix={webGroupPrefix}
            />
          </View>
        </View>
      </>
    );
  };

  private onOccupancyChanged = (): void => {
    const { isPropertyOccupied } = this.state;
    this.setState({ isPropertyOccupied: !isPropertyOccupied });
  };

  private onSubmit = async (values: IFormFields, formActions: FormikHelpers<IFormFields>): Promise<void> => {
    formActions.setSubmitting(true);
    this.setState({ loading: true });
    const { onNextStep, currentAssetId, assetGroupType, leaseUnit } = this.props;
    const { currentTermId } = this.state;
    const params: IManageTerm = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone_code: values.phoneCode,
      phone_number: values.phone,
      ...AssetService.extractLeaseParams(values, assetGroupType),
      ...(leaseUnit && { lease_unit: leaseUnit }),
    };
    try {
      if (currentTermId <= -1) {
        const id = await AssetRepository.createManageTerm(currentAssetId, params);
        this.setState({ currentTermId: id });
      } else {
        await AssetRepository.updateManageTerm(currentAssetId, currentTermId, params);
      }
      await onNextStep(TypeOfPlan.MANAGE);
      this.setState({ loading: false });
    }catch (err: any) {      this.setState({ loading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
    }
    formActions.setSubmitting(false);
  };

  private onNextStep = async (): Promise<void> => {
    const { onNextStep } = this.props;
    try {
      await onNextStep(TypeOfPlan.MANAGE, { is_managed: true });
    }catch (err: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
    }
  };

  private formSchema = (): yup.ObjectSchema => {
    const { t } = this.props;
    return yup.object().shape({
      ...LeaseFormSchema(t),
      firstName: yup
        .string()
        .matches(FormUtils.nameRegex, t('auth:onlyAlphabets'))
        .required(t('auth:firstNameRequired')),
      lastName: yup.string().matches(FormUtils.nameRegex, t('auth:onlyAlphabets')),
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      phone: yup.string().required(t('auth:numberRequired')),
    });
  };
}

const HOC = withTranslation(LocaleConstants.namespacesKey.property)(ManageTermController);
const manageTermController = withMediaQuery<any>(HOC);
export { manageTermController as ManageTermController };

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
  },
  textColor: {
    color: theme.colors.darkTint3,
  },
  descriptionText: {
    marginVertical: 12,
  },
  option: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginStart: 12,
  },
  continue: {
    flex: 0,
    marginTop: 20,
    marginBottom: 50,
  },
  continueWeb: {
    width: 251,
  },
  firstName: {
    flex: 0.5,
  },
  lastName: {
    flex: 0.5,
    marginStart: 16,
  },

  headerTitle: {
    marginTop: 20,
    marginBottom: 8,
    color: theme.colors.darkTint3,
  },
  inputContainer: {
    width: '31.5%',
    margin: 10,
  },
  input: {
    width: '100%',
  },
  tenantDetail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputContainerTab: {
    width: '47.5%',
    margin: 8,
  },
  optionWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 121,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
});
