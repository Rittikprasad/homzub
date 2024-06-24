import { colors } from '@homzhub/common/src/styles/colors';
import { layout } from '@homzhub/common/src/styles/layout';
import { constants } from '@homzhub/common/src/styles/constants';
import { viewport } from '@homzhub/common/src/styles/viewport';
import { form } from '@homzhub/common/src/styles/form';

// TODO: Make this compact in consideration of dynamic theming, can font & from can be abstracted out?
export const theme = {
  colors,
  form,
  layout,
  viewport,
  ...constants,
};
