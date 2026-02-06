'use client';

import { Box, HStack, Text, IconButton } from '@chakra-ui/react';
import { MdPalette } from 'react-icons/md';
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from '@/components/ui/menu';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSwitcher() {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <MenuRoot positioning={{ placement: 'bottom-end' }}>
      <MenuTrigger asChild>
        <IconButton
          aria-label="Switch theme"
          size="sm"
          variant="ghost"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            bg: 'gray.100',
            _dark: { bg: 'gray.700' },
          }}
        >
          <MdPalette />
        </IconButton>
      </MenuTrigger>
      <MenuContent minW="240px" p={2}>
        <Box px={3} py={2} mb={1}>
          <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase">
            Choose Theme
          </Text>
        </Box>
        {themes.map((theme) => (
          <MenuItem
            key={theme.id}
            value={theme.id}
            fontSize="sm"
            py={2}
            px={3}
            borderRadius="md"
            cursor="pointer"
            bg={currentTheme.id === theme.id ? 'gray.100' : 'transparent'}
            _dark={{
              bg: currentTheme.id === theme.id ? 'gray.700' : 'transparent',
            }}
            _hover={{
              bg: 'gray.50',
              _dark: { bg: 'gray.700' },
            }}
            onClick={() => setTheme(theme.id)}
          >
            <HStack gap={3} w="full">
              {/* Color Preview */}
              <HStack gap={1}>
                <Box
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  bg={theme.colors.primary}
                  border="1px solid"
                  borderColor="gray.200"
                  _dark={{ borderColor: 'gray.600' }}
                />
                <Box
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  bg={theme.colors.secondary}
                  border="1px solid"
                  borderColor="gray.200"
                  _dark={{ borderColor: 'gray.600' }}
                />
                <Box
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  bg={theme.colors.accent}
                  border="1px solid"
                  borderColor="gray.200"
                  _dark={{ borderColor: 'gray.600' }}
                />
              </HStack>
              {/* Theme Name */}
              <Text flex="1" fontWeight={currentTheme.id === theme.id ? '600' : '400'}>
                {theme.name}
              </Text>
              {/* Check mark for current theme */}
              {currentTheme.id === theme.id && (
                <Box color="green.500" fontSize="lg">
                  ✓
                </Box>
              )}
            </HStack>
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}
