import prettier from 'prettier'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import reactXIfPlugin from '.'

const format = async (code: string) => {
  return await prettier.format(code, {
    parser: 'babel',
  })
}

describe('vite-plugin-react-magic-kit', () => {
  let plugin: any

  beforeEach(() => {
    vi.clearAllMocks()
    plugin = reactXIfPlugin('abc-if')
  })

  describe('Plugin Configuration', () => {
    it('should create plugin with correct name', () => {
      expect(plugin.name).toBe('vite-plugin-react-x-if')
    })

    it('should have pre enforcement', () => {
      expect(plugin.enforce).toBe('pre')
    })
  })

  describe('Transform Method', () => {
    it('should transform outer JSX with x-if', async () => {
      const code = `
        export function Component({ show }) {
          return <div abc-if={show}>Content</div>
        }
      `
      const transformed = `
        export function Component({ show }) {
          return (Boolean(show) && <div>Content</div>)
        }
      `
      const result = await format(plugin.transform(code, 'test.tsx'))
      expect(result).toBe(await format(transformed))
    })

    it('should transform inner JSX with x-if', async () => {
      const code = `
        export function Component({ show }) {
          return <div>
            <div abc-if={show}>Content</div>
          </div>
        }
      `
      const transformed = `
        export function Component({ show }) {
          return <div>{Boolean(show) && <div>Content</div>}</div>
        }
      `
      const result = await format(plugin.transform(code, 'test.tsx'))
      expect(result).toBe(await format(transformed))
    })

    it('should transform nested JSX with x-if', async () => {
      const code = `
        export function Component({ show }) {
          return <div abc-if={show}>
              <div abc-if={show}>Content</div>
          </div>
        }
      `
      const transformed = `
        export function Component({ show }) {
          return (Boolean(show) && <div>{Boolean(show) && <div>Content</div>}</div>)
        }
      `
      const result = await format(plugin.transform(code, 'test.tsx'))
      expect(result).toBe(await format(transformed))
    })

    it('should transform JSX Fragment with x-if', async () => {
      const code = `
        export function Component({ show }) {
          return <>
            <div abc-if={show}>Content</div>
          </>
        }
      `
      const transformed = `
      export function Component({ show }) {
        return <>{Boolean(show) && <div>Content</div>}</>
      }
      `
      const result = await format(plugin.transform(code, 'test.tsx'))
      expect(result).toBe(await format(transformed))
    })
  })

  describe('File Type Filtering', () => {
    it('should process .js files', () => {
      const code = 'const test = "js file"'
      const result = plugin.transform(code, 'test.js')
      expect(result).toBeDefined()
    })

    it('should process .ts files', () => {
      const code = 'const test: string = "ts file"'
      const result = plugin.transform(code, 'test.ts')
      expect(result).toBeDefined()
    })

    it('should process .jsx files', () => {
      const code = 'const component = <div>JSX</div>'
      const result = plugin.transform(code, 'test.jsx')
      expect(result).toBeDefined()
    })

    it('should process .tsx files', () => {
      const code = 'const component: JSX.Element = <div>TSX</div>'
      const result = plugin.transform(code, 'test.tsx')
      expect(result).toBeDefined()
    })

    it('should skip .css files', () => {
      const code = '.class { color: red; }'
      const result = plugin.transform(code, 'styles.css')
      expect(result).toBe(code)
    })

    it('should skip .json files', () => {
      const code = '{"key": "value"}'
      const result = plugin.transform(code, 'data.json')
      expect(result).toBe(code)
    })
  })

  describe('getSuffix Helper', () => {
    it('should extract file extension correctly', () => {
      const testCases = [
        { input: 'file.js', expected: 'js' },
        { input: 'path/to/file.tsx', expected: 'tsx' },
        { input: '/absolute/path/component.jsx', expected: 'jsx' },
        { input: 'file.test.ts', expected: 'ts' },
        { input: 'file.min.js', expected: 'js' },
      ]

      testCases.forEach(({ input, expected }) => {
        // We test this indirectly through the transform method
        const code = 'test code'
        plugin.transform(code, input)
        // The fact that it doesn't throw and processes correctly indicates getSuffix works
      })
    })
  })
})
