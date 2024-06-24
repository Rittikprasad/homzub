// @ts-noCheck
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FullScreenAssetDetailsCarousel } from '../FullScreenAssetDetailsCarousel';

let props: any;

describe.skip('FullScreenAssetDetailsCarousel', () => {
  const createTestProps = (testProps: any): object => ({
    activeSlide: 0,
    data: [
      {
        fileName: 'prof.jpg',
        isCoverImage: true,
        link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
        mediaType: 'IMAGE',
        mediaAttributes: {
          videoId: 1,
        },
      },
      {
        fileName: 'prof.jpg',
        isCoverImage: true,
        link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
        mediaType: 'Video',
        mediaAttributes: {
          videoId: 1,
        },
      },
    ],
    onFullScreenToggle: jest.fn(),
    updateSlide: jest.fn(),
    onShare: jest.fn(),
    ...testProps,
  });

  props = createTestProps({});

  it('should match snapshot', () => {
    const wrapper = shallow(<FullScreenAssetDetailsCarousel {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call function', () => {
    const e = {
      nativeEvent: {
        contentOffset: {
          x: 0,
          y: 0,
        },
      },
    };
    const wrapper = shallow(<FullScreenAssetDetailsCarousel {...props} />);
    wrapper.find('[testID="attachmentFlatList"]').prop('onMomentumScrollEnd')(e);
    expect(props.updateSlide).toBeCalled();
  });

  it('should match snapshot for renderItem for IMAGE', () => {
    const wrapper = shallow(<FullScreenAssetDetailsCarousel {...props} />);
    const RenderItem = wrapper.find('[testID="attachmentFlatList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={props.data[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem for VIDEO', () => {
    const wrapper = shallow(<FullScreenAssetDetailsCarousel {...props} />);
    const RenderItem = wrapper.find('[testID="attachmentFlatList"]').prop('renderItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={props.data[1]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for keyExtractor', () => {
    const wrapper = shallow(<FullScreenAssetDetailsCarousel {...props} />);
    const KeyExtractor = wrapper.find('[testID="attachmentFlatList"]').prop('keyExtractor');
    // @ts-ignore
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={props.data[0]} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });
});
