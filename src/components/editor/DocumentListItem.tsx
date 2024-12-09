import { Document } from '@/lib/types'
import yaml from 'js-yaml'

interface DocumentListItemProps {
  document: Document
  isSelected: boolean
  onClick: () => void
}

function getSecondLineContent(mdx: string, data: Record<string, unknown>): string {
  // If there's a name, show the ID
  if (data.name) {
    return data.id as string
  }

  // Remove name and id from the data to show other frontmatter
  const { name, id, ...rest } = data
  if (Object.keys(rest).length > 0) {
    return yaml.dump(rest, { flowLevel: 1 }).replace(/[{}\n]/g, ' ').trim()
  }

  // If no other frontmatter, get the first line of content after frontmatter
  const content = mdx.split('---')[2]
  if (content) {
    const firstLine = content.trim().split('\n')[0]
    return firstLine.replace(/^#+\s*/, '').trim() // Remove heading markers
  }

  return ''
}

export function DocumentListItem({ document, isSelected, onClick }: DocumentListItemProps) {
  const data = JSON.parse(document.data)
  const displayName = data.name || document.id
  const secondLine = getSecondLineContent(document.mdx, data)

  return (
    <div
      className={`border-b last:border-b-0 border-border/40 cursor-pointer ${
        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <div className='p-3 space-y-1'>
        <div className='font-medium truncate'>{displayName}</div>
        {secondLine && (
          <div className='text-sm text-muted-foreground truncate'>{secondLine}</div>
        )}
      </div>
    </div>
  )
}