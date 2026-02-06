'use client';

import { Box, Container, Heading, Button, Flex, Link } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations();

  return (
    <Box
      style={{
        background: 'var(--color-background)',
      }}
      minH="calc(100vh - 73px)" // Full viewport minus header height
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* Animated background gradient */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        style={{
          background: `radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, var(--color-accent) 0%, transparent 50%)`,
        }}
      />

      <Container maxW="container.lg" position="relative" zIndex={1}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          minH="calc(100vh - 200px)"
        >
          {/* Main Slogan - positioned higher */}
          <Box flex="1" display="flex" alignItems="center" pt={{ base: 8, md: 0 }}>
            <Heading
              as="h1"
              fontSize={{ base: '5xl', md: '7xl', lg: '8xl' }}
              fontWeight="bold"
              fontFamily="'JetBrains Mono', monospace"
              style={{ color: 'var(--color-primary)' }}
              letterSpacing="tight"
              lineHeight="1.1"
            >
              {t('heroTitle')}
            </Heading>
          </Box>

          {/* CTA Button - positioned lower with more spacing */}
          <Box pb={{ base: 16, md: 20 }}>
            <Link href="#steps">
              <Button
                size="lg"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-background)',
                }}
                px={10}
                py={7}
                fontSize="xl"
                fontWeight="semibold"
                transition="all 0.2s"
                cursor="pointer"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'xl',
                  opacity: 0.9,
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
              >
                {t('ctaButton')}
              </Button>
            </Link>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
