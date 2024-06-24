class MathUtils {
  public roundToDecimal = (value: number, decimals: number): number => {
    // @ts-ignore
    // eslint-disable-next-line prefer-template
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  };
}

const mu = new MathUtils();
export { mu as MathUtils };
