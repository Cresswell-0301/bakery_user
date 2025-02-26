import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Must Login first ( Local )
  // publicRoutes: ["/api/:path*"],

  // No Required Login ( Deploy )
  publicRoutes: [
    "/", 
    "/products",
    "/collections",
    "/collections/:id",
    "/products/:id",
    "/search/:query"
  ],

  // No need auth to access this route
  ignoredRoutes: ["/api/banner", "/api/intro", "/api/icon_image"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
