import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import YoutubeSVG from '@homzhub/common/src/assets/images/youtube.svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  isToggled: boolean;
  onToggle: () => void;
  videoUrl: string;
  onUpdateUrl: (url: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const AddYoutubeUrl = (props: IProps): React.ReactElement => {
  const { isToggled, onToggle, videoUrl, onUpdateUrl, containerStyle } = props;

  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);

  const setPaddingForYouTubeSection = (): number => {
    if (PlatformUtils.isWeb() && !isMobile) return 20;
    if (isMobile) return 10;
    return 0;
  };
  const youtubeSectionPadding = { paddingLeft: setPaddingForYouTubeSection() };
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text type="small" textType="semiBold" style={styles.headerText}>
          {t('video')}
        </Text>
        <RNSwitch selected={isToggled} onToggle={onToggle} />
      </View>
      {isToggled && (
        <View style={[styles.youtubeContainer, youtubeSectionPadding]}>
          <View style={styles.youtubeIconAndText}>
            <YoutubeSVG width={35} height={35} />
            <Text type="small" textType="semiBold" style={styles.youtubeUrlText}>
              {t('youtubeUrl')}
            </Text>
          </View>
          <Label type="large" textType="regular" style={styles.helperText}>
            {t('videoHelperText')}
          </Label>
          <TextInput
            textContentType="URL"
            value={videoUrl}
            placeholder={t('urlPlaceholder')}
            keyboardType="default"
            onChangeText={onUpdateUrl}
            style={styles.textInput}
            clearButtonMode="always"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    padding: 15,
    backgroundColor: theme.colors.moreSeparator,
  },
  headerText: {
    color: theme.colors.darkTint3,
  },
  youtubeContainer: {
    justifyContent: 'space-around',
    alignItems: PlatformUtils.isWeb() ? 'flex-start' : 'center',
    backgroundColor: theme.colors.white,
    minHeight: 150,
  },
  helperText: {
    color: theme.colors.darkTint5,
  },
  youtubeUrlText: {
    color: theme.colors.darkTint3,
    marginStart: 10,
  },
  textInput: {
    width: 320,
    textAlign: 'left',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: theme.colors.disabled,
  },
  youtubeIconAndText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
