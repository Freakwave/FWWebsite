import { readFile } from 'node:fs/promises';
import path from 'node:path';

const includePattern = /<!--\s*@include\s+([\w./-]+)\s*-->/g;

async function readPartial(includePath, root, stack) {
  const resolved = path.resolve(root, includePath);
  if (!resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`HTML include escapes project root: ${includePath}`);
  }
  if (stack.includes(resolved)) {
    throw new Error(`Circular HTML include detected: ${includePath}`);
  }
  const fragment = await readFile(resolved, 'utf8');
  return expandIncludes(fragment, root, [...stack, resolved]);
}

/** Replaces every `<!-- @include path -->` comment with the referenced file, recursively. */
export async function expandIncludes(html, root, stack = []) {
  let output = '';
  let cursor = 0;
  for (const match of html.matchAll(includePattern)) {
    output += html.slice(cursor, match.index);
    output += await readPartial(match[1], root, stack);
    cursor = match.index + match[0].length;
  }
  return output + html.slice(cursor);
}

const isPartial = (file) => file.replaceAll('\\', '/').includes('/src/partials/');

export function htmlPartials({ root }) {
  return {
    name: 'html-partials',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => expandIncludes(html, root),
    },
    handleHotUpdate({ file, server }) {
      if (!isPartial(file)) return undefined;
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}
