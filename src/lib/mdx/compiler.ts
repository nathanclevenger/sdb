import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import { compile } from '@mdx-js/mdx'
import { visit } from 'unist-util-visit'

const defaultPlugins = [remarkFrontmatter, remarkGfm]

interface CompileOptions {
  format?: 'program' | 'function-body'
  development?: boolean
  plugins?: any[]
}

export async function compileMDX(content: string, options: CompileOptions = {}) {
  const { format = 'program', development = false, plugins = defaultPlugins } = options

  if (!content?.trim()) {
    return ''
  }

  try {
    const result = await compile(content, {
      outputFormat: format,
      development,
      remarkPlugins: plugins,
      jsx: true,
      providerImportSource: undefined,
    })

    const code = String(result)
    return format === 'function-body' 
      ? `const {components} = arguments[0];
         const MDXContent = (props) => {
           return ${code}
         };
         return MDXContent;`
      : code
  } catch (error) {
    console.error('MDX compilation error:', error)
    throw new Error(`Failed to compile MDX: ${error.message}`)
  }
}

export function getAST(content: string) {
  if (!content?.trim()) {
    return '{}'
  }

  try {
    const tree = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkFrontmatter)
      .use(remarkGfm)
      .use(() => (tree) => {
        visit(tree, (node) => {
          if (node.position) delete node.position
          Object.keys(node).forEach(key => {
            if (key.startsWith('_')) {
              delete node[key]
            }
          })
        })
        return tree
      })
      .parse(content)

    return JSON.stringify(tree, null, 2)
  } catch (error) {
    console.error('AST generation error:', error)
    return JSON.stringify({ error: error.message }, null, 2)
  }
}