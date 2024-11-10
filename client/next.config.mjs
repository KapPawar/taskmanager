/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "avatars.githubusercontent.com", "taskmanager-psi-kohl.vercel.app", "taskmanager-api-omega.vercel.app"],
  },
};

export default nextConfig;
