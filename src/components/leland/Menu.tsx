// Ported from @leland/ui-library (components/menu) — the production Menu and
// MenuItem on @radix-ui/react-dropdown-menu. Changes from the source:
// - next/link → react-router-dom Link
// - text-base → explicit 0.875rem (the monorepo overrides the base scale)
// - z-dropdown utility comes from styles/leland-theme.css
// - PROTOTYPE DIVERGENCE: whitespace-nowrap removed from items and max-w-80
//   added to content so long labels (e.g. full lesson titles) wrap.
import {
  Content as DropdownMenuContent,
  Item as DropdownMenuItem,
  Portal as DropdownMenuPortal,
  Root as DropdownMenuRoot,
  Separator as DropdownMenuSeparator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger as DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  type FC,
  forwardRef,
  Fragment,
  type ReactNode,
  type RefObject,
  type SVGProps,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { IconChevronLeft } from "./svg/icons";
import { FontWeight, FontWeightToStyles } from "./util";

export type MenuItemProps = {
  label: string;
  CustomLeftIcon?: FC<{ iconClassName?: string }>;
  LeftIcon?: FC<SVGProps<SVGSVGElement>>;
  CustomRightIcon?: FC<{ iconClassName?: string }>;
  RightIcon?: FC<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  fontWeight?: FontWeight;
  selected?: boolean;
} & (MenuItemWithoutItems | MenuItemWithItems);

type MenuItemWithItems = {
  onSelect?: never;
  items: MenuItemProps[][];
};

type MenuItemWithoutItems = {
  items?: never;
} & (
  | {
      onSelect: (e: Event | SyntheticEvent) => void;
    }
  | {
      url: string;
    }
);

export type MenuItemSection = MenuItemProps[];

type InternalMenuItemProps = Omit<MenuItemProps, "onSelect"> & {
  includeLeftIconPlaceholder: boolean;
  pageView?: boolean;
  alignSubmenuWithParent?: boolean;
  onSelect?: (e: Event | SyntheticEvent) => void;
  url?: string;
  parentMenuRef: RefObject<HTMLDivElement | null>;
  ignoreCollisions?: boolean;
  childRefs: RefObject<(HTMLDivElement | null)[]> | undefined;
  selected?: boolean;
};

const MenuItem = forwardRef<HTMLDivElement, InternalMenuItemProps>(
  (
    {
      label,
      CustomLeftIcon,
      LeftIcon,
      CustomRightIcon,
      RightIcon,
      disabled,
      fontWeight = FontWeight.SEMIBOLD,
      onSelect,
      url,
      includeLeftIconPlaceholder,
      items,
      pageView = false,
      alignSubmenuWithParent = false,
      parentMenuRef,
      ignoreCollisions = false,
      childRefs,
      selected = false,
    },
    ref,
  ) => {
    const iconStyles = "size-5";
    const [alignOffset, setAlignOffset] = useState(-8);
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const subRef = useRef<HTMLDivElement | null>(null);

    const subContentRefCallback = useCallback(
      (subContentElement: HTMLDivElement | null) => {
        subRef.current = subContentElement;
        if (!childRefs?.current?.includes(subContentElement)) {
          childRefs?.current?.push(subContentElement);
        }

        if (
          !alignSubmenuWithParent ||
          !parentMenuRef.current ||
          !triggerRef.current ||
          !subContentElement
        )
          return;
        const parentRect = parentMenuRef.current.getBoundingClientRect();
        const triggerRect = triggerRef.current.getBoundingClientRect();
        setAlignOffset(-(triggerRect.top - parentRect.top));
        subContentElement.style.minHeight = `${parentRect.height}px`;
      },
      [alignSubmenuWithParent, parentMenuRef, triggerRef, childRefs],
    );

    const itemClassName = `flex w-full group cursor-pointer select-none items-center justify-between gap-x-2.5 rounded-md p-2.5 text-[0.875rem] leading-tight text-leland-gray-dark outline-none hover:bg-leland-gray-hover focus:bg-leland-gray-hover active:bg-leland-gray-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-leland-gray-dark data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${selected ? "bg-leland-gray-hover" : ""} ${FontWeightToStyles[fontWeight]}`;

    const menuItem = (
      <>
        <div className="flex min-w-0 items-center gap-x-2.5">
          {CustomLeftIcon ? (
            <CustomLeftIcon iconClassName={iconStyles} />
          ) : LeftIcon ? (
            <LeftIcon className={iconStyles} />
          ) : includeLeftIconPlaceholder ? (
            <div className={iconStyles} />
          ) : null}
          <span>{label}</span>
        </div>
        {CustomRightIcon ? (
          <CustomRightIcon iconClassName={iconStyles} />
        ) : RightIcon ? (
          <RightIcon className={iconStyles} />
        ) : null}
      </>
    );

    if (!items?.length || pageView) {
      if (url) {
        return (
          <DropdownMenuItem ref={ref} asChild>
            <Link to={url} className={itemClassName}>
              {menuItem}
            </Link>
          </DropdownMenuItem>
        );
      }
      return (
        <DropdownMenuItem
          ref={ref}
          className={itemClassName}
          disabled={disabled}
          onSelect={onSelect}
        >
          {menuItem}
        </DropdownMenuItem>
      );
    }

    const hasLeftIcons = items.some((section) =>
      section.some((item) => item.LeftIcon || item.CustomLeftIcon),
    );

    return (
      <Sub>
        <SubTrigger
          ref={(node) => {
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            triggerRef.current = node;
          }}
          className={itemClassName}
          disabled={disabled}
          onClick={onSelect}
        >
          {menuItem}
        </SubTrigger>

        <DropdownMenuPortal>
          <SubContent
            className="min-w-48 max-w-80 rounded-md border border-leland-gray-stroke bg-leland-white p-2 shadow-md z-dropdown"
            sideOffset={16}
            alignOffset={alignOffset}
            avoidCollisions={!ignoreCollisions}
            ref={subContentRefCallback}
          >
            {items.map((section, sectionIndex) => (
              <Fragment key={`section-${sectionIndex}`}>
                {sectionIndex > 0 ? (
                  <MenuItemSeparator key={`separator-${sectionIndex}`} />
                ) : null}
                {section.map((item, index) => (
                  <MenuItem
                    childRefs={childRefs}
                    key={`${item.label}-${index}`}
                    includeLeftIconPlaceholder={hasLeftIcons}
                    {...item}
                    pageView={pageView}
                    alignSubmenuWithParent={alignSubmenuWithParent}
                    parentMenuRef={subRef}
                  />
                ))}
              </Fragment>
            ))}
          </SubContent>
        </DropdownMenuPortal>
      </Sub>
    );
  },
);
MenuItem.displayName = "MenuItem";

export const MenuItemSeparator = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <DropdownMenuSeparator
      ref={ref}
      className="my-1 h-px bg-leland-gray-stroke"
    />
  );
});
MenuItemSeparator.displayName = "MenuItemSeparator";

export interface MenuProps {
  itemSections: MenuItemSection[];
  asChild?: boolean;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  children: ReactNode;
  controlledOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  fillParentWidth?: boolean;
  subMenusInPageView?: boolean;
  loading?: boolean;
  ignoreCollisions?: boolean;
  alignSubmenuWithParent?: boolean;
  openOnHover?: boolean;
  header?: string;
  maxItems?: number;
  includeLeftIconPlaceholder?: boolean | null;
}

// Approximate rendered height of a MenuItem in pixels — used to compute a
// scroll cap when maxItems is provided.
const MENU_ITEM_HEIGHT_PX = 44;

export const Menu: FC<MenuProps> = ({
  itemSections: rawItemSections,
  asChild = true,
  align = "start",
  sideOffset = 4,
  children,
  onOpenChange: onOpenChangeProp,
  fillParentWidth = false,
  subMenusInPageView = false,
  loading = false,
  ignoreCollisions = false,
  alignSubmenuWithParent = false,
  openOnHover = false,
  controlledOpen = undefined,
  header,
  maxItems,
  includeLeftIconPlaceholder = null,
}) => {
  const itemSections = useMemo(
    () => rawItemSections.filter((section) => section.length > 0),
    [rawItemSections],
  );

  const parentMenuRef = useRef<HTMLDivElement | null>(null);

  const { onMouseEnter, open, onOpenChange, containerRef, menuItemRefs } =
    useControlledHoverState({
      openOnHover,
      parentMenuRef,
      onOpenChange: onOpenChangeProp,
    });

  const refCallback = (el: HTMLDivElement) => {
    parentMenuRef.current = el;
    const parent = el?.parentElement;
    if (!parent || !fillParentWidth) {
      return;
    }
    parent.style.right = "0";
    parent.style.position = "absolute";
    parent.style.zIndex = "5";
  };

  // Filling parent means to put it inline with the parent (no portal)
  const Container = fillParentWidth ? Fragment : DropdownMenuPortal;

  const {
    sections: pageSections,
    onSelect: onSelectPage,
    hasLeftIcons: hasLeftIconsPage,
  } = usePageSubmenus(itemSections);
  const sections = subMenusInPageView ? pageSections : itemSections;

  const hasLeftIcons =
    includeLeftIconPlaceholder ??
    (subMenusInPageView
      ? hasLeftIconsPage
      : sections.some((section) =>
          section.some((item) => item.LeftIcon || item.CustomLeftIcon),
        ));

  return (
    <DropdownMenuRoot
      open={controlledOpen ?? open}
      onOpenChange={onOpenChange}
      modal={!fillParentWidth && !openOnHover}
    >
      <DropdownMenuTrigger
        className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-gray-dark"
        asChild={asChild}
        onMouseEnter={onMouseEnter}
        ref={containerRef}
      >
        {children}
      </DropdownMenuTrigger>
      <Container>
        <DropdownMenuContent
          className="min-w-48 max-w-80 rounded-md border border-leland-gray-stroke bg-leland-white p-2 shadow-md z-dropdown"
          collisionPadding={
            !ignoreCollisions
              ? { top: 80, bottom: 80, left: 20, right: 20 }
              : undefined
          }
          avoidCollisions={!ignoreCollisions}
          align={align}
          sideOffset={sideOffset}
          sticky="partial"
          ref={refCallback}
          onMouseEnter={onMouseEnter}
        >
          {loading ? (
            <div className="flex flex-col gap-2" data-testid="menu-loading">
              <div className="h-10 w-full motion-safe:animate-pulse rounded-md bg-leland-gray-hover" />
              <div className="h-10 w-full motion-safe:animate-pulse rounded-md bg-leland-gray-hover" />
              <div className="h-10 w-full motion-safe:animate-pulse rounded-md bg-leland-gray-hover" />
            </div>
          ) : (
            <>
              {header ? (
                <div className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-leland-gray-light">
                  {header}
                </div>
              ) : null}
              <div
                className="overflow-y-auto"
                style={{
                  maxHeight: maxItems
                    ? `${maxItems * MENU_ITEM_HEIGHT_PX}px`
                    : "var(--radix-dropdown-menu-content-available-height)",
                }}
              >
                {sections.map((section, sectionIndex) => (
                  <Fragment key={`section-${sectionIndex}`}>
                    {sectionIndex > 0 ? (
                      <MenuItemSeparator key={`separator-${sectionIndex}`} />
                    ) : null}
                    {section.map((item, itemIndex) => (
                      <MenuItem
                        childRefs={menuItemRefs}
                        key={`item-${sectionIndex}-${itemIndex}`}
                        includeLeftIconPlaceholder={hasLeftIcons}
                        {...item}
                        pageView={subMenusInPageView}
                        alignSubmenuWithParent={alignSubmenuWithParent}
                        parentMenuRef={parentMenuRef}
                        ignoreCollisions={ignoreCollisions}
                        {...(subMenusInPageView
                          ? { onSelect: (e) => onSelectPage(e, item) }
                          : {})}
                      />
                    ))}
                  </Fragment>
                ))}
              </div>
            </>
          )}
        </DropdownMenuContent>
      </Container>
    </DropdownMenuRoot>
  );
};

const useControlledHoverState = ({
  openOnHover,
  parentMenuRef,
  onOpenChange: onOpenChangeProp,
}: {
  openOnHover: boolean;
  parentMenuRef: RefObject<HTMLElement | null>;
  onOpenChange: ((open: boolean) => void) | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Delay before closing so the cursor can cross the gap between trigger and
  // content without dismissing the menu.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMouseOutside = (event: MouseEvent) => {
      const refs = [
        containerRef.current,
        parentMenuRef.current,
        ...menuItemRefs.current,
      ];

      if (refs.every((ref) => ref && !ref.contains(event.target as Node))) {
        timer.current = setTimeout(() => {
          setOpen(false);
        }, 50);
      }
    };

    document.addEventListener("mouseover", handleMouseOutside);
    return () => document.removeEventListener("mouseover", handleMouseOutside);
  });

  const onOpenChange = useCallback(
    (_open: boolean) => {
      setOpen(_open);
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      onOpenChangeProp?.(_open);
    },
    [onOpenChangeProp],
  );

  const onMouseEnter = useCallback(() => {
    onOpenChange(true);
  }, [onOpenChange]);

  return openOnHover
    ? {
        onMouseEnter,
        open,
        onOpenChange,
        containerRef,
        menuItemRefs,
      }
    : { onOpenChange: onOpenChangeProp };
};

const usePageSubmenus = (sections: MenuItemSection[]) => {
  type MenuItemNodeSection = MenuItemProps & { nodeItems?: MenuItemTreeNode };

  interface MenuItemTreeNode {
    nodeSections: MenuItemNodeSection[][];
    sections: MenuItemSection[];
    parent?: MenuItemTreeNode;
  }

  const items = useMemo(() => {
    const addPageToSections = (
      sections: MenuItemSection[],
      parent?: MenuItemTreeNode,
    ): MenuItemTreeNode => {
      const node: MenuItemTreeNode = {
        sections,
        nodeSections: [],
        parent,
      };

      node.nodeSections = sections.map<MenuItemNodeSection[]>((section) =>
        section.map((item) => {
          const itemNode: MenuItemNodeSection = {
            ...item,
            nodeItems: undefined,
          };
          if (item.items) {
            itemNode.nodeItems = addPageToSections(item.items, node);
          }
          return itemNode;
        }),
      );

      return node;
    };

    return addPageToSections(sections);
  }, [sections]);

  const [currentNode, setCurrentNode] = useState<MenuItemTreeNode>(items);

  useEffect(() => {
    setCurrentNode(items);
  }, [items]);

  const handleSelect = useCallback(
    (e: Event | SyntheticEvent, item: MenuItemNodeSection) => {
      if (item.nodeItems) {
        // Prevent the menu from closing
        e.stopPropagation();
        e.preventDefault();
        setCurrentNode(item.nodeItems);
      } else if ("onSelect" in item) {
        item.onSelect?.(e);
      }
    },
    [],
  );

  const hasLeftIcons = useMemo(() => {
    return currentNode.nodeSections.some((section) =>
      section.some((item) => item.LeftIcon || item.CustomLeftIcon),
    );
  }, [currentNode]);

  const pageSections = useMemo(
    () => [
      ...(currentNode.parent !== undefined
        ? [
            [
              {
                label: "Back",
                LeftIcon: IconChevronLeft,
                items: currentNode.parent.sections,
                nodeItems: currentNode.parent,
              },
            ],
          ]
        : []),
      ...currentNode.nodeSections,
    ],
    [currentNode],
  );

  return {
    sections: pageSections,
    onSelect: handleSelect,
    hasLeftIcons,
  };
};
