declare module '*.mdx' {
  import type { ComponentType } from 'react';
  export const frontmatter: {
    number: number;
    title: string;
    minutes: number;
    day: number;
    optional?: boolean;
    track?: 'both' | 'java' | 'python';
    cheatsheet: string[];
  };
  const Body: ComponentType;
  export default Body;
}
