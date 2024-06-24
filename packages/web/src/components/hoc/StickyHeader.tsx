import React, { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

interface IProps {
  children: React.ReactElement | React.ReactNode;
}

const containerStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  width: '100%',
  display: 'flex',
  zIndex: 1000,
};

export const StickyHeader: FC<IProps> = ({ children }: IProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    setHeight(divRef?.current?.getBoundingClientRect()?.height ?? 0);
  }, []);
  return (
    <>
      <div ref={divRef} style={containerStyle}>
        {children}
      </div>
      <View style={{ height }} />
    </>
  );
};
