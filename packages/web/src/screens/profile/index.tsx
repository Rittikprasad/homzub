import React, { FC, useEffect, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteComponentProps, useHistory, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import Settings from '@homzhub/web/src/screens/settings';
import ContinuePopup from '@homzhub/web/src/components/molecules/ContinuePopup';
import ProfileContainer from '@homzhub/web/src/screens/profile/components/ProfileContainer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { EmailVerificationActions, IEmailVerification } from '@homzhub/common/src/domain/repositories/interfaces';

interface IDynamicLinkProps {
  verificationId: string;
}

interface IProps extends RouteComponentProps {
  getUserProfile: () => void;
}

const Profile: FC<IProps> = (props: IProps) => {
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  const location = useLocation<IDynamicLinkProps>();
  const history = useHistory<IDynamicLinkProps>();
  const { verificationId } = location.state || '';
  const { goBackClicked, setGoBackClicked } = useContext(AppLayoutContext);
  const [verifyEmailProps, setVerifyEmailProps] = useState({ isModalOpen: false, isApiError: false });
  useEffect(() => {
    if (verificationId) {
      toVerifyEmail();
    }
    return (): void => clearRouterState();
  }, []);

  useEffect(() => {
    if (goBackClicked) {
      customBackPress();
      setGoBackClicked(false);
    }
  }, [goBackClicked]);

  const customBackPress = (): void => {
    if (verificationId) {
      NavigationService.navigate(history, { path: RouteNames.protectedRoutes.DASHBOARD });
    } else {
      NavigationService.goBack();
    }
  };

  const toVerifyEmail = async (): Promise<void> => {
    const payload: IEmailVerification = {
      action: EmailVerificationActions.VERIFY_EMAIL,
      payload: {
        verification_id: verificationId,
      },
    };
    try {
      await UserRepository.sendOrVerifyEmail(payload);
      setVerifyEmailProps({ isModalOpen: true, isApiError: false });
      clearRouterState();
      props.getUserProfile();
    } catch (e) {
      setVerifyEmailProps({ isModalOpen: true, isApiError: true });
      clearRouterState();
    }
  };

  const clearRouterState = (): void => {
    if (history.location.state && history.location.state?.verificationId) {
      const state = { verificationId: '' };
      history.replace({ ...history.location, state });
    }
  };

  const successPopupProps = {
    title: t('moreProfile:emailVerifiedText'),
    subTitle: t('moreProfile:emailVerifiedDescription'),
    buttonSubText: '',
    buttonTitle: t('common:done'),
    svgSource: require('@homzhub/common/src/assets/images/confirmCheck.svg'),
  };
  const failurePopupProps = {
    title: t('moreProfile:emailNotVerifiedText'),
    subTitle: t('moreProfile:emailNotVerifiedDescription'),
    buttonSubText: '',
    buttonTitle: t('common:done'),
    svgSource: require('@homzhub/common/src/assets/images/errorAlert.svg'),
  };

  return !isTablet && !isMobile ? (
    <View style={!isTablet && !isMobile && styles.rowStyle}>
      <ContinuePopup
        isSvg
        isOpen={verifyEmailProps.isModalOpen}
        {...(!verifyEmailProps.isApiError ? successPopupProps : failurePopupProps)}
      />
      <ProfileContainer />
      {!isTablet && !isMobile && (
        <View style={styles.setting}>
          <Settings />
        </View>
      )}
    </View>
  ) : (
    <ProfileContainer />
  );
};

const styles = StyleSheet.create({
  setting: {
    marginLeft: 24,
    width: '57vw',
  },
  rowStyle: {
    flexDirection: 'row',
  },
});

export default Profile;
