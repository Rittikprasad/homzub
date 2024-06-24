import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/User/UpdateProfile';

export interface IDetailsInfo {
  icon: string;
  text?: string;
  helperText?: string;
  type?: 'TEXT' | 'EMAIL';
  emailVerified?: boolean;
}

interface IHeaderInfo {
  title: string;
  icon?: string;
  onPress?: (title: string, formType?: UpdateUserFormTypes) => void;
}

interface IOwnProps extends WithTranslation {
  details?: IDetailsInfo[];
  headerInfo?: IHeaderInfo;
  type?: UpdateUserFormTypes;
  onVerifyPress?: (email: string, type: UpdateUserFormTypes) => void;
  showDivider?: boolean;
}

class DetailsCard extends React.PureComponent<IOwnProps, {}> {
  public render = (): React.ReactNode => {
    const { headerInfo, showDivider = false } = this.props;
    return (
      <>
        {headerInfo && this.renderSectionHeader()}

        {headerInfo?.icon ? this.renderDetails() : this.renderEmptyView()}
        {showDivider && <Divider containerStyles={styles.dividerStyles} />}
      </>
    );
  };

  private renderEmptyView = (): React.ReactNode => {
    const { t, type } = this.props;

    return (
      <View style={styles.marginTop}>
        <Label style={styles.moreInfo} type="large">
          {type === UpdateUserFormTypes.EmergencyContact
            ? t('moreProfile:emergencyEmptyState')
            : t('moreProfile:workInfoEmptyState')}
        </Label>
        <TouchableOpacity onPress={this.onIconPress} style={styles.marginTop}>
          <Label style={styles.addContactBtn} type="large" textType="semiBold">
            {t('moreProfile:addContactInfoText')}
          </Label>
        </TouchableOpacity>
      </View>
    );
  };

  private renderDetails = (): React.ReactNode => {
    const { details, onVerifyPress, type, t } = this.props;

    return (
      details &&
      details.map((item, index) => {
        const { text, type: textType, icon, emailVerified, helperText } = item;

        const handleEmailVerifyPress = (): void => {
          if (onVerifyPress) {
            onVerifyPress(text ?? '', type ?? UpdateUserFormTypes.BasicDetails);
          }
        };

        return (
          <View style={styles.marginTop} key={index}>
            <View style={textType === 'EMAIL' ? styles.rowStyle : undefined}>
              <View style={styles.subTitle}>
                <Icon size={20} name={icon} color={text ? theme.colors.darkTint4 : theme.colors.darkTint8} />
                <Label style={[styles.textStyle, text ? {} : styles.helperTextColor]} type="large">
                  {text || helperText}
                </Label>
              </View>
              {textType === 'EMAIL' &&
                (emailVerified ? (
                  <Icon size={20} name={icons.doubleCheck} color={theme.colors.completed} />
                ) : (
                  <Icon size={20} name={icons.filledWarning} color={theme.colors.error} />
                ))}
            </View>
            {textType === 'EMAIL' && !!text && !item.emailVerified && (
              <Label onPress={handleEmailVerifyPress} style={styles.verifyMail} type="large">
                {t('moreProfile:verifyYourEmailText')}
              </Label>
            )}
          </View>
        );
      })
    );
  };

  private renderSectionHeader = (): React.ReactNode => {
    const { headerInfo } = this.props;

    if (!headerInfo) {
      return null;
    }

    return (
      <View style={styles.rowStyle}>
        <Text type="small" textType="semiBold">
          {headerInfo.title}
        </Text>
        {headerInfo.icon && (
          <Icon size={20} name={headerInfo.icon} color={theme.colors.primaryColor} onPress={this.onIconPress} />
        )}
      </View>
    );
  };

  private onIconPress = (): void => {
    const { headerInfo, type } = this.props;
    if (headerInfo?.onPress) {
      headerInfo.onPress(headerInfo?.title, type);
    }
  };
}

const detailsCard = withTranslation()(DetailsCard);
export { detailsCard as DetailsCard };

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTitle: {
    flexDirection: 'row',
  },
  verifyMail: {
    marginLeft: 30,
    color: theme.colors.primaryColor,
  },
  textStyle: {
    color: theme.colors.darkTint3,
    marginLeft: 10,
  },
  marginTop: {
    marginTop: 18,
  },
  dividerStyles: {
    marginVertical: 24,
  },
  helperTextColor: {
    color: theme.colors.darkTint8,
  },
  addContactBtn: {
    textAlign: 'center',
    color: theme.colors.primaryColor,
  },
  moreInfo: {
    textAlign: 'center',
    color: theme.colors.darkTint5,
  },
});
