import Link from 'next/link'

export async function generateMetadata() {
    return {
        metadataBase: new URL(process.env.SITE_URL),
        icons: {
            icon: "/assets/logo/rounded.png",
            apple: "/assets/logo/rounded.png",
            shortcut: "/assets/logo/box.png",
        },
        assets: ['/assets'],
        canonical: `/`,
        title: "404 - page not found | Cloud",
        description: "The Cloud Storage App is a web-based application designed for users to store and manage their files and folders in the cloud. It offers a convenient way to organize, upload, download, and delete files and folders, making it easy to access your data from anywhere.",
        author: "itsmateo20",
        keywords: "cloud, storage, cloudstorage",
        openGraph: {
            title: "404 - page not found | Cloud",
            description: "The Cloud Storage App is a web-based application designed for users to store and manage their files and folders in the cloud. It offers a convenient way to organize, upload, download, and delete files and folders, making it easy to access your data from anywhere.",
            url: `${process.env.SITE_URL}`,
            siteName: `${process.env.SITE_URL.replace("https://", "").replace("http://", "")}`,
            images: [
                {
                    url: `${process.env.SITE_URL}/assets/logo/thumbnail.png`,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "404 - page not found | Cloud",
            description: "The Cloud Storage App is a web-based application designed for users to store and manage their files and folders in the cloud. It offers a convenient way to organize, upload, download, and delete files and folders, making it easy to access your data from anywhere.",
            images: [`${process.env.SITE_URL}/assets/logo/thumbnail.png`],
        }
    }
};

export default function NotFound() {
    return (
        <div className="container404">
            <img src="/assets/404.webp" alt="404" />
            <h1>Page not found.</h1>
            <Link href="/">Redirect back to home page</Link>
        </div>
    )
}
