import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AnalyticsHelper } from '@homzhub/common/src/utils/AnalyticsHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import LeaseTermController from '@homzhub/common/src/components/organisms/LeaseTermController';
import { SaleTermController } from '@homzhub/common/src/components/organisms/SaleTermController';
import { ManageTermController } from '@homzhub/common/src/components/organisms/ManageTermController';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { Asset, LeaseTypes } from '@homzhub/common/src/domain/models/Asset';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { IExtraTrackData } from '@homzhub/common/src/services/Analytics/interfaces';

interface IProps {
  assetDetails: Asset;
  typeOfPlan: TypeOfPlan;
  leaseType: LeaseTypes;
  onNextStep: () => void;
  scrollToTop: () => void;
  onLeaseTypeChange: (leaseType: LeaseTypes) => void;
  webGroupPrefix?: (params: IWebProps) => React.ReactElement;
  leaseUnit?: number;
  startDate?: string;
}

interface IDispatchProps {
  getMaintenanceUnits: () => void;
}

type Props = IDispatchProps & IProps;

class ActionController extends React.PureComponent<Props, {}> {
  public componentDidMount = (): void => {
    const {
      getMaintenanceUnits,
      assetDetails: { assetGroupCode },
    } = this.props;

    if (assetGroupCode === AssetGroupTypes.COM) {
      getMaintenanceUnits();
    }
  };

  public render = (): React.ReactNode => {
    const {
      assetDetails: {
        id,
        assetGroupCode,
        furnishing,
        assetLeaseType,
        country: { currencies, phoneCodes },
      },
      leaseType,
      typeOfPlan,
      scrollToTop,
      onLeaseTypeChange,
      webGroupPrefix,
      leaseUnit,
      startDate,
    } = this.props;

    return (
      <>
        {typeOfPlan === TypeOfPlan.SELL && (
          <SaleTermController
            currentAssetId={id}
            assetGroupType={assetGroupCode}
            currencyData={currencies[0]}
            onNextStep={this.onNextStep}
            startDate={startDate}
          />
        )}
        {typeOfPlan === TypeOfPlan.RENT && (
          <LeaseTermController
            assetLeaseType={assetLeaseType}
            leaseType={leaseType}
            currentAssetId={id}
            assetGroupType={assetGroupCode}
            furnishing={furnishing}
            currencyData={currencies[0]}
            onNextStep={this.onNextStep}
            scrollToTop={scrollToTop}
            onLeaseTypeChange={onLeaseTypeChange}
            leaseUnit={leaseUnit}
            startDate={startDate}
          />
        )}
        {typeOfPlan === TypeOfPlan.MANAGE && (
          <ManageTermController
            currentAssetId={id}
            assetGroupType={assetGroupCode}
            currencyData={currencies[0]}
            phoneCode={phoneCodes[0].phoneCode}
            onNextStep={this.onNextStep}
            webGroupPrefix={webGroupPrefix}
            leaseUnit={leaseUnit}
            startDate={startDate}
          />
        )}
      </>
    );
  };

  private onNextStep = async (
    type: TypeOfPlan,
    params?: IUpdateAssetParams,
    trackParam?: IExtraTrackData
  ): Promise<void> => {
    const {
      onNextStep,
      assetDetails,
      assetDetails: { lastVisitedStepSerialized, id },
    } = this.props;

    const last_visited_step = {
      ...lastVisitedStepSerialized,
      listing: {
        ...lastVisitedStepSerialized.listing,
        type,
        is_listing_created: true,
      },
    };
    const reqBody = params ? { last_visited_step, ...params } : { last_visited_step };
    const trackData = AnalyticsHelper.getPropertyTrackData(assetDetails, trackParam);

    try {
      await AssetRepository.updateAsset(id, reqBody);
      AnalyticsService.track(EventType.AddListingSuccess, trackData);
      onNextStep();
    } catch (error) {
      const e = ErrorUtils.getErrorMessage(error.details);
      AlertHelper.error({ message: e, statusCode: error.details.statusCode });
      AnalyticsService.track(EventType.AddListingFailure, { ...trackData, error: error.message });
    }
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getMaintenanceUnits } = RecordAssetActions;
  return bindActionCreators({ getMaintenanceUnits }, dispatch);
};

const HOC = connect(null, mapDispatchToProps)(ActionController);
export { HOC as ActionController };
