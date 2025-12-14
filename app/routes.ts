import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("product/:slug", "routes/product.$slug.tsx"),
] satisfies RouteConfig;
