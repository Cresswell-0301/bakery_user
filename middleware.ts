import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Must Login first ( Local )
  // publicRoutes: ["/api/:path*"],

  // No Required Login ( Deploy )
  publicRoutes: ["/"],

  // No need auth to access this route
  ignoredRoutes: ["/api/banner"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
