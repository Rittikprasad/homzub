import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  headerComponent?: React.ReactNode;
  accordianContent?: React.ReactNode;
  onToggle?: (isActive: boolean) => void;
}

const Accordian: React.FC<IProps> = (props: IProps) => {
  const { headerComponent, accordianContent, onToggle } = props;

  const [setActive, setActiveState] = useState(false);
  const [setHeight, setHeightState] = useState('0px');

  const content = useRef(null);
  useEffect(() => {
    if (onToggle) {
      onToggle(setActive);
    }
    setHeightState(setActive ? '1500px' : '0px');
  }, [setActive]);
  const toggleAccordion = (): void => {
    setActiveState(!setActive);
  };
  return (
    <View style={styles.accordianContainer}>
      <TouchableOpacity onPress={toggleAccordion}>{headerComponent}</TouchableOpacity>
      <View ref={content} style={[styles.accordianContent, { maxHeight: `${setHeight}` }]}>
        {accordianContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accordianContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  accordianContent: {
    backgroundColor: theme.colors.grey1,
    overflow: 'hidden',
    transition: 'max-height 0.6s ease',
    borderRadius: 4,
  },
});
export default Accordian;
