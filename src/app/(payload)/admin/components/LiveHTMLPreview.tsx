'use client'

import React, { useEffect, useState } from 'react'
import { useField } from '@payloadcms/ui'
import { $generateHtmlFromNodes } from '@lexical/html'
import { createEditor } from 'lexical'
import { MarkNode } from '@/features/MarkFeature/MarkNode'
import { RichTextFieldClientProps } from 'payload'

function formatHTML(html: string): string {
  let formatted = ''
  const reg = /(>)(<)(\/*)/g
  html = html.replace(reg, '$1\n$2$3')
  let pad = 0
  html.split('\n').forEach((node) => {
    if (node.match(/^<\//)) pad -= 1
    if (pad < 0) pad = 0
    formatted += '  '.repeat(pad) + node + '\n'
    if (node.match(/^<[^!][^>]*[^\/]>$/) && !node.match(/^<\//)) pad += 1
  })
  return formatted.trim()
}

const LiveHTMLPreview: React.FC<RichTextFieldClientProps> = (props) => {
  const { path } = props
  const { value } = useField({ path })
  const [html, setHtml] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function convertToHTML() {
      if (!value) {
        setHtml('')
        return
      }

      setIsLoading(true)

      try {
        if (typeof value === 'string') {
          setHtml(value)
          setIsLoading(false)
          return
        }

        if (value && typeof value === 'object' && value.hasOwnProperty('root')) {
          const editor = createEditor({
            nodes: [MarkNode],
            onError: (_) => {},
          })

          try {
            const editorState = editor.parseEditorState(JSON.stringify(value))
            editor.setEditorState(editorState)

            let htmlOutput = ''
            editor.getEditorState().read(() => {
              htmlOutput = $generateHtmlFromNodes(editor, null)
            })

            setHtml(htmlOutput || '<p>No content</p>')
          } catch {
            setHtml('<div class="live-preview-error">Invalid</div>')
          }
        } else {
          setHtml('<div class="live-preview-error">Invalid</div>')
        }
      } catch {
        setHtml('<div class="live-preview-error">Error</div>')
      } finally {
        setIsLoading(false)
      }
    }

    convertToHTML()
  }, [value])

  const prettyHtml = html ? formatHTML(html) : ''

  return (
    <div>
      <div className="rich-text-field" />
      <div className="live-preview-wrapper">
        <div className="live-preview-header">
          <h4 className="live-preview-title">Live Preview</h4>
          {isLoading && <div className="live-preview-converting">Converting...</div>}
        </div>
        <div className="live-preview-content-outer">
          <div
            className="live-preview-content-inner live-preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        <div className="live-preview-html-raw">
          <div className="live-preview-html-label">Extracted HTML Output:</div>
          <pre className="live-preview-html-pre">{prettyHtml}</pre>
        </div>
      </div>
    </div>
  )
}

export default LiveHTMLPreview
