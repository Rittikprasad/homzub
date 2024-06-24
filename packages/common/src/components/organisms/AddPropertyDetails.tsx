import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { FurnishingSelection } from '@homzhub/common/src/components/atoms/FurnishingSelection';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { AssetDescriptionForm } from '@homzhub/common/src/components/molecules/AssetDescriptionForm';
import { FlowTypes, PropertySpaces } from '@homzhub/common/src/components/organisms/PropertySpaces';
import { AssetListingSection } from '@homzhub/common/src/components/HOC/AssetListingSection';
import { AssetDescriptionDropdownValues } from '@homzhub/common/src/domain/models/AssetDescriptionForm';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { ISpaceCount, SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IDescriptionForm {
  carpetArea?: string;
  areaUnit?: number;
  buildingGrade?: string;
  facing?: string;
  flooringType?: number;
  yearOfConstruction?: number;
  totalFloors?: string;
  onFloorNumber?: string;
}

interface IFurnishingForm {
  furnishingDetails?: string;
  furnishingType?: string;
}

interface IOwnProps extends WithTranslation {
  assetId: number;
  assetDetails: Asset | null;
  spaceTypes: SpaceType[];
  handleNextStep: () => void;
  lastVisitedStep: ILastVisitedStep;
  isEditPropertyFlow?: boolean;
}

interface IOwnState {
  spacesForm: ISpaceCount[];
  descriptionForm: IDescriptionForm;
  furnishingForm: IFurnishingForm;
  descriptionDropdownValues: AssetDescriptionDropdownValues | null;
  loading: boolean;
}

type IProps = IOwnProps & IWithMediaQuery;

class AddPropertyDetails extends React.PureComponent<IProps, IOwnState> {
  constructor(props: IProps) {
    super(props);
    const { assetDetails } = this.props;

    this.state = {
      spacesForm: [],
      descriptionForm: {
        carpetArea: (assetDetails && assetDetails.carpetArea && assetDetails.carpetArea.toString()) || undefined,
        areaUnit: (assetDetails && assetDetails.carpetAreaUnit && assetDetails.carpetAreaUnit.id) || 1,
        buildingGrade: '',
        facing: (assetDetails && assetDetails.facing) || undefined,
        flooringType: (assetDetails && assetDetails.floorType) || undefined,
        yearOfConstruction: (assetDetails && assetDetails.construction_Year) || undefined,
        totalFloors: (assetDetails && String(assetDetails.totalFloors)) || '0',
        onFloorNumber: (assetDetails && String(assetDetails.floorNumber)) || '0',
      },
      furnishingForm: {
        furnishingDetails: (assetDetails && assetDetails.furnishingDescription) || undefined,
        furnishingType: (assetDetails && assetDetails.furnishing) || undefined,
      },
      descriptionDropdownValues: null,
      loading: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    await this.getDescriptionDropdownValues();
  }

  public render(): ReactElement {
    const { spaceTypes, t, isMobile, lastVisitedStep } = this.props;
    const { descriptionForm, furnishingForm, descriptionDropdownValues, loading } = this.state;

    // TODO: Update this logic once verification shield logic is on place
    const isVerificationDone = lastVisitedStep.listing ? lastVisitedStep.listing.is_verification_done : false;
    return (
      <>
        <Loader visible={loading} />
        <Formik
          onSubmit={this.onSubmit}
          initialValues={{ ...descriptionForm, ...furnishingForm }}
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            return (
              <>
                <View style={PlatformUtils.isMobile() && styles.containerStyle}>
                  <AssetListingSection contentContainerStyles={styles.paddingStyle} title={t('property:spacesText')}>
                    <PropertySpaces
                      flowType={FlowTypes.PostAssetFlow}
                      onChange={this.handleSpaceFormChange}
                      spacesTypes={spaceTypes}
                      isVerificationDone={isVerificationDone}
                    />
                  </AssetListingSection>

                  {descriptionDropdownValues && (
                    <AssetListingSection title={t('assetDescription:description')} containerStyles={styles.description}>
                      <AssetDescriptionForm dropDownOptions={descriptionDropdownValues} formProps={formProps} />
                    </AssetListingSection>
                  )}

                  {descriptionDropdownValues && this.renderFurnishingFields(formProps)}
                </View>

                <Button
                  type="primary"
                  title={t('common:continue')}
                  containerStyle={[styles.buttonStyle, isMobile && styles.buttonMobileStyle]}
                  onPress={(): Promise<void> => this.onSubmit(formProps.values)}
                  disabled={formProps.submitCount === 1 || loading || !formProps.isValid}
                />
              </>
            );
          }}
        </Formik>
      </>
    );
  }

  private renderFurnishingFields = (formProps: FormikProps<FormikValues>): ReactElement => {
    const { t } = this.props;
    const onFurnishingChange = (value: string): void => this.setFurnishingStatus(formProps, value);
    return (
      <AssetListingSection title={t('property:furnishing')} containerStyles={styles.furnishingStyle}>
        <>
          <FurnishingSelection
            titleHidden
            containerStyle={{ flex: undefined }}
            value={formProps.values.furnishingType}
            onFurnishingChange={onFurnishingChange}
          />
          <FormTextInput
            style={styles.furnishingFieldStyle}
            name="furnishingDetails"
            label={t('property:furnishingDetails')}
            maxLength={400}
            inputType="default"
            formProps={formProps}
            multiline
          />
        </>
      </AssetListingSection>
    );
  };

  private onSubmit = async (values: FormikValues): Promise<void> => {
    const {
      areaUnit,
      carpetArea,
      facing,
      flooringType,
      furnishingDetails,
      onFloorNumber,
      totalFloors,
      yearOfConstruction,
      furnishingType,
    } = values;
    const { spacesForm } = this.state;
    const { handleNextStep, assetId, lastVisitedStep, t } = this.props;
    const spaceCount = spacesForm.filter((item) => item.count > 0).length;

    if (spaceCount < 1) {
      AlertHelper.error({ message: t('property:selectSpaces') });
      return;
    }
    const sanitizedSpaces = spacesForm
      .filter((item) => item && item.description !== '')
      .map((space) => {
        return {
          space_type: space.space_type,
          count: space.count,
          ...(space.description && { description: space.description }),
        };
      });

    const payload: IUpdateAssetParams = {
      carpet_area: carpetArea,
      carpet_area_unit: parseInt(areaUnit, 10),
      facing,
      floor_type: flooringType,
      furnishing_description: furnishingDetails,
      floor_number: Number(onFloorNumber) || 0,
      total_floors: Number(totalFloors) || 0,
      construction_year: yearOfConstruction,
      furnishing: furnishingType,
      spaces: sanitizedSpaces,
      last_visited_step: {
        ...lastVisitedStep,
        asset_creation: {
          ...lastVisitedStep.asset_creation,
          is_details_done: true,
          total_step: 4,
        },
      },
    };

    try {
      this.toggleLoader();
      await AssetRepository.updateAsset(assetId, payload);
      handleNextStep();
      this.toggleLoader();
    } catch (e) {
      this.toggleLoader();
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  private setFurnishingStatus = (formProps: FormikProps<FormikValues>, furnishingType: string): void => {
    formProps.setFieldValue('furnishingType', furnishingType);
  };

  private handleSpaceFormChange = (id: number, count: number, description?: string): void => {
    const { spacesForm } = this.state;

    spacesForm[id] = { space_type: id, count, description };
  };

  private toggleLoader = (): void => {
    this.setState((prevState) => ({ loading: !prevState.loading }));
  };

  private formSchema = (): yup.ObjectSchema<IDescriptionForm & IFurnishingForm> => {
    const { t } = this.props;
    return yup.object().shape({
      carpetArea: yup.string().optional(),
      areaUnit: yup.number().optional(),
      buildingGrade: yup.string().optional(),
      facing: yup.string().optional(),
      flooringType: yup.number().optional(),
      yearOfConstruction: yup.number().optional(),
      totalFloors: yup.string().optional(),
      onFloorNumber: yup
        .string()
        .optional()
        .test({
          name: 'lesserOnFloorTest',
          exclusive: true,
          message: t('property:onFloorValidation'),
          test(onFloorEntered: string) {
            const { totalFloors } = this.parent;
            return parseInt(totalFloors, 10) >= parseInt(onFloorEntered, 10);
          },
        }),
      furnishingType: yup.string().optional(),
      furnishingDetails: yup.string().optional(),
    });
  };

  private getDescriptionDropdownValues = async (): Promise<void> => {
    try {
      const response: AssetDescriptionDropdownValues = await AssetRepository.getAssetDescriptionDropdownValues();

      this.setState({
        descriptionDropdownValues: response,
        furnishingForm: {
          furnishingType: response.furnishingStatus[0].name,
        },
      });
    } catch (e) {
      AlertHelper.error({ message: e.message, statusCode: e.details.statusCode });
    }
  };
}

const translatedAddPropertyDetails = withTranslation()(AddPropertyDetails);
const addPropertyDetails = withMediaQuery<any>(translatedAddPropertyDetails);
export { addPropertyDetails as AddPropertyDetails };

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  buttonStyle: {
    flex: 0,
    width: '30%',
    alignSelf: 'flex-end',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 28,
  },
  buttonMobileStyle: {
    width: undefined,
    alignSelf: undefined,
    paddingHorizontal: undefined,
  },
  furnishingStyle: {
    marginTop: 16,
  },
  furnishingFieldStyle: {
    height: 85,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  paddingStyle: {
    paddingHorizontal: 0,
  },
  description: {
    marginTop: 16,
  },
});
