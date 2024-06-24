import React, { PureComponent, ReactElement, ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ImageHelper } from '@homzhub/mobile/src/utils/ImageHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Header } from '@homzhub/mobile/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import AddPropertyView from '@homzhub/common/src/components/organisms/AddPropertyView';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IReviewRefer } from '@homzhub/common/src/modules/common/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IScreenState {
  loading: boolean;
}

interface IStateProps {
  assetId: number;
  selectedImages: AssetGallery[];
}

interface IDispatchProps {
  getAssetById: () => void;
  resetState: () => void;
  setSelectedImages: (payload: AssetGallery[]) => void;
  setReviewReferData: (payload: IReviewRefer) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AddProperty>;
type Props = libraryProps & IStateProps & IDispatchProps;

export class AddProperty extends PureComponent<Props, IScreenState> {
  private scrollRef = React.createRef<ScrollView>();

  public state = {
    loading: false,
  };

  public componentWillUnmount = (): void => {
    const { navigation, getAssetById } = this.props;
    navigation.removeListener('focus', getAssetById);
  };

  public render = (): ReactNode => {
    const {
      t,
      route: { params },
    } = this.props;
    const { loading } = this.state;

    return (
      <View style={styles.screen}>
        <Loader visible={loading} />
        <Header icon={icons.leftArrow} title={t('property:addProperty')} onIconPress={this.goBack} />
        <KeyboardAvoidingView style={styles.screen} behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} ref={this.scrollRef}>
            <AddPropertyView
              onUploadImage={this.onPhotosUpload}
              onEditPress={this.onEditPress}
              scrollToTop={this.scrollToTop}
              previousScreen={params?.previousScreen}
              onNavigateToPlanSelection={this.handleNavigationToPlan}
              onNavigateToDetail={this.handleNavigationToDetail}
              renderCarousel={this.renderCarousel}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  };

  private renderCarousel = (
    data: Amenity[][],
    renderItem: (item: Amenity[]) => ReactElement,
    activeSlide: number,
    onSnap: (slideNumber: number) => void
  ): ReactElement => {
    return (
      <>
        <SnapCarousel
          carouselData={data}
          carouselItem={renderItem}
          activeIndex={activeSlide}
          onSnapToItem={onSnap}
          containerStyle={styles.carouselContainer}
        />
        <PaginationComponent
          containerStyle={styles.pagination}
          dotsLength={data.length}
          activeSlide={activeSlide}
          activeDotStyle={styles.activeDot}
          inactiveDotStyle={styles.inactiveDot}
        />
      </>
    );
  };

  public onPhotosUpload = async (): Promise<void> => {
    const { assetId, selectedImages } = this.props;
    await ImageHelper.handlePhotosUpload({ assetId, selectedImages, toggleLoader: this.toggleLoader });
  };

  private onEditPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PostAssetDetails);
  };

  private toggleLoader = (): void => {
    this.setState((prevState) => ({ loading: !prevState.loading }));
  };

  private goBack = (): void => {
    const {
      navigation,
      route: { params },
      resetState,
    } = this.props;

    if (params && params.previousScreen === ScreensKeys.Dashboard) {
      resetState();
    }

    navigation.goBack();
  };

  private handleNavigationToPlan = (): void => {
    const { navigation, setReviewReferData, t } = this.props;
    navigation.navigate(ScreensKeys.AssetPlanSelection);
    AlertHelper.success({ message: t('property:yourDetailsAdded') });
    setReviewReferData({ isReview: true });
  };

  private handleNavigationToDetail = (): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.BottomTabs, {
      screen: ScreensKeys.Portfolio,
      params: { screen: ScreensKeys.PropertyDetailScreen, initial: false },
    });
  };

  private scrollToTop = (): void => {
    setTimeout(() => {
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, 100);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentAssetId, getSelectedImages } = RecordAssetSelectors;

  return {
    assetId: getCurrentAssetId(state),
    selectedImages: getSelectedImages(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetById, resetState, setSelectedImages } = RecordAssetActions;
  const { setReviewReferData } = CommonActions;
  return bindActionCreators({ getAssetById, resetState, setSelectedImages, setReviewReferData }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AddProperty));

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  activeDot: {
    borderWidth: 1,
  },
  inactiveDot: {
    backgroundColor: theme.colors.darkTint10,
    borderWidth: 0,
  },
  pagination: {
    paddingVertical: 0,
  },
  carouselContainer: {
    alignSelf: 'center',
  },
});
