const { createMdxAstCompiler } = require("@mdx-js/mdx");

function removePosition(node) {
  delete node.position;
  if (node.children) {
    node.children = node.children.map(child => removePosition(child));
  }
  return node;
}

const compiler = createMdxAstCompiler({ remarkPlugins: [] });
const input = `
import YouTube from "./YouTube";

# Welcome

<YouTube id="123" />
`;

const ast = compiler.parse(input);
const astString = JSON.stringify(removePosition(ast), null, 2);
console.log(astString);
