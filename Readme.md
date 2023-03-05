# react-router-light
Lighter version of react-router with easy to use and integrate with added features like middleware.

Source is in ```./src```

## Install 

With npm
```bash
npm install --save react-router-light
```
with yarn 
```bash
yarn add react-router-light
```

## using

**Router** is to set to manage the children ```Route```
**Router** accepts the ```loadingUI```, ```homePath``` and ```notFoundUI```

```loadingUI``` is a component which is used for Route to render as chunks and provides a UX.
```homePath``` is setting the default path if no path is available default is '\'
```notFoundUI``` can be either component or element. This will be displayed when a page is not found in the *Route* specified path's


**Route** is a component which maintains individual routes
**Route** accepts the ```path```, ```redirectIfNotSatisfied```, ```middleware```, ```element```, ```component``` and ```children```

```path``` is string which denote's in which path we can access the component or element. You can params key to path by the colon (:) like ```'/route/:key'``` here *key* will be the key to the param. You can pass n number of params.
```middleware``` is array of functions, function or a boolean value which deals with checking if this page can be accessible or not.
```redirectIfNotSatisfied``` is a string path which will redirect if middleware conditions are not satisfied.
```component``` is React component which can be render if mounts on specified path. It can be lazy loaded or normal component. If we lazy loading is used *loadingUI* in Router is displayed while fetching the chunks of the component.
```element``` or ```children``` both or elements.
If *component*, *element* and *children* are passed first it try to load *component* if not *element* and in last *children*.


**Hooks**
There are useParams, useNavigate, useQueryParams, useBrowserState available.

```useParams``` will fetch the values params available in the current path.
```useQueryParams``` will fetch search params or hash params available in the current location.
```useBrowserState``` will fetch the browser state that is set.
```useHash``` will fetch  the hash that is set (if it string set other vise it will converted to queryParams)
```useNavigate``` used to redirect user to specific path. It hash *redirect* and *back* functions available
```useRouteUpdater``` used to set different location params it has *setQueryParams*, *setHash* and *setBrowserState* functions
>redirect accepts to and object of state, hash, search keyed values like 
```bash 
const navigate = useNavigate()
navigate.redirect(to, {state, hash, search})
```

using useRouteUpdater
```bash
const {setQueryParams, setHash, setBrowserState} = useRouteUpdater()
// setHash accepts only string
// setQueryParams accept object 
// setBrowserState accepts object
```
here search and hash (if hash is object) objects with key value pairs or queryParams.



**Using outside the hooks and components**
```
getParams
onCurrentPathnameUpdate
onQueryParamUpdate

queryParams
currentPathname
```

In this queryParams and currentPathname can be used to retrieve and set the values based on this paths redirection changes.
>currentPathname can be use to redirect by setting the value in it. It can be only string.
>queryParams will return query params as a object and set the vales as object it will set the search query to browser.

And onCurrentPathnameUpdate, onQueryParamUpdate can be used to trigger the this functions if currentPathUpdates adn currentPathnameUpdates adn queryParamsUpdate. And this will return the function which can be called if there is not more use to  inside function. This takes callback function as argument.

**usage**
```bash
const returnFunction = onCurrentPathnameUpdate(() => {
    ...
})

returnFunction()
```

