import React, { createContext } from "react";

export const RouterContext = createContext({
  params: {},
  queryParams: {},
  navigate: {},
  hash: null,
  state: {}
})

export const RouteContext = createContext({
  loadingUI: React.Fragment,
  path: '/'
})