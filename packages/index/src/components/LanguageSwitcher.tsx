'use client';

import { Button } from '@chakra-ui/react';
import { useLocale } from 'next-intl';
import { setLocale } from '@/actions/locale';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = async () => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    startTransition(async () => {
      await setLocale(newLocale);
      // Clear hash before reload to prevent auto-scroll
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      window.location.reload();
    });
  };

  return (
    <Button
      variant="ghost"
      size={{ base: 'sm', md: 'md' }}
      w={{ base: '50px', md: '60px' }}
      px={{ base: 2, md: 3 }}
      onClick={handleLanguageChange}
      loading={isPending}
      cursor="pointer"
      style={{ color: 'var(--color-text)' }}
      fontWeight="500"
      transition="all 0.2s"
      _hover={{
        bg: 'transparent',
        opacity: 0.7,
      }}
      css={{
        '&:hover': {
          color: 'var(--color-primary)',
        },
      }}
    >
      {locale === 'en' ? '中文' : 'EN'}
    </Button>
  );
}
