import React from 'react';
import { View, StyleSheet } from 'react-native';
import YouTube from 'react-native-youtube';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { theme } from '@homzhub/common/src/styles/theme';

const YOUTUBE_API_KEY = ConfigHelper.getYoutubeApiKey();

interface IProps {
  isFullScreen?: boolean;
  play?: boolean;
  loop?: boolean;
  videoId: string;
}

class YoutubeVideo extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { play = true, isFullScreen = false, loop = false, videoId } = this.props;
    return (
      <View style={styles.container}>
        <YouTube
          // @ts-ignore
          apiKey={YOUTUBE_API_KEY}
          videoId={videoId}
          play={play}
          fullscreen={isFullScreen}
          loop={loop}
          style={styles.youtube}
          onError={this.onError}
          resumePlayAndroid={false}
          controls={1}
        />
      </View>
    );
  }

  public onError = (e: any): void => {
    // TODO: To put the alert in case of error
  };
}

export { YoutubeVideo };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  youtube: {
    alignSelf: 'stretch',
    height: '100%',
    width: theme.viewport.width,
  },
});
