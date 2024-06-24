import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PropertyDetailsLocation, IProps } from '@homzhub/mobile/src/components/molecules/PropertyDetailsLocation';

const mock = jest.fn();

describe('Property Details Component', () => {
  let props: IProps;
  let component: ShallowWrapper;

  beforeEach(() => {
    props = {
      propertyName: 'Property A',
      propertyAddress: 'Property Address',
      onNavigate: mock,
      testID: 'lblChange',
    };
    component = shallow(<PropertyDetailsLocation {...props} />);
  });

  it('should render propertyDetails', () => {
    expect(toJson(component.dive())).toMatchSnapshot();
  });

  it('should call on navigate on label press', () => {
    // @ts-ignore
    component.dive().find('[testID="lblChange"]').prop('onPress')();
    expect(mock).toHaveBeenCalled();
  });
});
