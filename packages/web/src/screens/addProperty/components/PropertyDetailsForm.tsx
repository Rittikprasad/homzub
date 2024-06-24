import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import AddAssetDetails from '@homzhub/web/src/screens/addProperty/components/AddAssetDetails';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { AddPropertyContext } from '@homzhub/web/src/screens/addProperty/AddPropertyContext';
import { AddPropertyStack } from '@homzhub/web/src/screens/addProperty';

interface IProps {
  data: google.maps.places.PlaceResult | undefined;
  projectId: number | undefined;
}
const PropertyDetailsForm: FC<IProps> = ({ data, projectId }: IProps) => {
  const { navigateScreen } = useContext(AddPropertyContext);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const locationAddress = data?.formatted_address ?? '';
  const onSubmitPress = (): void => {
    navigateScreen(AddPropertyStack.AddPropertyViewScreen);
  };

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <Typography variant="text" size="small" fontWeight="regular" style={styles.title}>
        Property Location
      </Typography>
      <Typography variant="label" size="large" fontWeight="regular" style={styles.subTitle}>
        {locationAddress}
      </Typography>
      <AddAssetDetails data={data} projectId={projectId} onSubmitPress={onSubmitPress} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  containerTablet: {
    marginTop: 24,
  },
  title: {
    marginLeft: 24,
    marginBottom: 6,
    color: theme.colors.darkTint1,
  },
  subTitle: {
    marginLeft: 24,
    color: theme.colors.darkTint3,
  },
});
export default PropertyDetailsForm;
