import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { ContactActions } from '@homzhub/common/src/domain/models/Search';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  phoneNumber: string;
  image?: string;
  onContactTypeClicked: (type: ContactActions, phoneNumber: string, message: string) => void;
  from?: string;
  isShadowRequired?: boolean;
}

const ContactPerson = (props: IProps): React.ReactElement => {
  const {
    firstName,
    lastName,
    designation,
    phoneNumber,
    onContactTypeClicked,
    image,
    from,
    isShadowRequired = true,
  } = props;
  const fullName = `${firstName} ${lastName}`;
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  const OPTIONS = [
    { icon: icons.whatsapp, id: ContactActions.WHATSAPP, visible: !phoneNumber.includes('**') },
    { icon: icons.phone, id: ContactActions.CALL, visible: !phoneNumber.includes('**') },
    { icon: icons.envelope, id: ContactActions.MAIL, visible: true },
  ];

  const OPTIONS_SEARCH = [{ icon: icons.envelope, id: ContactActions.MAIL, visible: true }];

  const data = from === 'Search' ? OPTIONS_SEARCH : OPTIONS;

  return (
    <View style={[styles.container, isShadowRequired && styles.shadowView]}>
      <Avatar fullName={fullName} designation={designation} image={image} />
      <View style={styles.iconContainer}>
        {data.map((item, index: number) => {
          const { icon, id, visible } = item;

          const onPress = (): void => {
            if (id === ContactActions.CALL) {
              onContactTypeClicked(ContactActions.CALL, phoneNumber, '');
              return;
            }

            if (id === ContactActions.WHATSAPP) {
              onContactTypeClicked(ContactActions.WHATSAPP, phoneNumber, t('whatsappMessage', { fullName }));
              return;
            }

            onContactTypeClicked(ContactActions.MAIL, '', '');
          };

          return (
            <>
              {visible && (
                <TouchableOpacity
                  key={id}
                  style={[styles.iconButton, (PlatformUtils.isMobile() || isMobile) && styles.iconButtonMobile]}
                  onPress={onPress}
                  testID="to"
                >
                  <Icon name={icon} size={24} color={theme.colors.primaryColor} />
                </TouchableOpacity>
              )}
            </>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PlatformUtils.isWeb() ? 0 : 16,
  },
  shadowView: {
    shadowColor: theme.colors.darkTint7,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    borderRadius: 4,
    marginLeft: 24,
  },
  iconButtonMobile: {
    marginLeft: 12,
  },
});

const memoizedComponent = React.memo(ContactPerson);
export { memoizedComponent as ContactPerson };
