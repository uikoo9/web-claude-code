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

  const handleSignOut = async () => {
    // TODO: Implement sign out
    console.log('Sign out');
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
        borderColor="blue.200"
        _dark={{ borderColor: 'blue.700' }}
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
                color="gray.900"
                _dark={{ color: 'gray.100' }}
                truncate
              >
                {displayName || username}
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                _dark={{ color: 'gray.400' }}
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
          _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
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
          _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
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
