import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import SocietyInfoCard from '@homzhub/common/src/components/molecules/SocietyInfoCard';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface ISocietyListProp {
  onSelectSociety: (id: number) => void;
  renderMenu?: (item: Society) => React.ReactElement;
  onUpdateSociety?: (value: boolean) => void; // To handle Add new society flow if there is no existing society
  onPressInfo?: () => void;
}

const SocietyList = ({
  onSelectSociety,
  onUpdateSociety,
  renderMenu,
  onPressInfo,
}: ISocietyListProp): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertyPayment);
  const societies = useSelector(PropertyPaymentSelector.getSocieties);
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const [searchValue, setSearchValue] = useState('');
  const isWeb = PlatformUtils.isWeb();
  const getFormattedSocieties = (): Society[] => {
    if (searchValue) {
      const response = societies.filter(
        (item) => item.name.includes(searchValue) || item.societyBankInfo.beneficiaryName.includes(searchValue)
      );
      if (onUpdateSociety) {
        onUpdateSociety(response.length < 1);
      }

      if (asset.society) {
        return response.filter((item) => item.id === asset.society?.id).sort();
      }
      // Sorting in Alphabetical order
      return response.sort();
    }

    if (onUpdateSociety) {
      onUpdateSociety(societies.length < 1);
    }
    if (asset.society) {
      return societies.filter((item) => item.id === asset.society?.id).sort();
    }
    // Sorting in Alphabetical order
    return societies.sort();
  };

  return (
    <View style={styles.container}>
      <Label type="large" textType="semiBold">
        {t('chooseSociety')}
      </Label>
      {!asset.society && (
        <SearchBar
          placeholder={t('searchSociety')}
          value={searchValue}
          updateValue={setSearchValue}
          containerStyle={styles.searchContainer}
          searchBarStyle={styles.searchBar}
          iconStyle={styles.icon}
          textFieldStyle={[isWeb && styles.textFieldWeb]}
        />
      )}
      {getFormattedSocieties().length > 0 ? (
        getFormattedSocieties().map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={(): void => onSelectSociety(item.id)}>
              <SocietyInfoCard society={item} renderMenu={renderMenu && renderMenu(item)} onPressInfo={onPressInfo} />
            </TouchableOpacity>
          );
        })
      ) : (
        <EmptyState
          containerStyle={styles.emptyContainer}
          fieldType="label"
          textType="large"
          title={t('emptySocietyList')}
        />
      )}
    </View>
  );
};

export default SocietyList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  searchContainer: {
    marginVertical: 16,
  },
  searchBar: {
    height: 40,
    paddingHorizontal: 0,
  },
  icon: {
    marginEnd: 0,
  },
  textFieldWeb: {
    paddingLeft: 32,
  },
  emptyContainer: {
    marginVertical: 80,
  },
});
