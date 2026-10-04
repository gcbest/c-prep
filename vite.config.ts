import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeShiki from '@shikijs/rehype';
import remarkCheatSheet from './plugins/remark-cheatsheet.ts';

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm, remarkCheatSheet, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
        rehypePlugins: [[rehypeShiki, { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false }]],
      }),
    },
    react(),
  ],
  build: { chunkSizeWarningLimit: 1500 },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
