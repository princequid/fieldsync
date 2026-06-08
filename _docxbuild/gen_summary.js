const fs = require('fs');
const path = require('path');

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function run(text, opts = {}) {
  const props = [];
  if (opts.bold) props.push('<w:b/>');
  if (opts.italic) props.push('<w:i/>');
  if (opts.size) props.push(`<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>`);
  if (opts.color) props.push(`<w:color w:val="${opts.color}"/>`);
  const rPr = props.length ? `<w:rPr>${props.join('')}</w:rPr>` : '';
  return `<w:r>${rPr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function para(runs, { spacingAfter = 120, spacingBefore = 0, indent } = {}) {
  const pPrParts = [`<w:spacing w:before="${spacingBefore}" w:after="${spacingAfter}"/>`];
  if (indent) pPrParts.push(`<w:ind w:left="${indent}"/>`);
  return `<w:p><w:pPr>${pPrParts.join('')}</w:pPr>${runs}</w:p>`;
}

function title(text) { return para(run(text, { bold: true, size: 44 }), { spacingAfter: 240 }); }
function h1(text) { return para(run(text, { bold: true, size: 32, color: '1A6FA8' }), { spacingBefore:360, spacingAfter:160 }); }
function bullet(text) { return para(run('•  ' + text, { size: 22 }), { spacingAfter: 60, indent: 360 }); }

function walk(dir, base) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results.push(...walk(full, base));
    } else {
      results.push(path.relative(base, full).replace(/\\/g, '/'));
    }
  });
  return results;
}

function describeFile(absPath, relPath) {
  try {
    const content = fs.readFileSync(absPath, 'utf8');
    // Heuristics
    if (/mongoose\.Schema/.test(content) || /module\.exports = mongoose\.model/.test(content)) {
      const m = content.match(/module\.exports = mongoose\.model\(["']([A-Za-z0-9_]+)["']/);
      const name = m ? m[1] : path.basename(relPath);
      return `Mongoose model for ${name}. Defines the MongoDB schema and fields used to persist ${name} documents.`;
    }
    if (/typeDefs|#graphql/.test(content) || /type Job|type User/.test(content)) {
      return `GraphQL type definitions located in ${relPath}. Declares schema types, queries and mutations for the API.`;
    }
    if (/Resolver|resolvers|Query:|Mutation:/.test(content)) {
      return `GraphQL resolvers implementing the queries and mutations declared in the typeDefs. Contains business logic, DB calls and authorization checks.`;
    }
    if (/ApolloClient|createHttpLink|ApolloProvider/.test(content)) {
      return `Apollo client configuration for the frontend. Sets up HTTP link, auth link and cache used by UI GraphQL calls.`;
    }
    if (/React|from 'react'|from "react"|jsx/.test(content) || /function .*\(/.test(content) && /return \(/.test(content)) {
      return `React component or page used by the frontend UI. Renders UI and composes other components.`;
    }
    if (/express|app\.use|module\.exports = app/.test(content)) {
      return `Express application bootstrap or middleware registration. Sets up JSON parsing, CORS and attaches routes or Apollo middleware.`;
    }
    if (/dotenv|MongoDB|mongoose|connectDB/.test(content)) {
      return `Configuration or startup script responsible for environment, database connection, or server start logic.`;
    }
    if (/utils|helpers|generateToken|validator|validate/.test(relPath) || /module\.exports/.test(content)) {
      return `Utility/helper module that provides a focused function used across the codebase (validation, token generation, small helpers).`;
    }
    return `Project file: ${relPath}. Provides code or assets used by the application; open the file for exact details.`;
  } catch (err) {
    return `Could not read file to summarize: ${err.message}`;
  }
}

// entry
const workspaceRoot = path.resolve(__dirname, '..');
const roots = [
  path.join(workspaceRoot, 'backend', 'src'),
  path.join(workspaceRoot, 'frontendui', 'src'),
  path.join(workspaceRoot, 'database'),
  path.join(workspaceRoot, 'docs')
];

const paras = [];
paras.push(title('Project File Summary'));
paras.push(bullet(`Generated ${new Date().toISOString().slice(0,10)}`));

roots.forEach((r) => {
  if (!fs.existsSync(r)) return;
  const relFiles = walk(r, workspaceRoot);
  const section = h1(path.relative(workspaceRoot, r) || r);
  paras.push(section);
  relFiles.sort().forEach((f) => {
    const abs = path.join(workspaceRoot, f);
    const desc = describeFile(abs, f);
    paras.push(bullet(`${f} — ${desc}`));
  });
});

const body_xml = paras.join('');

const sectPr = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>';

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n  <w:body>\n    ${body_xml}\n    ${sectPr}\n  </w:body>\n</w:document>`;

const outDir = path.join(__dirname, 'word');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'document.xml'), documentXml, 'utf8');
console.log('document.xml written, length:', documentXml.length);
