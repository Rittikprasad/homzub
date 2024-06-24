import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  reviewData: AssetReview[];
  filterBy: (rating: number) => void;
}

interface IRatingObject {
  rating: number;
  count: number;
}

const FilterRating: FC<IProps> = (props: IProps) => {
  const { reviewData, filterBy } = props;
  const [totalData, setTotalData] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<IRatingObject[]>([]);
  const selectedFilter = new Array(reviewData.length).fill(false);
  const [isActive, setIsActive] = useState(selectedFilter);
  const isTablet = useDown(deviceBreakpoint.TABLET);

  useEffect(() => {
    setTotalData(reviewData.length);
    filterData();
  }, []);

  const filterData = (): void => {
    const datum = [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ];
    for (let index = 0; index < reviewData.length; index++) {
      const { rating } = reviewData[index];
      if (rating > 4) {
        datum[0].count += 1;
      } else if (rating > 3 && rating <= 4) {
        datum[1].count += 1;
      } else if (rating > 2 && rating <= 3) {
        datum[2].count += 1;
      } else if (rating > 1 && rating <= 2) {
        datum[3].count += 1;
      } else {
        datum[4].count += 1;
      }
    }
    setFilteredData(datum);
  };

  const filter = filteredData.map((item, index) => {
    const activeHandle = (): void => {
      filterBy(item.rating);
      const dataSelected = selectedFilter;
      dataSelected[index] = true;
      setIsActive(dataSelected);
    };
    const progressBar = {
      height: '100%',
      width: `${((item.count / totalData) * 100).toFixed(2)}%`,
      backgroundColor: isActive[index] ? theme.colors.darkPrimaryOpacity : theme.colors.background,
    };

    return (
      <TouchableOpacity onPress={activeHandle} key={index}>
        <View style={styles.starContainer}>
          <Rating value={item.rating} size={20} />
          <View style={[styles.bar, isTablet && styles.tabBar]}>
            <View style={progressBar} />
          </View>
          <View>
            <Typography size="regular" style={[styles.count, isActive[index] && styles.selected]}>
              {item.count}
            </Typography>
          </View>
        </View>
      </TouchableOpacity>
    );
  });
  return <View style={styles.container}>{filter}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: '10%',
  },
  starContainer: {
    paddingBottom: 15,
    flexDirection: 'row',
  },
  bar: {
    left: 19,
    height: 21,
    width: 200,
    borderRadius: 5,
    marginEnd: '10%',
  },
  tabBar: {
    width: 80,
  },
  count: {
    color: theme.colors.darkTint4,
  },
  selected: {
    color: theme.colors.primaryColor,
  },
});
export default FilterRating;
