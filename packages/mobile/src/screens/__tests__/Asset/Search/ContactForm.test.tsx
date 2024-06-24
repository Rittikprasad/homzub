import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ContactForm } from '@homzhub/mobile/src/screens/Asset/Search/ContactForm';
import { SearchFilter } from '@homzhub/common/src/mocks/FilterData';

describe('Contact Form Screen', () => {
  let component: ShallowWrapper;
  let props: any;
  const mock = jest.fn();

  beforeEach(() => {
    props = {
      filters: SearchFilter,
      isLoggedIn: true,
      navigation: {
        goBack: mock,
      },
      route: {
        params: {
          contactDetail: {},
        },
      },
    };
  });

  it('should render snapshot', () => {
    component = shallow(<ContactForm {...props} t={(key: string): string => key} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
