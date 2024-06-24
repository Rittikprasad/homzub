import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useViewPort, useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  videoLink: string;
}

const YoutubeCard: FC<IProps> = (props: IProps) => {
  const { videoLink } = props;
  const youtubeSize = useViewPort().width;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  const scaleX = isMobile ? 0.8 : 0.225;
  const scaleY = isMobile ? 0.5 : 0.3;
  const videoStyle = {
    width: youtubeSize * scaleX,
    height: youtubeSize * scaleY,
  };

  const convertYoutubeLink = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const link = `//www.youtube.com/embed/${match[2]}`;
      return link;
    }
    return 'error';
  };

  return (
    <View style={styles.image}>
      <iframe
        title={t('Video Loading')}
        style={videoStyle}
        src={convertYoutubeLink(videoLink)}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    marginTop: 12,
    width: '100%',
    height: 250,
  },
});

export default YoutubeCard;
