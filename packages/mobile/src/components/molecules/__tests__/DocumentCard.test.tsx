import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DocumentCard } from '@homzhub/mobile/src/components/molecules/DocumentCard';
import { DocumentsData } from '@homzhub/common/src/mocks/AssetData';

describe('DocumentCard', () => {
  it('should match snapshot', () => {
    const props = {
      document: DocumentsData[0],
      userEmail: 'test@gmail.com',
      handleShare: jest.fn(),
      handleDelete: jest.fn(),
    };
    // @ts-ignore
    const wrapper = mount(<DocumentCard {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
