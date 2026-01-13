import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';

const files = glob.sync('src/**/*.{ts,tsx}');

const sxMap = new Map();

function normalizeObject(obj) {
  // Sort keys so order differences don’t break dedupe
  return JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {})
  );
}

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = babelParser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });
  } catch (e) {
    console.error(`Parse fail in ${file}`);
    continue;
  }

  traverse(ast, {
    JSXAttribute(path) {
      if (path.node.name.name === 'sx') {
        const expr = path.node.value?.expression;
        if (expr?.type === 'ObjectExpression') {
          const obj = {};
          expr.properties.forEach((p) => {
            if (p.type === 'ObjectProperty' && p.key.type === 'Identifier') {
              obj[p.key.name] =
                p.value.type === 'StringLiteral'
                  ? p.value.value
                  : p.value.type === 'NumericLiteral'
                    ? p.value.value
                    : 'EXPR'; // if it’s dynamic, just placeholder
            }
          });

          const norm = normalizeObject(obj);
          if (!sxMap.has(norm)) {
            sxMap.set(norm, { count: 0, files: new Set() });
          }
          sxMap.get(norm).count++;
          sxMap.get(norm).files.add(file);
        }
      }
    },
  });
}

// Output
const sorted = [...sxMap.entries()].sort((a, b) => b[1].count - a[1].count);
for (const [sx, data] of sorted) {
  console.log(`${sx} → ${data.count} uses`);
  console.log(
    '   files:',
    [...data.files].slice(0, 5).join(', '),
    data.files.size > 5 ? '...' : ''
  );
}
