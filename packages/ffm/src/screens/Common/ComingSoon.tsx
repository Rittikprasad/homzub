import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';

const ComingSoon = (): React.ReactElement => {
  const { goBack } = useNavigation();

  return (
    <GradientScreen onGoBack={goBack}>
      <View style={styles.container}>
        <Text>Coming Soon</Text>
      </View>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ComingSoon;
