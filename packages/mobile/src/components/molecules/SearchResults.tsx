import React from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { GooglePlaceData } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

export interface IProps extends WithTranslation {
  results: GooglePlaceData[];
  onResultPress: (item: GooglePlaceData) => void;
  listTitleStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export class SearchResults extends React.PureComponent<IProps, {}> {
  public render = (): React.ReactNode => {
    const { results, t, listTitleStyle = {} } = this.props;
    return (
      <View style={styles.sectionsContainer}>
        <Label type="large" textType="semiBold" style={[styles.listTitle, listTitleStyle]}>
          {t('common:searchResults')}
        </Label>
        {results.map(this.renderSearchResult)}
      </View>
    );
  };

  private renderSearchResult = (item: GooglePlaceData): React.ReactElement => {
    const { onResultPress } = this.props;

    const onPress = (): void => {
      onResultPress(item);
    };

    return (
      <TouchableOpacity
        key={`${item.place_id}`}
        testID="pressResult"
        onPress={onPress}
        style={styles.listItemContainer}
      >
        <Label type="large" style={styles.listItemTitle} numberOfLines={2}>
          {item.description}
        </Label>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  sectionsContainer: {
    backgroundColor: theme.colors.secondaryColor,
  },
  listItemContainer: {
    marginStart: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkTint10,
  },
  listTitle: {
    backgroundColor: theme.colors.background,
    color: theme.colors.darkTint4,
    paddingTop: 20,
    paddingStart: 16,
    paddingBottom: 6,
  },
  listItemTitle: {
    marginVertical: 16,
    marginEnd: 16,
  },
});

export default withTranslation()(SearchResults);
