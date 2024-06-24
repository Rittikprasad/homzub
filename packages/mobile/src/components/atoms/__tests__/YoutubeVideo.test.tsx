import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { YoutubeVideo } from '@homzhub/mobile/src/components/atoms/YoutubeVideo';

describe('YoutubeVideo', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot', () => {
    const props = {
      videoId: 'ATSgwZXOuUo',
    };
    wrapper = shallow(<YoutubeVideo {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for full screen', () => {
    const props = {
      videoId: 'ATSgwZXOuUo',
      isFullScreen: true,
    };
    wrapper = shallow(<YoutubeVideo {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for no play', () => {
    const props = {
      videoId: 'ATSgwZXOuUo',
      play: false,
    };
    wrapper = shallow(<YoutubeVideo {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for loop', () => {
    const props = {
      videoId: 'ATSgwZXOuUo',
      loop: true,
    };
    wrapper = shallow(<YoutubeVideo {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
