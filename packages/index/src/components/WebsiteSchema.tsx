export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "webcc.dev",
    url: "https://webcc.dev",
    description:
      "Use Claude Code directly in your web browser. A powerful web-based terminal interface for Claude CLI.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://webcc.dev/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "webcc.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://webcc.dev/logo.svg",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
