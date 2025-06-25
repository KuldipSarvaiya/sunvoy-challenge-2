'use client'

import React from 'react'
import { $getSelection, $isRangeSelection, $isTextNode, $createTextNode } from 'lexical'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { MarkNode, $createMarkNode, $isMarkNode } from './MarkNode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHighlighter } from '@fortawesome/free-solid-svg-icons/faHighlighter'

export const MarkFeatureClient = createClientFeature({
  nodes: [MarkNode],
  toolbarInline: {
    groups: [
      {
        key: 'format',
        type: 'buttons',
        order: 36,
        items: [
          {
            label: 'Mark Feature',
            Component: (props: any) => {
              const { editor } = props
              const [isActive, setIsActive] = React.useState(false)

              React.useEffect(() => {
                return editor.registerUpdateListener(({ editorState }: { editorState: any }) => {
                  editorState.read(() => {
                    const selection = $getSelection()
                    if (selection) {
                      const nodes = selection.getNodes()
                      const hasMarkNode = nodes.some((node) => {
                        return $isMarkNode(node) || $isMarkNode(node.getParent())
                      })
                      setIsActive(hasMarkNode)
                    }
                  })
                })
              }, [editor])

              const toggleMark = () => {
                editor.update(() => {
                  const selection = $getSelection()
                  if (selection) {
                    if (isActive) {
                      if ($isRangeSelection(selection)) {
                        const extracted = selection.extract()
                        extracted.forEach((node) => {
                          if ($isTextNode(node) && $isMarkNode(node.getParent())) {
                            const parent = node.getParent()
                            if (parent && $isMarkNode(parent)) {
                              const parentText = parent.getTextContent()
                              const nodeText = node.getTextContent()
                              const parentChildren = parent.getChildren()
                              let offset = 0
                              let found = false
                              let before = ''
                              let after = ''
                              for (const child of parentChildren) {
                                if (child === node) {
                                  found = true
                                  break
                                }
                                if ($isTextNode(child)) {
                                  offset += child.getTextContent().length
                                }
                              }
                              if (found) {
                                before = parentText.slice(0, offset)
                                after = parentText.slice(offset + nodeText.length)
                              }
                              const newNodes = []
                              if (before) {
                                const beforeMark = $createMarkNode()
                                beforeMark.append($createTextNode(before))
                                newNodes.push(beforeMark)
                              }
                              const plainTextNode = $createTextNode(nodeText)
                              newNodes.push(plainTextNode)
                              if (after) {
                                const afterMark = $createMarkNode()
                                afterMark.append($createTextNode(after))
                                newNodes.push(afterMark)
                              }
                              newNodes.forEach((n) => parent.insertBefore(n))
                              parent.remove()
                            }
                          }
                        })
                      }
                    } else {
                      const selectedText = selection.getTextContent()
                      if (selectedText.trim()) {
                        const markNode = $createMarkNode()
                        markNode.append($createTextNode(selectedText))
                        selection.insertNodes([markNode])
                      }
                    }
                  }
                })
              }

              return (
                <button
                  type="button"
                  className={`toolbar-icon ${isActive ? 'toolbar-active' : ''}`}
                  onClick={toggleMark}
                  title="Mark Feature"
                >
                  <FontAwesomeIcon icon={faHighlighter} />
                </button>
              )
            },
            key: 'highlight',
            order: 5,
          },
        ],
      },
    ],
  },
})
