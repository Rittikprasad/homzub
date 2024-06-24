import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { icons } from '@homzhub/common/src/assets/icon';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { CollapsibleSection } from '@homzhub/mobile/src/components/molecules/CollapsibleSection';
import ScheduleVisitForm from '@homzhub/common/src/components/organisms/ScheduleVisitForm';
import { IVisitParam } from '@homzhub/ffm/src/navigation/interfaces';

const VisitForm = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const { startDate, comment } = params as IVisitParam;

  const onSubmitSuccess = (): void => {
    AlertHelper.success({ message: t('siteVisits:rescheduleVisit') });
    goBack();
  };

  const handleSlotView = (value: boolean): void => {
    setIsCollapsed(value);
  };

  const renderCollapsibleSection = (children: React.ReactElement, title: string): React.ReactElement => {
    return (
      <CollapsibleSection
        title={title}
        icon={icons.watch}
        titleStyle={styles.upcomingTitle}
        initialCollapsedValue={isCollapsed}
        onCollapse={handleSlotView}
      >
        {children}
      </CollapsibleSection>
    );
  };

  return (
    <GradientScreen
      isUserHeader
      isScrollable
      onGoBack={goBack}
      loading={isLoading}
      screenTitle={t('property:siteVisits')}
      pageTitle={t('siteVisits:rescheduleForm')}
      pageHeaderStyle={styles.pageHeaderStyle}
    >
      {/* @ts-ignore */}
      <ScheduleVisitForm
        isFromFFM
        isReschedule
        comment={comment}
        startDate={startDate}
        isCollapsed={isCollapsed}
        setLoading={setLoading}
        onSubmitSuccess={onSubmitSuccess}
        renderCollapseSection={renderCollapsibleSection}
        pickerStyle={styles.pickerStyle}
      />
    </GradientScreen>
  );
};

export default VisitForm;

const styles = StyleSheet.create({
  upcomingTitle: {
    marginLeft: 12,
  },
  pageHeaderStyle: {
    marginBottom: 20,
  },
  pickerStyle: {
    width: '99%',
  },
});
