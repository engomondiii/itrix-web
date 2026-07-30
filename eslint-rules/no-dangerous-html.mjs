/**
 * itrix/no-dangerous-html
 *
 * Bans `dangerouslySetInnerHTML`, `innerHTML =` and `insertAdjacentHTML` in src/.
 *
 * ── WHY THIS IS A BUILD FAILURE AND NOT A REVIEW COMMENT ─────────────────────
 *
 * From v6.0 the transcript renders assistant text as formatted Markdown. The
 * design that makes that safe is structural rather than procedural: the parser
 * emits plain data, the renderer emits React elements, and React escapes every
 * text child — so no HTML string exists anywhere between a model's output and the
 * DOM (Architecture v2.7 §19.9 rule 2).
 *
 * That property is worth exactly as much as the discipline that maintains it. One
 * well-meant `dangerouslySetInnerHTML` — added to "just render the highlighted
 * code", or to support one more Markdown feature in a hurry — reintroduces the
 * entire class of bug the design removed, and it will pass code review because it
 * looks local and small.
 *
 * So the rule sits beside no-atelier-tokens: a retired practice banned by NAME, in
 * CI, where nobody has to remember it.
 *
 * If a genuine exception ever arises, disable it on the single line with a comment
 * explaining who reviewed the sanitisation. Do not widen the rule's scope.
 */

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban HTML-string injection. Assistant text renders as React elements; no HTML string may reach the DOM.',
    },
    schema: [],
    messages: {
      dangerous:
        '{{name}} is banned in src/. Assistant text renders through MarkdownTurn as React ' +
        'elements — no HTML string may reach the DOM (Architecture v2.7 §19.9 rule 2). ' +
        'If you need a new Markdown feature, add a node kind to lib/markdown/allowedNodes.ts ' +
        'and give it a renderer.',
    },
  },

  create(context) {
    function report(node, name) {
      context.report({ node, messageId: 'dangerous', data: { name } });
    }

    return {
      /* <div dangerouslySetInnerHTML={…} /> */
      JSXAttribute(node) {
        if (node.name && node.name.name === 'dangerouslySetInnerHTML') {
          report(node, 'dangerouslySetInnerHTML');
        }
      },

      /* React.createElement(x, { dangerouslySetInnerHTML: … }) and object literals */
      Property(node) {
        const key = node.key;
        const name = key && (key.name || key.value);
        if (name === 'dangerouslySetInnerHTML') report(node, 'dangerouslySetInnerHTML');
      },

      /* el.innerHTML = … and el.outerHTML = … */
      AssignmentExpression(node) {
        const left = node.left;
        if (left && left.type === 'MemberExpression' && left.property) {
          const prop = left.property.name || left.property.value;
          if (prop === 'innerHTML' || prop === 'outerHTML') report(node, prop);
        }
      },

      /* el.insertAdjacentHTML(…) and document.write(…) */
      CallExpression(node) {
        const callee = node.callee;
        if (callee && callee.type === 'MemberExpression' && callee.property) {
          const prop = callee.property.name;
          if (prop === 'insertAdjacentHTML' || prop === 'write' || prop === 'writeln') {
            /* document.write is only a problem on `document`; a `write` method on
               something else is almost certainly unrelated. */
            const objName = callee.object && callee.object.name;
            if (prop === 'insertAdjacentHTML' || objName === 'document') {
              report(node, prop === 'insertAdjacentHTML' ? 'insertAdjacentHTML' : 'document.write');
            }
          }
        }
      },
    };
  },
};

export default rule;
