import React, { createRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { ResponseHelper } from '@homzhub/common/src/services/GooglePlaces/ResponseHelper';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetGroupSelection } from '@homzhub/common/src/components/molecules/AssetGroupSelection';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { PostAssetForm } from '@homzhub/common/src/components/molecules/PostAssetForm';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

interface IStateProps {
  assetGroups: AssetGroup[];
  isLoading: boolean;
  assetId: number;
  asset?: Asset | null;
  lastVisitedStep: ILastVisitedStep | null;
}

interface IDispatchProps {
  setAssetId: (id: number) => void;
  getAssetGroups: () => void;
  setEditPropertyFlow: (payload: boolean) => void;
  toggleEditPropertyFlowBottomSheet: (payload: boolean) => void;
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
  //   displayGoBackCaution: boolean;
}

interface IOwnProps {
  data: google.maps.places.PlaceResult | undefined;
  onSubmitPress: () => void;
  projectId: number | undefined;
}

type Props = WithTranslation & IDispatchProps & IStateProps & IOwnProps & IWithMediaQuery;

class AddAssetDetails extends React.PureComponent<Props, IOwnState> {
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
  };

  private formikInnerRef: React.RefObject<FormikProps<IFormData>> | null = createRef<FormikProps<IFormData>>();

  public componentDidMount = (): void => {
    const { getAssetGroups, data } = this.props;
    getAssetGroups();
    if (!data) {
      this.setDataFromAsset();
      return;
    }
    this.setDataFromProps();
  };

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IOwnState>): void {
    const { asset, data } = this.props;
    const { asset: prevAsset, data: prevData } = prevProps;

    if (asset !== prevAsset) {
      this.setDataFromAsset();
    }
    if (data !== prevData) {
      this.setDataFromProps();
    }
  }

  public render(): React.ReactNode {
    return <View style={styles.container}>{this.renderForm()}</View>;
  }

  private renderForm = (): React.ReactNode => {
    const { t, assetGroups, asset, isMobile } = this.props;
    const { formData, assetGroupTypeId, assetGroupId, assetGroupSelectionDisabled } = this.state;
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
            <View style={styles.subContainer}>
              <PostAssetForm formProps={formProps} isVerificationDone={asset?.isVerificationDocumentUploaded} />
              <AssetGroupSelection
                isDisabled={assetGroupSelectionDisabled}
                assetGroups={assetGroups}
                selectedAssetGroupType={assetGroupTypeId}
                selectedAssetGroupId={assetGroupId}
                onAssetGroupSelected={this.onAssetGroupSelected}
                scrollRef={null}
              />
              <FormButton
                disabled={assetGroupTypeId === -1}
                type="primary"
                title={t('common:submit')}
                containerStyle={[styles.buttonStyle, isMobile && styles.mobileButton]}
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
              />
            </View>
          );
        }}
      </Formik>
    );
  };

  private onSubmit = async (
    values: IFormData,
    formActions: FormikHelpers<IFormData>,
    shouldGoBack?: boolean
  ): Promise<void> => {
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
    const { setAssetId, assetId, lastVisitedStep, onSubmitPress, projectId } = this.props;
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

    const params = {
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
      ...(projectId && { project: projectId }),
    };

    formActions.setSubmitting(true);
    try {
      if (assetId > -1) {
        await AssetRepository.updateAsset(assetId, params);
      } else {
        const response = await AssetRepository.createAsset(params);
        setAssetId(response.id);
        AnalyticsService.track(EventType.AddPropertySuccess, { property_address: address });
      }
      onSubmitPress();
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      if (assetId < 1) {
        AnalyticsService.track(EventType.AddPropertyFailure, { property_address: address, error });
      }
      AlertHelper.error({ message: error, statusCode: e.details.statusCode }); // TODOS: Lakshit: Require clarity on usage
    }
    formActions.setSubmitting(false);
  };

  private onAssetGroupSelected = (assetGroupTypeId: number): void => {
    this.setState({ assetGroupTypeId });
  };

  private setDataFromProps = (): void => {
    const { data, asset } = this.props;
    const { formData } = this.state;

    if (!data) return;
    const { state, city, country, pincode, countryIsoCode } = ResponseHelper.getLocationDetails(data);
    const { name, formatted_address, geometry } = data;

    this.setState({
      formData: {
        ...formData,
        projectName: name as string,
        pincode,
        city,
        state,
        country,
        countryIsoCode,
        address: formatted_address ?? '',
        unitNo: asset?.unitNumber ?? '',
        blockNo: asset?.blockNumber ?? '',
      },
      assetGroupId: asset?.assetGroupId ?? -1,
      assetGroupTypeId: asset?.assetGroupTypeId ?? -1,
      assetGroupSelectionDisabled: !!asset,
      longitude: geometry?.location?.lng() ?? 0,
      latitude: geometry?.location?.lat() ?? 0,
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
  }> => {
    const { t } = this.props;
    return yup.object().shape({
      projectName: yup.string().required(t('projectNameRequired')),
      unitNo: yup.string().required(t('unitNoRequired')),
      blockNo: yup.string(),
      pincode: yup.string().required(t('common:requiredText', { field: t('pincode').toLowerCase() })),
      address: yup.string().required(t('common:requiredText', { field: t('address').toLowerCase() })),
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  subContainer: {
    width: '100%',
  },
  buttonStyle: {
    flex: 1,
    width: 'fit-content',
    margin: 16,
    alignSelf: 'flex-end',
    paddingHorizontal: '10%',
  },
  mobileButton: {
    alignSelf: 'auto',
    width: 'auto',
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
  const { getAssetGroups, getAssetGroupsLoading, getCurrentAssetId, getAssetDetails, getLastVisitedStep } =
    RecordAssetSelectors;
  return {
    assetGroups: getAssetGroups(state),
    assetId: getCurrentAssetId(state),
    isLoading: getAssetGroupsLoading(state),
    asset: getAssetDetails(state),
    lastVisitedStep: getLastVisitedStep(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetGroups, setAssetId, setEditPropertyFlow, toggleEditPropertyFlowBottomSheet } = RecordAssetActions;
  return bindActionCreators(
    {
      setAssetId,
      getAssetGroups,
      setEditPropertyFlow,
      toggleEditPropertyFlowBottomSheet,
    },
    dispatch
  );
};

const translatedAddAssetDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AddAssetDetails));

export default withMediaQuery<any>(translatedAddAssetDetails);
