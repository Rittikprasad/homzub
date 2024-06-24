import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SearchResults } from '@homzhub/mobile/src/components/molecules/SearchResults';
import { AutocompleteMock } from '@homzhub/common/src/mocks/GooglePlacesMocks';

let props: any;
let wrapper: ShallowWrapper;

describe('SearchResults', () => {
  const createTestProps = (testProps: any): object => ({
    results: AutocompleteMock.predictions,
    onResultPress: jest.fn(),
    ...testProps,
  });
  props = createTestProps({});

  it('should match snapshot', () => {
    wrapper = shallow(<SearchResults {...props} t={(key: string): string => key} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
