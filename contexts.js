import React, { createContext } from "react";

export const RouterContext = createContext({
  params: {},
  pathname: '/',
  queryParams: {}
})

export const RouteContext = createContext({
  loadingUI: React.Fragment,
  path: '/'
})