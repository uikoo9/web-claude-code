'use client';

import { Heading, Button, Stack, Flex, Box, Text } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogBody,
  DialogCloseTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const t = useTranslations();
  const { signInWithGithub, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setLoading(provider);

    try {
      if (provider === 'github') {
        await signInWithGithub();
      } else {
        await signInWithGoogle();
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      size="sm"
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent
        maxW={{ base: 'calc(100% - 32px)', sm: '400px' }}
        mx={{ base: 4, sm: 'auto' }}
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <DialogCloseTrigger />
        <DialogBody p={{ base: 6, md: 10 }}>
          {/* Header */}
          <Flex direction="column" align="center" mb={6} textAlign="center">
            <Heading
              size={{ base: 'xl', md: '2xl' }}
              style={{ color: 'var(--color-primary)' }}
              mb={4}
              fontWeight="700"
              letterSpacing="-0.02em"
            >
              {t('welcomeBack')}
            </Heading>
          </Flex>

          {/* OAuth Buttons */}
          <Stack gap={3}>
            <Button
              size={{ base: 'md', md: 'lg' }}
              variant="outline"
              w="full"
              cursor="pointer"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-text)',
                backgroundColor: 'transparent',
              }}
              borderWidth="2px"
              py={{ base: 6, md: 7 }}
              _hover={{
                style: {
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-background)',
                },
                transform: 'translateY(-2px)',
                shadow: 'md',
              }}
              onClick={() => handleOAuthLogin('github')}
              loading={loading === 'github'}
              disabled={loading !== null}
              transition="all 0.2s"
            >
              <Flex align="center" gap={3}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="500">
                  {t('signInWithGithub')}
                </Text>
              </Flex>
            </Button>

            <Button
              size={{ base: 'md', md: 'lg' }}
              variant="outline"
              w="full"
              cursor="pointer"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-text)',
                backgroundColor: 'transparent',
              }}
              borderWidth="2px"
              py={{ base: 6, md: 7 }}
              _hover={{
                style: {
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-background)',
                },
                transform: 'translateY(-2px)',
                shadow: 'md',
              }}
              onClick={() => handleOAuthLogin('google')}
              loading={loading === 'google'}
              disabled={loading !== null}
              transition="all 0.2s"
            >
              <Flex align="center" gap={3}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="500">
                  {t('signInWithGoogle')}
                </Text>
              </Flex>
            </Button>
          </Stack>

          {/* Footer Note */}
          <Text
            style={{ color: 'var(--color-text-secondary)' }}
            fontSize="xs"
            textAlign="center"
            mt={6}
            lineHeight="1.6"
          >
            {t('termsNotice')}
          </Text>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
