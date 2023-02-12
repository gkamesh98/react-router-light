class RouterClass {
  // variables
  #currentPathname = "";
  #currentPath = "";

  #pathUpdateFunctions = new Map();
  #pathnameUpdateFunctions = new Map();
  #queryParamsUpdateFunctions = new Map();

  #queryParams = {};

  // functions

  init(currentPathname) {
    this.#currentPathname = currentPathname;
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
      this.#currentPathname = pathname;
      this.#triggerCurrentPathnameFunctions();
    }
  }

  get queryParams() {
    return this.#queryParams ?? {};
  }

  set queryParams(queryParam) {
    if (this.#queryParams.toString() !== queryParam.toString()) {
      this.#queryParams = queryParam;
      this.#triggerQueryParamsFunctions();
    }
  }
}

export const routeConfig = new RouterClass();
