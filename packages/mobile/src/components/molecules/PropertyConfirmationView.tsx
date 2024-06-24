import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { User } from '@homzhub/common/src/domain/models/User';

interface IProps {
  propertyData?: Asset;
  user?: User | null;
  userRole?: string;
  description: string;
  message: string;
  onCancel: () => void;
  onContinue: () => void;
  secondaryButtonTitle?: string;
  secondaryTitleStyle?: StyleProp<TextStyle>;
  secondaryButtonStyle?: StyleProp<ViewStyle>;
}

const PropertyConfirmationView = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    propertyData,
    user,
    description,
    message,
    onCancel,
    onContinue,
    userRole,
    secondaryButtonTitle = t('common:continue'),
    secondaryButtonStyle,
    secondaryTitleStyle,
  } = props;
  return (
    <View style={styles.container}>
      {propertyData && (
        <PropertyAddressCountry
          primaryAddress={propertyData.projectName}
          subAddress={propertyData.formattedAddressWithCity}
          countryFlag={propertyData.country?.flag}
        />
      )}
      {user && <Avatar fullName={user.name} designation={userRole} />}
      <Divider containerStyles={styles.divider} />
      <Text type="small">{description}</Text>
      <Text type="small" style={styles.message}>
        {message}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          type="secondary"
          title={secondaryButtonTitle}
          titleStyle={[styles.buttonTitle, secondaryTitleStyle]}
          onPress={onContinue}
          containerStyle={[styles.editButton, secondaryButtonStyle]}
        />
        <Button
          type="primary"
          title={t('common:cancel')}
          onPress={onCancel}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.doneButton}
        />
      </View>
    </View>
  );
};

export default PropertyConfirmationView;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  divider: {
    marginVertical: 14,
    borderColor: theme.colors.darkTint10,
  },
  message: {
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
  },
  doneButton: {
    flexDirection: 'row-reverse',
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
});
