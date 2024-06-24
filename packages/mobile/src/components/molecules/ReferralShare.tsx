import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Share, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import Whatsapp from '@homzhub/common/src/assets/images/whatsapp.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { DynamicLinkParamKeys, DynamicLinkTypes, RouteTypes } from '@homzhub/mobile/src/services/constants';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IReferralShareProp {
  setLoading: (isLoading: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const ReferralShare = ({ setLoading, containerStyle }: IReferralShareProp): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);
  const code = useSelector(UserSelector.getReferralCode);
  const url = useRef('');

  useEffect(() => {
    setLoading(true);
    LinkingService.buildShortLink(
      DynamicLinkTypes.Referral,
      `${DynamicLinkParamKeys.ReferralCode}=${code}&${DynamicLinkParamKeys.RouteType}=${RouteTypes.Public}`
    )
      .then((link) => {
        url.current = `${t('shareHomzhub', { code, url: link })}`;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code, t]);

  const onShare = useCallback(async (): Promise<void> => {
    await Share.share({ message: url.current });
  }, []);

  const onMail = useCallback(async (): Promise<void> => {
    trackEvent(t('common:mail'));
    await LinkingService.openEmail({ body: url.current, subject: t('shareHomzhubSubject') });
  }, []);

  const onSms = useCallback(async (): Promise<void> => {
    trackEvent(t('common:sms'));
    await LinkingService.openSMS({ message: url.current });
  }, []);

  const onWhatsapp = useCallback(async (): Promise<void> => {
    trackEvent(t('common:whatsapp'));
    await LinkingService.openWhatsapp(url.current);
  }, []);

  const trackEvent = (source: string): void => {
    AnalyticsService.track(EventType.Refer, {
      source,
      code,
    });
  };

  const data = useRef([
    {
      title: t('common:whatsapp'),
      icon: 'w',
      onPress: onWhatsapp,
    },
    {
      title: t('common:sms'),
      icon: icons.sms,
      onPress: onSms,
    },
    {
      title: t('common:mail'),
      icon: icons.envelope,
      onPress: onMail,
    },
    {
      title: t('common:share'),
      icon: icons.shareFilled,
      onPress: onShare,
    },
  ]);

  return (
    <View style={[styles.shareContainer, containerStyle]}>
      {data.current.map((item) => (
        <TouchableOpacity key={item.title} style={styles.shareOption} activeOpacity={0.5} onPress={item.onPress}>
          {item.icon === 'w' ? <Whatsapp /> : <Icon name={item.icon} size={24} color={theme.colors.active} />}
          <Label type="regular" style={styles.shareText}>
            {item.title}
          </Label>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ReferralShare;

const styles = StyleSheet.create({
  shareContainer: {
    marginHorizontal: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  shareOption: {
    alignItems: 'center',
  },
  shareText: {
    marginTop: 8,
    textAlign: 'center',
    color: theme.colors.darkTint5,
  },
});
