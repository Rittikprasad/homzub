import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CountryWithCode } from '@homzhub/common/src/mocks/CountryWithCode';
import { BottomSheetListView } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';

const mock = jest.fn();

const createTestProps = (testProps: any): object => ({
  data: CountryWithCode,
  selectedValue: 'abc',
  listTitle: 'Title',
  isBottomSheetVisible: true,
  onCloseDropDown: mock,
  onSelectItem: mock,
  testID: 'btmshList',
  ...testProps,
});
let props: any;

describe('BottomSheetListView', () => {
  beforeAll(() => jest.spyOn(React, 'useEffect').mockImplementation((f) => f));
  it('should render snapshot', () => {
    props = createTestProps({});
    const wrapper = mount(<BottomSheetListView {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
