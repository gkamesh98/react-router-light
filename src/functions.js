export const serialize = (obj = {}) =>  {

  var p = '';
  Object.entries(obj).forEach(([key, value], index) => {
    p = p + (index ? '&' : '') + key + '=' + encodeURIComponent(JSON.stringify(value))
  });

  return p
}

export const deserialize = (str = '') => {
  var p = {};
  if(str){
    str.split('&').forEach((value) => {
      let [key, parserValue] = value.split('=');
      if(parserValue){
        p = {
          ...p,
          [key]: JSON.parse(decodeURIComponent(parserValue))
        }
      }
    })
  }
  return p
}