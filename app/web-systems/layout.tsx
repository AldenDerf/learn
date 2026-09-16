import { Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';
import Link from 'next/link';
import { SYSTEM_ADMIN_AVAILABLE } from '@/lib/course-availability';

export default async function WebSystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap('/web-systems');

  return (
    <Layout
      navbar={
        <Navbar
          logo={
            <div className="x:flex x:items-center x:gap-2">
              <span className="x:text-xl">🌐</span>
              <span className="x:font-bold x:text-base">Web Systems & Tech</span>
            </div>
          }
        >
          <Link
            href="/"
            className="x:text-sm x:font-medium x:text-gray-600 hover:x:text-black x:dark:text-gray-400 dark:hover:x:text-white"
          >
            🏠 Home
          </Link>
          {SYSTEM_ADMIN_AVAILABLE ? (
            <Link
              href="/sys-admin"
              className="x:text-sm x:font-medium x:text-gray-600 hover:x:text-black x:dark:text-gray-400 dark:hover:x:text-white"
            >
              🖥️ SysAdmin →
            </Link>
          ) : null}
        </Navbar>
      }
      pageMap={pageMap}
      docsRepositoryBase="https://github.com/xxoo3034/learn"
      footer={null}
    >
      {children}
    </Layout>
  );
}
