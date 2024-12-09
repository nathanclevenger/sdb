import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { evaluateMDX } from '@/lib/mdx/runtime'
import { compileMDX } from '@/lib/mdx/compiler'

interface MDXPreviewProps {
  content: string
}

export function MDXPreview({ content }: MDXPreviewProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function renderMDX() {
      if (!content?.trim()) {
        setComponent(null)
        setError(null)
        return
      }

      try {
        const code = await compileMDX(content, {
          format: 'function-body',
          development: false,
        })
        const MDXComponent = await evaluateMDX(code)
        setComponent(() => MDXComponent)
        setError(null)
      } catch (err) {
        console.error('MDX Preview Error:', err)
        setError(`Failed to render MDX: ${err.message}`)
        setComponent(null)
      }
    }

    renderMDX()
  }, [content])

  if (error) {
    return (
      <div className="p-8 text-destructive">
        <h3 className="text-lg font-semibold mb-2">MDX Preview Error</h3>
        <pre className="text-sm font-mono whitespace-pre-wrap break-words">
          {error}
        </pre>
      </div>
    )
  }

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No content to preview
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="prose dark:prose-invert max-w-none p-8">
        <Component />
      </div>
    </ScrollArea>
  )
}