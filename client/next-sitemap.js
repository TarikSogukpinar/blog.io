module.exports = {
  siteUrl: process.env.SITE_URL || "https://blog.tariksogukpinar.dev",
  generateRobotsTxt: true,
  // optional
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
