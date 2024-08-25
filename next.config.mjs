
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
            },
            {
                protocol: 'http',
                hostname: 'localhost'
            }
        ]
    },
    experimental: {
        instrumentationHook: true
    },
    output: 'standalone'
};

export default nextConfig;
