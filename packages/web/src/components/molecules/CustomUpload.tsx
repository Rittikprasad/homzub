import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IProps {
  handleFile: (fileUploaded: File) => void;
  children?: React.ReactNode;
  acceptedTypes?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const CustomUpload: React.FC<IProps> = (props: IProps) => {
  const { children, handleFile, acceptedTypes, containerStyle } = props;

  // Create a reference to the hidden file input element
  const hiddenFileInput = React.createRef<HTMLInputElement>();

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (): void => {
    hiddenFileInput?.current?.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event: any): void => {
    const target = event.target as HTMLInputElement;
    if (target) {
      const fileUploaded = event.target.files[0];
      handleFile(fileUploaded);
    }
  };
  const defaultAccepted = 'image/x-png, image/jpeg, image/jpg';
  return (
    <View style={[styles.container, containerStyle]}>
      {children ? (
        <TouchableOpacity onPress={handleClick}>{children}</TouchableOpacity>
      ) : (
        <Icon size={16} name={icons.noteBookOutlined} color={theme.colors.white} onPress={handleClick} />
      )}
      <input
        type="file"
        accept={acceptedTypes || defaultAccepted}
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomUpload;
