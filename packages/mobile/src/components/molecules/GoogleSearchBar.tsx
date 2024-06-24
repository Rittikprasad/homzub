import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';

interface IProps {
  placeholder: string;
  value: string;
  updateValue: (value: string) => void;
  onRef?: (ref: GoogleSearchBar) => void;
  autoFocus?: boolean;
  onFocusChange?: (isFocus: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  searchBarStyle?: StyleProp<ViewStyle>;
  cancelButtonStyle?: StyleProp<ViewStyle>;
  cancelTextStyle?: StyleProp<TextStyle>;
  testID?: string;
  isCancelVisible?: boolean;
}

interface IState {
  showCancel: boolean;
}

type Props = WithTranslation & IProps;

export class GoogleSearchBar extends React.PureComponent<Props, IState> {
  public SearchTextInput: TextInput | null = null;

  public state = {
    showCancel: false,
  };

  public componentDidMount = (): void => {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  };

  public render = (): React.ReactNode => {
    const {
      placeholder,
      value,
      t,
      containerStyle = {},
      cancelButtonStyle = {},
      cancelTextStyle = {},
      searchBarStyle = {},
      autoFocus = false,
    } = this.props;
    const { showCancel } = this.state;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.textInputContainer, searchBarStyle]}>
          <Button
            type="primary"
            icon={icons.search}
            iconSize={20}
            iconColor={theme.colors.darkTint6}
            containerStyle={[styles.iconButton, styles.searchIcon]}
            onPress={this.onSearchIconPress}
            testID="btnSearch"
          />
          <TextInput
            ref={(input): void => {
              this.SearchTextInput = input;
            }}
            style={styles.textInput}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.darkTint7}
            autoCorrect={false}
            autoFocus={autoFocus}
            numberOfLines={1}
            returnKeyType="done"
            onChangeText={this.onChangeText}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
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
        {showCancel && (
          <Button
            type="secondary"
            title={t('common:cancel')}
            containerStyle={[styles.cancelButtonContainer, cancelButtonStyle]}
            titleStyle={[styles.cancelButtonText, cancelTextStyle]}
            onPress={this.onCancelPress}
            testID="btnCancel"
          />
        )}
      </View>
    );
  };

  private onFocus = (): void => {
    const { onFocusChange, isCancelVisible } = this.props;
    if (onFocusChange) {
      onFocusChange(true);
    }
    this.setState({ showCancel: isCancelVisible ?? true });
  };

  private onBlur = (): void => {
    const { onFocusChange } = this.props;
    if (onFocusChange) {
      onFocusChange(false);
    }
    this.setState({ showCancel: false });
  };

  private onSearchIconPress = (): void => {
    this.SearchTextInput?.focus();
  };

  private onCrossPress = (): void => {
    this.onChangeText('');
  };

  private onCancelPress = (): void => {
    this.onCrossPress();
    this.SearchTextInput?.blur();
  };

  private onChangeText = (updatedValue: string): void => {
    const { updateValue } = this.props;
    updateValue(updatedValue);
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primaryColor,
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
    flex: 1,
    color: theme.colors.darkTint1,
  },
  cancelButtonContainer: {
    backgroundColor: theme.colors.primaryColor,
    flex: 0,
    borderWidth: 0,
    marginStart: 12,
  },
  cancelButtonText: {
    color: theme.colors.secondaryColor,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
    flex: 0,
  },
  searchIcon: {
    marginEnd: 16,
  },
});

export default withTranslation()(GoogleSearchBar);
