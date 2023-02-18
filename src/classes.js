import { serialize } from "./functions";

class RouterClass {
  // variables
  #currentPathname = "";
  #currentPath = "";
  #currentState = null;
  #queryParams = {};

  #serializedSearch = '';

  #pathUpdateFunctions = new Map();
  #pathnameUpdateFunctions = new Map();
  #queryParamsUpdateFunctions = new Map();
  #currentStateUpdateFunctions = new Map();


  // functions

  init(currentPathname) {
    this.currentPathname = currentPathname;
    this.currentPath = '';
    this.queryParams = {};
    this.currentState = null;
  }

  onCurrentPathUpdate(callback) {
    if (typeof callback === "function") {
      this.#pathUpdateFunctions.set(callback.toString(), callback);
      return () => {
        if (this.#pathUpdateFunctions.has(callback.toString())) {
          this.#pathUpdateFunctions.delete(callback.toString());
        }
      };
    }
    return () => {};
  }

  onCurrentPathnameUpdate(callback) {
    if (typeof callback === "function") {
      this.#pathnameUpdateFunctions.set(callback.toString(), callback);
      return () => {
        if (this.#pathnameUpdateFunctions.has(callback.toString())) {
          this.#pathnameUpdateFunctions.delete(callback.toString());
        }
      };
    }
    return () => {};
  }

  onQueryParamUpdate(callback) {
    if (typeof callback === "function") {
      this.#queryParamsUpdateFunctions.set(callback.toString(), callback);
      return () => {
        if (this.#queryParamsUpdateFunctions.has(callback.toString())) {
          this.#queryParamsUpdateFunctions.delete(callback.toString());
        }
      };
    }
    return () => {};
  }

  onCurrentStateUpdate(callback) {
    if (typeof callback === "function") {
      this.#currentStateUpdateFunctions.set(callback.toString(), callback);
      return () => {
        if (this.#currentStateUpdateFunctions.has(callback.toString())) {
          this.#currentStateUpdateFunctions.delete(callback.toString());
        }
      };
    }
    return () => {};
  }

  getParams() {
    const [, ...currentPathSplitArray] = this.#currentPathname.split("/");
    const [, ...routePathSplitter] = this.#currentPath.split("/");

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
  }

  #triggerCurrentPathFunctions() {
    this.#pathUpdateFunctions.forEach((callback) => {
      callback();
    });
  }

  #triggerCurrentPathnameFunctions() {
    this.#pathnameUpdateFunctions.forEach((callback) => {
      callback();
    });
  }

  #triggerQueryParamsFunctions() {
    this.#queryParamsUpdateFunctions.forEach((callback) => {
      callback();
    });
  }

  #triggerCurrentStateFunctions(){
    this.#currentStateUpdateFunctions.forEach((callback) => {
      callback();
    });
  }

  // getter and setter

  get currentPathname() {
    return this.#currentPathname;
  }

  get currentPath() {
    return this.#currentPath;
  }

  set currentPath(path) {
    if (this.#currentPath.toString() !== path.toString()) {
      this.#currentPath = path;
      this.#triggerCurrentPathFunctions();
    }
  }

  set currentPathname(pathname) {
    if (this.#currentPathname.toString() !== pathname.toString()) {
      // resetting
      this.currentPath = '';
      this.queryParams = {};
      this.currentState = null;

      this.#currentPathname = pathname;
      window.history.pushState(null, "", pathname);
      this.#triggerCurrentPathnameFunctions();
    }
  }

  get queryParams() {
    return this.#queryParams ?? {};
  }

  set queryParams(queryParam) {
    if (JSON.stringify(this.#queryParams) !== JSON.stringify(queryParam)) {
      this.#queryParams = queryParam;
      this.#serializedSearch = (() => {
        if (
          (queryParam) &&
          typeof (queryParam) === "object" &&
          Object.keys(queryParam).length
        ) {
          return '?' + serialize(queryParam);
        }
        return "";
      })();
      window.history.pushState(this.#currentState, "", this.#currentPathname + this.#serializedSearch);
      this.#triggerQueryParamsFunctions();
    }
  }

  get currentState(){
    return this.#currentState
  }

  set currentState(state){
    if(JSON.stringify(state) !== JSON.stringify(this.#currentState))
    this.#currentState = state
    window.history.pushState(this.#currentState, "", this.#currentPathname + this.#serializedSearch);
    this.#triggerCurrentStateFunctions()
  }
}

export const routeConfig = new RouterClass();
