import { extractQueryParams } from "./extract-query-params.js";

export function buildParams(req, route) {
  const routeParams = req.url.match(route.path);

  const { query, ...params } = routeParams.groups;

  req.params = params;
  req.query = query ? extractQueryParams(query) : {};
}
