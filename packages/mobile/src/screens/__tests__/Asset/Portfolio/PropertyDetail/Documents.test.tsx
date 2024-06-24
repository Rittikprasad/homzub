// @ts-noCheck
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Documents } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/Documents';

describe.skip('Documents Screen', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      getAssetDocument: jest.fn(),
    };
    component = shallow(<Documents {...props} />);
  });

  it('should render snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render snapshot with documents', () => {
    component.setState({ documents: [{}] });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should match snapshot for renderItem', () => {
    component.setState({ documents: [{}] });
    const RenderItem = component.find('[testID="documentList"]').prop('renderItem');
    const renderItemShallowWrapper = shallow(<RenderItem item={{}} />);
    renderItemShallowWrapper.find('[testID="documentCard"]').prop('handleShare')('link');
    renderItemShallowWrapper.find('[testID="documentCard"]').prop('handleDelete')(1);
    renderItemShallowWrapper.find('[testID="documentCard"]').prop('handleDownload')('key', 'dummy.pdf');
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for renderSeparator', () => {
    component.setState({ documents: [{}] });
    const RenderItem = component.find('[testID="documentList"]').prop('ItemSeparatorComponent');
    const renderItemShallowWrapper = shallow(<RenderItem />);
    expect(toJson(renderItemShallowWrapper)).toMatchSnapshot();
  });

  it('should match snapshot for keyExtractor', () => {
    component.setState({ documents: [{}] });
    const KeyExtractor = component.find('[testID="documentList"]').prop('keyExtractor');
    const renderExtractorShallowWrapper = shallow(<KeyExtractor item={{}} />);
    expect(toJson(renderExtractorShallowWrapper)).toMatchSnapshot();
  });

  it('should update search value', () => {
    component.find('[testID="searchBar"]').prop('updateValue')('search');
    expect(component.instance().state.searchValue).toBe('search');
  });
});
