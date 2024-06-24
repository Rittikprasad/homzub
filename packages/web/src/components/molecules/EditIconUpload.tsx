import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  handleFile: (fileUploaded: File) => void;
}

const EditIconUpload: React.FC<IProps> = (props: IProps) => {
  // Create a reference to the hidden file input element
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
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
      props.handleFile(fileUploaded);
    }
  };
  return (
    <View style={[styles.editView, isTablet && styles.editViewTablet, isMobile && styles.editViewMobile]}>
      <Icon size={16} name={icons.noteBookOutlined} color={theme.colors.white} onPress={handleClick} />
      <input
        type="file"
        accept="'image/x-png,image/jpeg', image/jpg"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editView: {
    ...(theme.circleCSS(28) as object),
    backgroundColor: theme.colors.primaryColor,
    borderColor: theme.colors.white,
    borderWidth: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '60%',
    left: '54%',
  },
  editViewTablet: {
    top: '55%',
    left: '52%',
  },
  editViewMobile: {
    top: '60%',
    left: '54%',
  },
});

export default EditIconUpload;
