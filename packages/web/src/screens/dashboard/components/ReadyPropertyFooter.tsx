import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';

// TODO (LAKSHIT) - change dummy data with actual api data

const ReadyPropertyFooter = (): React.ReactElement => {
  return (
    <View style={styles.card}>
      <Button
        type="secondary"
        title="Enquiry"
        containerStyle={styles.buttonEnquiry}
        titleStyle={styles.buttonEnquiryText}
      />
      <Button
        type="primary"
        title="Schedule Visit"
        containerStyle={styles.buttonVisit}
        titleStyle={styles.buttonScheduleText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.white,
    marginHorizontal: 4,
    borderTopColor: theme.colors.background,
    borderTopWidth: 1,
    paddingBottom: 18,
    paddingTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: '70px',
  },
  buttonEnquiry: {
    borderRadius: 4,
    width: 118,
    padding: 0,
    justifyContent: 'center',
    borderStartColor: theme.colors.blue,
  },
  buttonVisit: {
    borderRadius: 4,
    width: 156,
    paddingLeft: '2%',
    justifyContent: 'center',
  },
  buttonEnquiryText: {
    marginVertical: 0,
    marginHorizontal: 0,
  },
  buttonScheduleText: {
    marginVertical: 0,
    marginHorizontal: 0,
  },
});

export default ReadyPropertyFooter;
