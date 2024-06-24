import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ImageRound, ImageSquare } from '@homzhub/common/src/components/atoms/Image';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});
describe('<ImageRound />', () => {
  it('renders a round image', () => {
    const roundImage = shallow(
      <ImageRound
        size={50}
        source={{
          uri: 'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
        }}
      />
    );
    expect(toJson(roundImage)).toMatchSnapshot();
  });
});

describe('<ImageSquare />', () => {
  it('renders a square image', () => {
    const squareImage = shallow(
      <ImageSquare
        size={50}
        source={{
          uri: 'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
        }}
      />
    );
    expect(toJson(squareImage)).toMatchSnapshot();
  });
});
