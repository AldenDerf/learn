import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SYSTEM_ADMIN_AVAILABLE } from '@/lib/course-availability';

export default async function SysAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!SYSTEM_ADMIN_AVAILABLE) {
    notFound();
  }

  const pageMap = await getPageMap('/sys-admin');

  return (
    <Layout
      navbar={
        <Navbar
          logo={
            <div className="x:flex x:items-center x:gap-2">
              <span className="x:text-xl">🖥️</span>
              <span className="x:font-bold x:text-base">System Administration</span>
            </div>
          }
          projectLink="https://github.com/AldenDerf/learn"
        >
          <Link
            href="/"
            className="x:text-sm x:font-medium x:text-gray-600 hover:x:text-black x:dark:text-gray-400 dark:hover:x:text-white"
          >
            🏠 Home
          </Link>
          <Link
            href="/web-systems"
            className="x:text-sm x:font-medium x:text-gray-600 hover:x:text-black x:dark:text-gray-400 dark:hover:x:text-white"
          >
            🌐 Web Systems →
          </Link>
        </Navbar>
      }
      pageMap={pageMap}
      docsRepositoryBase="https://github.com/AldenDerf/learn/tree/system-admin-module-02"
      footer={<Footer>MIT {new Date().getFullYear()} © aldender • System Administration and Maintenance</Footer>}
    >
      {children}
    </Layout>
  );
}
