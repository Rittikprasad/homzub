export class FunctionUtils {
  public static noop = (): void => {};

  public static noopAsync = (params?: any): Promise<void> => Promise.resolve(params);
}
