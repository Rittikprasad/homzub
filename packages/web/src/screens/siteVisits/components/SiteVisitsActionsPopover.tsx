import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import BookVisit from '@homzhub/web/src/screens/siteVisits/components/BookVisit';
import CancelVisit from '@homzhub/web/src/screens/siteVisits/components/CancelVisit';
import { SubmitReviewForm } from '@homzhub/web/src/screens/siteVisits/components/SubmitReviewForm';
import ReportReview from '@homzhub/web/src/screens/siteVisits/components/ReportReview';
import { AssetReviewCard, IAssetReviewProps } from '@homzhub/web/src/screens/siteVisits/components/AssetReviewCard';
import DeleteReview from '@homzhub/web/src/screens/siteVisits/components/DeleteReview';
import { IBookVisitProps, IVisitActionParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export enum SiteVisitAction {
  SCHEDULE_VISIT = 'SCHEDULE_VISIT',
  RESCHEDULE_VISIT = 'RESCHEDULE_VISIT',
  CANCEL = 'CANCEL',
  SUBMIT_REVIEW = 'SUBMIT_REVIEW',
  POST_REVIEW_ACTIONS = 'POST_REVIEW_ACTIONS',
  REPORT_REVIEW = 'REPORT_REVIEW',
  DELETE_REVIEW = 'DELETE_REVIEW',
}

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  siteVisitActionType: SiteVisitAction | null;
  onCloseModal: () => void;
  handleSiteVisitsAction?: (value: SiteVisitAction) => void;
  paramsBookVisit?: IBookVisitProps;
  paramsVisitAction?: IVisitActionParam;
  handleVisitActions?: (param: IVisitActionParam) => void;
  reviewFormProps?: IReviewFormProps;
  postReviewProps?: IAssetReviewProps;
  reportReviewProps?: IReportReviewProps;
  setSiteVisitActionType?: React.Dispatch<React.SetStateAction<SiteVisitAction>>;
  onSuccessCallback?: () => void;
}

export interface IReviewFormProps {
  onDelete?: () => void;
  review?: AssetReview;
  editReview?: boolean;
  onClose: (reset?: boolean) => void;
  asset: VisitAssetDetail;
  saleListingId: number | null;
  leaseListingId: number | null;
  ratingCategories: Pillar[];
}

interface IReportReviewProps {
  review: AssetReview;
  reportCategories: Unit[];
}

const SiteVisitsActionsPopover: React.FC<IProps> = (props: IProps) => {
  const {
    siteVisitActionType,
    popupRef,
    onCloseModal,
    paramsBookVisit,
    paramsVisitAction,
    handleVisitActions,
    reviewFormProps,
    postReviewProps,
    reportReviewProps,
    setSiteVisitActionType,
    onSuccessCallback,
  } = props;
  const {
    review: { isReported, reviewReportId },
  } = { ...postReviewProps, review: postReviewProps?.review ?? {} };
  const { onDelete } = { ...reviewFormProps };

  const [isUnderReview, setIsUnderReview] = useState(isReported && !reviewReportId);

  const renderActionsPopover = (): React.ReactNode | null => {
    switch (siteVisitActionType) {
      case SiteVisitAction.SCHEDULE_VISIT:
        return (
          <BookVisit
            paramsBookVisit={paramsBookVisit as IBookVisitProps}
            isReschedule={false}
            onCloseModal={onSuccessCallback ?? onCloseModal}
          />
        );
      case SiteVisitAction.RESCHEDULE_VISIT:
        return (
          <BookVisit paramsBookVisit={paramsBookVisit as IBookVisitProps} isReschedule onCloseModal={onCloseModal} />
        );
      case SiteVisitAction.CANCEL:
        return (
          <CancelVisit
            paramsVisitAction={paramsVisitAction || ({} as IVisitActionParam)}
            handleVisitActions={handleVisitActions || FunctionUtils.noop}
            onCloseModal={onCloseModal}
          />
        );
      case SiteVisitAction.SUBMIT_REVIEW:
        if (reviewFormProps?.asset.id && setSiteVisitActionType) {
          return <SubmitReviewForm {...reviewFormProps} setSiteVisitActionType={setSiteVisitActionType} />;
        }
        return null;
      case SiteVisitAction.POST_REVIEW_ACTIONS:
        if (postReviewProps?.review.id) {
          return (
            <AssetReviewCard
              {...postReviewProps}
              isUnderReview={isUnderReview as boolean}
              onCloseModal={onCloseModal}
              setSiteVisitActionType={setSiteVisitActionType}
            />
          );
        }
        return null;
      case SiteVisitAction.REPORT_REVIEW:
        if (reportReviewProps?.review.id) {
          return (
            <ReportReview
              {...reportReviewProps}
              setIsUnderReview={setIsUnderReview}
              onCloseModal={onCloseModal}
              setSiteVisitActionType={setSiteVisitActionType}
            />
          );
        }
        return null;
      case SiteVisitAction.DELETE_REVIEW:
        if (reviewFormProps?.asset.id && setSiteVisitActionType) {
          return (
            <DeleteReview onDelete={onDelete || FunctionUtils.noop} setSiteVisitActionType={setSiteVisitActionType} />
          );
        }
        return null;
      default:
        return null;
    }
  };
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();

  const siteVisitsPopoverTypes = {
    [SiteVisitAction.SCHEDULE_VISIT.toString()]: {
      title: t('siteVisits:schedulePropertyVisit'),
      styles: {
        height: '620px',
      },
    },
    [SiteVisitAction.RESCHEDULE_VISIT.toString()]: {
      title: t('siteVisits:reschedulePropertyVisit'),
      styles: {
        height: '620px',
      },
    },

    [SiteVisitAction.CANCEL.toString()]: {
      title: t('property:cancelVisit'),
    },
    [SiteVisitAction.SUBMIT_REVIEW.toString()]: {
      title: t('property:submitReviewTitle'),
    },
    [SiteVisitAction.POST_REVIEW_ACTIONS.toString()]: {
      title: t('property:postReviewActionsTitle'),
    },
    [SiteVisitAction.REPORT_REVIEW.toString()]: {
      title: t('property:reportReviewTitle'),
    },
    [SiteVisitAction.DELETE_REVIEW.toString()]: {
      title: t('property:deleteReviewTitle'),
    },
  };
  const SiteVisitsPopoverType = siteVisitActionType && siteVisitsPopoverTypes[siteVisitActionType?.toString()];
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {SiteVisitsPopoverType?.title}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint7}
            onPress={onCloseModal}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.verticalStyle} />
        <View style={styles.modalContent}>{renderActionsPopover()}</View>
      </View>
    );
  };
  return (
    <Popover
      content={renderPopoverContent}
      popupProps={{
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
          borderRadius: 8,
          overflow: 'auto',
          ...SiteVisitsPopoverType?.styles,
        },
        children: undefined,
        modal: true,
        position: 'center center',
        onClose: onCloseModal,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default SiteVisitsActionsPopover;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    padding: 24,
  },
  verticalStyle: {
    marginTop: 20,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: 12,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
});
