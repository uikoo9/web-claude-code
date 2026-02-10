export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://webcc.dev/#website',
        url: 'https://webcc.dev',
        name: 'webcc.dev',
        description:
          'Use Claude Code directly in your web browser. A powerful web-based terminal interface for Claude CLI.',
        publisher: {
          '@id': 'https://webcc.dev/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://webcc.dev/?s={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['en-US', 'zh-CN'],
      },
      {
        '@type': 'Organization',
        '@id': 'https://webcc.dev/#organization',
        name: 'webcc.dev',
        url: 'https://webcc.dev',
        logo: {
          '@type': 'ImageObject',
          url: 'https://webcc.dev/logo.svg',
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://github.com/uikoo9/web-claude-code',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://webcc.dev/#webpage',
        url: 'https://webcc.dev',
        name: 'webcc.dev - Claude Code Web Interface',
        isPartOf: {
          '@id': 'https://webcc.dev/#website',
        },
        about: {
          '@id': 'https://webcc.dev/#organization',
        },
        description:
          'Use Claude Code directly in your web browser. A powerful web-based terminal interface for Claude CLI.',
        inLanguage: ['en-US', 'zh-CN'],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'webcc',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          ratingCount: '1',
        },
        description:
          'A web-based interface for Claude Code CLI that lets you use Claude directly in your browser.',
        url: 'https://webcc.dev',
        screenshot: 'https://static-small.vincentqiao.com/webcc.png',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
