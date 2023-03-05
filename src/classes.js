import { serialize } from "./functions";

class RouterClass {
  // variables
  #currentPathname = "";
  #currentPath = "";
  #currentState = null;
  #queryParams = {};
  #currentHash = null;

  #serializedSearch = '';

  #pathUpdateFunctions = new Map();
  #pathnameUpdateFunctions = new Map();
  #queryParamsUpdateFunctions = new Map();
  #currentStateUpdateFunctions = new Map();
  #currentHashUpdateFunctions = new Map();


  // functions

  init({pathname = '/', hash = null, state = {}, queryParams = {}} = {}) {
    this.currentPathname = pathname;
    this.currentPath = '';
    this.queryParams = queryParams;
    this.currentState = state;
    this.hash = hash;
  }

  onCurrentPathUpdate(callback) {
    return this.#callbackUpdater(callback, this.#pathUpdateFunctions)
  }

  onCurrentPathnameUpdate(callback) {
    return this.#callbackUpdater(callback, this.#pathnameUpdateFunctions)
  }

  onQueryParamUpdate(callback) {
    return this.#callbackUpdater(callback, this.#queryParamsUpdateFunctions)
  }

  onCurrentStateUpdate(callback) {
    return this.#callbackUpdater(callback, this.#currentStateUpdateFunctions)
  }

  onHashUpdate(callback){
    return this.#callbackUpdater(callback, this.#currentHashUpdateFunctions)
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
    this.#triggerFunction(this.#pathUpdateFunctions)
  }

  #triggerCurrentPathnameFunctions() {
    this.#triggerFunction(this.#pathnameUpdateFunctions);
  }

  #triggerQueryParamsFunctions() {
    this.#triggerFunction(this.#queryParamsUpdateFunctions);
  }

  #triggerCurrentStateFunctions(){
    this.#triggerFunction(this.#currentStateUpdateFunctions);
  }


  #triggerCurrentHashFunction(){
    this.#triggerFunction(this.#currentHashUpdateFunctions);
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
      this.hash = null;

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
      this.#settingPath()
      this.#triggerQueryParamsFunctions();
    }
  }

  get currentState(){
    return this.#currentState
  }

  set currentState(state){
    if(JSON.stringify(state) !== JSON.stringify(this.#currentState)){
      this.#currentState = state
      this.#settingPath()
      this.#triggerCurrentStateFunctions()
    }
   
  }

  set hash(value){
    if(this.#currentHash !== value){
      this.#currentHash = value
      this.#settingPath()
      this.#triggerCurrentHashFunction()
    }
  }

  get hash(){
    return this.#currentHash
  }

  #settingPath(){
    window.history.pushState(this.#currentState, "", this.#currentPathname + this.#serializedSearch + (this.#currentHash ? `#${this.#currentHash}` : ''));
  }

  #callbackUpdater(callback, map){
    if (typeof callback === "function") {
      map.set(callback.toString(), callback);
      return () => {
        if (map.has(callback.toString())) {
          map.delete(callback.toString());
        }
      };
    }
    return () => {};
  }

  #triggerFunction(map){
    map.forEach((callback) => {
      callback()
    })
  }
}

export const routeConfig = new RouterClass();
