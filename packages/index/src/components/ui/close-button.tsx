'use client';

import { IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface CloseButtonProps extends ChakraIconButtonProps {}

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(props, ref) {
    return (
      <ChakraIconButton
        variant="ghost"
        aria-label="Close"
        ref={ref}
        style={{ color: 'var(--color-text)' }}
        css={{
          '&:hover': {
            backgroundColor: 'var(--color-primary) !important',
            color: 'var(--color-background) !important',
          },
        }}
        {...props}
      >
        {props.children ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        )}
      </ChakraIconButton>
    );
  },
);
