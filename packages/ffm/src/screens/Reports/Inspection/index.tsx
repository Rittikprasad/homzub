import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Progress } from '@homzhub/common/src/components/atoms/Progress/Progress';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { AttachmentCarousel } from '@homzhub/ffm/src/screens/Reports/Inspection/AttachmentCarousel';
import ReviewCard from '@homzhub/ffm/src/screens/Reports/Inspection/ReviewCard';
import SpaceDetail from '@homzhub/ffm/src/screens/Reports/Inspection/SpaceDetail';
import { SpaceInspection } from '@homzhub/common/src/domain/models/SpaceInspection';
import SpaceList from '@homzhub/ffm/src/screens/Reports/Inspection/SpaceList';
import { ReportSpace } from '@homzhub/common/src/domain/models/ReportSpace';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const Inspection = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { params } = useRoute();
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const report = useSelector(FFMSelector.getCurrentReport);
  const spaces = useSelector(FFMSelector.getReportSpaces);
  const { reportSpace, spaceDetail } = useSelector(FFMSelector.getFFMLoaders);
  const [selectedSpace, setSelectedSpace] = useState<ReportSpace | null>(null);
  const [isFromPreview, setFromPreview] = useState<boolean | undefined>(false);
  const [spaceInspection, setSpaceInspection] = useState<SpaceInspection | null>(null);
  const [isSubmitted, setSubmission] = useState(false);

  useEffect(() => {
    if (report) {
      dispatch(FFMActions.getReportSpace(report.id));
      dispatch(FFMActions.clearSpaceData());
    }
  }, []);

  const onUpdateSpaceSuccess = (): void => {
    if (report) {
      dispatch(FFMActions.getReportSpace(report.id));
      setSelectedSpace(null);
    }
  };

  const onBack = (): void => {
    setSelectedSpace(null);
    dispatch(FFMActions.clearSpaceData());
  };

  const onToggleCarousel = (): void => {
    setSpaceInspection(null);
  };

  const onSubmit = async (): Promise<void> => {
    if (report) {
      try {
        await FFMRepository.updateInspectionReport({ reportId: report.id, status: 'SUBMIT' });
        setSubmission(true);
      } catch (e) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
  };

  const onGoBack = (): void => {
    navigate(ScreenKeys.ReportDashboard);
    dispatch(FFMActions.clearCurrentReport());
    dispatch(FFMActions.clearSpaceData());
  };

  const handleSpaceSelection = (space: ReportSpace, fromPreview?: boolean): void => {
    setSelectedSpace(space);
    setFromPreview(fromPreview);
  };

  const getPercentage = (): number => {
    return Math.floor((spaces?.filter((item) => item.isCompleted).length / spaces.length) * 100);
  };

  const primaryStyle: ITypographyProps = { size: 'small' };
  const subAddressStyle: ITypographyProps = { variant: 'label', size: 'large' };

  return (
    <GradientScreen
      isUserHeader
      isScrollable
      loading={reportSpace || spaceDetail}
      screenTitle={t('inspection')}
      containerStyle={styles.container}
    >
      {report && (
        <View style={styles.header}>
          <PropertyAddressCountry
            primaryAddress={report.asset.projectName}
            subAddress={report.asset.address}
            countryFlag={report.asset.country.flag}
            subAddressTextStyles={subAddressStyle}
            primaryAddressTextStyles={primaryStyle}
          />
          {spaces.length > 0 && <Progress progress={getPercentage()} containerStyles={styles.progress} />}
        </View>
      )}
      {isSubmitted ? (
        <ReviewCard onGoBack={onGoBack} />
      ) : (
        <View style={styles.content}>
          {selectedSpace ? (
            <SpaceDetail spaceDetail={selectedSpace} onBack={onBack} onSuccess={onUpdateSpaceSuccess} />
          ) : (
            <SpaceList
              onSubmit={onSubmit}
              onGoBack={onGoBack}
              isPreview={isFromPreview}
              onSelectSpace={handleSpaceSelection}
              onSetInspection={setSpaceInspection}
              // @ts-ignore
              isCompletedReport={params?.isCompleted ?? false}
            />
          )}
        </View>
      )}
      {spaceInspection && (
        <AttachmentCarousel
          onFullScreenToggle={onToggleCarousel}
          comment={spaceInspection.comments}
          data={spaceInspection.spaceInspectionAttachments}
        />
      )}
    </GradientScreen>
  );
};

export default Inspection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
    padding: 0,
  },
  header: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  progress: {
    marginVertical: 10,
  },
  content: {
    marginVertical: 16,
    backgroundColor: theme.colors.white,
    padding: 20,
  },
});
