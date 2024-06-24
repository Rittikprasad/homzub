import React from 'react';
import { CheckboxGroup, ICheckboxGroupProps } from '@homzhub/common/src/components/molecules/CheckboxGroup';

interface IState {
  data: any[];
}

// Todo (Sriram: do we need this component?)
export class UncontrolledCheckboxGroup extends React.PureComponent<ICheckboxGroupProps, IState> {
  public state = {
    data: [],
  };

  public componentDidMount = (): void => {
    const { data } = this.props;
    this.setState({ data });
  };

  public render = (): React.ReactNode => {
    const { containerStyle = {} } = this.props;
    const { data } = this.state;
    return <CheckboxGroup containerStyle={containerStyle} data={data} onToggle={this.handleToggle} />;
  };

  private handleToggle = (id: number | string, isSelected: boolean): void => {
    const { data } = this.state;
    const { onToggle } = this.props;

    const updatedData = data.map((item: any) => {
      if (item.id === id) {
        return { ...item, isSelected };
      }
      return item;
    });

    this.setState({ data: updatedData });

    onToggle(id, isSelected);
  };
}
