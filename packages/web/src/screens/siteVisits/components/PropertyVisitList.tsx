import React, { useState, useEffect, useRef } from 'react';
import { View, PickerItemProps, StyleProp, ViewStyle, LayoutChangeEvent, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import SiteVisitsActionsPopover, {
  IReviewFormProps,
  SiteVisitAction,
} from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsActionsPopover';
import VisitCard from '@homzhub/common/src/components/molecules/VisitCard';
import { AssetVisit, IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { IVisitActionParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  visitType: Tabs;
  visitData: IVisitByKey[];
  isLoading: boolean;
  dropdownValue: number;
  dropdownData: PickerItemProps[];
  handleAction: (param: IVisitActionParam) => void;
  handleReschedule: (asset: AssetVisit, userId?: number) => void;
  handleDropdown: (value: string | number, visitType: Tabs) => void;
  handleUserView: (id: number) => void;
  handleConfirmation: (param: IVisitActionParam) => void;
  pillars?: Pillar[];
  resetData?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  reviewVisitId?: number;
  // isFromProperty?: boolean;
  // isUserView?: boolean;
  // isResponsiveHeightRequired?: boolean;
}

interface ICustomState {
  reportCategories: Unit[];
  height: number;
  showReviewForm: boolean;
  showDeleteForm: boolean;
  postReviewActions: boolean;
  reviewData: AssetReview;
  reviewAsset: AssetVisit | null;
}

const PropertyVisitList: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const {
    visitType,
    visitData,
    dropdownData,
    dropdownValue,
    handleDropdown,
    isLoading,
    handleAction,
    handleReschedule,
    handleUserView,
    handleConfirmation,
    containerStyle,
    pillars,
    resetData = FunctionUtils.noop,
  } = props;
  const [customState, setCustomState] = useState<ICustomState>({
    reportCategories: [],
    height: theme.viewport.height,
    showReviewForm: false, // Write Review Form
    showDeleteForm: false, // Delete Review Form
    postReviewActions: false, // Reply/Report Review Form
    reviewData: new AssetReview(),
    reviewAsset: new AssetVisit(),
  });
  const getReportCategory = async (): Promise<void> => {
    try {
      const response = await AssetRepository.getReviewReportCategories();
      setCustomState((state) => {
        return {
          ...state,
          reportCategories: response,
        };
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  useEffect(() => {
    getReportCategory();
  }, []);

  const { height, showReviewForm, showDeleteForm, postReviewActions, reviewData, reviewAsset, reportCategories } =
    customState;
  const { asset, leaseListing, saleListing } = {
    ...reviewAsset,
    leaseListing: reviewAsset?.leaseListing ?? null,
    saleListing: reviewAsset?.saleListing ?? null,
    asset: reviewAsset?.asset ?? new VisitAssetDetail(),
  };
  const isPopover = showReviewForm || showDeleteForm || postReviewActions;

  const [siteVisitActionType, setSiteVisitActionType] = useState(SiteVisitAction.SUBMIT_REVIEW);

  const popupRef = useRef<PopupActions>(null);
  const onOpenModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    setCustomState((state) => {
      return { ...state, postReviewActions: false, showDeleteForm: false, showReviewForm: false };
    });
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  useEffect(() => {
    if (isPopover) {
      onOpenModal();
    }
  }, [isPopover]);

  const onLayout = (e: LayoutChangeEvent): void => {
    const { height: newHeight } = e.nativeEvent.layout;
    if (newHeight === height) {
      setCustomState((state) => {
        return {
          ...state,
          height: newHeight,
        };
      });
    }
  };
  const totalVisit = visitData[0] ? visitData[0].totalVisits : 0;

  const navigateToPropertyView = (listingId: number | null, id: number, isValidVisit: boolean): void => {
    if (isValidVisit) {
      // @ts-ignore
      //   navigation.navigate(ScreensKeys.PropertyAssetDescription, {
      //     propertyTermId: listingId,
      //     propertyId: id,
      //   }); // Navigate the user to Property Detail Search View onPress Address & SubAddress
    } else {
      AlertHelper.error({ message: t('property:inValidVisit') });
    }
  };

  const onPressReview = (item: AssetVisit): void => {
    const { review, isAssetOwner } = item;
    if (review) {
      getReview(review.id);
    }

    if (isAssetOwner) {
      setCustomState((state) => {
        return { ...state, postReviewActions: true };
      });
      setSiteVisitActionType(SiteVisitAction.POST_REVIEW_ACTIONS);
    } else {
      setCustomState((state) => {
        return { ...state, reviewAsset: item, showReviewForm: true };
      });
      setSiteVisitActionType(SiteVisitAction.SUBMIT_REVIEW);
    }
  };

  const getReview = (id: number): void => {
    try {
      AssetRepository.getReview(id).then((response) => {
        setCustomState((state) => {
          return { ...state, reviewData: response };
        });
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const onCancelReview = (reset = false): void => {
    onCloseModal();
    if (!reset || !resetData) return;
    resetData();
  };

  const onDelete = (): void => {
    setCustomState((state) => {
      return { ...state, showDeleteForm: !state.showDeleteForm };
    });
    AssetRepository.deleteReview(reviewData.id)
      .then(() => {
        if (resetData) {
          onCloseModal();
          resetData();
        }
        AlertHelper.success({ message: t('property:deleteReviewSuccess') });
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  // const openReviewForm = (): void => { TODO: Notifications Flow
  //   if (!reviewVisitId || visitData.length <= 0) return;

  //   const visits: any[] = [];
  //   visitData.forEach((date) => visits.push(...date.results));
  //   const visitToReview = visits.find((item: AssetVisit) => item.id === reviewVisitId);

  //   if (!visitToReview || visitToReview.review) return;

  //   setTimeout(() => {
  //     setCustomState(state => { return { ...state, reviewAsset: visitToReview, showReviewForm: true}});
  //   }, 500);
  // };

  const mainContainerStyles: ViewStyle = {
    width: '320px',
  };

  const isMobile = useOnly(deviceBreakpoint.MOBILE);

  const renderItem = (item: AssetVisit): React.ReactElement => {
    return (
      <VisitCard
        visit={item}
        visitType={visitType}
        isUserView={false}
        handleUserView={handleUserView}
        handleReschedule={handleReschedule}
        navigateToAssetDetails={navigateToPropertyView}
        handleAction={handleAction}
        handleConfirmation={handleConfirmation}
        onPressReview={onPressReview}
        mainContainerStyles={mainContainerStyles}
      />
    );
  };

  let reviewFormProps: IReviewFormProps;

  if (reviewData && reviewData.id) {
    reviewFormProps = {
      editReview: true,
      onDelete,
      review: reviewData,
      onClose: onCancelReview,
      asset,
      leaseListingId: reviewData.leaseListing as number,
      saleListingId: reviewData.saleListing as number,
      ratingCategories: reviewData.pillarRatings,
    };
  } else {
    reviewFormProps = {
      onClose: onCancelReview,
      asset,
      leaseListingId: leaseListing as number,
      saleListingId: saleListing as number,
      ratingCategories: pillars ?? [],
    };
  }

  const postReviewProps = {
    hideShowMore: true,
    key: reviewData.id,
    review: reviewData,
    reportCategories,
  };

  const reportReviewProps = {
    review: reviewData,
    reportCategories,
  };

  return (
    <View onLayout={onLayout} style={[styles.mainView, containerStyle]}>
      {dropdownData && handleDropdown && visitType && (
        <View style={styles.headerView}>
          <Label type="regular" style={styles.count}>
            {t('property:totalVisit', { totalVisit })}
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
        <View style={{ minHeight: height }}>
          {visitData.map((item) => {
            const results = item.results as AssetVisit[];
            return (
              <>
                {results.length > 0 && (
                  <View style={styles.dateView}>
                    <View style={styles.dividerView} />
                    <Text type="small" style={styles.horizontalStyle}>
                      {item.key}
                    </Text>
                    <View style={styles.dividerView} />
                  </View>
                )}
                <View style={[styles.cardsRow, isMobile && styles.cardsRowMobile]}>
                  {results.map((argAsset: AssetVisit) => {
                    return renderItem(argAsset);
                  })}
                </View>
              </>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyView}>
          <EmptyState icon={icons.schedule} title={t('property:noVisits')} />
        </View>
      )}
      <SiteVisitsActionsPopover
        popupRef={popupRef}
        onCloseModal={onCloseModal}
        siteVisitActionType={siteVisitActionType}
        setSiteVisitActionType={setSiteVisitActionType}
        reviewFormProps={reviewFormProps}
        postReviewProps={postReviewProps}
        reportReviewProps={reportReviewProps}
      />
      <Loader visible={isLoading ?? false} />
    </View>
  );
};

export default PropertyVisitList;

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
    width: 150,
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
  cardsRow: {
    flexDirection: 'row',
  },
  cardsRowMobile: {
    flexDirection: 'column',
  },
});
