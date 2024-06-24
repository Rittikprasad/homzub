import React from 'react';
import { StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IPdfProps {
  source: object;
  fileName?: string;
  onCrossPress?: () => void;
}

export const PdfView = ({ source, fileName, onCrossPress }: IPdfProps): React.ReactElement => {
  return (
    <View style={[styles.container, fileName !== undefined && styles.fileContainer]}>
      <Pdf source={source} maxScale={1} fitPolicy={0} style={styles.pdf} />
      {onCrossPress && (
        <Icon
          onPress={onCrossPress}
          style={styles.crossStyle}
          name={icons.close}
          size={25}
          color={theme.colors.white}
        />
      )}
      {!!fileName && (
        <View style={styles.pdfNameContainer}>
          <Icon style={styles.pdfIcon} name={icons.pdf} size={20} color={theme.colors.darkTint3} />
          <Label type="large" textType="regular" style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
            {fileName}
          </Label>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray8,
    width: 350,
    height: 140,
    overflow: 'hidden',
    paddingBottom: 6,
    marginTop: 12,
  },
  fileContainer: {
    height: 180,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4.22,
    elevation: 3,
  },
  pdfNameContainer: {
    flexDirection: 'row',
    margin: 10,
  },
  crossStyle: {
    position: 'absolute',
    top: 15,
    right: 20,
  },
  pdfIcon: {
    marginRight: 10,
  },
  fileName: {
    flex: 1,
    color: theme.colors.darkTint4,
  },
  pdf: {
    width: 350,
    height: 140,
  },
});
