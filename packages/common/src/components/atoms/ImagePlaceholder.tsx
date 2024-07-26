import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { theme } from "@homzhub/common/src/styles/theme";
import PlaceHolder from "@homzhub/common/src/assets/images/imageLoader.svg";

interface IProps {
  width?: number | string;
  height?: number | string;
  containerStyle?: StyleProp<ViewStyle>;
}

const ImagePlaceholder = (props: IProps): React.ReactElement => {
  const { width = "100%", containerStyle } = props;
  return (
    <View style={[styles.placeholderImage]}>
      <PlaceHolder width={width} {...props} />
    </View>
  );
};

const memoizedComponent = React.memo(ImagePlaceholder);
export { memoizedComponent as ImagePlaceholder };

const styles = StyleSheet.create({
  placeholderImage: {
    backgroundColor: theme.colors.background,
  },
});
