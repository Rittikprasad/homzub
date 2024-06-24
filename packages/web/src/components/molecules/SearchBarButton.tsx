import React, { FC, useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SearchFieldButton } from '@homzhub/web/src/components/atoms/SearchFieldButton';

interface ISearchBarProps {
  containerStyle: ViewStyle;
  onSearchPress: (value: string) => void;
  onSearchActive: (value: string) => void;
}

const SearchBarButton: FC<ISearchBarProps> = (props: ISearchBarProps) => {
  const { containerStyle, onSearchPress, onSearchActive } = props;
  const [searchText, setSearchText] = useState('');
  const { t } = useTranslation();

  const updateSearchValue = (value: string): void => {
    setSearchText(value);
    onSearchActive(value);
  };

  return (
    <SearchFieldButton
      placeholder={t('common:faqSearchPlaceholder')}
      value={searchText}
      updateValue={updateSearchValue}
      containerStyle={[styles.searchBar, containerStyle]}
      onSearchPress={(value): void => onSearchPress(value)}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    alignSelf: 'stretch',
    width: '100%',
  },
});

export default SearchBarButton;
