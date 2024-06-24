import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import DisplayDate from '@homzhub/common/src/components/atoms/DisplayDate';
import { FlagHOC, flagName } from '@homzhub/common/src/components/atoms/Flag';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';

interface IProps {
  reminder: Reminder;
  cardContainerStyle?: StyleProp<ViewStyle>;
  onPressCard?: () => void;
}

const ReminderCard = (props: IProps): React.ReactElement => {
  const {
    reminder: { nextReminderDate, title, description, asset },
    cardContainerStyle,
    onPressCard,
  } = props;

  const countryFlag = (iso2Code: string): React.ReactElement | null =>
    iso2Code.length > 0 ? FlagHOC(flagName[iso2Code], 12) : null;

  const AddressView = (): React.ReactElement | null => {
    if (!asset) return null;
    return (
      <PropertyAddressCountry
        primaryAddress={asset?.projectName ?? ''}
        countryFlag={countryFlag(asset?.country.iso2Code ?? '')}
        primaryAddressTextStyles={{
          size: 'regular',
          variant: 'label',
          fontWeight: 'regular',
          style: styles.addressText,
        }}
        containerStyle={styles.addressContainer}
      />
    );
  };

  return (
    <TouchableOpacity onPress={onPressCard} style={[styles.container, cardContainerStyle && cardContainerStyle]}>
      <DisplayDate date={nextReminderDate} containerStyle={styles.dateContainer} />
      <View style={styles.flexOne}>
        <AddressView />
        <Label type="large" textType="bold">
          {title}
        </Label>
        <Label type="large">{description}</Label>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ReminderCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexOne: {
    flex: 1,
  },
  addressContainer: {
    marginBottom: 7,
  },
  addressText: {
    color: theme.colors.darkTint4,
  },
});
