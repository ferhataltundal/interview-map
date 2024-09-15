"use client";
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Drawer,
  DrawerContent,
  useDisclosure,
  DrawerOverlay,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { ArrowLeftIcon, Menu } from "lucide-react";
import useUIModelStore from "@/zustand/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarContent } from "./SidebarContent";

export function LeftSidebar({ children }: { children: ReactNode }) {
  const { isClosed, setIsClosed } = useUIModelStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();
  return (
    <>
      <Flex
        w="100%"
        maxW={isClosed ? 30 : 350}
        flexDirection="column"
        margin={1}
        gap={1}
        transition="all 0.1s ease-in-out"
        display={{ base: "none", lg: "flex" }}
      >
        <SidebarContent isClosed={isClosed} setIsClosed={setIsClosed}>
          {children}
        </SidebarContent>
        {!isClosed &&
          pathname !== "/" &&
          !pathname.includes("/edit-location") && (
            <Flex w="100%" flexDirection="column" gap={2} marginTop={4}>
              <Link href="/">
                <Button size="sm" variant="outline" colorScheme="blue" w="100%">
                  Menu
                </Button>
              </Link>
              <Link
                href={
                  pathname === "/add-location"
                    ? "/saved-locations"
                    : pathname === "/saved-locations"
                    ? "/add-location"
                    : "/"
                }
              >
                <Button size="sm" variant="outline" colorScheme="blue" w="100%">
                  {pathname === "/add-location"
                    ? "Saved Locations"
                    : pathname === "/saved-locations"
                    ? "Add Location"
                    : "Menu"}
                </Button>
              </Link>
            </Flex>
          )}
      </Flex>
      <Flex
        w="100%"
        maxW={30}
        flexDirection="column"
        margin={1}
        gap={1}
        transition="all 0.1s ease-in-out"
        display={{ base: "flex", lg: "none" }}
      >
        <ButtonGroup
          size="sm"
          isAttached
          variant="outline"
          display="flex"
          flexDirection={isClosed ? "column" : "row"}
          w="max-content"
          gap={1}
        >
          <IconButton
            aria-label="close"
            onClick={onOpen}
            icon={<Menu />}
            borderRadius="5px !important"
          />
        </ButtonGroup>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay bg="rgba(0, 0, 0, 0.8)" />
          <DrawerContent p={1} gap={1}>
            <ButtonGroup
              size="sm"
              isAttached
              variant="outline"
              display="flex"
              flexDirection={isClosed ? "column" : "row"}
              w="max-content"
              gap={1}
            >
              <Link href="/">
                <IconButton
                  aria-label="back"
                  icon={<ArrowLeftIcon />}
                  borderRadius="5px !important"
                />
              </Link>
            </ButtonGroup>
            <SidebarContent isClosed={isClosed} setIsClosed={setIsClosed}>
              {children}
            </SidebarContent>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  );
}
