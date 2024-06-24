import React from 'react';
import { Label } from '@homzhub/common/src/components/atoms/Text';

class About extends React.PureComponent<{}, {}> {
  public render(): React.ReactNode {
    return (
      <div>
        <Label type="small" textType="bold">
          Label - Small - Bold
        </Label>
      </div>
    );
  }
}

export default About;
