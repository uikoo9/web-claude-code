'use client';

import { Box, Flex, Heading, Button, IconButton, Link } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LoginModal } from './LoginModal';
import { UserMenu } from './UserMenu';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const t = useTranslations();
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, loading } = useAuth();

  // Extract user data from Supabase user object
  const userData = user
    ? {
        avatarUrl: user.user_metadata?.avatar_url || null,
        displayName: user.user_metadata?.full_name || user.user_metadata?.name || null,
        username: user.user_metadata?.user_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
      }
    : null;

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={1000}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        boxShadow="sm"
        borderBottom="1px"
        suppressHydrationWarning
      >
        <Flex
          justify="space-between"
          align="center"
          px={{ base: 4, md: 8 }}
          py={4}
        >
          {/* Logo - Left */}
          <Heading
            as="h1"
            fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
            style={{ color: 'var(--color-primary)' }}
            fontWeight="black"
            cursor="pointer"
            transition="opacity 0.2s"
            _hover={{
              opacity: 0.8,
            }}
            letterSpacing="tight"
            fontFamily="'JetBrains Mono', monospace"
          >
            webcc.dev
          </Heading>

          {/* Right side buttons */}
          <Flex gap={{ base: 2, md: 4 }} align="center">
            {/* User state */}
            {loading ? (
              // Loading placeholder
              <Box w="40px" h="40px" />
            ) : userData ? (
              // Logged in: Show user menu
              <UserMenu
                avatarUrl={userData.avatarUrl}
                displayName={userData.displayName}
                username={userData.username}
                email={userData.email}
              />
            ) : (
              // Not logged in: Show login button
              <Button
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-background)',
                }}
                size={{ base: 'sm', md: 'md' }}
                px={{ base: 4, md: 6 }}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-1px)',
                  shadow: 'md',
                  opacity: 0.9,
                }}
                onClick={() => setLoginOpen(true)}
              >
                {t('login')}
              </Button>
            )}

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* GitHub button */}
            <Link
              href="https://github.com/uikoo9/web-claude-code"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <IconButton
                aria-label="GitHub"
                size="md"
                variant="ghost"
                cursor="pointer"
                style={{ color: 'var(--color-text)' }}
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
                <FaGithub size={20} />
              </IconButton>
            </Link>
          </Flex>
        </Flex>
      </Box>

      {/* Login Modal */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
