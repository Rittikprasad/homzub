// @ts-nocheck
import OpenSansBold from './OpenSans-Bold.ttf';
import OpenSansExtraBold from './OpenSans-ExtraBold.ttf';
import OpenSansLight from './OpenSans-Light.ttf';
import OpenSansRegular from './OpenSans-Regular.ttf';
import OpenSansSemibold from './OpenSans-SemiBold.ttf';
import RalewayBold from './Raleway-Bold.ttf';
import RalewayLight from './Raleway-Light.ttf';
import RalewayMedium from './Raleway-Medium.ttf';
import icomoon from './icomoon.ttf';

const iconFontStyles = `
@font-face {
  src: url(${OpenSansBold});
  font-family: OpenSans-Bold;
}
@font-face {
  src: url(${OpenSansExtraBold});
  font-family: OpenSans-ExtraBold;
}
@font-face {
  src: url(${OpenSansBold});
  font-family: OpenSans-Bold;
}
@font-face {
  src: url(${OpenSansLight});
  font-family: OpenSans-Light;
}
@font-face {
  src: url(${OpenSansRegular});
  font-family: OpenSans-Regular;
}
@font-face {
  src: url(${OpenSansSemibold});
  font-family: OpenSans-SemiBold;
}
@font-face {
  src: url(${RalewayBold});
  font-family: Raleway-Bold;
}
@font-face {
  src: url(${RalewayLight});
  font-family: Raleway-Light;
}
@font-face {
  src: url(${RalewayMedium});
  font-family: Raleway-Medium;
}
@font-face {
  src: url(${icomoon});
  font-family: icomoon;
}
`;
// Create stylesheet
const style: any = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);
