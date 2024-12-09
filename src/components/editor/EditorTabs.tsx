import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonacoEditor } from './MonacoEditor'
import { MDXPreview } from './MDXPreview'
import { useEditorStore } from '@/lib/store'
import { useMemo, useState } from 'react'
import { getAST } from '@/lib/mdx/compiler'

export function EditorTabs() {
  const { selectedDocument } = useEditorStore()
  const [activeTab, setActiveTab] = useState('mdx')
  const mdxContent = selectedDocument?.mdx || ''

  const ast = useMemo(() => {
    try {
      return getAST(mdxContent)
    } catch (error) {
      console.error('AST generation error:', error)
      return JSON.stringify({ error: 'Failed to generate AST' }, null, 2)
    }
  }, [mdxContent])

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-1">
            <TabsContent value="mdx" className="h-full p-0 m-0 data-[state=inactive]:hidden">
              <MonacoEditor />
            </TabsContent>
            <TabsContent value="ast" className="h-full p-0 m-0 data-[state=inactive]:hidden">
              <MonacoEditor
                value={ast}
                language="json"
                options={{ 
                  readOnly: true,
                  wordWrap: 'on',
                  minimap: { enabled: false }
                }}
              />
            </TabsContent>
            <TabsContent value="preview" className="h-full p-0 m-0 data-[state=inactive]:hidden overflow-auto">
              <MDXPreview content={mdxContent} />
            </TabsContent>
          </div>
          <div className="border-t p-2 flex justify-start">
            <TabsList className="h-8">
              <TabsTrigger value="mdx" className="px-3 h-7">MDX</TabsTrigger>
              <TabsTrigger value="ast" className="px-3 h-7">AST</TabsTrigger>
              <TabsTrigger value="preview" className="px-3 h-7">Preview</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  )
}