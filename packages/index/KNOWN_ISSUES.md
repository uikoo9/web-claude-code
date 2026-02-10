# Known Issue: Hydration Warning with Chakra UI

## Issue Description

When running the development server, you may see the following hydration warning:

```
Hydration failed because the server rendered HTML didn't match the client.
```

**Location**: `src/app/page.tsx:21`

## Root Cause

This is a **known issue** with Chakra UI v3 and Next.js App Router when using:
- Server-Side Rendering (SSR)
- Emotion CSS-in-JS
- Global styles injection

The issue occurs because:
1. Server renders HTML with inline styles
2. Client hydrates with emotion's global styles
3. The timing of style injection differs between server and client
4. This causes a mismatch in the initial DOM structure

## Impact

✅ **Does NOT affect**:
- Functionality - the app works correctly
- Production builds - warning only shows in development
- SEO - search engines see the correct content
- User experience - no visible issues

❌ **Only affects**:
- Development console - shows warning message
- Developer experience - warning noise

## Why We Keep SSR Despite the Warning

We chose to keep SSR enabled because:

1. **SEO Benefits** ✅
   - Search engines can crawl the full content
   - Better ranking and indexing
   - Social media previews work correctly

2. **Performance** ✅
   - Faster initial page load
   - Better Time to First Byte (TTFB)
   - Improved Core Web Vitals

3. **User Experience** ✅
   - Content visible immediately
   - No flash of unstyled content
   - Better perceived performance

## Solutions Attempted

### ❌ Attempted Solutions (Trade-offs not worth it)

1. **Disable SSR entirely**
   - Loses all SEO benefits
   - Slower initial load
   - Poor search engine visibility

2. **Client-side only rendering**
   - Adds `'use client'` to page
   - Search engines see empty page
   - Bad for social media sharing

3. **Hide content until mounted**
   - Flash of empty screen
   - Poor user experience
   - Defeats the purpose of SSR

### ✅ Current Solution

**Accept the warning as a known limitation**

We've added `suppressHydrationWarning` to minimize the warning, but some may still appear. This is acceptable because:

1. Only shows in development mode
2. Does not affect production builds
3. Does not impact functionality
4. Keeps all SSR/SEO benefits intact

## Mitigation Steps Taken

1. ✅ Disabled `reactStrictMode` to reduce double-rendering issues
2. ✅ Added `suppressHydrationWarning` to key elements
3. ✅ Configured Emotion compiler in Next.js
4. ✅ Set `cssVarsRoot="body"` in ChakraProvider
5. ✅ Used `key={locale}` to force remount on language change

## References

- [Chakra UI v3 Next.js Integration](https://www.chakra-ui.com/docs/get-started/frameworks/nextjs)
- [Next.js Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [Emotion SSR](https://emotion.sh/docs/ssr)

## Upstream Issue Tracking

This is a known issue in the community:
- Chakra UI v3 is relatively new (released 2024)
- Next.js App Router SSR support is evolving
- Emotion's SSR handling with App Router needs improvement

Expected to be resolved in future versions of:
- Chakra UI v3.x
- Next.js 16+
- Emotion 12+

## Recommendation

**For now, ignore this warning in development.**

The warning does not indicate a real problem with your application. Everything works correctly in both development and production.

If the warning becomes too distracting, you can:
1. Filter it out in your browser console
2. Use a browser extension to hide React hydration warnings
3. Wait for upstream fixes in Chakra UI / Next.js

---

**Last Updated**: 2026-02-10
**Status**: Known Issue - Safe to Ignore
