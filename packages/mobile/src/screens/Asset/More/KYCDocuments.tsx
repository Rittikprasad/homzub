import React, { memo, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Share, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { DocumentCard } from '@homzhub/mobile/src/components/molecules/DocumentCard';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/MoreStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type Props = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.KYC>;

const KYCDocuments = (props: Props): React.ReactElement => {
  const { navigation } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);

  // HOOKS
  const user = useSelector(UserSelector.getUserProfile);
  const [searchString, setSearchString] = useState('');
  const [docs, setDocs] = useState<AssetDocument[]>([]);
  const [loading, setLoading] = useState(true);
  // HOOKS END

  // EFFECTS
  useEffect(() => {
    try {
      UserRepository.getKYCDocuments().then((data: AssetDocument[]) => {
        setDocs(data);
        setLoading(false);
      });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e);
      AlertHelper.error({ message: error });
      setLoading(false);
    }
  }, []);
  // EFFECTS END

  // CALLBACKS
  const onShare = useCallback(
    async (link: string) => {
      try {
        await Share.share({
          message: `${t('shareDoc')} ${link}`,
        });
      } catch (error) {
        AlertHelper.error({ message: error });
      }
    },
    [t]
  );
  // TODO: Add the `delete` functionality and remove the canDelete prop from DocumentCard.tsx
  const onDeleteDocument = (id: number): void => {};
  // CALLBACKS END

  const arrToDisplay = searchString
    ? docs.filter((item) => item.attachment.fileName.toLowerCase().includes(searchString.toLowerCase()))
    : docs;

  const renderList = (): React.ReactNode => {
    if (arrToDisplay.length <= 0) {
      return <EmptyState title={t('noDocs')} />;
    }

    return arrToDisplay.map((doc, index) => (
      <View key={doc.id}>
        <DocumentCard
          document={doc}
          handleShare={onShare}
          handleDelete={onDeleteDocument}
          handleDownload={AttachmentService.downloadAttachment}
          canDelete={doc.canDelete}
          userEmail={user?.email ?? ''}
          rightIcon={icons.doc}
        />
        {index !== arrToDisplay.length - 1 && <Divider containerStyles={styles.divider} />}
      </View>
    ));
  };

  return (
    <UserScreen title={t('more')} pageTitle={t('kycDocuments')} onBackPress={navigation.goBack} loading={loading}>
      <View style={styles.container}>
        <SearchBar
          placeholder={t('searchByDoc')}
          value={searchString}
          updateValue={setSearchString}
          containerStyle={styles.searchBar}
        />
        {renderList()}
      </View>
    </UserScreen>
  );
};

const memoizedComponent = memo(KYCDocuments);
export { memoizedComponent as KYCDocuments };

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
    paddingBottom: 24,
  },
  searchBar: {
    marginTop: 24,
    marginBottom: 8,
  },
  divider: {
    marginTop: 16,
    borderColor: theme.colors.darkTint10,
  },
});
