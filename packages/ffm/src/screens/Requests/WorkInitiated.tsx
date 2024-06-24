import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import WorkInitiatedForm from '@homzhub/common/src/components/organisms/ServiceTickets/WorkInitiatedForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const WorkInitiated = (): ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [isLoading, setLoader] = useState(false);

  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  return (
    <GradientScreen
      isUserHeader
      onGoBack={goBack}
      loading={isLoading}
      pageTitle={t('workInitiated')}
      screenTitle={selectedTicket?.propertyName ?? ''}
    >
      <WorkInitiatedForm toggleLoader={setLoader} onSubmit={goBack} buttonContainerStyle={styles.buttonContainer} />
    </GradientScreen>
  );
};

export default WorkInitiated;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0,
  },
});
