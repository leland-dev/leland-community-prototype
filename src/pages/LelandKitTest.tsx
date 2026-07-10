// Reference sheet for the Leland production design system port
// (src/components/leland + src/styles/leland-theme.css).
import { useState } from "react";
import {
  Button,
  ButtonColor,
  ButtonSize,
  ProgressBar,
  ProgressBarColor,
  Tag,
  TagColor,
} from "../components/leland";
import * as LelandIcons from "../components/leland/svg/icons";
import { IconArrowRight, IconSearch } from "../components/leland/svg/icons";

const SWATCHES: Array<[string, string]> = [
  ["leland-primary", "bg-leland-primary"],
  ["leland-primary-hover", "bg-leland-primary-hover"],
  ["leland-primary-light", "bg-leland-primary-light"],
  ["leland-primary-extra-light", "bg-leland-primary-extra-light"],
  ["leland-success", "bg-leland-success"],
  ["leland-success-light", "bg-leland-success-light"],
  ["leland-success-extra-light", "bg-leland-success-extra-light"],
  ["leland-gray-dark", "bg-leland-gray-dark"],
  ["leland-gray-light", "bg-leland-gray-light"],
  ["leland-gray-extra-light", "bg-leland-gray-extra-light"],
  ["leland-gray-stroke", "bg-leland-gray-stroke"],
  ["leland-dark-green", "bg-leland-dark-green"],
  ["leland-red", "bg-leland-red"],
  ["leland-orange", "bg-leland-orange"],
  ["leland-blue", "bg-leland-blue"],
  ["leland-blue-brand", "bg-leland-blue-brand"],
  ["leland-purple", "bg-leland-purple"],
  ["leland-yellow", "bg-leland-yellow"],
  ["leland-beige", "bg-leland-beige"],
  ["leland-rust", "bg-leland-rust"],
  ["leland-tan", "bg-leland-tan"],
  ["leland-slate", "bg-leland-slate"],
];

const TYPE_CLASSES = [
  "leland-heading-6xl",
  "leland-heading-4xl",
  "leland-heading-2xl",
  "leland-heading-xl",
  "leland-heading-base",
  "leland-subtext-xl",
  "leland-subtext-base",
  "leland-paragraph-lg",
  "leland-paragraph-base",
  "leland-eyebrow",
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="leland-eyebrow mb-4 text-leland-gray-extra-light">{title}</h2>
      {children}
    </section>
  );
}

export default function LelandKitTest() {
  const [iconQuery, setIconQuery] = useState("");
  const icons = Object.entries(LelandIcons).filter(([name]) =>
    name.toLowerCase().includes(iconQuery.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 font-macan text-leland-gray-dark">
      <h1 className="leland-heading-3xl">Leland design system port</h1>
      <p className="leland-paragraph-lg mt-2 mb-10 text-leland-gray-light">
        Production tokens and primitives from the monorepo. Import from{" "}
        <code className="rounded bg-leland-gray-hover px-1">components/leland</code>;
        tokens are usable directly (e.g.{" "}
        <code className="rounded bg-leland-gray-hover px-1">bg-leland-primary</code>,{" "}
        <code className="rounded bg-leland-gray-hover px-1">leland-heading-2xl</code>,{" "}
        <code className="rounded bg-leland-gray-hover px-1">font-macan</code>).
      </p>

      <Section title="Colors">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {SWATCHES.map(([name, cls]) => (
            <div key={name}>
              <div className={`h-12 rounded-lg border border-leland-gray-stroke ${cls}`} />
              <p className="mt-1 text-[11px] text-leland-gray-light">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type scale (Macan)">
        <div className="flex flex-col gap-3">
          {TYPE_CLASSES.map((cls) => (
            <div key={cls} className="flex items-baseline gap-6">
              <span className="w-44 shrink-0 text-[11px] text-leland-gray-extra-light">{cls}</span>
              <span className={cls}>Reach ambitious goals</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          {Object.values(ButtonColor)
            .filter((c) => !c.startsWith("REVEAL_") && c !== "TRANSPARENT")
            .map((color) => (
              <Button key={color} label={color} buttonColor={color} rounded />
            ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button label="Small" buttonColor={ButtonColor.PRIMARY} size={ButtonSize.SMALL} rounded />
          <Button label="Medium" buttonColor={ButtonColor.PRIMARY} rounded />
          <Button label="Large" buttonColor={ButtonColor.PRIMARY} size={ButtonSize.LARGE} rounded />
          <Button label="With icons" buttonColor={ButtonColor.SECONDARY} LeftIcon={IconSearch} RightIcon={IconArrowRight} rounded />
          <Button label="Selected" buttonColor={ButtonColor.SECONDARY} selected rounded />
          <Button label="Disabled" buttonColor={ButtonColor.PRIMARY} disabled rounded />
        </div>
      </Section>

      <Section title="Tags">
        <div className="flex flex-wrap items-center gap-3">
          {Object.values(TagColor).map((color) => (
            <Tag key={color} text={color} tagColor={color} />
          ))}
        </div>
      </Section>

      <Section title="Progress bars">
        <div className="flex max-w-sm flex-col gap-4">
          <ProgressBar value={65} />
          <ProgressBar value={40} color={ProgressBarColor.Dark} />
        </div>
      </Section>

      <Section title={`Icons (${icons.length})`}>
        <input
          value={iconQuery}
          onChange={(e) => setIconQuery(e.target.value)}
          placeholder="Filter icons…"
          className="mb-4 w-64 rounded-lg border border-leland-gray-stroke px-3 py-2 text-[0.875rem] focus:border-leland-gray-dark focus:outline-none"
        />
        <div className="grid grid-cols-4 gap-x-4 gap-y-5 sm:grid-cols-8">
          {icons.map(([name, Icon]) => (
            <div key={name} className="flex flex-col items-center gap-1.5 text-center">
              <Icon className="size-6" />
              <span className="break-all text-[10px] text-leland-gray-light">{name}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
