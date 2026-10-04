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
  type KeyboardEvent as ReactKeyboardEvent,
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

import { IconChevronLeft, IconSearch } from "./svg/icons";
import { FontWeight, FontWeightToStyles } from "./util";

function filterMenuItems(items: MenuItemProps[], query: string): MenuItemProps[] {
  return items.flatMap((item) => {
    if (item.label.toLowerCase().includes(query)) {
      return [item];
    }
    if (!item.items) {
      return [];
    }
    const matchingChildren = filterMenuSections(item.items, query);
    return matchingChildren.length > 0
      ? [{ ...item, items: matchingChildren }]
      : [];
  });
}

function filterMenuSections(
  sections: MenuItemProps[][],
  query: string,
): MenuItemProps[][] {
  return sections
    .map((section) => filterMenuItems(section, query))
    .filter((section) => section.length > 0);
}

function useMenuSearch(
  sections: MenuItemProps[][],
  enabled: boolean,
): {
  query: string;
  onQueryChange: (value: string) => void;
  resetQuery: () => void;
  sections: MenuItemProps[][];
  hasQuery: boolean;
} {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const hasQuery = enabled && normalizedQuery !== '';

  const filteredSections = useMemo(
    () => (hasQuery ? filterMenuSections(sections, normalizedQuery) : sections),
    [sections, hasQuery, normalizedQuery],
  );

  const resetQuery = useCallback(() => setQuery(''), []);

  return {
    query,
    onQueryChange: setQuery,
    resetQuery,
    sections: filteredSections,
    hasQuery,
  };
}

export type MenuItemLeftIconSize = 'default' | 'large';

export type MenuItemProps = {
  label: string;
  description?: string;
  leftIconSize?: MenuItemLeftIconSize;
  CustomLeftIcon?: FC<{ iconClassName?: string }>;
  LeftIcon?: FC<SVGProps<SVGSVGElement>>;
  CustomRightIcon?: FC<{ iconClassName?: string }>;
  RightIcon?: FC<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  fontWeight?: FontWeight;
  selected?: boolean;
  destructive?: boolean;
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
      onSelect?: (e: Event | SyntheticEvent) => void;
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
  destructive?: boolean;
};

const MenuItem = forwardRef<HTMLDivElement, InternalMenuItemProps>(
  (
    {
      label,
      description,
      leftIconSize = 'default',
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
      destructive = false,
    },
    ref,
  ) => {
    const iconStyles = "size-5";
    const leftIconStyles = leftIconSize === 'large' ? 'size-10' : iconStyles;
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

    const toneClassName = destructive
      ? 'text-leland-red hover:bg-leland-red-light focus:bg-leland-red-light active:bg-leland-red-light focus-visible:ring-leland-red'
      : 'text-leland-gray-dark hover:bg-leland-gray-hover focus:bg-leland-gray-hover active:bg-leland-gray-hover focus-visible:ring-leland-gray-dark';

    const selectedClassName = selected
      ? destructive
        ? 'bg-leland-red-light'
        : 'bg-leland-gray-hover'
      : '';

    const itemClassName = `flex w-full group cursor-pointer select-none items-center justify-between gap-x-2.5 rounded-md p-2.5 text-[0.875rem] leading-tight outline-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${toneClassName} ${selectedClassName} ${FontWeightToStyles[fontWeight]}`;

    const menuItem = (
      <>
        <div className="flex min-w-0 items-center gap-x-2.5">
          {CustomLeftIcon ? (
            <CustomLeftIcon iconClassName={leftIconStyles} />
          ) : LeftIcon ? (
            <LeftIcon className={leftIconStyles} />
          ) : includeLeftIconPlaceholder ? (
            <div className={leftIconStyles} />
          ) : null}
          {description ? (
            <span className="flex min-w-0 flex-col gap-y-0.5 text-left">
              <span className="truncate">{label}</span>
              <span className="truncate text-[0.75rem] font-normal text-leland-gray-light">
                {description}
              </span>
            </span>
          ) : (
            <span>{label}</span>
          )}
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
          <DropdownMenuItem ref={ref} asChild onSelect={onSelect}>
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
  /**
   * If true, the trigger emits no corner radius of its own, leaving the shape to
   * the element passed in via `asChild`.
   *
   * Needed because this package's stylesheet loads after the consuming app's, so
   * the default `rounded-sm` here and a consumer's own radius utility tie on
   * specificity and this one wins — a pill trigger renders with clipped corners.
   * Set this when the trigger is not a standard rectangle; the focus ring follows
   * whatever radius the element carries either way.
   * @default false
   */
  hasCustomTriggerRadius?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

const MENU_ITEM_HEIGHT_PX = 44;
const TWO_LINE_MENU_ITEM_HEIGHT_PX = 60;
const MENU_SEPARATOR_HEIGHT_PX = 9;

function menuItemHeightPx(item: MenuItemProps): number {
  return item.description || item.leftIconSize === 'large'
    ? TWO_LINE_MENU_ITEM_HEIGHT_PX
    : MENU_ITEM_HEIGHT_PX;
}

function visibleHeightPx(
  sections: MenuItemSection[],
  maxItems: number,
): number {
  let height = 0;
  let counted = 0;
  sections.forEach((section, sectionIndex) => {
    if (counted >= maxItems) return;
    if (sectionIndex > 0) height += MENU_SEPARATOR_HEIGHT_PX;
    section.forEach((item) => {
      if (counted >= maxItems) return;
      height += menuItemHeightPx(item);
      counted += 1;
    });
  });
  return height;
}

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
  hasCustomTriggerRadius = false,
  searchable = false,
  searchPlaceholder = 'Search',
}) => {
  const itemSections = useMemo(
    () => rawItemSections.filter((section) => section.length > 0),
    [rawItemSections],
  );

  const {
    query,
    onQueryChange,
    resetQuery,
    sections: searchedSections,
    hasQuery,
  } = useMenuSearch(itemSections, searchable);

  const parentMenuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemListRef = useRef<HTMLDivElement>(null);

  const { onMouseEnter, open, onOpenChange, containerRef, menuItemRefs } =
    useControlledHoverState({
      openOnHover,
      parentMenuRef,
      onOpenChange: onOpenChangeProp,
    });

  const [isOpenInternally, setIsOpenInternally] = useState(false);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setIsOpenInternally(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const effectiveOpen = controlledOpen ?? open ?? isOpenInternally;

  useEffect(() => {
    if (!searchable || effectiveOpen) {
      return;
    }
    resetQuery();
  }, [searchable, effectiveOpen, resetQuery]);

  useEffect(() => {
    if (!searchable || loading || !effectiveOpen) {
      return;
    }
    const frame = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [searchable, loading, effectiveOpen]);

  const focusEdgeItem = useCallback((edge: 'first' | 'last') => {
    const items = itemListRef.current?.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([data-disabled])',
    );
    if (!items || items.length === 0) {
      return;
    }
    const target = edge === 'first' ? items[0] : items[items.length - 1];
    target?.focus();
  }, []);

  const handleSearchKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        focusEdgeItem(event.key === 'ArrowDown' ? 'first' : 'last');
        return;
      }
      if (event.key === 'Escape' || event.key === 'Tab') {
        return;
      }
      event.stopPropagation();
    },
    [focusEdgeItem],
  );

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
  } = usePageSubmenus(searchedSections);
  const sections = subMenusInPageView ? pageSections : searchedSections;

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
      onOpenChange={handleOpenChange}
      modal={!fillParentWidth && !openOnHover}
    >
      <DropdownMenuTrigger
        className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-leland-gray-dark ${
          hasCustomTriggerRadius ? '' : 'rounded-sm'
        }`}
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
            <div
              className="flex flex-col gap-2"
              data-testid="menu-loading"
              role="status"
              aria-busy="true"
              aria-label="Loading"
            >
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
              {searchable ? (
                <div className="-mx-2 mb-1 flex items-center gap-x-2.5 border-b border-leland-gray-stroke px-4.5 pb-2 pt-1">
                  <IconSearch className="size-4 shrink-0 text-leland-gray-light" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    aria-label={searchPlaceholder}
                    placeholder={searchPlaceholder}
                    className="w-full min-w-0 bg-transparent text-[0.875rem] leading-tight text-leland-gray-dark outline-none placeholder:text-leland-gray-extra-light"
                    onChange={(event) => onQueryChange(event.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
              ) : null}
              <div
                ref={itemListRef}
                className="overflow-y-auto"
                style={{
                  maxHeight:
                    maxItems && sections.length > 0
                      ? `${visibleHeightPx(sections, maxItems)}px`
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
                {hasQuery && sections.length === 0 ? (
                  <div className="p-2.5 text-[0.875rem] leading-tight text-leland-gray-light">
                    No matches
                  </div>
                ) : null}
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
