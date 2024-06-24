import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/PortfolioStack';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ProfileLeaseTerm from '@homzhub/common/src/components/organisms/ProfileLeaseTerm';
import { TransactionDetail } from '@homzhub/common/src/domain/models/TransactionDetail';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { ILeaseTermData } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.UpdateLeaseScreen>;
type Props = libraryProps;

const UpdateLeaseTerm = (props: Props): React.ReactElement => {
  const {
    navigation,
    route: {
      params: { transactionId, assetGroup, user },
    },
  } = props;

  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const [leaseData, setLeaseData] = useState<TransactionDetail>();

  useEffect(() => {
    AssetRepository.getLeaseTransaction(transactionId)
      .then((res) => {
        setLeaseData(res);
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      });
  }, []);

  const onSubmit = async (payload: ILeaseTermData): Promise<void> => {
    try {
      await AssetRepository.updateLeaseTransaction({ transactionId, data: payload });
      AlertHelper.success({ message: t('property:leaseUpdated') });
      navigation.goBack();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  if (!leaseData) return <Loader visible />;

  return (
    <UserScreen title={t('assetMore:more')} pageTitle={t('property:editLease')} onBackPress={navigation.goBack}>
      <ProfileLeaseTerm user={user} assetGroup={assetGroup} leaseData={leaseData} onSubmit={onSubmit} isFromEdit />
    </UserScreen>
  );
};

export default UpdateLeaseTerm;
