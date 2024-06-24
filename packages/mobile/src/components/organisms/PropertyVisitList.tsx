import React, { PureComponent } from 'react';
import { LayoutChangeEvent, PickerItemProps, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/PortfolioStack';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { AssetReviewCard } from '@homzhub/mobile/src/components/molecules/AssetReviewCard';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { ReviewForm } from '@homzhub/mobile/src/components/molecules/ReviewForm';
import VisitCard from '@homzhub/common/src/components/molecules/VisitCard';
import { AssetVisit, IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IVisitActionParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

type NavigationType =
  | StackNavigationProp<CommonParamList, ScreensKeys.PropertyVisits>
  | StackNavigationProp<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;

interface IProps {
  visitData: IVisitByKey[];
  handleAction: (param: IVisitActionParam) => void;
  visitType?: Tabs;
  dropdownData?: PickerItemProps[];
  isLoading?: boolean;
  isFromProperty?: boolean;
  dropdownValue?: number;
  isUserView?: boolean;
  handleUserView?: (id: number) => void;
  handleConfirmation?: (param: IVisitActionParam) => void; // Prop from EventWithProfile Bottomsheet
  handleReschedule: (asset: AssetVisit, userId?: number) => void;
  handleDropdown?: (value: string | number, visitType: Tabs) => void;
  containerStyle?: StyleProp<ViewStyle>;
  pillars?: Pillar[];
  resetData?: () => void;
  reviewVisitId?: number;
  isResponsiveHeightRequired?: boolean;
  navigation?: NavigationType;
}

interface IScreenState {
  showReviewForm: boolean;
  showDeleteForm: boolean;
  reviewAsset: AssetVisit | null;
  height: number;
  replyReview: boolean;
  reviewData: AssetReview;
  reportCategories: Unit[];
}

type Props = IProps & WithTranslation;

class PropertyVisitList extends PureComponent<Props, IScreenState> {
  public state = {
    showReviewForm: false,
    showDeleteForm: false,
    reviewAsset: null,
    height: theme.viewport.height,
    replyReview: false,
    reviewData: new AssetReview(),
    reportCategories: [],
  };

  public componentDidMount = async (): Promise<void> => {
    this.openReviewForm();
    await this.getReportCategory();
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const { visitData } = this.props;

    if (prevProps.visitData.length <= 0 && visitData.length > 0) {
      this.openReviewForm();
    }
  };

  public render(): React.ReactNode {
    const {
      visitData,
      isLoading,
      t,
      dropdownData,
      dropdownValue,
      visitType,
      handleDropdown,
      isUserView,
      containerStyle,
      isResponsiveHeightRequired = true,
    } = this.props;

    const { height } = this.state;

    const totalVisit = visitData[0] ? visitData[0].totalVisits : 0;

    return (
      <View onLayout={this.onLayout} style={[styles.mainView, containerStyle]}>
        {dropdownData && handleDropdown && visitType && (
          <View style={styles.headerView}>
            <Label type="regular" style={styles.count}>
              {t('totalVisit', { totalVisit })}
            </Label>
            <Dropdown
              isOutline
              data={dropdownData}
              value={dropdownValue ?? ''}
              icon={icons.downArrow}
              textStyle={{ color: theme.colors.blue }}
              iconColor={theme.colors.blue}
              onDonePress={(value: string | number): void => handleDropdown(value, visitType)}
              containerStyle={styles.dropdownStyle}
            />
          </View>
        )}
        {visitData.length > 0 ? (
          <ScrollView
            style={isResponsiveHeightRequired ? { minHeight: height } : {}}
            showsVerticalScrollIndicator={false}
          >
            {visitData.map((item) => {
              const results = item.results as AssetVisit[];
              return (
                <>
                  {!isUserView && results.length > 0 && (
                    <View style={styles.dateView}>
                      <View style={styles.dividerView} />
                      <Text type="small" style={styles.horizontalStyle}>
                        {item.key}
                      </Text>
                      <View style={styles.dividerView} />
                    </View>
                  )}
                  {results.map((asset: AssetVisit) => {
                    return this.renderItem(asset);
                  })}
                </>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyView}>
            <EmptyState icon={icons.schedule} title={t('noVisits')} />
          </View>
        )}
        <Loader visible={isLoading ?? false} />
        {this.renderReviewForm()}
        {this.renderReplyReviewForm()}
      </View>
    );
  }

  private renderItem = (item: AssetVisit): React.ReactElement => {
    const { visitType, handleReschedule, isUserView, handleUserView, handleAction, handleConfirmation } = this.props;

    return (
      <VisitCard
        visit={item}
        visitType={visitType}
        isUserView={isUserView}
        handleUserView={handleUserView}
        handleReschedule={handleReschedule}
        navigateToAssetDetails={this.navigateToAssetDetails}
        handleAction={handleAction}
        handleConfirmation={handleConfirmation}
        onPressReview={this.onPressReview}
      />
    );
  };

  private renderReviewForm = (): React.ReactNode => {
    const { showReviewForm, reviewAsset, reviewData } = this.state;
    const { t, pillars } = this.props;
    if (reviewAsset === null) return null;
    const { asset, leaseListing, saleListing } = reviewAsset as unknown as AssetVisit;
    return (
      <BottomSheet
        visible={showReviewForm}
        sheetHeight={theme.viewport.height * 0.85}
        headerTitle={t('propertyReview')}
        onCloseSheet={this.onCancelReview}
      >
        {reviewData && reviewData.id ? (
          <ReviewForm
            editReview
            review={reviewData}
            onDelete={this.onDelete}
            onClose={this.onCancelReview}
            asset={asset}
            ratingCategories={reviewData.pillarRatings}
            leaseListingId={reviewData.leaseListing}
            saleListingId={reviewData.saleListing}
          />
        ) : (
          <ReviewForm
            onClose={this.onCancelReview}
            asset={asset}
            ratingCategories={pillars ?? []}
            leaseListingId={leaseListing}
            saleListingId={saleListing}
          />
        )}
      </BottomSheet>
    );
  };

  private renderReplyReviewForm = (): React.ReactNode => {
    const { replyReview, reviewData, reportCategories } = this.state;
    const { t } = this.props;
    if (!reviewData) return null;
    return (
      <BottomSheet
        visible={replyReview}
        sheetHeight={theme.viewport.height * 0.65}
        headerTitle={t('propertyReview')}
        onCloseSheet={this.onCancelReviewReply}
      >
        <ScrollView>
          <AssetReviewCard hideShowMore key={reviewData.id} review={reviewData} reportCategories={reportCategories} />
        </ScrollView>
      </BottomSheet>
    );
  };

  private onCancelReviewReply = (): void => {
    this.setState({
      replyReview: false,
    });
  };

  private onCancelReview = (reset = false): void => {
    const { resetData } = this.props;
    this.setState(
      {
        showReviewForm: false,
      },
      () => {
        if (!reset || !resetData) return;
        resetData();
      }
    );
  };

  private onDelete = (): void => {
    const { showDeleteForm, reviewData } = this.state;
    const { resetData } = this.props;
    this.setState({ showDeleteForm: !showDeleteForm });
    AssetRepository.deleteReview(reviewData.id)
      .then(() => {
        if (resetData) {
          this.closeBottomSheet();
          resetData();
        }
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  private onLayout = (e: LayoutChangeEvent): void => {
    const { height } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    if (newHeight === height) {
      this.setState({ height: newHeight });
    }
  };

  private onPressReview = (item: AssetVisit): void => {
    const { review, isAssetOwner } = item;
    if (review) {
      this.getReview(review.id);
    }

    if (isAssetOwner) {
      this.setState({ replyReview: true });
    } else {
      this.setState({ reviewAsset: item, showReviewForm: true });
    }
  };

  private navigateToAssetDetails = (listingId: number | null, id: number, isValidVisit: boolean): void => {
    const { navigation, t } = this.props;
    if (isValidVisit && navigation) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.PropertyAssetDescription, {
        propertyTermId: listingId,
        propertyId: id,
      });
    } else {
      AlertHelper.error({ message: t('property:inValidVisit') });
    }
  };

  private closeBottomSheet = (): void => {
    const { showReviewForm } = this.state;
    this.setState({ showReviewForm: !showReviewForm, reviewData: new AssetReview() });
  };

  private getReview = (id: number): void => {
    AssetRepository.getReview(id)
      .then((response) => {
        this.setState({ reviewData: response });
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  private openReviewForm = (): void => {
    const { reviewVisitId, visitData } = this.props;

    if (!reviewVisitId || visitData.length <= 0) return;

    const visits: any[] = [];
    visitData.forEach((date) => visits.push(...date.results));
    const visitToReview = visits.find((item: AssetVisit) => item.id === reviewVisitId);

    if (!visitToReview || visitToReview.review) return;

    setTimeout(() => {
      this.setState({ reviewAsset: visitToReview, showReviewForm: true });
    }, 500);
  };

  private getReportCategory = async (): Promise<void> => {
    try {
      const response = await AssetRepository.getReviewReportCategories();
      this.setState({
        reportCategories: response,
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.property)(PropertyVisitList);

const styles = StyleSheet.create({
  mainView: {
    marginBottom: 75,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  count: {
    color: theme.colors.darkTint6,
  },
  dropdownStyle: {
    width: 140,
  },
  dividerView: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    width: 100,
  },
  horizontalStyle: {
    marginHorizontal: 16,
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  emptyView: {
    marginBottom: 20,
  },
});
