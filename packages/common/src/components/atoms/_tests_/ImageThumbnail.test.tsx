import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ImageThumbnail, IOwnProps } from '@homzhub/common/src/components/atoms/ImageThumbnail';

describe.skip('Image Thumbnail', () => {
  let props: IOwnProps;

  it('should match snapshot for isCoverPhotoContainer', () => {
    props = {
      imageUrl: 'image',
      isCoverPhotoContainer: true,
    };
    const wrapper: ShallowWrapper = shallow(<ImageThumbnail {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for isCoverPhotoContainer when isFavourite is true ', () => {
    props = {
      imageUrl: 'image',
      isCoverPhotoContainer: true,
      isFavorite: true,
    };
    const wrapper: ShallowWrapper = shallow(<ImageThumbnail {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for isLastThumbnail ', () => {
    props = {
      imageUrl: 'image',
      isLastThumbnail: true,
    };
    const wrapper: ShallowWrapper = shallow(<ImageThumbnail {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for handleIconPress when onIconPress prop is there ', () => {
    props = {
      imageUrl: 'image',
      onIconPress: jest.fn(),
    };
    const wrapper: ShallowWrapper = shallow(<ImageThumbnail {...props} />);
    // @ts-ignore
    wrapper.instance().handleIconPress();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for handleIconPress when onIconPress prop is not there', () => {
    props = {
      imageUrl: 'image',
    };
    const wrapper: ShallowWrapper = shallow(<ImageThumbnail {...props} />);
    // @ts-ignore
    wrapper.instance().handleIconPress();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
