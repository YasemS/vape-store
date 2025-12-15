import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("product/:slug", "routes/product.$slug.tsx"),
  route("cart", "routes/cart.tsx"),
] satisfies RouteConfig;
