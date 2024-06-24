import React, { PureComponent } from 'react';
import { View, Modal, StyleProp, ViewStyle, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

export interface IModalProps {
  visible: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  children: React.ReactElement | React.ReactNode;
  modalStyle?: StyleProp<ViewStyle>;
  modalContainerStyle: StyleProp<ViewStyle>;
  onClose: () => void;
}

export class ModalView extends PureComponent<IModalProps> {
  public render(): React.ReactNode {
    const { animationType, visible, children, onClose, modalStyle = {}, modalContainerStyle = {} } = this.props;

    return (
      <Modal animationType={animationType} transparent visible={visible}>
        <TouchableOpacity onPress={onClose} style={modalContainerStyle}>
          <TouchableWithoutFeedback>
            <View style={modalStyle}>{children}</View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  }
}
