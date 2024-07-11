import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { ErrorUtils } from "@homzhub/common/src/utils/ErrorUtils";
import { AssetRepository } from "@homzhub/common/src/domain/repositories/AssetRepository";
import { PortfolioNavigatorParamList } from "@homzhub/mobile/src/navigation/PortfolioStack";
import { RecordAssetActions } from "@homzhub/common/src/modules/recordAsset/actions";
import { theme } from "@homzhub/common/src/styles/theme";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { Divider } from "@homzhub/common/src/components/atoms/Divider";
import { Text } from "@homzhub/common/src/components/atoms/Text";
import { BottomSheet } from "@homzhub/common/src/components/molecules/BottomSheet";
import { IDropdownOption } from "@homzhub/common/src/components/molecules/FormDropdown";
import { PropertyAddressCountry } from "@homzhub/common/src/components/molecules/PropertyAddressCountry";
import CancelTerminateListing, {
  ISubmitPayload,
} from "@homzhub/mobile/src/components/organisms/CancelTerminateListing";
import { UserScreen } from "@homzhub/mobile/src/components/HOC/UserScreen";
import {
  ICancelListingPayload,
  ITerminateListingPayload,
  ListingType,
} from "@homzhub/common/src/domain/repositories/interfaces";
import {
  NavigationScreenProps,
  ScreensKeys,
  UpdatePropertyFormTypes,
} from "@homzhub/mobile/src/navigation/interfaces";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";

interface IDispatchProps {
  resetState: () => void;
}

interface IScreenState {
  isLoading: boolean;
  isFormTouched: boolean;
  isSheetVisible: boolean;
  reasons: IDropdownOption[];
}

type libProps = WithTranslation &
  NavigationScreenProps<
    PortfolioNavigatorParamList,
    ScreensKeys.UpdatePropertyScreen
  >;
type Props = IDispatchProps & libProps;

class UpdatePropertyListing extends Component<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      isFormTouched: false,
      isSheetVisible: false,
      reasons: [],
    };
  }

  public componentDidMount = (): void => {
    const {
      route: { params },
    } = this.props;
    this.setState({ isLoading: true });
    AssetRepository.getClosureReason(params.payload)
      .then((res) => {
        const formattedData: IDropdownOption[] = res.map((item) => ({
          value: item.id,
          label: item.title,
        }));

        this.setState({
          reasons: formattedData,
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.detail) });
      });
  };

  public render(): React.ReactNode {
    const {
      t,
      route: { params },
    } = this.props;
    const { isSheetVisible, isLoading } = this.state;
    const {
      assetDetail: { projectName, formattedAddressWithCity, country },
    } = params;
    return (
      <>
        <UserScreen
          title={t("portfolio")}
          loading={isLoading}
          pageTitle={this.renderSectionHeader()}
          onBackPress={(): void => this.onBack(false)}
        >
          <View style={styles.container}>
            <PropertyAddressCountry
              primaryAddress={projectName}
              subAddress={formattedAddressWithCity}
              countryFlag={country.flag}
              containerStyle={styles.address}
            />
            <Divider containerStyles={styles.divider} />
            {this.renderFormOnType()}
          </View>
        </UserScreen>
        <BottomSheet
          visible={isSheetVisible}
          headerTitle={t("common:backText")}
          onCloseSheet={this.onCloseSheet}
        >
          <View style={styles.sheetContainer}>
            <Text type="small" textType="regular">
              {t("common:wantToLeave")}
            </Text>
            <View style={styles.buttonView}>
              <Button
                type="primary"
                title={t("common:yes")}
                containerStyle={styles.leftButton}
                onPress={(): void => this.onBack(true)}
              />
              <Button
                type="secondary"
                title={t("common:no")}
                containerStyle={styles.buttonContainer}
                onPress={this.onCloseSheet}
              />
            </View>
          </View>
        </BottomSheet>
      </>
    );
  }

  private renderSectionHeader = (): string => {
    const {
      route: { params },
      t,
    } = this.props;

    switch (params.formType) {
      case UpdatePropertyFormTypes.CancelListing:
        return t("property:cancelListing");
      case UpdatePropertyFormTypes.TerminateListing:
        return t("property:noticeToVacate");
      case UpdatePropertyFormTypes.RenewListing:
        return t("property:renewListing");
      default:
        return t("property:cancelListing");
    }
  };

  private renderFormOnType = (): React.ReactElement | null => {
    const {
      route: { params },
    } = this.props;
    const { reasons } = this.state;
    if (!params) return null;
    const { formType, param } = params;
    switch (formType) {
      case UpdatePropertyFormTypes.CancelListing:
        return (
          <CancelTerminateListing
            onFormEdit={this.onFormEdit}
            reasonData={reasons}
            onSubmit={this.handleSubmit}
          />
        );
      case UpdatePropertyFormTypes.TerminateListing:
        return (
          <CancelTerminateListing
            isTerminate
            leaseEndDate={param?.endDate}
            onFormEdit={this.onFormEdit}
            reasonData={reasons}
            onSubmit={this.handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  // HANDLERS START

  private onBack = (leave: boolean): void => {
    const { navigation, resetState } = this.props;
    const { isFormTouched } = this.state;
    if (isFormTouched && !leave) {
      this.setState({
        isSheetVisible: true,
      });
    } else {
      navigation.goBack();
      resetState();
    }
  };

  private onFormEdit = (): void => {
    this.setState({
      isFormTouched: true,
    });
  };

  private onCloseSheet = (): void => {
    this.setState({
      isSheetVisible: false,
    });
  };

  private handleSubmit = (formData: ISubmitPayload): void => {
    const {
      t,
      navigation,
      route: { params },
    } = this.props;
    if (params && !params.assetDetail) return;
    const { id, assetStatusInfo } = params.assetDetail;
    const { reasonId, isTerminate, description, terminationDate } = formData;

    this.setState({ isLoading: true });

    if (isTerminate && params.param && params.param.id) {
      const payload: ITerminateListingPayload = {
        id: params.param.id,
        data: {
          termination_reason: reasonId,
          termination_date: `${terminationDate}T23:59:00Z`,
          ...(description && { termination_description: description }),
        },
      };
      AssetRepository.terminateLease(payload)
        .then((res) => {
          navigation.goBack();
          const role = res.app_permissions.is_asset_owner
            ? t("property:tenant")
            : t("property:owner");
          this.setState({ isLoading: false });
          AlertHelper.success({
            message: t("property:terminationRequest", { role }),
          });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          AlertHelper.error({
            message: ErrorUtils.getErrorMessage(err.detail),
          });
        });
    } else {
      if (!assetStatusInfo) return;
      const { leaseListingId, saleListingId } = assetStatusInfo;

      const payload: ICancelListingPayload = {
        param: {
          listingType:
            leaseListingId && leaseListingId > 0
              ? ListingType.LEASE_LISTING
              : ListingType.SALE_LISTING,
          listingId:
            leaseListingId && leaseListingId > 0
              ? leaseListingId
              : saleListingId ?? 0,
          assetId: id,
        },
        data: {
          cancel_reason: reasonId,
          ...(description && { cancel_description: description }),
        },
      };
      AssetRepository.cancelAssetListing(payload)
        .then(() => {
          this.updateAsset().then();
          this.setState({ isLoading: false });
          // @ts-ignore
          navigation.navigate(ScreensKeys.PropertyPostStack, {
            screen: ScreensKeys.PortfolioLandingScreen,
          });
          // navigation.navigate(ScreensKeys.PortfolioLandingScreen);
          AlertHelper.success({ message: t("property:listingCancelled") });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          AlertHelper.error({
            message: ErrorUtils.getErrorMessage(err.details),
          });
        });
    }
  };

  private updateAsset = async (): Promise<void> => {
    const {
      route: { params },
    } = this.props;

    if (params && !params.assetDetail) return;

    const { lastVisitedStepSerialized, id } = params.assetDetail;

    const last_visited_step = {
      ...lastVisitedStepSerialized,
      listing: {
        ...lastVisitedStepSerialized.listing,
        type: "",
        is_listing_created: false,
        is_verification_done: false,
        is_services_done: false,
        is_payment_done: false,
      },
    };
    const reqBody = { last_visited_step };
    await AssetRepository.updateAsset(id, reqBody);
  };

  // HANDLERS END
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { resetState } = RecordAssetActions;
  return bindActionCreators({ resetState }, dispatch);
};

export default connect(
  null,
  mapDispatchToProps
)(
  withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(
    UpdatePropertyListing
  )
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  address: {
    marginTop: 12,
  },
  divider: {
    marginTop: 10,
    borderColor: theme.colors.background,
  },
  sheetContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonView: {
    flexDirection: "row",
    marginTop: 24,
  },
  leftButton: {
    height: 50,
    marginRight: 20,
  },
  buttonContainer: {
    height: 50,
  },
});
