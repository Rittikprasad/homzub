import React from 'react';
import renderer from 'react-test-renderer';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

const testProps = (Props: object): any => ({
  ...Props,
});
let props: any;

describe('Label Component', () => {
  describe('Snapshot tests for <Label>', () => {
    const labelTypes = [
      { type: null, name: 'Default' },
      { type: 'small', name: 'Small' },
      { type: 'regular', name: 'Regular' },
    ];

    labelTypes.forEach((labelType) => {
      it(`Type: ${labelType.name}`, () => {
        props = testProps({
          type: labelType.type,
        });
        const tree = renderer.create(<Label {...props}>Text</Label>).toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
});

describe('Text Component', () => {
  describe('Snapshot tests for <Text>', () => {
    const textTypes = [
      { type: null, name: 'Default' },
      { type: 'small', name: 'Small' },
      { type: 'regular', name: 'Regular' },
      { type: 'large', name: 'Large' },
    ];

    textTypes.forEach((textType) => {
      it(`Type: ${textType.name}`, () => {
        props = testProps({
          type: textType.type,
        });
        const tree = renderer.create(<Text {...props}>Demo</Text>).toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
});
