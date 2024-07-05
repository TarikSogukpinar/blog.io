module.exports = {
  siteUrl: process.env.SITE_URL || "https://yourdomain.com",
  generateRobotsTxt: true,
  // optional
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
