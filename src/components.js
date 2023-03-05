import React, {
  Suspense,
  useContext,
  useMemo,
  useState,
  Fragment,
  useEffect,
} from "react";
import { routeConfig } from "./classes";
import { RouteContext, RouterContext } from "./contexts";
import { deserialize } from "./functions";
import { usePathMatcher } from "./hooks";

export const RouterProvide = ({
  homePath = "/",
  children,
  loadingUI = Fragment,
  notFoundUI: NotFoundUI = Fragment,
}) => {
  const [currentPathname, setCurrentPathname] = useState(
    window.location.pathname ?? homePath
  );
  const [usedPath, setUsedPath] = useState("");
  const [hash, setHash] = useState(window.location.hash.replace('#','') ?? null);
  const [browserState, setBrowserState] = useState(window.history.state ?? {})

  const [queryParams, setQueryParams] = useState(
    deserialize((window.location.search.substring(1))) ?? {}
  );

  useEffect(() => {
    routeConfig.init({
      pathname: window.location.pathname ?? homePath,
      hash: window.location.hash.replace('#','') ?? null,
      state: window.history.state ?? {},
      queryParams: deserialize((window.location.search.substring(1))) ?? {}
    });
  }, [homePath]);

  useEffect(() => {
    const returnFunction = routeConfig.onQueryParamUpdate(() => {
      setQueryParams(routeConfig.queryParams);
    });
    return returnFunction;
  }, []);

  useEffect(() => {
    const returnFunction = routeConfig.onCurrentPathnameUpdate(() => {
      setCurrentPathname(routeConfig.currentPathname);
    });
    return returnFunction;
  }, []);

  useEffect(() => {
    const returnFunction = routeConfig.onCurrentPathUpdate(() => {
      setUsedPath(routeConfig.currentPath);
    });
    return returnFunction;
  }, []);

  useEffect(() => {
    const returnFunction = routeConfig.onHashUpdate(() => {
      setHash(routeConfig.hash);
    });
    return returnFunction;
  }, []);

  useEffect(() => {
    const returnFunction = routeConfig.onCurrentStateUpdate(() => {
      setBrowserState(routeConfig.hash);
    });
    return returnFunction;
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/") {
      routeConfig.currentPathname = homePath;
    }
  }, [homePath]);

  window.onpopstate = () => {
    routeConfig.currentPathname = window.location.pathname ?? homePath;
  };

  const navigate = useMemo(() => {
    return {
      redirect: (to, { state = null, search, hash } = {}) => {
        routeConfig.currentPathname = to;
        routeConfig.currentState = state;
        routeConfig.queryParams =
          typeof (search) === "object" ? search : {};
        if(typeof hash === "object"){
          routeConfig.queryParams = hash
          routeConfig.hash = null
        }else{
          routeConfig.hash = hash
        }
      },
      back: () => {
        window.history.back();
        routeConfig.currentPathname = window.location.pathname ?? homePath;
        routeConfig.queryParams = deserialize((window.location.search.substring(1))) ?? {}
      },
    };
  }, [homePath]);

  return (
    <RouterContext.Provider
      value={{
        pathname: currentPathname,
        navigate,
        queryParams,
        hash,
        state: browserState,
      }}
    >
      <RouteContext.Provider
        value={{
          loadingUI,
          path: usedPath,
        }}
      >
        {children}
        {!Boolean(usedPath) &&
          (typeof NotFoundUI === "function" ? (
            <NotFoundUI />
          ) : (
            NotFoundUI
          ))}
      </RouteContext.Provider>
    </RouterContext.Provider>
  );
};

export const Route = ({
  component: Component,
  children,
  element,
  path,
  middleware = [],
  redirectIfNotSatisfied,
}) => {
  const { loadingUI: LoadingUI } = useContext(RouteContext);
  const matched = usePathMatcher(path);
  const [satisified, setIsSafied] = useState(false);

  useEffect(() => {
    if (matched) {
      const isSuccessFull = Array.isArray(middleware)
        ? middleware.every((middle) =>
            typeof middle === "function" ? middle() : middle
          )
        : typeof middle === "function"
        ? middleware()
        : middleware;
      routeConfig.currentPath = path;
      if (isSuccessFull) {
        setIsSafied(isSuccessFull);
      } else {
        routeConfig.currentPathname = redirectIfNotSatisfied;
      }
    }
  }, [path, matched, middleware, redirectIfNotSatisfied]);

  if (matched) {
    if (!satisified) {
      return <LoadingUI />;
    }
    return (
      <RouteContext.Consumer>
        {({ loadingUI: LoadingUI }) => {
          return (
            <Suspense fallback={<LoadingUI />}>
              {Component ? <Component /> : element ?? children}
            </Suspense>
          );
        }}
      </RouteContext.Consumer>
    );
  }
  return null;
};
