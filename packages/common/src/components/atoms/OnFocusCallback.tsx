import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

interface IProps {
  callback: any;
  isAsync?: boolean;
}

// Use this component to leverage the react-navigation `onFocus` hook in a class based component.
export const OnFocusCallback = (props: IProps): React.ReactElement => {
  const { callback, isAsync = false } = props;
  useFocusEffect(
    useCallback(() => {
      if (isAsync) {
        callback().then();
        return;
      }
      callback();
    }, [callback, isAsync])
  );
  return <></>;
};
