const { createMdxAstCompiler } = require("@mdx-js/mdx");
const mdxHastToJsx = require("@mdx-js/mdx/mdx-hast-to-jsx");

const input = `import YouTube from "./YouTube";

# Welcome

<YouTube id="123" />
`;

const compiler = createMdxAstCompiler({ remarkPlugins: [] }).use(mdxHastToJsx);
const jsx = compiler.processSync(input).toString();
console.log(jsx);
