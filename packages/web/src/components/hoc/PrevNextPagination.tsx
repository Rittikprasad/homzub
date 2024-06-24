import React, { Component, ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  children: ReactNode;
  hasMore: boolean;
  limit: number;
  loader: boolean;
  fetchMoreData?: (value: number, isNext: boolean) => void;
  onPressPrevBtn?: () => void;
  onPressNextBtn?: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

interface IState {
  offset: number;
  hasMore: boolean;
}

class PrevNextPaginationHOC extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      offset: 0,
      hasMore: false,
    };
  }

  public componentDidMount(): void {
    const { hasMore } = this.props;
    this.setState({
      hasMore,
    });
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    const { hasMore: hasMoreProp } = prevProps;
    const { hasMore: hasMoreState } = prevState;
    if (hasMoreProp !== hasMoreState) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        hasMore: hasMoreProp,
      });
    }
  }

  public render(): React.ReactNode {
    const { children, containerStyle, contentStyle, t, isPrevDisabled, isNextDisabled } = this.props;
    return (
      <View style={[containerStyle]}>
        <View style={[contentStyle]}>{children}</View>
        <View style={styles.buttonGrpContainer}>
          <Button
            type="secondary"
            containerStyle={[styles.button, styles.buttonPrev]}
            onPress={this.onPressPrev}
            title={t('previous')}
            icon={icons.leftArrow}
            iconSize={20}
            iconColor={isPrevDisabled ? theme.colors.white : theme.colors.primaryColor}
            disabled={isPrevDisabled}
          />
          <Button
            type="primary"
            containerStyle={[styles.button, styles.buttonNext]}
            onPress={this.onPressNext}
            title={t('next')}
            icon={icons.rightArrow}
            iconSize={20}
            iconColor={theme.colors.white}
            disabled={isNextDisabled}
          />
        </View>
      </View>
    );
  }

  private onPressPrev = (): void => {
    const { onPressPrevBtn, fetchMoreData } = this.props;
    if (onPressPrevBtn) {
      onPressPrevBtn();
    } else if (fetchMoreData) {
      this.fetchMore(false);
    }
  };

  private onPressNext = (): void => {
    const { hasMore } = this.state;
    const { onPressNextBtn } = this.props;
    if (onPressNextBtn) {
      onPressNextBtn();
    } else if (hasMore) {
      this.fetchMore(true);
    }
  };

  private fetchMore = (isNext: boolean): void => {
    const { fetchMoreData, limit } = this.props;
    const { offset } = this.state;
    let newOffset = 0;
    if (isNext) {
      newOffset = offset + limit;
    } else if (offset !== 0) {
      newOffset = offset - limit;
    }

    this.setState({ offset: newOffset });
    if (fetchMoreData) {
      fetchMoreData(newOffset, isNext);
    }
  };
}

const PrevNextPagination = withTranslation(LocaleConstants.namespacesKey.common)(PrevNextPaginationHOC);
export default PrevNextPagination;

const styles = StyleSheet.create({
  button: {
    height: 45,
    width: 125,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonPrev: {
    flexDirection: 'row-reverse',
  },
  buttonNext: {
    marginHorizontal: 24,
  },
  buttonGrpContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
