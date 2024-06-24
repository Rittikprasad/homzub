import React, { FC } from 'react';
import '@homzhub/web/src/screens/landing/components/GradientBackground/GradientBackgroundStyle.scss';

interface IProps {
  children?: React.ReactNode;
}

export const GradientBackground: FC<IProps> = ({ children }: IProps) => {
  return <div className="landing-navigation-bg">{children}</div>;
};
