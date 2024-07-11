import { applyMiddleware, Store } from "redux";
import { legacy_createStore as createStore } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "@redux-saga/core";
import { composeWithDevTools } from "redux-devtools-extension"; // Only for Development Environment
import { AppModes, ConfigHelper } from "@homzhub/common/src/utils/ConfigHelper";
import { PlatformUtils } from "@homzhub/common/src/utils/PlatformUtils";
import { IState } from "@homzhub/common/src/modules/interfaces";
import rootReducer from "@homzhub/common/src/modules/reducers";
import rootSaga from "@homzhub/common/src/modules/sagas";

export const configureStore = (): Store<IState> => {
  // Redux middleware configurations
  const middleware = [];
  // Saga Middleware
  const sagaMiddleware = createSagaMiddleware();

  if (ConfigHelper.getAppMode() === AppModes.DEBUG) {
    // logger
    const logger = createLogger();
    middleware.push(logger);
  }

  middleware.push(sagaMiddleware);

  // store setup
  let store: Store;
  if (ConfigHelper.getAppMode() === AppModes.DEBUG && PlatformUtils.isWeb()) {
    store = createStore(
      rootReducer,
      composeWithDevTools(applyMiddleware(...middleware))
    );
  } else {
    store = createStore(rootReducer, applyMiddleware(...middleware));
  }

  // Kick off root saga
  sagaMiddleware.run(rootSaga);
  return store;
};
