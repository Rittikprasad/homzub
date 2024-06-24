/* eslint-disable react/no-unused-state */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import '@homzhub/web/src/components/hoc/ErrorBoundary.scss';

interface IProps extends WithTranslation {
  children: ReactNode;
}

interface IErrorState {
  hasError: boolean;
}
interface IState {
  error: Error;
  errorInfo: ErrorInfo;
}

class ErrorBoundary extends Component<IProps, IState> {
  public state: IState & IErrorState = {
    hasError: false,
    error: {
      name: '',
      message: '',
      stack: '',
    },
    errorInfo: {
      componentStack: '',
    },
  };

  public static getDerivedStateFromError(_: Error): IErrorState {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
    };
  }

  // eslint-disable-next-line react/sort-comp
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });
  }

  public render(): ReactNode {
    const { hasError, errorInfo, error } = this.state;
    const { children, t } = this.props;
    if (hasError) {
      return (
        <div className="error-container">
          <Icon name={icons.filledWarning} size={80} color={theme.colors.warning} />
          <h1>{t('common:genericErrorMessage')}</h1>
          <br />
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {error && error.toString()}
              <br />
              {errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return children;
  }
}

export default withTranslation()(ErrorBoundary);
