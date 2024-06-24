import React, { CSSProperties, FC, useState } from 'react';
import Script from 'react-load-script';
import { useDown, useViewPort, useIsIpadPro } from '@homzhub/common/src/utils/MediaQueryUtils';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import '@homzhub/web/src/screens/microSite/components/BannerVideo.scss';

const BannerVideo: FC = () => {
  const [hasScriptLoaded, setHasScriptLoaded] = useState(0);
  const { width } = useViewPort();
  const isTab = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isIpadPro = useIsIpadPro();
  const videoStyle: CSSProperties = {
    height: '40%',
    position: 'absolute',
    top: !isMobile ? (isTab ? 392 : 435) : 576,
    width: !isMobile ? (isTab ? '90%' : '65%') : '92%',
    left: !isMobile ? (isTab ? '5%' : '18%') : '4%',
    borderRadius: 12,
  };
  const displayVideo: CSSProperties = {
    height: '100%',
    left: 0,
    opacity: hasScriptLoaded,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    transition: 'opacity 200ms',
    width: '100%',
  };

  const bannerStyle = {
    width: !isIpadPro && !isTab && !isMobile ? width - 15 : width,
    height: !isMobile ? (isTab ? 561 : 632) : 649,
  };

  return (
    <div className="banner-video">
      <Image
        source={
          !isMobile
            ? isTab
              ? require('@homzhub/common/src/assets/images/bannerTab.jpg')
              : require('@homzhub/common/src/assets/images/bannerDesktop.jpg')
            : require('@homzhub/common/src/assets/images/bannerMobile.jpg')
        }
        style={bannerStyle}
      />

      <div>
        <Script url="https://fast.wistia.com/embed/medias/iw6gcc3v4o.jsonp" />
        <Script url="https://fast.wistia.com/assets/external/E-v1.js" />
        <div className="wistia_responsive_padding">
          <div className="wistia_responsive_wrapper" style={videoStyle}>
            <div className="wistia_embed wistia_async_iw6gcc3v4o videoFoam=true">
              <div className="wistia_swatch" style={displayVideo}>
                <img
                  id="image"
                  src="https://fast.wistia.com/embed/medias/iw6gcc3v4o/swatch"
                  alt=""
                  aria-hidden="true"
                  onLoad={(): void => {
                    setHasScriptLoaded(1);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BannerVideo;
