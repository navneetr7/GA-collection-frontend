import './globals.css';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'GovAssist Data Collection',
  description: 'Form submission for customer data collection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Use a workaround for SSR: check for /form/ in the pathname
  const isFormPage = typeof window !== 'undefined' ? window.location.pathname.startsWith('/form/') : false;

  return (
    <html lang="en">
      <body className="bg-[#FAFAF9] font-sans">
        <div className="min-h-screen flex flex-col">
          {!isFormPage && (
            <header className="bg-white shadow-sm p-4">
              <Image 
                src="/GA.jpg" 
                alt="GovAssist Logo" 
                width={150}
                height={48}
                className="h-12 w-auto"
                priority
              />
            </header>
          )}
          <main className={isFormPage ? "flex-grow flex items-center justify-center" : "flex-grow"}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}