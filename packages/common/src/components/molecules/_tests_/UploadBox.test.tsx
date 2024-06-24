import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { icons } from '@homzhub/common/src/assets/icon';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('Test cases for UploadBox', () => {
  it('should render snapshot', () => {
    const props = {
      icon: icons.idProof,
      header: 'Header',
      subHeader: 'Sub header Text',
      onPress: jest.fn(),
      iconSize: 40,
    };
    const wrapper: ShallowWrapper = shallow(<UploadBox {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
