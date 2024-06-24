import React, { ReactElement, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TimeUtils } from '@homzhub/common/src/utils/TimeUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import ReportReviewForm from '@homzhub/common/src/components/molecules/ReportReviewForm';
import { SiteVisitAction } from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsActionsPopover';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { ReportReview as IReportReview } from '@homzhub/common/src/domain/models/ReportReview';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IProps {
  review: AssetReview;
  reportCategories?: Unit[]; // Availability of Props
  setIsUnderReview: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  onCloseModal: () => void;
  setSiteVisitActionType?: React.Dispatch<React.SetStateAction<SiteVisitAction>>;
}

const ReportReview: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { review, reportCategories, setIsUnderReview, onCloseModal, setSiteVisitActionType } = props;
  const { id: reviewId, reviewReportId } = review;
  const [reportData, setReportData] = useState<IReportReview>();

  useEffect(() => {
    if (reviewReportId) {
      AssetRepository.getReportReviewData(reviewId, reviewReportId)
        .then((res) => {
          setReportData(res);
        })
        .catch((err) => {
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
        });
    }
  }, []);

  const renderReportedReview = (): ReactElement | null => {
    if (!reportData) return null;
    return (
      <View style={styles.reportView}>
        <Label textType="regular" type="large">
          {t('property:youHaveAlreadyReportedThisCommentOn')}
        </Label>
        <Label type="large" textType="bold">
          {TimeUtils.getLocaltimeDifference(reportData.reportedOn)}
        </Label>
        <Divider containerStyles={styles.divider} />
        <Label textType="semiBold" type="large">
          {t('common:comments')}
        </Label>
        <View style={styles.comment}>
          <Avatar
            fullName={reportData.reviewedBy.name}
            imageSize={50}
            designation={t('common:admin')}
            date={new Date(reportData.reviewedAt).toString()}
          />
        </View>
        <Label type="large" textType="light" style={styles.comment}>
          {reportData.reviewComment}
        </Label>
      </View>
    );
  };

  const onReportFormSubmit = (): void => {
    setIsUnderReview(true);
    onCloseModal();
    AlertHelper.info({ message: t('reportSubmittedMessage') });
  };

  const disableReportForm = (): void => {
    if (setSiteVisitActionType) {
      setSiteVisitActionType(SiteVisitAction.POST_REVIEW_ACTIONS);
    }
  };

  if (reviewReportId) {
    return renderReportedReview();
  }

  return (
    <ReportReviewForm
      reviewId={reviewId}
      reportCategories={reportCategories ?? []}
      onFormCancellation={disableReportForm}
      onSuccessFullSubmit={onReportFormSubmit}
    />
  );
};

export default ReportReview;

const styles = StyleSheet.create({
  divider: {
    borderColor: theme.colors.background,
    marginVertical: 16,
  },
  reportView: {
    padding: 25,
  },
  comment: {
    marginTop: 10,
  },
});
