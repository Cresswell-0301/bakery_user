import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Must Login first ( Local )
  // publicRoutes: ["/api/:path*"],

  // No Required Login ( Deploy )
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
