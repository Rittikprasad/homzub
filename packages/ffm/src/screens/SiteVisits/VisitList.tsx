import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import VisitCard from '@homzhub/ffm/src/components/molecules/VisitCard';
import { VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { IUpdateVisitPayload, VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFeedbackParam } from '@homzhub/ffm/src/navigation/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IProps {
  tab: Tabs;
  status: string;
  navigateToDetail: (id: number) => void;
  onReschedule: (visit: FFMVisit) => void;
  navigateToFeedback: (param: IFeedbackParam) => void;
}

const VisitList = ({ tab, onReschedule, navigateToDetail, navigateToFeedback, status }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const visits = useSelector(FFMSelector.getVisits);
  const [isConfirmation, setConfirmation] = useState(false);
  const [selectedVisitId, setVisitId] = useState(0);

  const handleActions = async (id: number, action: VisitActions): Promise<void> => {
    if (action === VisitActions.SCHEDULED || action === VisitActions.AWAITING) return;
    if (action === VisitActions.CANCEL) {
      setConfirmation(true);
      setVisitId(id);
      return;
    }

    const payload: IUpdateVisitPayload = {
      id,
      data: {
        status: action,
      },
    };

    await updateVisit(payload);
  };

  const handleCancel = async (): Promise<void> => {
    const payload: IUpdateVisitPayload = {
      id: selectedVisitId,
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
      dispatch(FFMActions.getVisits({ status__in: status }));
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const getVisitList = (): FFMVisit[] => {
    switch (tab) {
      case Tabs.COMPLETED:
        return visits.filter((item) => item.status === VisitStatus.ACCEPTED && DateUtils.isDatePassed(item.endDate));
      case Tabs.NEW:
      case Tabs.ONGOING:
        return visits.filter((item) => !DateUtils.isDatePassed(item.endDate));
      case Tabs.MISSED: {
        const formattedVisits: FFMVisit[] = [];
        visits.forEach((item) => {
          if (item.status !== VisitStatus.PENDING) {
            formattedVisits.push(item);
          }
          if (item.status === VisitStatus.PENDING && DateUtils.isDatePassed(item.endDate)) {
            formattedVisits.push(item);
          }
        });
        return formattedVisits;
      }
      default:
        return visits;
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {getVisitList().length ? (
        getVisitList().map((item, index) => {
          const param = {
            visitId: item.id,
            isSubmitted: !item.canSubmitFeedback,
            feedbackId: item.prospectFeedback ? item.prospectFeedback.id : null,
          };
          return (
            <VisitCard
              key={index}
              visit={item}
              navigateToDetail={(): void => navigateToDetail(item.id)}
              onReschedule={(): void => onReschedule(item)}
              navigateToFeedback={(): void => navigateToFeedback(param)}
              handleActions={(action: VisitActions): Promise<void> => handleActions(item.id, action)}
            />
          );
        })
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
    </ScrollView>
  );
};

export default VisitList;
