import { useContext } from "react";
import { routeConfig } from "./classes";
import { RouteContext, RouterContext } from "./contexts";

const useRouter = () => {
  return useContext(RouterContext);
};

export const usePathMatcher = (path) => {
  const { pathname } = useRouter();

  const [, ...currentPathSplitArray] = pathname.split("/");
  const [, ...routePathSplitter] = path.split("/");

  return routePathSplitter.every((sep, index) => {
    if (sep[0] === ":") {
      return true;
    } else if (sep === currentPathSplitArray[index]) {
      return true;
    }
    return false;
  });
};

export const useParams = () => {
  const { pathname } = useRouter();
  const { path } = useContext(RouteContext);

  const [, ...currentPathSplitArray] = pathname.split("/");
  const [, ...routePathSplitter] = path.split("/");

  return routePathSplitter.reduce((previous, sep, index) => {
    if (sep[0] === ":") {
      const [, ...param] = sep.split("");
      return {
        ...previous,
        [param.join("")]: currentPathSplitArray[index],
      };
    }
    return previous;
  }, {});
};

export const useNavigate = () => {
  const { navigate } = useRouter();
  return navigate;
};

// getting the search params
// getting the hash params

export const useQueryParams = () => {
  const { queryParams } = useRouter();
  return queryParams;
};

export const useBrowserState = () => {
  const { state } = useRouter();
  return state;
}

export const useHash = () => {
  const { hash } = useRouter();
  return hash
}

export const useRouteUpdater = () => {

  const setHash = (hash) => {
    routeConfig.hash = hash
  }

  const setBrowserState = (state) => {
    routeConfig.currentState = state
  }

  const setQueryParams = (params={}) => {
    routeConfig.queryParams = params
  }

  return {
    setHash,
    setBrowserState,
    setQueryParams,
  }
}