import MagicString from 'magic-string'
import { JSXElement, Node, parseSync } from 'oxc-parser'
import { walk } from 'oxc-walker'

let alias = 'x-if'

export function reactXIf(sourceCode: string, suffix: string, _alias: string) {
  if (!['jsx', 'tsx'].includes(suffix)) return sourceCode

  const res = parseSync(`index.${suffix}`, sourceCode, {
    astType: suffix.startsWith('ts') ? 'ts' : 'js',
    range: true,
  })
  if (res.errors.length > 0) {
    return sourceCode
  }

  alias = _alias
  xIfJsxInfo.length = 0

  const s = new MagicString(sourceCode)

  walk(res.program, {
    enter(node, parent) {
      switch (node.type) {
        case 'JSXElement':
          collectXIfJsx(node, parent)
          break
      }
    },
  })

  transformAllXIfJsx(s)

  return s.toString()
}

type XIfJsxInfo = {
  node: JSXElement
  parent: Node | null
}

const xIfJsxInfo: XIfJsxInfo[] = []

function collectXIfJsx(node: JSXElement, parent: Node | null) {
  const hasXIf = node.openingElement.attributes.some(
    (attr) =>
      attr.type === 'JSXAttribute' &&
      attr.name.type === 'JSXIdentifier' &&
      attr.name.name === alias,
  )
  if (!hasXIf) return
  xIfJsxInfo.push({ node, parent })
}

function transformAllXIfJsx(s: MagicString) {
  xIfJsxInfo
    .sort((a, b) => b.node.start - a.node.start)
    .forEach((info) => transformXIf(info, s))
  xIfJsxInfo.length = 0
}

function transformXIf(info: XIfJsxInfo, s: MagicString) {
  const { node, parent } = info
  let XIfValue = ''

  for (const attr of node.openingElement.attributes) {
    if (
      attr.type === 'JSXAttribute' &&
      attr.name.type === 'JSXIdentifier' &&
      attr.name.name === alias
    ) {
      XIfValue = s.slice(...attr.value!.range!)
      s.remove(...attr.range!)
      break
    }
  }

  if (XIfValue) {
    const jsxValue = s.slice(...node.range!)
    const condition = XIfValue.slice(1, -1)
    if (parent?.type === 'JSXElement' || parent?.type === 'JSXFragment') {
      s.overwrite(...node.range!, `{Boolean(${condition}) && (${jsxValue})}`)
    } else {
      s.overwrite(...node.range!, `(Boolean(${condition}) && (${jsxValue}))`)
    }
  }
}
