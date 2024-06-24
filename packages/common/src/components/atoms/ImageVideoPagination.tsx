import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  currentSlide: number;
  totalSlides: number;
  type: string;
  hasOnlyImages?: boolean;
}

const ImageVideoPagination = (props: IProps): React.ReactElement => {
  const { currentSlide, totalSlides, type, hasOnlyImages = false } = props;
  return (
    <View style={styles.container}>
      <Icon
        name={icons.camera}
        size={20}
        color={type === 'IMAGE' ? theme.colors.white : theme.colors.darkTint5}
        style={hasOnlyImages ? styles.video : {}}
      />
      {!hasOnlyImages && (
        <Icon
          name={icons.video}
          size={20}
          color={type === 'VIDEO' ? theme.colors.white : theme.colors.darkTint5}
          style={styles.video}
        />
      )}
      <Label type="large" textType="regular" style={styles.label}>
        {currentSlide + 1} / {totalSlides}
      </Label>
    </View>
  );
};

export { ImageVideoPagination };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.imageVideoPaginationBackground,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 2,
  },
  label: {
    color: theme.colors.white,
  },
  video: {
    paddingHorizontal: 5,
  },
});
