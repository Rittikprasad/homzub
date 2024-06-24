import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { RadioButtonGroup } from '@homzhub/common/src/components/molecules/RadioButtonGroup';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IUpdateProspectProfile } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IOfferForm {
  jobType: number;
  companyName: string;
  workEmail: string | null;
  occupants: string;
  tenantType: number;
}

interface IScreenState {
  offerForm: IOfferForm;
  userType: number;
  categories: IUnit[];
  tenantType: IUnit[];
  loading: boolean;
}

interface IStateToProps {
  userDetails: UserProfile | null;
}

interface IProp {
  editData: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.ProspectProfile>;
type Props = libraryProps & IProp & IStateToProps;
class ProspectProfile extends Component<Props, IScreenState> {
  public state = {
    offerForm: {
      jobType: 0,
      companyName: '',
      workEmail: '',
      occupants: '',
      tenantType: 0,
    },
    userType: 0,
    categories: [],
    tenantType: [],
    loading: false,
  };

  public async componentDidMount(): Promise<void> {
    try {
      const {
        route: { params },
        userDetails,
      } = this.props;
      this.setState({ loading: true });
      const { offerForm } = this.state;
      const tenant = await OffersRepository.getTenantTypes();
      const jobType = await OffersRepository.getJobType();
      this.setState({
        categories: jobType,
        tenantType: tenant,
        offerForm: {
          ...offerForm,
          workEmail: userDetails?.workInfo?.workEmail ?? '',
          companyName: userDetails?.workInfo?.companyName ?? '',
        },
      });
      const prospectsData = await OffersRepository.getProspectsInfo();
      const {
        user: { workInfo },
        occupants,
        tenantType,
      } = prospectsData;
      if (params?.editData) {
        this.setState({
          offerForm: {
            jobType: workInfo.jobType.id,
            occupants: String(occupants),
            companyName: workInfo.companyName,
            workEmail: workInfo.workEmail ?? '',
            tenantType: tenantType.id,
          },
          userType: tenantType.id,
        });
      }
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ loading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  }

  public render = (): React.ReactNode => {
    const { t, userDetails } = this.props;
    const { offerForm, userType, tenantType, loading } = this.state;
    if (!userDetails) return null;
    return (
      <Screen
        backgroundColor={theme.colors.white}
        headerProps={{
          type: 'secondary',
          title: t('offers:prospectProfile'),
          onIconPress: (): void => this.goBack(),
        }}
        isLoading={loading}
        scrollEnabled={false}
        contentContainerStyle={styles.screen}
      >
        <Formik
          onSubmit={this.onSubmit}
          initialValues={offerForm}
          enableReinitialize
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<IOfferForm>): React.ReactNode => {
            const disabledButton = !formProps.values.occupants || !formProps.values.jobType || !userType;
            return (
              <>
                <View style={styles.container}>
                  <KeyboardAwareScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <Avatar
                      fullName={userDetails.name}
                      designation={userDetails.email}
                      image={userDetails.profilePicture}
                    />
                    <Label type="large" textType="regular" style={styles.radioGroup}>
                      {t('offers:tenantProfileInfo')}
                    </Label>

                    <FormDropdown
                      formProps={formProps}
                      isMandatory
                      options={this.loadJobTypeCategories()}
                      name="jobType"
                      label={t('offers:jobType')}
                      placeholder={t('offers:selfEmployed')}
                      dropdownContainerStyle={styles.dropdownStyle}
                    />
                    <FormTextInput
                      formProps={formProps}
                      inputType="default"
                      name="companyName"
                      label={t('offers:organizationName')}
                      placeholder={t('offers:enterName')}
                    />
                    <FormTextInput
                      formProps={formProps}
                      inputType="email"
                      name="workEmail"
                      label={t('offers:workEmail')}
                      placeholder={t('offers:enterEmail')}
                    />
                    <FormTextInput
                      formProps={formProps}
                      isMandatory
                      inputType="number"
                      name="occupants"
                      label={t('offers:occupants')}
                      placeholder={t('offers:enterNumber')}
                    />

                    <Text type="small" textType="semiBold" style={styles.radioGroup}>
                      {t('offers:tenantType')}
                    </Text>
                    <RadioButtonGroup
                      numColumns={3}
                      data={tenantType as Unit[]}
                      onToggle={this.handleUserType}
                      selectedValue={userType}
                      containerStyle={styles.radioButton}
                    />
                  </KeyboardAwareScrollView>

                  <View style={styles.formButtonContainer}>
                    <FormButton
                      // @ts-ignore
                      onPress={formProps.handleSubmit}
                      formProps={formProps}
                      disabled={disabledButton}
                      type="primary"
                      title={t('common:next')}
                    />
                  </View>
                </View>
              </>
            );
          }}
        </Formik>
      </Screen>
    );
  };

  public onSubmit = async (values: IOfferForm): Promise<void> => {
    const {
      t,
      route: { params },
    } = this.props;
    const { navigation } = this.props;
    const { userType } = this.state;
    this.setState({ loading: true });
    const isValid = await this.validateEmail(values.workEmail);
    if (!isValid) {
      this.setState({ loading: false });
      AlertHelper.error({ message: t('auth:emailUsed') });
      return;
    }

    const payload: IUpdateProspectProfile = {
      job_type: values.jobType,
      company_name: values.companyName,
      work_email: !values.workEmail ? null : values.workEmail,
      number_of_occupants: Number(values.occupants),
      tenant_type: userType,
    };

    try {
      await OffersRepository.updateProspects(payload);
      this.setState({ loading: false });
      if (params && params.editData) {
        AlertHelper.success({ message: t('offers:prospectProfileEditSuccess'), duration: 5000 });
        navigation.goBack();
        return;
      }
      AlertHelper.success({ message: t('offers:prospectProfileCreateSuccess'), duration: 5000 });
      navigation.navigate(ScreensKeys.SubmitOffer);
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      this.setState({ loading: false });
    }
  };

  private validateEmail = async (email: string | null): Promise<boolean> => {
    const { userDetails } = this.props;
    let isExists = true;
    if (!email || userDetails?.workInfo?.workEmail === email) return true;
    if (userDetails?.workInfo?.workEmail !== email) {
      try {
        const res = await UserRepository.workEmailExists(email);
        isExists = res.is_exists;
      } catch (e) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
    return !isExists;
  };

  private formSchema = (): yup.ObjectSchema => {
    const { t } = this.props;
    return yup.object().shape({
      jobType: yup.number().required(t('moreProfile:fieldRequiredError')),
      occupants: yup.string().required(t('moreProfile:fieldRequiredError')),
      tenantType: yup.number().required(t('moreProfile:fieldRequiredError')),
    });
  };

  private loadJobTypeCategories = (): IDropdownOption[] => {
    const { categories } = this.state;
    return categories.map((category: IUnit) => {
      return {
        value: category.id,
        label: category.label,
      };
    });
  };

  private handleUserType = (id: number): void => {
    this.setState({ userType: id });
  };

  private goBack = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    if (params?.propertyTermId) {
      navigation.navigate(ScreensKeys.PropertyAssetDescription, { propertyTermId: params.propertyTermId });
    } else {
      navigation.goBack();
    }
  };
}

const mapStateToProps = (state: IState): IStateToProps => {
  return {
    userDetails: UserSelector.getUserProfile(state),
  };
};

export default connect(mapStateToProps, null)(withTranslation()(ProspectProfile));

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  container: {
    flex: 3,
    marginTop: 5,
  },
  radioGroup: {
    marginVertical: 16,
    color: theme.colors.darkTint3,
  },
  dropdownStyle: {
    paddingVertical: 12,
  },
  scrollView: {
    flex: 2.9,
    paddingHorizontal: 16,
  },
  formButtonContainer: {
    flex: 0.1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: theme.colors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    elevation: 7,
  },
  radioButton: {
    marginBottom: 20,
  },
});
