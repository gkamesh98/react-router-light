import { routeConfig } from "./classes";

const {
  getParams,
  queryParams,
  currentPath,
  currentPathname,
  onCurrentPathUpdate,
  onCurrentPathnameUpdate,
  onQueryParamUpdate,
  onCurrentStateUpdate,
  onHashUpdate,
} = routeConfig;

export { RouterProvide as default } from "./components";
export { Route } from "./components";
export * from "./hooks";

export {
  getParams,
  queryParams,
  currentPath,
  currentPathname,
  onCurrentPathUpdate,
  onCurrentPathnameUpdate,
  onQueryParamUpdate,
  onCurrentStateUpdate,
  onHashUpdate,
};
