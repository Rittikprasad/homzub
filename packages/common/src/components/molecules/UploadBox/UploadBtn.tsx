import React from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import Icon from "@homzhub/common/src/assets/icon";
import { theme } from "@homzhub/common/src/styles/theme";
import { Label, Text } from "@homzhub/common/src/components/atoms/Text";

interface IProps {
  icon: string;
  header: string;
  subHeader: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  subHeaderStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
  iconStyle?: StyleProp<ViewStyle>;
}

export const UploadBtn = <T extends IProps>(props: T): React.ReactElement => {
  const {
    icon,
    header,
    subHeader,
    onPress,
    containerStyle,
    headerStyle,
    subHeaderStyle,
    iconSize,
    iconColor,
    iconStyle,
  } = props;
  console.log("this is props in UploadBoxComponent", props.onPress);
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <View style={[styles.icon, iconStyle]}>
        <Icon
          name={icon}
          size={iconSize ?? 40}
          color={iconColor ?? theme.colors.primaryColor}
        />
      </View>
      <View style={styles.headerView}>
        <Text
          type="small"
          textType="semiBold"
          style={[styles.header, headerStyle]}
        >
          {header}
        </Text>
        <Label
          type="regular"
          textType="regular"
          style={[styles.subHeader, subHeaderStyle]}
        >
          {subHeader}
        </Label>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.lowPriority,
    borderRadius: 4,
    padding: 8,
    zIndex: -1,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    flex: 1,
  },
  headerView: {
    flex: 4,
  },
  header: {
    color: theme.colors.primaryColor,
  },
  subHeader: {
    paddingTop: 8,
    color: theme.colors.darkTint5,
  },
});
