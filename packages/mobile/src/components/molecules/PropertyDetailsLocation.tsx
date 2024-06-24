import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';

export interface IProps {
  propertyName: string;
  propertyAddress: string;
  onNavigate: () => void;
  testID?: string;
  isVerificationDone?: boolean;
}

type Props = IProps & WithTranslation;

const PropertyDetailsLocation = (props: Props): React.ReactElement => {
  const { t, propertyName, propertyAddress, onNavigate, testID, isVerificationDone } = props;
  const navigateToMaps = (): void => {
    onNavigate();
  };

  return (
    <View style={styles.locationContainer}>
      <View style={styles.icon}>
        <Icon name={icons.locationMarkerTick} size={30} color={theme.colors.green} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.rowContainer}>
          <Label
            type="large"
            textType="regular"
            numberOfLines={1}
            style={[styles.textColor, { width: theme.viewport.width * 0.6 }]}
          >
            {propertyName}
          </Label>
          {!isVerificationDone && (
            <Label type="large" textType="semiBold" style={styles.label} onPress={navigateToMaps} testID={testID}>
              {t('common:change')}
            </Label>
          )}
        </View>
        <Label type="large" textType="regular" numberOfLines={1} style={styles.addressPadding}>
          {propertyAddress}
        </Label>
      </View>
    </View>
  );
};

const HOC = withTranslation()(PropertyDetailsLocation);
export { HOC as PropertyDetailsLocation };

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    margin: theme.layout.screenPadding,
  },
  textContainer: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    ...(theme.circleCSS(52) as object),
    backgroundColor: theme.colors.greenOpacity,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginEnd: 12,
  },
  addressPadding: {
    paddingTop: 4,
    marginEnd: 12,
    color: theme.colors.darkTint3,
  },
  textColor: {
    color: theme.colors.darkTint3,
  },
  label: {
    color: theme.colors.primaryColor,
  },
});
