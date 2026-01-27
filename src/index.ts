import { reactXIf } from 'src/x-if'
import { Plugin } from 'vite'

export default function reactXIfPlugin(alias = 'x-if'): Plugin {
  return {
    name: 'vite-plugin-react-x-if',
    enforce: 'pre',
    transform(code, id) {
      const suffix = getSuffix(id)

      try {
        return reactXIf(code, id, suffix, alias)
      } catch (error) {
        console.error(`[react-x-if] ${id} transform failed: ${error}`)
        return null
      }
    },
  }
}

function getSuffix(id: string) {
  const index = id.lastIndexOf('.')
  return id.slice(index + 1)
}
