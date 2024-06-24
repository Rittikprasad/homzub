import React, { FC, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Webcam from 'react-webcam';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface ISelfieProps {
  onCapture: (data: string | null) => void;
  closePopover: () => void;
}
const CaptureSelfie: FC<ISelfieProps> = (props: ISelfieProps) => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  const webcamRef = useRef<Webcam>(null);
  const { onCapture, closePopover } = props;
  const capture = useCallback(() => {
    if (webcamRef && webcamRef.current !== null) {
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc);
    }
    closePopover();
  }, [webcamRef]);
  const videoConstraints = {
    width: { min: isMobile ? 250 : 400 },
    height: { min: isMobile ? 350 : 480 },
    aspectRatio: isMobile ? 0.7 : 0.8222222222,
  };
  return (
    <>
      <View style={Styles.heading}>
        <Typography variant="text" size="regular" fontWeight="semiBold">
          {t('property:takeSelfie')}
        </Typography>
        <View style={Styles.icon}>
          <TouchableOpacity>
            <Icon name={icons.close} size={20} onPress={(): void => onCapture(null)} />
          </TouchableOpacity>
        </View>
      </View>
      <Divider />
      <View style={Styles.webCam}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          mirrored
          videoConstraints={videoConstraints}
          width={isMobile ? 250 : 400}
          height={isMobile ? 350 : 480}
        />

        <View style={[Styles.footer, isMobile && Styles.buttonMobile]}>
          <Button type="primary" onPress={capture} containerStyle={Styles.button}>
            <Icon name={icons.camera} size={24} color={theme.colors.white} style={Styles.iconCamera} />
            <Typography variant="text" fontWeight="semiBold" size="small" style={Styles.buttonText}>
              {t('property:captureWeb')}
            </Typography>
          </Button>
        </View>
      </View>
    </>
  );
};

const Styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    marginLeft: 100,
    top: '88%',
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 45,
    width: 210,
    justifyContent: 'center',
  },
  buttonMobile: {
    marginLeft: 20,
    top: '84%',
  },
  webCam: {
    marginHorizontal: 24,
    bottom: 24,
    top: 20,
  },
  icon: {
    position: 'absolute',
    left: '95%',
  },
  heading: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginVertical: 20,
  },
  iconCamera: {
    marginStart: 30,
    marginEnd: 7.5,
  },
  buttonText: {
    color: theme.colors.white,
    marginEnd: 30,
  },
});
export default CaptureSelfie;
