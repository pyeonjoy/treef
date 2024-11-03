'use client';

import i18n from '@/i18n';
import './globals.css';
import { appWithTranslation } from 'next-i18next';
import { useParams, usePathname } from 'next/navigation';
const RootLayout = ({ children }) => {
  const { locale } = useParams(); // 또는 usePathname()을 사용하여 경로에서 locale을 추출할 수 있습니다

  return (
    <html lang={locale || 'en'}>
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
