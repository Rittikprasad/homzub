import React from 'react';
import renderer from 'react-test-renderer';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';

describe('Test cases for WithFieldError', () => {
  it('render snapshot:: WithFieldError', () => {
    const props = {
      children: null,
      error: 'Error',
    };
    const tree = renderer.create(<WithFieldError {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('render snapshot when hideError is true:: WithFieldError', () => {
    const props = {
      children: null,
      hideError: true,
    };
    const tree = renderer.create(<WithFieldError {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
