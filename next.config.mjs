/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/signup',
                destination: '/register',
                permanent: true,
            },
        ]
    }
};

export default nextConfig;
