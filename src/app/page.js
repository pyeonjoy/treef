'use client';

import { useTranslation } from 'next-i18next';
import Body from './components/body';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Body />
    </div>
  );
}
