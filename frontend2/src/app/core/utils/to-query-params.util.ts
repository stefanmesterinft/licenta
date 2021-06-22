export function toQueryParams(obj) {
    if (!obj) return null;
    const flattenObj = (x, path = []) => {
      const result = [];
      if(!x){
        return result;
      }
      Object.keys(x).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(x, key)) return;
        const newPath = path.slice();
        newPath.push(key);
        let vals = [];
        if (typeof x[key] === 'object') {
          vals = flattenObj(x[key], newPath);
        } else {
          vals.push({ path: newPath, val: x[key] });
        }
        vals.forEach((v) => {
          return result.push(v);
        });
      });
      return result;
    };
    
  
    let parts = flattenObj(obj);
    parts = parts.map((varInfo) => {
      if (varInfo.path.length === 1) {
        varInfo.path = varInfo.path[0]; // eslint-disable-line no-param-reassign
      } else {
        const first = varInfo.path[0];
        const rest = varInfo.path.slice(1);
        varInfo.path = `${first}[${rest.join('][')}]`; // eslint-disable-line no-param-reassign
      }
      return varInfo;
    });
  
    const queryString = parts.reduce((acc, varInfo) => {
        acc[varInfo.path] = varInfo.val;
        return acc;
    },[]);

    return queryString;
}