import { Logger } from '@homzhub/common/src/utils/Logger';

describe('Logger', () => {
  const logMessage = 'test message';

  it('should be able to log a info message', () => {
    const spy = jest.spyOn(global.console, 'info');

    Logger.info(logMessage);
    expect(spy).toBeCalledWith(logMessage);
  });

  it('should be able to log a warn message', () => {
    const spy = jest.spyOn(global.console, 'warn');

    Logger.warn(logMessage);
    expect(spy).toBeCalledWith(logMessage);
  });

  it('should be able to log a error message', () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation(() => 1);

    Logger.error(logMessage);
    expect(spy).toBeCalled();
  });
});
