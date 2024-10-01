// app/page.js

"use client";

import { useAuth } from '@/context/AuthProvider';
import Layout from '@/components/Layout';
import main from "@/public/styles/main.module.css";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
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

  if (user) return (
    <Layout loading={loading} mobile={isMobile} user={user}>
      <main className={main.main}>
        <h1>Hello world</h1>
      </main>
    </Layout>
  );
  else return router.push('/login')
}
