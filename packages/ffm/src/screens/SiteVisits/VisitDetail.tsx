import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import VisitCard from '@homzhub/ffm/src/components/molecules/VisitCard';
import { VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { IVisitDetailParam, ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { IUpdateVisitPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { DynamicLinkTypes, RouteTypes } from '@homzhub/mobile/src/services/constants';

const VisitDetail = (): React.ReactElement => {
  const { navigate, dispatch: navDispatch } = useNavigation();
  const dispatch = useDispatch();
  const { params } = useRoute();
  const { t } = useTranslation();
  const detail = useSelector(FFMSelector.getVisitDetail);
  const [deepLinkUrl, setUrl] = useState('');
  const [isConfirmation, setConfirmation] = useState(false);
  const { visitId } = params as IVisitDetailParam;

  useEffect(() => {
    dispatch(FFMActions.getVisitDetail(visitId));
  }, []);

  useEffect(() => {
    if (detail) {
      const { leaseListing, saleListing } = detail;
      const transactionType = leaseListing ? 'RENT' : 'SELL';

      CommonRepository.getDeepLink({
        action: 'MAIN',
        payload: {
          type: DynamicLinkTypes.AssetDescription,
          routeType: RouteTypes.Public,
          propertyTermId: leaseListing ? leaseListing.id : saleListing?.id ?? 0,
          asset_transaction_type: transactionType,
        },
      }).then((res) => {
        setUrl(res.deepLink);
      });
    }
  }, [detail]);

  const navigateToDetail = (): void => {
    if (deepLinkUrl) {
      LinkingService.canOpenURL(deepLinkUrl).then();
    }
  };

  const onReschedule = (): void => {
    if (detail) {
      dispatch(AssetActions.setVisitIds([detail.id]));
      navigate(ScreenKeys.VisitForm, { startDate: detail.startDate, comment: detail.comments });
    }
  };

  const onGoBack = (): void => {
    navDispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreenKeys.SiteVisitDashboard }],
      })
    );
  };

  const navigateToFeedback = (): void => {
    if (detail) {
      const param = {
        visitId: detail.id,
        isSubmitted: !detail.canSubmitFeedback,
        feedbackId: detail.prospectFeedback ? detail.prospectFeedback.id : null,
      };
      navigate(ScreenKeys.FeedbackForm, param);
    }
  };

  const handleActions = async (action: VisitActions): Promise<void> => {
    if (action === VisitActions.SCHEDULED || action === VisitActions.AWAITING) return;
    if (action === VisitActions.CANCEL) {
      setConfirmation(true);
      return;
    }

    const payload: IUpdateVisitPayload = {
      id: visitId,
      data: {
        status: action,
      },
    };

    await updateVisit(payload);
  };

  const handleCancel = async (): Promise<void> => {
    const payload: IUpdateVisitPayload = {
      id: visitId,
      data: {
        status: VisitActions.CANCEL,
      },
    };

    await updateVisit(payload);
    setConfirmation(false);
  };

  const updateVisit = async (payload: IUpdateVisitPayload): Promise<void> => {
    try {
      await AssetRepository.updatePropertyVisit(payload);
      AlertHelper.success({ message: t('siteVisits:visitUpdate') });
      dispatch(FFMActions.getVisitDetail(visitId));
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  return (
    <GradientScreen
      isUserHeader
      screenTitle={t('property:siteVisits')}
      pageTitle={t('property:visitDetails')}
      onGoBack={onGoBack}
      loading={!detail}
    >
      {detail ? (
        <VisitCard
          visit={detail}
          isFromDetail
          handleActions={handleActions}
          navigateToFeedback={navigateToFeedback}
          onReschedule={onReschedule}
          navigateToDetail={navigateToDetail}
        />
      ) : (
        <EmptyState />
      )}
      <ConfirmationSheet
        isVisible={isConfirmation}
        message={t('siteVisits:cancelVisit')}
        onCloseSheet={(): void => setConfirmation(false)}
        onPressDelete={handleCancel}
        buttonTitles={[t('common:notNow'), t('common:cancel')]}
      />
    </GradientScreen>
  );
};

export default VisitDetail;
