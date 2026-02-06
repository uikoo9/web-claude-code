'use client';

import { Box, Container, Text } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();

  return (
    <Box
      as="footer"
      borderTop="1px"
      style={{ borderColor: 'var(--color-border)' }}
      py={12}
      mt={32}
    >
      <Container maxW="container.xl">
        <Text
          textAlign="center"
          fontSize="md"
          style={{ color: 'var(--color-text-secondary)' }}
          fontFamily="'IBM Plex Sans', sans-serif"
          lineHeight="1.75"
        >
          {t('footer')}
        </Text>
      </Container>
    </Box>
  );
}
