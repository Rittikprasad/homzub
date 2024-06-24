import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { User } from '@homzhub/common/src/domain/models/User';

interface IProp {
  role: string;
  user: User;
  time: string;
  label: string;
  description: string;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

// TODO: (Shikha) - Re-look component
export const TicketActivitySection = (props: IProp): React.ReactElement => {
  const {
    user: { profilePicture, name },
    role,
    time,
    label,
    description,
    children,
    containerStyle,
  } = props;

  const isWeb = PlatformUtils.isWeb();

  return (
    <View style={[styles.activityHolder, !isWeb && styles.activityHolderMobile, containerStyle]}>
      <Avatar image={profilePicture} fullName={name} isOnlyAvatar imageSize={45} />
      <View style={styles.content}>
        <View style={styles.activityTextTop}>
          <Label type="regular" textType="regular" style={styles.role}>
            {role}
          </Label>
          <Label type="regular" textType="regular" style={styles.timeLabel}>
            {DateUtils.getDisplayDate(time, DateFormats.HHMM_AP)}
          </Label>
        </View>
        <Text type="small" textType="semiBold" style={styles.ticketStatus}>
          {label}
        </Text>
        {Boolean(description.length) && (
          <Label type="large" textType="regular">
            {description}
          </Label>
        )}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityHolder: {
    flexDirection: 'row',
    marginTop: 20,
  },
  activityHolderMobile: {
    flex: 1,
  },
  role: {
    color: theme.colors.darkTint4,
  },
  activityTextTop: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  timeLabel: {
    marginRight: 10,
  },
  ticketStatus: {
    marginVertical: 4,
    color: theme.colors.darkTint2,
  },
});
