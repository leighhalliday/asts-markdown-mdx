import React, { useState, useEffect } from "react";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import raw from "rehype-raw";
import stringify from "rehype-stringify";

const Node = ({ node }) => (
  <div style={{ paddingLeft: `15px` }}>
    <strong>
      {node.type}
      {node.depth && <span> (d{node.depth})</span>}
    </strong>

    {node.value && <div style={{ paddingLeft: "15px" }}>{node.value}</div>}

    {node.children &&
      node.children.map(child => {
        const { line, column, offset } = child.position.start;
        return <Node key={`${line}-${column}-${offset}`} node={child} />;
      })}
  </div>
);

function elementCount(acc, node) {
  acc[node.type] = (acc[node.type] || 0) + 1;

  return (node.children || []).reduce(
    (childAcc, childNode) => elementCount(childAcc, childNode),
    acc
  );
}

function wordCount(count, node) {
  if (node.type === "text") {
    return count + node.value.split(" ").length;
  } else {
    return (node.children || []).reduce(
      (childCount, childNode) => wordCount(childCount, childNode),
      count
    );
  }
}

function App() {
  const [input, setInput] = useState(`# Welcome`);
  const [tree, setTree] = useState({});
  const [words, setWords] = useState(0);
  const [elements, setElements] = useState({});
  const [html, setHtml] = useState("");

  useEffect(() => {
    const treeResult = unified()
      .use(markdown)
      .parse(input);
    setTree(treeResult);
    setElements(elementCount({}, treeResult));
    setWords(wordCount(0, treeResult));

    (async () => {
      const htmlResult = await unified()
        .use(markdown)
        .use(remark2rehype, { allowDangerousHTML: true })
        .use(raw)
        .use(stringify)
        .process(input);
      setHtml(htmlResult);
    })();
  }, [input]);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <textarea
          style={{ width: "50vw", height: "50vh" }}
          value={input}
          onChange={e => {
            setInput(e.target.value);
          }}
        />
        <div
          style={{ width: "50vw", height: "50vh", overflowY: "scroll" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50vw" }}>
          <p>{words} words</p>
          <ul>
            {Object.entries(elements)
              .sort(([_keyA, a], [_keyB, b]) => b - a)
              .map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
          </ul>
        </div>
        <div style={{ width: "50vw" }}>
          <Node node={tree} />
        </div>
      </div>
    </div>
  );
}

export default App;
