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

  const [queryParams, setQueryParams] = useState(
    new Proxy(
      new URLSearchParams(
        window.location.search ?? window.location.hash.replace("#", "?")
      ),
      {
        get: (searchParams, prop) => searchParams.get(prop),
      }
    )
  );

  useEffect(() => {
    routeConfig.init(window.location.pathname ?? homePath);
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
          typeof (search || hash) === "object" ? search || hash : {};
      },
      back: () => {
        window.history.back();
        routeConfig.currentPathname = window.location.pathname ?? homePath;
        routeConfig.queryParams = new Proxy(
          new URLSearchParams(
            window.location.search ?? window.location.hash.replace("#", "?")
          ),
          {
            get: (searchParams, prop) => searchParams.get(prop),
          }
        );
      },
    };
  }, [homePath]);

  return (
    <RouterContext.Provider
      value={{
        pathname: currentPathname,
        navigate,
        queryParams,
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
