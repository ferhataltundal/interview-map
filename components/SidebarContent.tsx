import { ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { AlignJustify, X, Map, Plus } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export function SidebarContent({
  children,
  isClosed,
  setIsClosed,
}: {
  children: ReactNode;
  isClosed: boolean;
  setIsClosed: (isClosed: boolean) => void;
}) {
  return (
    <>
      <Flex w="100%" flexDirection="column">
        <ButtonGroup
          size="sm"
          isAttached
          variant="outline"
          flexDirection={isClosed ? "column" : "row"}
          w="max-content"
          gap={1}
          display={{ base: "none", lg: "flex" }}
        >
          <IconButton
            aria-label="close"
            icon={isClosed ? <AlignJustify /> : <X />}
            onClick={() => setIsClosed(isClosed ? false : true)}
            borderRadius="5px !important"
          />
          {isClosed && (
            <>
              <Link href="/add-location" onClick={() => setIsClosed(false)}>
                <IconButton
                  aria-label="add"
                  icon={<Plus />}
                  borderRadius="5px !important"
                />
              </Link>
              <Link href="/saved-locations" onClick={() => setIsClosed(false)}>
                <IconButton
                  aria-label="show"
                  icon={<Map />}
                  borderRadius="5px !important"
                />
              </Link>
            </>
          )}
        </ButtonGroup>
      </Flex>
      {!isClosed && children}
    </>
  );
}
