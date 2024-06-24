import React, { Component, ReactElement } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { cloneDeep, remove } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { CheckboxGroup, ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';
import { AssetHighlightCard } from '@homzhub/common/src/components/molecules/AssetHighlightCard';
import { AssetListingSection } from '@homzhub/common/src/components/HOC/AssetListingSection';
import InputGroup from '@homzhub/common/src/components/molecules/InputGroup';
import { Amenity, AssetAmenity } from '@homzhub/common/src/domain/models/Amenity';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { OtherDetails } from '@homzhub/common/src/constants/AssetHighlights';

enum Details {
  powerBackup = 'Power backup',
  isGated = 'Gated Society',
  cornerProperty = 'Corner Property',
  allDayAccess = '24x7 Access',
}

export interface IOtherDetail {
  id: number;
  name: string;
  details: ICheckboxGroupData[];
}

interface IOwnState {
  assetAmenity: AssetAmenity[];
  propertyHighlight: string[];
  selectedAmenity: number[];
  otherDetails: ICheckboxGroupData[];
  selectedDetails: string[];
  isSelected: boolean;
  loading: boolean;
}

interface IReduxState {
  isEditPropertyFlow?: boolean;
}

interface IHighlightProps {
  handleNextStep: () => void;
  propertyId: number;
  propertyDetail: Asset | null;
  lastVisitedStep: ILastVisitedStep;
  renderCarousel?: (
    data: Amenity[][],
    renderItem: (item: Amenity[]) => ReactElement,
    activeSlide: number,
    onSnap: (slideNumber: number) => void
  ) => ReactElement;
}

type Props = IHighlightProps & WithTranslation & IWithMediaQuery & IReduxState;

export class AssetHighlights extends Component<Props, IOwnState> {
  public state = {
    assetAmenity: [],
    propertyHighlight: [''],
    selectedAmenity: [],
    otherDetails: [],
    selectedDetails: [],
    isSelected: false,
    loading: false,
  };

  private MAX_ADDITIONAL_HIGHLIGHTS = 5;

  public componentDidMount = async (): Promise<void> => {
    const { propertyDetail, isEditPropertyFlow } = this.props;
    const shouldGetProjectAmenities =
      !isEditPropertyFlow && !propertyDetail?.lastVisitedStepSerialized.asset_creation?.is_highlights_done;
    await this.getAmenities();
    if (shouldGetProjectAmenities) {
      await this.getProjectAmenities();
    }
    const propertyType = propertyDetail ? propertyDetail.assetGroup.name : '';
    const data = OtherDetails.find((item: IOtherDetail) => item.name === propertyType);
    if (data) {
      this.setState({
        otherDetails: [...data.details],
      });
    }
    if (propertyDetail) {
      this.getSelectedData(propertyDetail);
    }
  };

  public render(): React.ReactNode {
    const { t, isMobile } = this.props;
    const { selectedAmenity, selectedDetails, propertyHighlight, loading } = this.state;
    const highlights = propertyHighlight.filter((item) => item);
    const isButtonDisabled = selectedAmenity.length <= 0 && selectedDetails.length <= 0 && highlights.length <= 0;
    const isWebMobile = PlatformUtils.isWeb() && isMobile;

    let continueButtonStyleWeb: ViewStyle = {};
    if (!isWebMobile && !PlatformUtils.isMobile()) continueButtonStyleWeb = styles.continueButtonStyleDesktop;

    return (
      <View style={PlatformUtils.isMobile() && styles.container}>
        {this.renderAmenities()}
        {this.renderOtherDetails()}
        {this.renderOtherHighlights()}
        <Loader visible={loading} />
        <Button
          type="primary"
          title={t('continue')}
          disabled={isButtonDisabled || loading}
          containerStyle={[styles.buttonStyle, continueButtonStyleWeb]}
          onPress={this.handleContinue}
        />
      </View>
    );
  }

  private renderAmenities = (): React.ReactElement[] => {
    const { renderCarousel } = this.props;
    const { assetAmenity, selectedAmenity } = this.state;

    return assetAmenity.map((item: AssetAmenity) => {
      const title = this.getAmenitiesTitle(item.name);
      return (
        <AssetHighlightCard
          title={title}
          data={item.amenities}
          key={item.id}
          selectedAmenity={selectedAmenity}
          onAmenityPress={this.onSelectAmenity}
          renderCarousel={renderCarousel}
        />
      );
    });
  };

  private renderOtherDetails = (): React.ReactElement | null => {
    const { t } = this.props;
    const { otherDetails, isSelected } = this.state;

    return (
      <AssetListingSection title={t('property:otherDetails')} containerStyles={styles.card}>
        <CheckboxGroup key={`${isSelected}-checkbox`} data={otherDetails} onToggle={this.onPressCheckbox} />
      </AssetListingSection>
    );
  };

  private renderOtherHighlights = (): React.ReactElement => {
    const { propertyHighlight } = this.state;
    const { t, isMobile, isTablet } = this.props;
    let highlightsContainerDeviceStyle: ViewStyle = {
      padding: 14,
    };
    let textInputContainerDeviceStyle: ViewStyle = {};
    let textInputDeviceStyle: ViewStyle = {};
    let addButtonDeviceStyle: ViewStyle = {
      paddingHorizontal: 16,
    };
    if (isMobile) {
      textInputDeviceStyle = styles.textInputAndAddButtonMobile;
      highlightsContainerDeviceStyle = { ...highlightsContainerDeviceStyle, ...styles.highlightsContainerMobile };
      textInputContainerDeviceStyle = styles.textInputContainerMobile;
      addButtonDeviceStyle = { ...addButtonDeviceStyle, ...styles.addButtonWrapperMobile };
    } else if (isTablet) textInputDeviceStyle = styles.textInputAndAddButtonTablet;
    else textInputDeviceStyle = styles.textInputAndAddButtonDesktop;
    return (
      <AssetListingSection title={t('property:propertyHighlights')} containerStyles={styles.card}>
        <InputGroup
          data={propertyHighlight}
          maxLimit={this.MAX_ADDITIONAL_HIGHLIGHTS}
          updateData={this.updateHighlight}
          inputContainer={highlightsContainerDeviceStyle}
          textInputContainerDeviceStyle={textInputContainerDeviceStyle}
          textInputDeviceStyle={textInputDeviceStyle}
          addButtonDeviceStyle={addButtonDeviceStyle}
        />
      </AssetListingSection>
    );
  };

  private onPressCheckbox = (id: number | string, isChecked: boolean): void => {
    const { otherDetails, isSelected } = this.state;
    const selectedValues: string[] = [];

    otherDetails.forEach((detail: ICheckboxGroupData) => {
      if (detail.id === id) {
        detail.isSelected = isChecked;
      }
      if (detail.isSelected) {
        selectedValues.push(detail.label);
      }
    });

    this.setState({ otherDetails, selectedDetails: selectedValues, isSelected: !isSelected });
  };

  private onSelectAmenity = (id: number): void => {
    const { selectedAmenity } = this.state;
    const newAmenity: number[] = cloneDeep(selectedAmenity);
    let value: number[];
    if (newAmenity.includes(id)) {
      remove(newAmenity, (item: number) => item === id);
      value = newAmenity;
    } else {
      value = newAmenity.concat(id);
    }
    this.setState({ selectedAmenity: value });
  };

  private getSelectedData = (propertyDetail: Asset): void => {
    const { selectedAmenity, otherDetails, selectedDetails } = this.state;
    const toUpdate = [...otherDetails];
    const selectedValues: string[] = selectedDetails;
    const newSelectedValues: number[] = selectedAmenity;
    const { amenityGroup, isGated, powerBackup, allDayAccess, cornerProperty, assetHighlights } = propertyDetail;
    if (amenityGroup) {
      amenityGroup.amenities.forEach((item) => {
        newSelectedValues.push(item.id);
      });

      this.setState({
        selectedAmenity: newSelectedValues,
      });
    }
    toUpdate.forEach((item: ICheckboxGroupData) => {
      switch (item.label) {
        case Details.isGated:
          item.isSelected = isGated;
          break;
        case Details.powerBackup:
          item.isSelected = powerBackup;
          break;
        case Details.cornerProperty:
          item.isSelected = cornerProperty;
          break;
        case Details.allDayAccess:
          item.isSelected = allDayAccess;
          break;
        default:
          item.isSelected = false;
      }
    });

    toUpdate.forEach((item: ICheckboxGroupData) => {
      if (item.isSelected) {
        selectedValues.push(item.label);
      }
    });
    this.setState({ otherDetails: toUpdate, selectedDetails: selectedValues });

    if (assetHighlights.length > 0) {
      this.setState({
        propertyHighlight: assetHighlights,
      });
    }
  };

  private getAmenitiesTitle = (name: string): string => {
    const { t } = this.props;
    if (name === 'General') {
      return t('property:amenities');
    }
    return name;
  };

  private handleContinue = async (): Promise<void> => {
    const { handleNextStep, propertyId, lastVisitedStep } = this.props;
    const { isGated, allDayAccess, cornerProperty, powerBackup } = Details;
    const { selectedAmenity, propertyHighlight, selectedDetails } = this.state;

    const otherDetails: string[] = selectedDetails;
    const highlights = propertyHighlight.filter((item) => item);

    const payload: IUpdateAssetParams = {
      amenities: selectedAmenity,
      asset_highlights: highlights,
      last_visited_step: {
        ...lastVisitedStep,
        asset_creation: {
          ...lastVisitedStep.asset_creation,
          is_highlights_done: true,
          total_step: 4,
        },
      },
      is_gated: otherDetails.includes(isGated),
      power_backup: otherDetails.includes(powerBackup),
      all_day_access: otherDetails.includes(allDayAccess),
      corner_property: otherDetails.includes(cornerProperty),
    };
    try {
      this.setLoader();
      await AssetRepository.updateAsset(propertyId, payload);
      this.resetLoader();
      handleNextStep();
    } catch (e) {
      this.resetLoader();
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  private updateHighlight = (values: string[]): void => {
    this.setState({
      propertyHighlight: values,
    });
  };

  private getAmenities = async (): Promise<void> => {
    try {
      this.setLoader();
      const response = await RecordAssetRepository.getAmenities();
      this.setState({ assetAmenity: response });
      this.resetLoader();
    } catch (e) {
      this.resetLoader();
      const error = ErrorUtils.getErrorMessage(e);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  private getProjectAmenities = async (): Promise<void> => {
    const { propertyDetail } = this.props;
    if (propertyDetail && propertyDetail.project) {
      try {
        const {
          project: { id },
        } = propertyDetail;
        this.setLoader();
        const projectAmenities = await PropertyRepository.getProjectAmenities(id);
        const projectAmenityIds = projectAmenities.map((item) => item.id);
        this.setState({ selectedAmenity: projectAmenityIds });
        this.resetLoader();
      } catch (e) {
        this.resetLoader();
        const error = ErrorUtils.getErrorMessage(e);
        AlertHelper.error({ message: error, statusCode: e.details.statusCode });
      }
    }
  };

  private resetLoader = (): void => this.setState({ loading: false });

  private setLoader = (): void => this.setState({ loading: true });
}
const assetHighlights = withMediaQuery<Props>(AssetHighlights);

const mapStateToProps = (state: IState): IReduxState => {
  const { getEditPropertyFlowDetails } = RecordAssetSelectors;
  return {
    isEditPropertyFlow: getEditPropertyFlowDetails(state).isEditPropertyFlow,
  };
};

export default connect(mapStateToProps, null)(withTranslation()(assetHighlights));

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  buttonStyle: {
    flex: 0,
    marginBottom: 28,
  },
  card: {
    marginBottom: 16,
  },
  iconButton: {
    flex: 0,
    backgroundColor: theme.colors.secondaryColor,
    marginRight: 14,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
    marginVertical: 8,
    borderColor: theme.colors.darkTint10,
  },
  highlightsContainer: {
    padding: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  textInputContainerMobile: {
    padding: 0,
  },
  highlightsContainerMobile: {
    padding: 0,
  },
  textInputWrapper: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  textInput: {
    width: '90%',
  },
  textInputAndAddButtonDesktop: {
    flexBasis: '31%',
    marginHorizontal: 12,
    marginVertical: 12,
  },
  textInputAndAddButtonTablet: {
    flexBasis: '45%',
    marginHorizontal: 12,
    marginVertical: 12,
  },
  textInputAndAddButtonMobile: {
    flexBasis: '100%',
  },
  addButtonWrapper: {
    flex: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  addButtonWrapperMobile: {
    paddingHorizontal: 0,
  },
  addButton: {
    borderStyle: 'dashed',
  },
  continueButtonStyleDesktop: {
    width: 250,
    alignSelf: 'flex-end',
  },
});
