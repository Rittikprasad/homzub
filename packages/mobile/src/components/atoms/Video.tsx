import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Video, { OnProgressData, OnLoadData } from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
// import Orientation from 'react-native-orientation-locker';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';

interface IProps {
  uri: string;
  volume?: number;
  onToggleFullScreenVideoPlayer?: () => void;
  isFullScreenCarousel?: boolean;
}

interface IRNVideoState {
  currentTime: number;
  duration: number;
  isFullScreen: boolean;
  isLoading: boolean;
  paused: boolean;
  playerState: number;
  screenType: string;
}

class RNVideo extends React.Component<IProps, IRNVideoState> {
  private videoPlayer: Video | null = null;
  public state = {
    currentTime: 0,
    duration: 0,
    isFullScreen: false,
    isLoading: true,
    paused: false,
    playerState: PLAYER_STATES.PLAYING,
    screenType: 'cover',
  };

  public render(): React.ReactElement {
    const { uri, volume = 1, isFullScreenCarousel } = this.props;
    const { currentTime, duration, isFullScreen, isLoading, paused, playerState, screenType } = this.state;
    return (
      <View style={styles.container}>
        {isFullScreenCarousel && (
          <View style={styles.backButtonWrapper}>
            <TouchableOpacity onPress={this.goBack}>
              <Icon name={icons.leftArrow} size={22} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        )}
        <Video
          onEnd={this.onEnd}
          onLoad={this.onLoad}
          onLoadStart={this.onLoadStart}
          onProgress={this.onProgress}
          paused={paused}
          ref={(c): void => {
            this.videoPlayer = c;
          }}
          // @ts-ignore
          resizeMode={screenType}
          onFullScreen={isFullScreen}
          source={{ uri }}
          style={styles.mediaPlayer}
          volume={Math.max(Math.min(1, volume), 0)}
        />
        <MediaControls
          duration={duration}
          isLoading={isLoading}
          mainColor={theme.colors.shadow}
          isFullScreen={isFullScreen}
          onFullScreen={this.onFullScreen}
          onPaused={this.onPaused}
          onReplay={this.onReplay}
          onSeek={this.onSeek}
          onSeeking={this.onSeeking}
          playerState={playerState}
          progress={currentTime}
        />
      </View>
    );
  }

  public onSeek = (seek: number): void => {
    // Handler for change in seekbar
    this.videoPlayer?.seek(seek);
  };

  public onPaused = (playerState: number): void => {
    const { paused } = this.state;
    // Handler for Video Pause
    this.setState({
      paused: !paused,
      playerState,
    });
  };

  public onReplay = (): void => {
    // Handler for Replay
    this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer?.seek(0);
  };

  public onProgress = (data: OnProgressData): void => {
    const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({ currentTime: data.currentTime });
    }
  };

  public onLoad = (data: OnLoadData): void => this.setState({ duration: data.duration, isLoading: false });

  public onLoadStart = (): void => this.setState({ isLoading: true });

  public onEnd = (): void => this.setState({ playerState: PLAYER_STATES.ENDED });

  public onFullScreen = (): void => {
    const { onToggleFullScreenVideoPlayer, isFullScreenCarousel } = this.props;
    if (isFullScreenCarousel) {
      // Orientation.lockToLandscapeLeft();
      return;
    }
    if (onToggleFullScreenVideoPlayer) {
      onToggleFullScreenVideoPlayer();
    }
  };

  public onSeeking = (currentTime: number): void => this.setState({ currentTime });

  public goBack = (): void => {
    const { isFullScreenCarousel, onToggleFullScreenVideoPlayer } = this.props;
    if (isFullScreenCarousel) {
      if (onToggleFullScreenVideoPlayer) {
        onToggleFullScreenVideoPlayer();
      }
      // Orientation.lockToPortrait();
    }
  };
}

export { RNVideo };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.transparent,
  },
  backButtonWrapper: {
    backgroundColor: theme.colors.transparent,
    left: 20,
    top: 20,
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'flex-start',
  },
});
