// @ts-noCheck
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { RNVideo } from '@homzhub/mobile/src/components/atoms/Video';

let props: any;
let wrapper: ShallowWrapper;

describe('Video', () => {
  beforeEach(() => {
    props = {
      direction: 'row',
    };
  });

  it('should match snapshot', () => {
    wrapper = shallow(<RNVideo {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for full screen', () => {
    props = {
      ...props,
      isFullScreenCarousel: true,
    };
    wrapper = shallow(<RNVideo {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should validate state', () => {
    props = {
      ...props,
      isFullScreenCarousel: true,
      onToggleFullScreenVideoPlayer: jest.fn(),
    };

    const instance = shallow(<RNVideo {...props} />).instance();
    instance.onPaused(1);
    expect(instance.state.paused).toBe(true);
    expect(instance.state.playerState).toBe(1);
    instance.onLoad({ duration: 12 });
    expect(instance.state.duration).toBe(12);
    expect(instance.state.isLoading).toBe(false);
    instance.onProgress({ currentTime: 15 });
    expect(instance.state.currentTime).toBe(15);
    instance.onLoadStart();
    expect(instance.state.isLoading).toBe(true);
    instance.onEnd();
    expect(instance.state.playerState).toBe(2);
    instance.onSeeking(12);
    expect(instance.state.currentTime).toBe(12);
  });
});
