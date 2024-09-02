import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["blog.tariksogukpinar.dev", "via.placeholder.com"],
  },
};

export default withNextIntl(nextConfig);
