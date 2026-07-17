// Remark plugin (used with remark-directive) turning an `::example` leaf
// directive in content markdown into a placeholder the blocks builder splits
// on. Authors write, on its own line:
//
//   ::example{id="button/variants" title="Button variants"}
//
// where `id` is the example's path under src/examples/<collection>/ (the page
// route supplies the collection). The placeholder carries the id and title,
// so the rendered HTML self-describes each example's position - no fence
// counting. Plain .js so astro.config.mjs can import it directly.

const escapeAttr = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function remarkExample() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'leafDirective' && child.name === 'example') {
        const { id, title } = child.attributes ?? {};
        if (!id) {
          throw new Error('::example directive is missing its id attribute');
        }
        const titleAttr = title ? ` data-title="${escapeAttr(title)}"` : '';
        return {
          type: 'html',
          value: `<div data-example-block="${escapeAttr(id)}"${titleAttr}></div>`,
        };
      }
      walk(child);
      return child;
    });
  };
  return walk;
}
