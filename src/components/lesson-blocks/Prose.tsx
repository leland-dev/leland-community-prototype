// Renders a markdown string with leland typography. Shared by MarkdownBlock and
// any block that carries markdown body text (callouts, captions). react-markdown
// emits its top-level blocks as direct children, so the flex-col gap wrapper
// spaces paragraphs / lists / headings uniformly.
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const isBlockCode = (className?: string, children?: React.ReactNode) =>
  /language-/.test(className ?? "") || String(children ?? "").includes("\n");

const components: Components = {
  h1: ({ children }) => (
    <h2 className="leland-heading-3xl font-semibold text-leland-gray-dark">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="leland-heading-2xl font-semibold text-leland-gray-dark">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="leland-heading-xl font-semibold text-leland-gray-dark">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="leland-paragraph-lg text-leland-gray-dark">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 leland-paragraph-lg text-leland-gray-dark marker:text-leland-gray-extra-light">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="flex list-decimal flex-col gap-1.5 pl-5 leland-paragraph-lg text-leland-gray-dark marker:text-leland-gray-extra-light">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-leland-gray-dark underline decoration-leland-gray-extra-light decoration-[1.5px] underline-offset-2 hover:decoration-leland-gray-dark"
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

export function Prose({ body, className }: { body: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
