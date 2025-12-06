import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export const Layout = ({ children, hideFooter }: LayoutProps) => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <Navbar />
    <main className="flex-1 pt-16">{children}</main>
    {!hideFooter && <Footer />}
  </div>
);
