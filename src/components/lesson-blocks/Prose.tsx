// Renders a markdown string with leland typography. Shared by MarkdownBlock and
// any block that carries markdown body text (callouts, captions). react-markdown
// emits its top-level blocks as direct children, so the flex-col gap wrapper
// spaces paragraphs / lists / headings uniformly.
import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const isBlockCode = (className?: string, children?: React.ReactNode) =>
  /language-/.test(className ?? "") || String(children ?? "").includes("\n");

const H2_CLASS = "leland-heading-2xl font-semibold! text-leland-gray-dark md:leland-heading-3xl";
// Exported so other components (e.g. the accordion row title) can reuse the
// real H3 treatment instead of hard-coding a one-off size.
export const H3_CLASS = "leland-heading-lg font-semibold! text-leland-gray-dark md:leland-heading-xl";

// h1 gets its own large Season-font treatment — except inside contexts that
// disallow it (e.g. a callout's content), where it's demoted to H2 size so it
// can't blow out a compact container.
function buildComponents(allowH1: boolean): Components {
  return {
  h1: allowH1
    ? ({ children }) => (
        <h2 className="text-heading-4xl font-normal font-season text-leland-gray-dark md:text-heading-5xl">
          {children}
        </h2>
      )
    : ({ children }) => <h2 className={H2_CLASS}>{children}</h2>,
  h2: ({ children }) => <h2 className={H2_CLASS}>{children}</h2>,
  h3: ({ children }) => <h3 className={H3_CLASS}>{children}</h3>,
  p: ({ children }) => (
    <p className="leland-paragraph-base text-leland-gray-dark md:leland-paragraph-lg">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="flex list-disc flex-col gap-4 pl-5 leland-paragraph-lg text-leland-gray-dark marker:text-leland-gray-extra-light">
      {children}
    </ul>
  ),
  // Numbers each <li> ourselves (rather than relying on react-markdown to pass
  // an `ordered`/`index` prop, which this version doesn't) so `li` can render
  // the circle-badge + dotted-connector "steps" treatment for ordered lists.
  ol: ({ children }) => (
    <ol className="flex flex-col text-leland-gray-dark">
      {Children.toArray(children)
        .filter(isValidElement)
        .map((child, i) => cloneElement(child, { index: i } as { index: number }))}
    </ol>
  ),
  li: (({ children, index }: { children?: ReactNode; index?: number }) =>
    index !== undefined ? (
      <li className="group grid grid-cols-[24px_1fr] gap-x-4">
        <div className="flex flex-col items-center">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-leland-gray-stroke bg-white text-[13px] font-semibold text-leland-gray-dark">
            {index + 1}
          </span>
          <span className="mt-1 w-0 flex-1 border-l-2 border-dotted border-leland-gray-stroke group-last:hidden" />
        </div>
        <div className="pb-4 leland-paragraph-lg text-leland-gray-dark group-last:pb-0">
          {children}
        </div>
      </li>
    ) : (
      <li className="pl-1">{children}</li>
    )) as Components["li"],
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-leland-gray-dark underline decoration-dotted decoration-leland-gray-extra-light decoration-[1.5px] underline-offset-4 hover:decoration-leland-gray-dark"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ className, children }) =>
    isBlockCode(className, children) ? (
      <code className="font-mono text-[13px] leading-relaxed text-leland-gray-dark">
        {children}
      </code>
    ) : (
      <code className="rounded bg-leland-gray-hover px-1.5 py-0.5 font-mono text-[0.85em] text-leland-gray-dark">
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg border border-leland-gray-stroke bg-leland-gray-hover p-4">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-leland-gray-stroke pl-4 leland-paragraph-base italic text-leland-gray-light">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-leland-gray-stroke" />,
  img: ({ src, alt }) => (
    <img src={typeof src === "string" ? src : undefined} alt={alt} className="max-w-full rounded-lg" />
  ),
  table: ({ children }) => (
    // Extra top margin so tables aren't cramped against the text above (adds to
    // the Prose flex gap).
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse overflow-hidden rounded-lg border border-leland-gray-stroke bg-white text-left">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-leland-gray-hover">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-leland-gray-stroke px-4 py-2.5 leland-heading-base font-semibold text-leland-gray-dark">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-leland-gray-stroke px-4 py-2.5 align-top leland-paragraph-base text-leland-gray-dark">
      {children}
    </td>
  ),
  };
}

export function Prose({
  body,
  className,
  allowH1 = true,
}: {
  body: string;
  className?: string;
  allowH1?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={buildComponents(allowH1)}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
