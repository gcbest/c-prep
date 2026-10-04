// Collects the list items inside every <CheatSheet> block and appends them to the
// MDX frontmatter as `cheatsheet: [...]`, so /cheatsheet can show them without
// rendering the lesson. Must run after remark-frontmatter and before remark-mdx-frontmatter.
type Node = { type: string; name?: string; value?: string; children?: Node[] };

function text(node: Node): string {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(text).join('');
}

function collect(node: Node, items: string[]) {
  if (node.type === 'mdxJsxFlowElement' && node.name === 'CheatSheet') {
    const walk = (n: Node) => {
      if (n.type === 'listItem') items.push(text(n).replace(/\s+/g, ' ').trim());
      else (n.children ?? []).forEach(walk);
    };
    (node.children ?? []).forEach(walk);
    return;
  }
  (node.children ?? []).forEach(child => collect(child, items));
}

export default function remarkCheatSheet() {
  return (tree: Node) => {
    const items: string[] = [];
    collect(tree, items);
    let yaml = tree.children?.find(child => child.type === 'yaml');
    if (!yaml) {
      yaml = { type: 'yaml', value: '' };
      tree.children = [yaml, ...(tree.children ?? [])];
    }
    yaml.value = `${yaml.value ?? ''}\ncheatsheet: ${JSON.stringify(items)}`;
  };
}
