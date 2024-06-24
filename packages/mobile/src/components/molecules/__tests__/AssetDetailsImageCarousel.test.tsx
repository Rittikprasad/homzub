import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AssetDetailsImageCarousel } from '@homzhub/mobile/src/components/molecules/AssetDetailsImageCarousel';

let props: any;

describe('AssetDetailsImageCarousel', () => {
  const createTestProps = (testProps: any): object => ({
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
        mediaType: 'VIDEO',
        mediaAttributes: {
          videoId: 1,
        },
      },
    ],
    enterFullScreen: jest.fn(),
    updateSlide: jest.fn(),
    activeSlide: 0,
    ...testProps,
  });
  props = createTestProps({});
  it('should match snapshot', () => {
    const wrapper = shallow(<AssetDetailsImageCarousel {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for carouselItem', () => {
    const wrapper = shallow(<AssetDetailsImageCarousel {...props} />);
    const RenderItem = wrapper.find('[testID="assetSnap"]').prop('carouselItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={props.data[0]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for carouselItem', () => {
    const wrapper = shallow(<AssetDetailsImageCarousel {...props} />);
    const RenderItem = wrapper.find('[testID="assetSnap"]').prop('carouselItem');
    // @ts-ignore
    const renderItemShallowWrapper = shallow(<RenderItem item={props.data[1]} />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should call function', () => {
    const wrapper = shallow(<AssetDetailsImageCarousel {...props} />);
    // @ts-ignore
    wrapper.find('[testID="assetSnap"]').prop('onSnapToItem')(1);
    expect(props.updateSlide).toBeCalled();
  });
});
