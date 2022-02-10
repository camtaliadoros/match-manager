export function createTestStore() {
  const store = createStore(
    combineReducers({
      user: userReducer,
      config: configReducer,
    })
  );
  return store;
}
