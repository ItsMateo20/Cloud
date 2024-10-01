// app/page.js

"use client";

import { useAuth } from '@/context/AuthProvider';
import Layout from '@/components/Layout';
import login from "@/public/styles/login.module.css";

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

export default function Page() {
    const { user, loading } = useAuth();

    const [isMobile, setIsMobile] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let mobile = window.matchMedia("(max-width: 1023px)");
            setIsMobile(mobile.matches);

            const handleResize = () => setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    if (!user) return (
        <Layout loading={false} mobile={isMobile} user={user}>
            <main className={login.main}>
                <h1 className={login.title}>Login</h1>
                <h2 className={login.subtitle}>Login into your cloud storage account</h2>
            </main>
        </Layout>
    );
    else return redirect('/')
}
