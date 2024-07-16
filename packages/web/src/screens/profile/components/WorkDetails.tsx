import React, { FC, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { EmailVerificationActions, IEmailVerification } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import ProfilePopover, { ProfileUserFormTypes } from '@homzhub/web/src/screens/profile/components/ProfilePopover';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export interface IDetailsInfo {
  icon: string;
  text?: string;
  helperText?: string;
  type?: 'TEXT' | 'EMAIL';
  emailVerified?: boolean;
}
export interface IProps {
  userProfileInfo: UserProfileModel;
}

const WorkDetails: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { userProfileInfo } = props;
  const [formType, setFormType] = useState<ProfileUserFormTypes>(ProfileUserFormTypes.EmergencyContact);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const popupRef = useRef<PopupActions>(null);
  if (!userProfileInfo) {
    return null;
  }
  const { workInfoArray, emergencyContactArray, workInfo } = userProfileInfo;
  const onVerifyEmail = async (): Promise<void> => {
    const { workEmail } = workInfo;
    const payload: IEmailVerification = {
      action: EmailVerificationActions.GET_VERIFICATION_EMAIL,
      payload: {
        email: workEmail as string | undefined,
        is_work_email: true,
      },
    };
    try {
      await UserRepository.sendOrVerifyEmail(payload);
      AlertHelper.info({ message: t('moreProfile:emailVerificationSetAlert', { email: workEmail }) });
    } catch (e: any) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.statusCode });
    }
  };
  const details = (data: IDetailsInfo[]): React.ReactNode => {
    return data?.map((item, index) => {
      return (
        <View key={index}>
          <View style={styles.userContent}>
            <View style={styles.rowStyle}>
              <Icon size={20} name={item.icon} color={theme.colors.darkTint4} />
              <Label type="large" style={styles.text}>
                {item.text}
              </Label>
            </View>

            {item.type === 'EMAIL' &&
              (item.emailVerified ? (
                <Icon size={20} name={icons.doubleCheck} color={theme.colors.completed} />
              ) : (
                <Icon size={20} name={icons.filledWarning} color={theme.colors.error} />
              ))}
          </View>

          {item.type === 'EMAIL' && !item.emailVerified && (
            <Label type="large" style={styles.verifyMail} onPress={onVerifyEmail}>
              {t('moreProfile:verifyYourEmailText')}
            </Label>
          )}
        </View>
      );
    });
  };
  const openModal = (type: ProfileUserFormTypes): void => {
    setFormType(type);
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const emptyData = (item: string, type: ProfileUserFormTypes): React.ReactElement => {
    return (
      <View style={styles.marginTop}>
        <Label type="large" style={styles.moreInfo}>
          {item === 'emergencyContact' ? t('moreProfile:emergencyEmptyState') : t('moreProfile:workInfoEmptyState')}
        </Label>
        <TouchableOpacity onPress={(): void => openModal(type)}>
          <Label
            type="large"
            textType="semiBold"
            style={[styles.addContactBtn, item !== 'emergencyContact' && !isTablet && styles.workInfo]}
          >
            {item === 'emergencyContact' ? t('moreProfile:addContactInfoText') : t('moreProfile:addWorkInfoText')}
          </Label>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, isTablet && styles.tabContainer]}>
      <View style={[styles.innerContainer, isMobile && styles.innerContainerMob, isTablet && styles.innerContainerTab]}>
        {!isTablet && <Divider containerStyles={styles.divider} />}
        <View style={styles.heading}>
          <Text type="small" textType="semiBold">
            {t('moreProfile:emergencyContact')}
          </Text>

          {emergencyContactArray && (
            <Icon
              size={20}
              name={icons.noteBook}
              color={theme.colors.primaryColor}
              onPress={(): void => openModal(ProfileUserFormTypes.EmergencyContact)}
            />
          )}
        </View>
        {emergencyContactArray ? (
          <View>{details(emergencyContactArray)}</View>
        ) : (
          emptyData('emergencyContact', ProfileUserFormTypes.EmergencyContact)
        )}
        <Divider containerStyles={styles.divider} />
        <View style={styles.heading}>
          <Text type="small" textType="semiBold">
            {t('moreProfile:workInformation')}
          </Text>

          {workInfoArray && (
            <Icon
              size={20}
              name={icons.noteBook}
              color={theme.colors.primaryColor}
              onPress={(): void => openModal(ProfileUserFormTypes.WorkInfo)}
            />
          )}
        </View>
        {workInfoArray ? <View>{details(workInfoArray)}</View> : emptyData('workInfo', ProfileUserFormTypes.WorkInfo)}
        <ProfilePopover popupRef={popupRef} formType={formType} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
  },
  innerContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  innerContainerTab: {
    marginTop: 16,
  },
  innerContainerMob: {
    marginHorizontal: 16,
  },
  tabContainer: {
    height: 353,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    marginVertical: 24,
  },
  marginTop: {
    marginTop: 18,
  },
  dividerStyles: {
    marginVertical: 24,
  },

  addContactBtn: {
    textAlign: 'center',
    color: theme.colors.primaryColor,
  },
  moreInfo: {
    textAlign: 'center',
    color: theme.colors.darkTint5,
    paddingBottom: 16,
  },
  bottom: {
    paddingBottom: 16,
  },
  verifyMail: {
    marginLeft: 30,
    color: theme.colors.primaryColor,
  },
  workInfo: {
    paddingBottom: 8,
  },
  userContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  rowStyle: {
    flexDirection: 'row',
  },
  text: {
    marginLeft: 10,
  },
});
export default WorkDetails;
