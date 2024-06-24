import React, { Component, ReactNode, CSSProperties } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

interface IProps {
  children: ReactNode;
  data: number;
  fetchMoreData: (value: number) => void;
  height?: number | string;
  style?: CSSProperties;
  hasMore: boolean;
  limit: number;
  loader: boolean;
}

interface IState {
  offset: number;
}

class InfiniteScrollView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      offset: 0,
    };
  }

  public render(): React.ReactNode {
    const { children, height, style, hasMore, loader } = this.props;
    return (
      <div id="search-infinite-scroll" style={{ height, overflowY: 'auto', overflowX: 'hidden' }}>
        <InfiniteScroll loadMore={this.fetchMore} hasMore={hasMore && !loader} style={style} useWindow={false}>
          {children}
        </InfiniteScroll>
      </div>
    );
  }

  private fetchMore = (): void => {
    const { fetchMoreData, limit } = this.props;
    const { offset } = this.state;
    const newOffset = offset + limit;
    this.setState({ offset: newOffset });
    fetchMoreData(newOffset);
  };
}

export default InfiniteScrollView;
