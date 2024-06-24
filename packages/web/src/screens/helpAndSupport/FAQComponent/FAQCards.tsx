import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import Accordian from '@homzhub/web/src/components/molecules/Accordian';

const Header: React.FC = () => {
  return (
    <View style={styles.accordianHeader}>
      <View style={styles.leftChild}>
        <Text type="small" textType="regular" style={styles.titleContent}>
          Q. Question Goes Here ?
        </Text>
      </View>
      <View style={styles.rightChild}>
        <Icon style={styles.icon} name={icons.downArrow} size={20} color={theme.colors.darkTint3} />
      </View>
    </View>
  );
};

const AccordianContent: React.FC = () => {
  return (
    <View style={styles.content}>
      <Label type="large" textType="regular" style={styles.contentLabel}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et orci vestibulum lectus et etiam consectetur posuere
        pellentesque convallis. posuere pellentesque convallis.
      </Label>
      <View style={styles.videoContainer}>Video Card</View>
    </View>
  );
};
const FAQCards: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <Accordian headerComponent={<Header />} accordianContent={<AccordianContent />} />
    </View>
  );
};

const styles = StyleSheet.create({
  accordianHeader: {
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  leftChild: {
    flexDirection: 'row',
  },
  titleContent: {
    color: theme.colors.darkTint2,
  },
  cardContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    margin: 10,
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
  },
  rightChild: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  content: {
    margin: 10,
    marginTop: -10,
    alignContent: 'center',
  },
  contentLabel: {
    color: theme.colors.darkTint4,
    paddingTop: 20,
    margin: 16,
    marginBottom: 0,
  },
  videoContainer: {
    height: 400,
    backgroundColor: theme.colors.background,
    margin: 16,
    alignItems: 'center',
    borderRadius: 4,
  },
});
export default FAQCards;
