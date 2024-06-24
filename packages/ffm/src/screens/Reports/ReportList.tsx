import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { ReportAction } from '@homzhub/ffm/src/services/ReportService';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import ReportCard from '@homzhub/ffm/src/components/molecules/ReportCard';
import { Report } from '@homzhub/common/src/domain/models/Report';
import { IUpdateReport } from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  currentTab: Tabs;
}

const ReportList = ({ currentTab }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const reports = useSelector(FFMSelector.getInspectionReport);
  const [selectedReportId, setReportId] = useState(0);
  const [isCancelSheet, setCancelSheet] = useState(false);

  const handleReportAction = (payload: IUpdateReport, report: Report): void => {
    const { ACCEPT, REJECT, CANCEL, START, RESUME, VIEW } = ReportAction;
    const { status, reportId } = payload;
    setReportId(reportId);
    switch (status) {
      case ACCEPT:
      case REJECT:
        updateReport({ reportId, status: status.toLocaleUpperCase() }).then();
        break;
      case CANCEL:
        setCancelSheet(true);
        break;
      case START: {
        dispatch(FFMActions.setCurrentReport(report));
        navigate(ScreenKeys.InspectionSelection);
        break;
      }
      case RESUME: {
        dispatch(FFMActions.setCurrentReport(report));
        navigate(ScreenKeys.Inspection);
        break;
      }
      case VIEW: {
        dispatch(FFMActions.setCurrentReport(report));
        navigate(ScreenKeys.Inspection, { isCompleted: true });
        break;
      }
      default:
    }
  };

  const updateReport = async (payload: IUpdateReport): Promise<void> => {
    try {
      await FFMRepository.updateInspectionReport(payload);
      dispatch(FFMActions.getInspectionReport(currentTab.toLocaleUpperCase()));
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const onCancel = (): void => {
    updateReport({ reportId: selectedReportId, status: ReportAction.CANCEL.toLocaleUpperCase() }).then(() =>
      setCancelSheet(false)
    );
  };

  const getReportList = (): Report[] => {
    if (reports) {
      return reports.results;
    }

    return [];
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {getReportList().length > 0 ? (
        getReportList().map((item, index) => {
          return (
            <ReportCard key={index} data={item} handleAction={(payload): void => handleReportAction(payload, item)} />
          );
        })
      ) : (
        <EmptyState />
      )}
      <ConfirmationSheet
        isVisible={isCancelSheet}
        message={t('reportCancel')}
        onCloseSheet={(): void => setCancelSheet(false)}
        buttonTitles={[t('common:notNow'), t('common:cancel')]}
        onPressDelete={onCancel}
      />
    </ScrollView>
  );
};

export default ReportList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 20,
  },
});
