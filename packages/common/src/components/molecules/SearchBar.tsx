import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';

interface IProps {
  placeholder: string;
  value: string;
  updateValue: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  searchBarStyle?: StyleProp<ViewStyle>;
  textFieldStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export class SearchBar extends React.PureComponent<IProps> {
  public render = (): React.ReactNode => {
    const { placeholder, value, containerStyle = {}, searchBarStyle = {}, iconStyle, textFieldStyle = {} } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.textInputContainer, searchBarStyle]}>
          <Button
            type="primary"
            icon={icons.search}
            iconSize={20}
            iconColor={theme.colors.darkTint6}
            containerStyle={[styles.iconButton, styles.searchIcon, iconStyle]}
            testID="btnSearch"
          />
          <TextInput
            style={[styles.textInput, textFieldStyle]}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.darkTint7}
            autoCorrect={false}
            autoCapitalize="none"
            numberOfLines={1}
            returnKeyType="done"
            onChangeText={this.onChangeText}
            testID="textInput"
          />
          {value.length > 0 && (
            <Button
              type="primary"
              icon={icons.circularCrossFilled}
              iconSize={20}
              iconColor={theme.colors.darkTint6}
              containerStyle={styles.iconButton}
              onPress={this.onCrossPress}
              testID="btnCross"
            />
          )}
        </View>
      </View>
    );
  };

  private onChangeText = (value: string): void => {
    const { updateValue } = this.props;
    updateValue(value);
  };

  private onCrossPress = (): void => {
    this.onChangeText('');
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.darkTint10,
  },
  textInputContainer: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.secondaryColor,
  },
  textInput: {
    marginLeft: 16,
    flex: 1,
    color: theme.colors.darkTint1,
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
    flex: 0,
  },
  searchIcon: {
    marginEnd: 16,
  },
});
