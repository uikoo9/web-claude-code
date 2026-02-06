'use client';

import { Avatar as ChakraAvatar, Group } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface AvatarProps extends ChakraAvatar.RootProps {
  name?: string;
  src?: string;
  icon?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(props, ref) {
  const { name, src, icon, fallback, children, ...rest } = props;
  return (
    <ChakraAvatar.Root ref={ref} {...rest}>
      {src && <ChakraAvatar.Image src={src} />}
      <ChakraAvatar.Fallback>
        {fallback || (icon ? icon : name ? getInitials(name) : null)}
      </ChakraAvatar.Fallback>
      {children}
    </ChakraAvatar.Root>
  );
});

function getInitials(name: string) {
  const names = name.trim().split(' ');
  const firstName = names[0] ?? '';
  const lastName = names.length > 1 ? names[names.length - 1] : '';
  return firstName && lastName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
    : firstName.charAt(0);
}

export const AvatarGroup = Group;
