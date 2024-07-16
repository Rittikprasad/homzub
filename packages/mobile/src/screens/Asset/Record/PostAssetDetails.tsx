import React, { createRef, ReactElement } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { IPostAssetDetailsProps, NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { Header, PropertyDetailsLocation } from '@homzhub/mobile/src/components';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { AssetGroupSelection } from '@homzhub/common/src/components/molecules/AssetGroupSelection';
import { PostAssetForm } from '@homzhub/common/src/components/molecules/PostAssetForm';
import PropertyConfirmationView from '@homzhub/mobile/src/components/molecules/PropertyConfirmationView';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IEditPropertyFlow } from '@homzhub/common/src/modules/recordAsset/interface';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

interface IStateProps {
  assetGroups: AssetGroup[];
  isLoading: boolean;
  assetId: number;
  asset: Asset | null;
  lastVisitedStep: ILastVisitedStep | null;
  editPropertyFlowDetails: IEditPropertyFlow;
}

interface IDispatchProps {
  setAssetId: (id: number) => void;
  getAssetGroups: () => void;
  resetState: () => void;
  setEditPropertyFlow: (payload: boolean) => void;
  toggleEditPropertyFlowBottomSheet: (payload: boolean) => void;
  getAssets: () => void;
}

interface IFormData {
  projectName: string;
  unitNo: string;
  blockNo: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  countryIsoCode: string;
  address: string;
}

interface IOwnState {
  formData: IFormData;
  assetGroupTypeId: number;
  assetGroupId: number;
  latitude: number;
  longitude: number;
  assetGroupSelectionDisabled: boolean;
  displayGoBackCaution: boolean;
  loading: boolean;
}
type libraryProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.PostAssetDetails>;
type Props = WithTranslation & libraryProps & IDispatchProps & IStateProps;

class PostAssetDetails extends React.PureComponent<Props, IOwnState> {
  public state = {
    formData: {
      projectName: '',
      unitNo: '',
      blockNo: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
      countryIsoCode: '',
      address: '',
    },
    assetGroupSelectionDisabled: false,
    assetGroupTypeId: -1,
    assetGroupId: -1,
    longitude: 0,
    latitude: 0,
    displayGoBackCaution: false,
    loading: false,
  };

  private scrollView: KeyboardAwareScrollView | null = null;
  private formikInnerRef: React.RefObject<FormikProps<IFormData>> | null = createRef<FormikProps<IFormData>>();

  public componentDidMount = (): void => {
    const {
      getAssetGroups,
      navigation,
      route: { params },
    } = this.props;
    getAssetGroups();

    navigation.addListener('focus', this.onFocus);

    // @ts-ignore
    if (!params || (params && params.status)) {
      this.setDataFromAsset();
      return;
    }

    this.setDataFromNavProps();
  };

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IOwnState>): void {
    const { asset } = this.props;
    const { formData } = this.state;
    const { formData: prevForm } = prevState;
    const { asset: prevAsset } = prevProps;
    if (asset !== prevAsset || formData.projectName !== prevForm.projectName) {
      this.setDataFromAsset();
    }
  }

  public componentWillUnmount = (): void => {
    const { navigation } = this.props;
    navigation.removeListener('focus', this.onFocus);
  };

  public render(): React.ReactNode {
    const { isLoading, t } = this.props;
    const { loading } = this.state;

    return (
      <>
        <Header title={t('headerTitle')} onIconPress={this.handleGoBack} barVisible />
        <SafeAreaView style={styles.container}>{this.renderForm()}</SafeAreaView>
        <Loader visible={isLoading || loading} />
        {this.renderGoBackCaution()}
      </>
    );
  }

  private renderForm = (): React.ReactNode => {
    const { t, assetGroups, asset } = this.props;
    const {
      formData,
      assetGroupTypeId,
      assetGroupId,
      formData: { projectName, address },
      assetGroupSelectionDisabled,
      loading,
    } = this.state;

    // TODO: Update this logic once verification shield logic is on place
    const isVerificationDonne = asset ? asset.lastVisitedStep.isPropertyReady : false;

    return (
      <Formik
        validateOnMount
        enableReinitialize
        initialValues={formData}
        onSubmit={this.onSubmit}
        validate={FormUtils.validate(this.formSchema)}
        innerRef={this.formikInnerRef}
      >
        {(formProps: FormikProps<FormikValues>): React.ReactNode => {
          return (
            <>
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="never"
                showsVerticalScrollIndicator={false}
                ref={(ref): void => {
                  this.scrollView = ref;
                }}
              >
                <PropertyDetailsLocation
                  propertyName={projectName}
                  propertyAddress={address}
                  onNavigate={this.onChange}
                  testID="propertyLocation"
                  isVerificationDone={isVerificationDonne}
                />
                <PostAssetForm formProps={formProps} isVerificationDone={isVerificationDonne} />
                <AssetGroupSelection
                  isDisabled={assetGroupSelectionDisabled}
                  assetGroups={assetGroups}
                  selectedAssetGroupType={assetGroupTypeId}
                  selectedAssetGroupId={assetGroupId}
                  onAssetGroupSelected={this.onAssetGroupSelected}
                  scrollRef={this.scrollView}
                />
              </KeyboardAwareScrollView>
              <WithShadowView>
                <FormButton
                  disabled={assetGroupTypeId === -1 || loading}
                  type="primary"
                  title={t('common:submit')}
                  containerStyle={styles.buttonStyle}
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                />
              </WithShadowView>
              {this.renderEditFlowCaution()}
            </>
          );
        }}
      </Formik>
    );
  };

  private renderEditFlowCaution = (): ReactElement | null => {
    const {
      t,
      editPropertyFlowDetails: { showBottomSheet },
      asset,
    } = this.props;
    if (!asset) {
      return null;
    }

    return (
      <BottomSheet
        key="editFlowSheet"
        sheetHeight={450}
        headerTitle={t('editProperty')}
        visible={showBottomSheet}
        onCloseSheet={this.onBottomSheetClose}
      >
        <PropertyConfirmationView
          propertyData={asset}
          description={t('editPropertyCautionText')}
          message={t('common:wantToContinue')}
          onCancel={this.goBack}
          onContinue={this.onBottomSheetClose}
        />
      </BottomSheet>
    );
  };

  private renderGoBackCaution = (): ReactElement => {
    const { t } = this.props;
    const { displayGoBackCaution } = this.state;

    return (
      <BottomSheet
        key="goBackCaution"
        sheetHeight={300}
        visible={displayGoBackCaution}
        onCloseSheet={this.closeGoBackCaution}
      >
        <View style={styles.sheetStyle}>
          <Text type="regular" textType="regular">
            {t('saveYourDetailsCautionText')}
          </Text>
          <View style={styles.buttonGroupStyle}>
            <Button
              containerStyle={styles.marginRight}
              type="primary"
              title={t('common:save')}
              onPress={this.onSavePress}
            />
            <Button
              containerStyle={styles.marginLeft}
              type="primary"
              title={t('common:discard')}
              onPress={this.goBack}
            />
          </View>
        </View>
      </BottomSheet>
    );
  };

  private onChange = (): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.AssetLocationSearch);
  };

  private onBottomSheetClose = (): void => {
    const { toggleEditPropertyFlowBottomSheet } = this.props;

    toggleEditPropertyFlowBottomSheet(false);
  };

  private onSubmit = async (
    values: IFormData,
    formActions: FormikHelpers<IFormData>,
    shouldGoBack?: boolean
  ): Promise<void> => {
    const {
      setAssetId,
      assetId,
      navigation,
      lastVisitedStep,
      route: { params },
      getAssets,
    } = this.props;
    const {
      projectName: project_name,
      unitNo: unit_number,
      blockNo: block_number,
      pincode: postal_code,
      city: city_name,
      state: state_name,
      country: country_name,
      countryIsoCode: country_iso2_code,
      address,
    } = values;
    const { assetGroupTypeId: asset_type, longitude, latitude } = this.state;

    let visitedStep = {
      asset_creation: {
        is_created: true,
        total_step: 4,
      },
    };

    if (lastVisitedStep) {
      visitedStep = {
        ...lastVisitedStep,
        asset_creation: {
          ...lastVisitedStep.asset_creation,
          is_created: true,
          total_step: 4,
        },
      };
    }

    const payload = {
      city_name,
      state_name,
      country_name,
      country_iso2_code,
      address,
      project_name,
      postal_code,
      asset_type,
      block_number,
      unit_number,
      latitude,
      longitude,
      last_visited_step: visitedStep,
      // @ts-ignore
      ...(params && params.projectId && { project: params.projectId }),
    };

    formActions.setSubmitting(true);
    this.setState({ loading: true });
    try {
      if (assetId > -1) {
        // @ts-ignore
        const isApprovedListing = params && params.status === 'APPROVED';
        await AssetRepository.updateAsset(assetId, { ...payload, change_status: isApprovedListing });
      } else {
        const response = await AssetRepository.createAsset(payload);
        setAssetId(response.id);
        if (response) {
          getAssets();
        }
        AnalyticsService.track(EventType.AddPropertySuccess, { property_address: address });
      }
      this.setState({ loading: false });
      if (!shouldGoBack) {
        navigation.navigate(ScreensKeys.AddProperty);
        return;
      }
      this.goBack();
    }catch (e: any) {      this.setState({ loading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      if (assetId < 1) {
        AnalyticsService.track(EventType.AddPropertyFailure, { property_address: address, error });
      }
      AlertHelper.error({ message: error });
    }
    formActions.setSubmitting(false);
  };

  private onAssetGroupSelected = (assetGroupTypeId: number): void => {
    this.setState({ assetGroupTypeId });
  };

  private onFocus = (): void => {
    const {
      route: { params },
    } = this.props;

    if (!params) return;
    this.setDataFromNavProps();
  };

  private onSavePress = async (): Promise<void> => {
    if (!this.formikInnerRef) {
      return;
    }

    const { current } = this.formikInnerRef;
    await this.onSubmit(current?.values as IFormData, current as FormikHelpers<IFormData>, true);
  };

  private closeGoBackCaution = (): void => {
    this.setState({ displayGoBackCaution: false });
  };

  private handleGoBack = (): void => {
    if (!this.formikInnerRef) {
      return;
    }

    const { current } = this.formikInnerRef;
    if (current?.dirty) {
      this.setState({ displayGoBackCaution: true });
      return;
    }
    this.goBack();
  };

  private goBack = (): void => {
    const {
      navigation,
      setEditPropertyFlow,
      editPropertyFlowDetails: { isEditPropertyFlow },
      resetState,
    } = this.props;

    if (isEditPropertyFlow) {
      setEditPropertyFlow(false);
      resetState();
    }
    navigation.goBack();
  };

  private setDataFromNavProps = (): void => {
    const {
      route: { params },
      asset,
    } = this.props;
    const { formData } = this.state;

    if (!params) return;
    const { name, pincode, state, address, country, city, countryIsoCode, longitude, latitude } =
      params as IPostAssetDetailsProps;
    this.setState({
      formData: {
        ...formData,
        projectName: name,
        pincode,
        city,
        state,
        country,
        countryIsoCode,
        address,
        unitNo: asset?.unitNumber ?? '',
        blockNo: asset?.blockNumber ?? '',
      },
      assetGroupId: asset?.assetGroupId ?? -1,
      assetGroupTypeId: asset?.assetGroupTypeId ?? -1,
      assetGroupSelectionDisabled: !!asset,
      longitude,
      latitude,
    });
  };

  private setDataFromAsset = (): void => {
    const { asset } = this.props;
    if (!asset) {
      return;
    }

    const {
      pinCode,
      projectName,
      unitNumber,
      blockNumber,
      city,
      state,
      countryName,
      countryIsoCode,
      address,
      assetGroupTypeId,
      latitude,
      longitude,
      assetGroupId,
    } = asset;

    this.setState({
      formData: {
        projectName,
        unitNo: unitNumber,
        blockNo: blockNumber,
        pincode: pinCode,
        city,
        state,
        country: countryName,
        countryIsoCode,
        address,
      },
      assetGroupSelectionDisabled: true,
      assetGroupTypeId,
      assetGroupId,
      longitude,
      latitude,
    });
  };

  private formSchema = (): yup.ObjectSchema<{
    projectName: string;
    unitNo: string;
    blockNo: string;
    pincode: string;
    address: string;
    city: string;
  }> => {
    const { t } = this.props;
    return yup.object().shape({
      projectName: yup.string().required(t('projectNameRequired')),
      unitNo: yup.string().required(t('unitNoRequired')),
      blockNo: yup.string(),
      pincode: yup
        .string()
        .required(t('common:requiredText', { field: t('pincode').toLowerCase() }))
        .min(3, t('auth:minimumCharacters', { count: 3 })),
      address: yup.string().required(t('common:requiredText', { field: t('address').toLowerCase() })),
      city: yup.string().required(t('common:requiredText', { field: t('city').toLowerCase() })),
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  sheetStyle: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  buttonGroupStyle: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  marginRight: {
    marginRight: 5,
  },
  marginLeft: {
    marginLeft: 5,
  },
});

const mapStateToProps = (state: IState): IStateProps => {
  const {
    getAssetGroups,
    getAssetGroupsLoading,
    getCurrentAssetId,
    getAssetDetails,
    getLastVisitedStep,
    getEditPropertyFlowDetails,
  } = RecordAssetSelectors;
  return {
    assetGroups: getAssetGroups(state),
    assetId: getCurrentAssetId(state),
    isLoading: getAssetGroupsLoading(state),
    asset: getAssetDetails(state),
    lastVisitedStep: getLastVisitedStep(state),
    editPropertyFlowDetails: getEditPropertyFlowDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetGroups, setAssetId, setEditPropertyFlow, toggleEditPropertyFlowBottomSheet, resetState } =
    RecordAssetActions;
  const { getAssets } = UserActions;
  return bindActionCreators(
    {
      setAssetId,
      getAssetGroups,
      setEditPropertyFlow,
      toggleEditPropertyFlowBottomSheet,
      resetState,
      getAssets,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(PostAssetDetails));
