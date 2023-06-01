const routeParamsRegex = /:([a-zA-Z]+)/g;
const queryParamsBuildRegex = `(?<query>\\?(.*))?`;

export function buildRoutePath(path) {
  const pathWithDynamicParams = path.replaceAll(
    routeParamsRegex,
    `(?<$1>[a-z0-9\-_]+)`
  );

  const pathRegex = new RegExp(
    `^${pathWithDynamicParams}${queryParamsBuildRegex}$`
  );

  return pathRegex;
}
