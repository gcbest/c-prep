import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MDXProvider } from '@mdx-js/react';
import Lesson from './lessons/01-how-this-plan-works.mdx';
import { mdxComponents } from '../components';

// Regression guard: MDX v3 only resolves components from <MDXProvider> when the
// rollup plugin sets providerImportSource: '@mdx-js/react' (see vite.config.ts).
// Without it, the first custom component used in a lesson throws
// "Expected component `X` to be defined".
describe('MDX provider wiring', () => {
  it('resolves custom components used inside lesson content', () => {
    const html = renderToStaticMarkup(
      createElement(MDXProvider, { components: mdxComponents }, createElement(Lesson)),
    );
    expect(html).toContain('Choose your backend');
    expect(html).toContain('Your backend track'); // <BackendChoice /> rendered
    expect(html).toContain('You know this from'); // <Bridge /> rendered
  });
});
