'use client';

import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from '@/components/ui/menu';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  avatarUrl?: string | null;
  displayName?: string | null;
  username: string;
  email: string;
}

export const UserMenu = ({
  avatarUrl,
  displayName,
  username,
  email,
}: UserMenuProps) => {
  const t = useTranslations();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <MenuRoot positioning={{ placement: 'bottom-end' }}>
      <MenuTrigger asChild>
        <Box
          cursor="pointer"
          borderRadius="full"
          transition="all 0.2s"
          _hover={{
            transform: 'scale(1.05)',
            boxShadow: 'md',
          }}
        >
          <Avatar
            size="sm"
            name={displayName || username}
            src={avatarUrl || undefined}
          />
        </Box>
      </MenuTrigger>
      <MenuContent
        minW="240px"
        p={2}
        style={{ borderColor: 'var(--color-border)' }}
        borderWidth="1px"
      >
        {/* User Info */}
        <Box px={3} py={3} mb={1}>
          <HStack gap={3}>
            <Avatar
              size="md"
              name={displayName || username}
              src={avatarUrl || undefined}
            />
            <Stack gap={0.5} flex="1">
              <Text
                fontWeight="600"
                fontSize="sm"
                style={{ color: 'var(--color-text)' }}
                truncate
              >
                {displayName || username}
              </Text>
              <Text
                fontSize="xs"
                style={{ color: 'var(--color-text-secondary)' }}
                truncate
              >
                {email}
              </Text>
            </Stack>
          </HStack>
        </Box>

        <MenuSeparator />

        {/* Menu Items */}
        <MenuItem
          value="profile"
          fontSize="sm"
          py={2}
          px={3}
          borderRadius="md"
          cursor="pointer"
          _hover={{
            style: { backgroundColor: 'var(--color-surface)' },
          }}
        >
          {t('profile')}
        </MenuItem>
        <MenuItem
          value="settings"
          fontSize="sm"
          py={2}
          px={3}
          borderRadius="md"
          cursor="pointer"
          _hover={{
            style: { backgroundColor: 'var(--color-surface)' },
          }}
        >
          {t('settings')}
        </MenuItem>

        <MenuSeparator my={1} />

        <MenuItem
          value="signout"
          fontSize="sm"
          py={2}
          px={3}
          borderRadius="md"
          cursor="pointer"
          color="red.600"
          _dark={{ color: 'red.400' }}
          _hover={{
            bg: 'red.50',
            color: 'red.700',
            _dark: { bg: 'red.900', color: 'red.300' },
          }}
          onClick={handleSignOut}
        >
          {t('signOut')}
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
