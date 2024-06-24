import ReactPixel from 'react-facebook-pixel';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';

export enum PixelEventType {
  CompleteRegistration = 'CompleteRegistration',
  Schedule = 'Schedule',
  ViewContent = 'ViewContent',
  Subscribe = 'Subscribe',
  Lead = 'Lead',
}

class PixelService {
  public ReactPixel: any;

  public initPixelService = (): void => {
    const advancedMatching: ReactPixel.AdvancedMatching = {
      ct: '',
      country: '',
      db: '',
      em: '',
      fn: '',
      ge: '',
      ln: '',
      ph: '',
      st: '',
      zp: '',
    }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
    const options = {
      autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
      debug: false, // enable logs
    };
    ReactPixel.init(ConfigHelper.getFacebookPixelId(), advancedMatching, options);
    this.ReactPixel = ReactPixel;
  };
}

const pixelService = new PixelService();
export { pixelService as PixelService };
