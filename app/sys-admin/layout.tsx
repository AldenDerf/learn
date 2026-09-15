import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';
import Link from 'next/link';

export default async function SysAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          projectLink="https://github.com/xxoo3034/learn"
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
      docsRepositoryBase="https://github.com/xxoo3034/learn"
      footer={<Footer>MIT {new Date().getFullYear()} © aldender • System Administration and Maintenance</Footer>}
    >
      {children}
    </Layout>
  );
}
