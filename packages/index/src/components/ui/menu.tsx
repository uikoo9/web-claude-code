'use client';

import { Menu as ChakraMenu, Portal } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface MenuContentProps extends ChakraMenu.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  function MenuContent(props, ref) {
    const { portalled = true, portalRef, ...rest } = props;

    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraMenu.Positioner>
          <ChakraMenu.Content ref={ref} {...rest} />
        </ChakraMenu.Positioner>
      </Portal>
    );
  },
);

export const MenuRoot = ChakraMenu.Root;
export const MenuTrigger = ChakraMenu.Trigger;
export const MenuItem = ChakraMenu.Item;
export const MenuItemGroup = ChakraMenu.ItemGroup;
export const MenuSeparator = ChakraMenu.Separator;
export const MenuArrow = ChakraMenu.Arrow;
export const MenuCheckboxItem = ChakraMenu.CheckboxItem;
export const MenuRadioItem = ChakraMenu.RadioItem;
export const MenuRadioItemGroup = ChakraMenu.RadioItemGroup;
export const MenuItemCommand = ChakraMenu.ItemCommand;
export const MenuContextTrigger = ChakraMenu.ContextTrigger;
