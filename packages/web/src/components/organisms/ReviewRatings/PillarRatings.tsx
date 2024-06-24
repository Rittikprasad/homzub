import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IPieData {
  pieData: Pillar[];
}

const PillarRatings = (props: IPieData): React.ReactElement => {
  const isTablet = useDown(deviceBreakpoint.TABLET);

  const { pieData } = props;
  const CircularProgress = {
    text: { fontSize: 24, fill: theme.colors.darkTint1 },
    path: {
      stroke: theme.colors.gold,
    },
  };
  const CircularProgressGood = {
    text: { fontSize: 24, fill: theme.colors.darkTint1 },
    path: {
      stroke: theme.colors.green,
    },
  };
  const CircularProgressBad = {
    text: { fontSize: 24, fill: theme.colors.darkTint1 },
    path: {
      stroke: theme.colors.error,
    },
  };

  return (
    <View style={[styles.container, isTablet && styles.containerTab]}>
      {pieData.map((item, index) => {
        return (
          <View style={styles.pieWithLabel} key={index}>
            <View style={styles.circular} key={item.id}>
              <CircularProgressbar
                value={item.rating}
                maxValue={5}
                text={`${item.rating}`}
                styles={
                  item.rating !== 5 ? (item.rating < 3 ? CircularProgressBad : CircularProgressGood) : CircularProgress
                }
                strokeWidth={5}
              />
            </View>

            <View>
              <Typography size="large" variant="label">
                {item.pillarName?.name}
              </Typography>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  containerTab: {
    flexWrap: 'nowrap',
  },
  circular: {
    width: 80,
    height: 80,
    bottom: 4,
  },
  pieWithLabel: {
    flexDirection: 'column',
    marginEnd: '10%',
    marginBottom: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
});
export default PillarRatings;
