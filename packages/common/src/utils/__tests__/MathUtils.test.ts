import { MathUtils } from '@homzhub/common/src/utils/MathUtils';

describe('Math Utils', () => {
  it('should round number to required number of decimal places', () => {
    const result = MathUtils.roundToDecimal(12.8788776647, 8);
    expect(result).toStrictEqual(12.87887766);
  });
});
