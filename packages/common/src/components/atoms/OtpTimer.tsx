import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onResentPress: () => void;
}

const initialCount = 60;
export const OtpTimer = (props: IProps): React.ReactElement => {
  const [seconds, setSeconds] = useState(initialCount);
  const { t } = useTranslation(LocaleConstants.namespacesKey.auth);

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      setSeconds((oldTimer: number) => oldTimer - 1);
    }, 1000);

    return (): void => clearInterval(interval);
  }, [seconds]);

  const onResendPress = (): void => {
    setSeconds(initialCount);
    props.onResentPress();
  };

  return (
    <Label type="large" textType="regular" style={styles.text}>
      {`${t('receiveOtp')} `}
      {seconds > 0 ? (
        <Label type="large" textType="semiBold">
          {t('resendIn', { sec: seconds })}
        </Label>
      ) : (
        <Label type="large" textType="semiBold" style={styles.resend} onPress={onResendPress}>
          {t('resend')}
        </Label>
      )}
    </Label>
  );
};

const styles = StyleSheet.create({
  text: {
    color: theme.colors.darkTint4,
  },
  resend: {
    color: theme.colors.active,
  },
});
