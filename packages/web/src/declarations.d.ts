/* eslint-disable @typescript-eslint/no-explicit-any */
declare class Content<T> {
  public get props(): T;
  public get context(): any;
  public state: any;
  public refs: any;
  public forceUpdate(callback: any): void;
  public render(): any;
  public setState(partialState: any, callback: any): void;
}
declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';

  export = Content<SvgProps>();
}

declare interface IScriptProps {
  attributes?: object;
  onCreate?: () => void;
  onError?: () => void;
  onLoad: () => void;
  url: string;
}

declare module 'react-facebook-login/dist/facebook-login-render-props' {
  import { ReactFacebookLoginProps } from 'react-facebook-login';

  export = Content<ReactFacebookLoginProps>();
}

declare module 'react-load-script' {
  export = Content<IScriptProps>();
}
