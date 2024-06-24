import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { ContactPerson } from '@homzhub/common/src/components/molecules/ContactPerson';

// TODO (LAKSHIT) - change dummy data with actual api data

interface IProps {
  containerStyle?: StyleProp<ViewStyle>;
  from?: string;
}

const SalePropertyFooter = (props: IProps): React.ReactElement => {
  const { containerStyle, from } = props;
  const onContactTypeClicked = (): void => {
    //  TODOS LAKSHIT
  };
  const contactData = {
    designation: 'Property Agent',
    firstName: 'Jane',
    lastName: 'Cooper',
    email: 'jane@demo.com',
    phoneNumber: '',
    onContactTypeClicked,
  };
  return (
    <View style={[styles.card, containerStyle]}>
      <ContactPerson {...contactData} from={from} />
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
    paddingBottom: 15,
    paddingTop: 12,
    paddingHorizontal: 16,
    minHeight: '70px',
  },
});

export default SalePropertyFooter;
