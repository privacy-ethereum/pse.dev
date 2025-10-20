"use client"

import katex from "katex"
import React, { useCallback } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import "katex/dist/katex.min.css"
import { TableRowCard } from "../cards/table-row-card"
import { Accordion } from "./accordion"
import Prism from "prismjs"
import rehypeRaw from "rehype-raw"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-json"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-css"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-python"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-solidity"
import { AppLink } from "../app-link"
import { Icons } from "../icons"

const SCROLL_OFFSET = 150

const scrollToElementWithOffset = (target: HTMLElement) => {
  const rect = target.getBoundingClientRect()
  const targetPosition = rect.top + window.pageYOffset - SCROLL_OFFSET

  // Set margin before scrolling
  target.style.scrollMarginTop = `${SCROLL_OFFSET}px`

  requestAnimationFrame(() => {
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    })
  })
}

// Helper function to convert double dollar math blocks to a custom markdown syntax
const preprocessMathBlocks = (content: string): string => {
  // Replace $$...$$ with a custom markdown syntax that won't interfere with footnotes
  return content.replace(/\$\$([\s\S]*?)\$\$/g, (match, mathContent) => {
    const encodedMath = Buffer.from(mathContent.trim()).toString("base64")
    return `\n\n<math-block data-math="${encodedMath}"></math-block>\n\n`
  })
}

// Custom component for math blocks
const MathBlockComponent = ({ "data-math": dataMath, ...props }: any) => {
  const mathContent = React.useMemo(() => {
    try {
      return Buffer.from(dataMath, "base64").toString("utf8")
    } catch {
      return ""
    }
  }, [dataMath])

  return <KaTeXBlock math={mathContent} />
}

interface CustomComponents extends Components {
  "table-row-card": React.ComponentType<{
    node: any
    children: string
  }>
  accordion: React.ComponentType<{
    node: any
    children: string
  }>
  "footnote-ref": React.ComponentType<{
    identifier: string
    label: string
  }>
  "footnote-definition": React.ComponentType<{
    identifier: string
    label: string
    children: React.ReactNode
  }>
  footnotes: React.ComponentType<{
    children: React.ReactNode
  }>
}

const generateSectionId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const createMarkdownElement = (
  tag: keyof JSX.IntrinsicElements,
  props: any
) =>
  React.createElement(tag, {
    ...props,
    ref: (node: HTMLElement | null) => {
      if (node && node.textContent) {
        node.setAttribute(
          "data-section-id",
          generateSectionId(node.textContent)
        )
      }
    },
  })

const Table = (props: any) => {
  return (
    <div className="w-full overflow-x-auto border rounded-lg border-tuatara-300">
      <table className="min-w-full !bg-background" data-component="table">
        {props.children}
      </table>
    </div>
  )
}

const TableRow = (props: any) => {
  return <tr data-component="table-row">{props.children}</tr>
}

const TableHead = (props: any) => {
  if (!props.children || props.children.length === 0) {
    return null
  }

  const isEmpty = React.Children.toArray(props.children).every((child: any) => {
    if (!child.props || !child.props.children) return true

    if (child.props.children) {
      const thChildren = React.Children.toArray(child.props.children)
      if (thChildren.length === 0) return true

      return thChildren.every((thChild: any) => {
        if (!thChild) return true
        if (typeof thChild === "string") return thChild.trim() === ""
        if (!thChild.props || !thChild.props.children) return true
        if (typeof thChild.props.children === "string")
          return thChild.props.children.trim() === ""
        return false
      })
    }
    return true
  })

  if (isEmpty) {
    return null
  }

  return <thead>{props.children}</thead>
}

const TableBody = (props: any) => {
  if (!props.children || props.children.length === 0) {
    return null
  }

  return <tbody>{props.children}</tbody>
}

const remarkCustomNewlines = () => {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === "text" && typeof node.value === "string") {
        if (node.value.includes("/n")) {
          const parts = node.value.split("/n")
          const newChildren: any[] = []

          parts.forEach((part: string, index: number) => {
            newChildren.push({ type: "text", value: part })

            if (index < parts.length - 1) {
              newChildren.push({ type: "break" })
            }
          })

          return newChildren
        }
      }

      if (node.children) {
        const newChildren: any[] = []
        for (const child of node.children) {
          const result = visit(child)
          if (Array.isArray(result)) {
            newChildren.push(...result)
          } else if (result) {
            newChildren.push(result)
          } else {
            newChildren.push(child)
          }
        }
        node.children = newChildren
      }

      return node
    }

    return visit(tree)
  }
}

// Custom math components
const KaTeXBlock = ({ math }: { math: string }) => {
  const mathRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (mathRef.current) {
      try {
        const processedMath = preprocessMathContent(math.trim())
        katex.render(processedMath, mathRef.current, {
          displayMode: true,
          throwOnError: false,
        })
      } catch (error) {
        console.error("KaTeX block render error:", error)
        if (mathRef.current) {
          mathRef.current.textContent = math
        }
      }
    }
  }, [math])

  return <div ref={mathRef} className="my-4 flex justify-center" />
}

const KaTeXInline = ({ math }: { math: string }) => {
  const mathRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (mathRef.current) {
      try {
        // Pre-process the math content to replace "mod" with "\pmod"
        const processedMath = preprocessMathContent(math.trim())
        katex.render(processedMath, mathRef.current, {
          displayMode: false,
          throwOnError: false,
        })
      } catch (error) {
        console.error("KaTeX inline render error:", error)
        if (mathRef.current) {
          mathRef.current.textContent = math
        }
      }
    }
  }, [math])

  return <span ref={mathRef} className="inline-block align-middle katex-math" />
}

// Preprocess math content to improve rendering
const preprocessMathContent = (mathContent: string): string => {
  // Replace pattern "x ; mod ; q" or "x \mod q" with "\pmod{q}"
  const modRegex = /([^\\])(;?\s*mod\s*;?\s*)([^{])/g
  const processedMath = mathContent.replace(
    modRegex,
    (match, before, mod, after) => {
      return `${before}\\pmod{${after}}`
    }
  )

  // Also handle cases like "\mod q" or "\mod{q}"
  const modCommandRegex = /\\mod\s+([^{])/g
  return processedMath.replace(modCommandRegex, (match, after) => {
    return `\\pmod{${after}}`
  })
}

// Define a simple regex to extract math content from our markdown
const extractMathBlocks = (content: string) => {
  const mathBlocks: {
    start: number
    end: number
    content: string
    isBlock: boolean
  }[] = []

  const blockMathRegex = /\$\$([\s\S]*?)\$\$/g
  let match: RegExpExecArray | null

  while ((match = blockMathRegex.exec(content)) !== null) {
    mathBlocks.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[1],
      isBlock: true,
    })
  }

  const inlineMathRegex = /\$(.*?)\$/g
  let inlineMatch: RegExpExecArray | null
  while ((inlineMatch = inlineMathRegex.exec(content)) !== null) {
    // Make sure this isn't already part of a block math section
    const isInsideBlockMath = mathBlocks.some(
      (block) =>
        inlineMatch!.index > block.start && inlineMatch!.index < block.end
    )

    if (!isInsideBlockMath) {
      mathBlocks.push({
        start: inlineMatch.index,
        end: inlineMatch.index + inlineMatch[0].length,
        content: inlineMatch[1],
        isBlock: false,
      })
    }
  }

  mathBlocks.sort((a, b) => a.start - b.start)

  return mathBlocks
}

// Helper to check if text contains unescaped math delimiters
const containsMath = (text: string): boolean => {
  // Skip markdown links
  if (text.match(/\[.*?\]\(.*?\)/)) {
    return false
  }

  if (!text.includes("$")) return false

  // Check for currency pattern first
  const currencyPattern = /\$\s*\d+(?:,\d{3})*(?:\.\d{2})?(?!\^|\{|\}|\d)/g
  if (text.match(currencyPattern) && !text.match(/\$.*[\^_{}].*\$/)) {
    return false
  }

  const blockMathRegex = /\$\$([\s\S]*?)\$\$/g
  const inlineMathRegex =
    /(?<![\\$])\$(?![\s\d,]*\d(?:\.\d{2})?(?!\^|\{|\}|\d))((?:[^$\\]|\\$|\\[^$])+?)\$/g

  return blockMathRegex.test(text) || inlineMathRegex.test(text)
}

const MathText = ({ text }: { text: string }) => {
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  try {
    // First handle block math ($$...$$)
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g
    let match: RegExpExecArray | null

    while ((match = blockMathRegex.exec(text))) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }

      const mathContent = match[1].trim()
      parts.push(
        <KaTeXBlock key={`block-math-${match.index}`} math={mathContent} />
      )

      lastIndex = match.index + match[0].length
    }

    // Then handle remaining text for inline math ($...$)
    const remainingText = text.slice(lastIndex)
    if (remainingText) {
      const inlineParts: React.ReactNode[] = []
      let inlineLastIndex = 0
      const inlineMathRegex = /(?<![\\$])\$(?![$])([^$]+)\$/g
      let inlineMatch: RegExpExecArray | null

      while ((inlineMatch = inlineMathRegex.exec(remainingText))) {
        if (inlineMatch.index > inlineLastIndex) {
          inlineParts.push(
            remainingText.slice(inlineLastIndex, inlineMatch.index)
          )
        }

        const mathContent = inlineMatch[1].trim()
        inlineParts.push(
          <KaTeXInline
            key={`inline-math-${inlineMatch.index}`}
            math={mathContent}
          />
        )

        inlineLastIndex = inlineMatch.index + inlineMatch[0].length
      }

      if (inlineLastIndex < remainingText.length) {
        inlineParts.push(remainingText.slice(inlineLastIndex))
      }

      parts.push(...inlineParts)
    }

    return <>{parts}</>
  } catch (error) {
    console.error("Error processing text with math:", error)
    return <>{text}</>
  }
}

const rehypeProcessBrTags = () => {
  return (tree: any) => {
    const visit = (node: any) => {
      if (
        node.type === "element" &&
        (node.tagName === "td" || node.tagName === "th")
      ) {
        // Look for text nodes that contain \n or <br> and convert them
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i]
            if (child.type === "text" && child.value) {
              if (child.value.includes("\n")) {
                const parts = child.value.split("\n")
                const newChildren: any[] = []

                parts.forEach((part: string, index: number) => {
                  newChildren.push({ type: "text", value: part })

                  // Add <br> element except after the last part
                  if (index < parts.length - 1) {
                    newChildren.push({
                      type: "element",
                      tagName: "br",
                      properties: {},
                      children: [],
                    })
                  }
                })

                node.children.splice(i, 1, ...newChildren)
                // Adjust i based on the new length of children we've inserted
                i += newChildren.length - 1
              }
            }
          }
        }
      }

      if (node.children) {
        node.children.forEach(visit)
      }

      return node
    }

    return visit(tree)
  }
}

const CodeBlock = ({
  className,
  children,
}: {
  className?: string
  children: string
}) => {
  const language = className ? className.replace(/language-/, "") : "text"
  const codeRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [children])

  return (
    <pre className="relative rounded-lg bg-tuatara-950 overflow-hidden">
      <code ref={codeRef} className={`bg-tuatara-950 language-${language}`}>
        {children}
      </code>
    </pre>
  )
}

const HeadingLink = ({
  level,
  children,
}: {
  level: number
  children: React.ReactNode
}) => {
  const [copied, setCopied] = React.useState(false)
  const [showLink, setShowLink] = React.useState(false)

  const id = React.useMemo(() => {
    if (typeof children === "string") {
      return generateSectionId(children)
    }
    const text = React.Children.toArray(children)
      .map((child) => {
        if (typeof child === "string") return child
        if (
          React.isValidElement(child) &&
          typeof child.props?.children === "string"
        ) {
          return child.props.children
        }
        return ""
      })
      .join("")
    return generateSectionId(text)
  }, [children])

  const copyToClipboard = React.useCallback(() => {
    const url = new URL(window.location.href)
    url.hash = id
    navigator.clipboard.writeText(url.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [id])

  const headingClasses = React.useMemo(() => {
    switch (level) {
      case 1:
        return "text-4xl md:text-5xl font-bold"
      case 2:
        return "text-4xl"
      case 3:
        return "text-3xl"
      case 4:
        return "text-xl"
      case 5:
        return "text-lg font-bold"
      default:
        return "text-md font-bold"
    }
  }, [level])

  const Component = React.createElement(
    `h${level}` as keyof JSX.IntrinsicElements,
    {
      id,
      className: `group relative flex items-center gap-2 text-primary ${headingClasses}`,
      onMouseEnter: () => setShowLink(true),
      onMouseLeave: () => setShowLink(false),
    },
    <>
      {children}
      <button
        onClick={copyToClipboard}
        className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          copied ? "text-green-500" : "text-tuatara-400 hover:text-tuatara-600"
        }`}
        aria-label="Copy link to section"
      >
        {copied ? <Icons.copied /> : <Icons.copy />}
      </button>
    </>
  )

  return Component
}

const REACT_MARKDOWN_CONFIG = (darkMode: boolean): CustomComponents => ({
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("#")) {
      return (
        <AppLink
          href={href}
          data-anchor="with-scroll-margin"
          {...props}
          onClick={(e) => {
            e.preventDefault()
            const targetId = href.slice(1)
            const target = document.getElementById(targetId)
            if (target) {
              scrollToElementWithOffset(target)
            }
          }}
        >
          {children}
        </AppLink>
      )
    }

    return (
      <AppLink href={href ?? ""} external {...props}>
        {children}
      </AppLink>
    )
  },
  h1: ({ children }) => <HeadingLink level={1}>{children}</HeadingLink>,
  h2: ({ children }) => <HeadingLink level={2}>{children}</HeadingLink>,
  h3: ({ children }) => <HeadingLink level={3}>{children}</HeadingLink>,
  h4: ({ children }) => <HeadingLink level={4}>{children}</HeadingLink>,
  h5: ({ children }) => <HeadingLink level={5}>{children}</HeadingLink>,
  h6: ({ children }) => <HeadingLink level={6}>{children}</HeadingLink>,
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "")
    return !inline ? (
      <CodeBlock className={className} {...props}>
        {String(children).replace(/\n$/, "")}
      </CodeBlock>
    ) : (
      <code
        className="bg-tuatara-950 px-1.5 py-0.5 rounded-md text-white"
        {...props}
      >
        {children}
      </code>
    )
  },
  p: ({ node, children }: { node: any; children: React.ReactNode }) => {
    const childArray = React.Children.toArray(children)
    const isOnlyLink =
      childArray.length === 1 &&
      React.isValidElement(childArray[0]) &&
      childArray[0].type === "a"

    if (isOnlyLink) {
      return <>{children}</>
    }

    // For other paragraphs, continue with normal processing
    const text = childArray
      .map((child) => {
        if (typeof child === "string") return child
        if (React.isValidElement(child) && child.props?.children) {
          return child.props.children
        }
        return ""
      })
      .join("")

    let isMathOnly = false
    if (text.trim().startsWith("$$") && text.trim().endsWith("$$")) {
      const innerContent = text.trim().slice(2, -2)
      if (!innerContent.includes("$$")) {
        isMathOnly = true
      }
    }

    if (containsMath(text)) {
      return (
        <p
          className={`text-tuatara-600 dark:text-tuatara-200 font-sans text-lg font-normal ${
            isMathOnly ? "math-only" : ""
          }`}
        >
          <MathText text={text} />
        </p>
      )
    }

    return (
      <p className="text-tuatara-600 dark:text-tuatara-200 font-sans text-lg font-normal">
        {children}
      </p>
    )
  },
  // Handle math in list items
  li: ({ node, children, ...props }) => {
    const text = React.Children.toArray(children)
      .map((child) => {
        if (typeof child === "string") return child
        // @ts-expect-error - children props vary
        if (child?.props?.children) return child.props.children
        return ""
      })
      .join("")

    if (containsMath(text)) {
      return (
        <li
          className="text-tuatara-500 font-sans text-base lg:text-lg font-normal dark:text-tuatara-100"
          {...props}
        >
          <MathText text={text} />
        </li>
      )
    }

    return (
      <li
        className="text-tuatara-500 font-sans text-base lg:text-lg font-normal dark:text-tuatara-100"
        {...props}
      >
        {children}
      </li>
    )
  },
  ul: ({ ordered, ...props }) =>
    createMarkdownElement(ordered ? "ol" : "ul", {
      className:
        "ml-6 list-disc text-tuatara-600  font-sans text-lg font-normal",
      ...props,
    }),
  ol: ({ ordered, ...props }) =>
    createMarkdownElement(ordered ? "ol" : "ul", {
      className:
        "list-decimal text-tuatara-600 font-sans text-lg font-normal mt-3 dark:text-tuatara-200",
      ...props,
    }),
  table: Table,
  tr: TableRow,
  thead: TableHead,
  tbody: TableBody,
  "table-row-card": ({ node, children }: { node: any; children: string }) => {
    try {
      const content = JSON.parse(children)
      return <TableRowCard items={content} />
    } catch (error) {
      console.error("Error parsing table-row-card content:", error)
      return <div>Error rendering table row card</div>
    }
  },
  accordion: ({ node, children }: { node: any; children: string }) => {
    try {
      const content = JSON.parse(children)
      return (
        <Accordion
          type={content.type || "multiple"}
          size={content.size || "xs"}
          defaultValue={content.defaultValue}
          items={content.items}
          iconOnHover={content.iconOnHover}
          id={content.id}
        />
      )
    } catch (error) {
      console.error("Error parsing accordion content:", error)
      return <div>Error rendering accordion</div>
    }
  },
  td: (props) => {
    const { node, children, ...rest } = props

    // Convert children to text to check for math
    const text = React.Children.toArray(children)
      .map((child) => {
        if (typeof child === "string") return child
        // @ts-expect-error - children props vary
        if (child?.props?.children) return child.props.children
        return ""
      })
      .join("")

    // Handle line breaks in table cells by replacing <br> with actual line breaks
    const hasBrTags = typeof text === "string" && text.includes("<br>")

    // Check if there's HTML content with style attribute in the cell
    const hasHtmlContent =
      typeof text === "string" && (text.includes("<div style=") || hasBrTags)

    // Check if there's math content
    if (containsMath(text)) {
      return (
        <td className="p-4 text-left" {...rest}>
          <MathText text={text} />
        </td>
      )
    }

    if (hasHtmlContent) {
      const processedText = hasBrTags ? text.replace(/<br>/g, "<br/>") : text
      return (
        <td
          className="p-4 text-left"
          {...rest}
          dangerouslySetInnerHTML={{ __html: processedText }}
        />
      )
    }

    return (
      <td className="p-4 text-left" {...rest}>
        {children}
      </td>
    )
  },
  th: (props) => {
    const { node, children, ...rest } = props
    if (!children || (Array.isArray(children) && children.length === 0)) {
      return null
    }

    // Convert children to text to check for math
    const text = React.Children.toArray(children)
      .map((child) => {
        if (typeof child === "string") return child
        // @ts-expect-error - children props vary
        if (child?.props?.children) return child.props.children
        return ""
      })
      .join("")

    // Handle line breaks in table headers by replacing <br> with actual line breaks
    const hasBrTags = typeof text === "string" && text.includes("<br>")

    // Check if there's HTML content with style attribute in the cell
    const hasHtmlContent =
      typeof text === "string" && (text.includes("<div style=") || hasBrTags)

    if (containsMath(text)) {
      return (
        <th className="p-4 text-left font-medium" {...rest}>
          <MathText text={text} />
        </th>
      )
    }

    if (hasHtmlContent) {
      const processedText = hasBrTags ? text.replace(/<br>/g, "<br/>") : text
      return (
        <th
          className="p-4 text-left font-medium"
          {...rest}
          dangerouslySetInnerHTML={{ __html: processedText }}
        />
      )
    }

    return (
      <th className="p-4 text-left font-medium" {...rest}>
        {children}
      </th>
    )
  },
  img: ({ ...props }) =>
    createMarkdownElement("img", {
      className:
        "w-auto w-auto mx-auto rounded-lg object-cover dark:bg-white dark:p-3",
      ...props,
    }),
  "footnote-ref": ({ identifier, label }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const target = document.getElementById(`fn-${identifier}`)
        if (target) {
          scrollToElementWithOffset(target)
        }
      },
      [identifier]
    )

    React.useEffect(() => {
      console.log("Footnote ref mounted:", identifier)
    }, [identifier])

    return (
      <sup>
        <button
          type="button"
          id={`fnref-${identifier}`}
          className="text-anakiwa-500 hover:text-orange duration-200"
          onClick={handleClick}
        >
          [{label}]
        </button>
      </sup>
    )
  },
  "footnote-definition": ({ identifier, label, children }) => {
    const handleBackClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const target = document.getElementById(`fnref-${identifier}`)
        if (target) {
          scrollToElementWithOffset(target)
        }
      },
      [identifier]
    )

    React.useEffect(() => {
      console.log("Footnote definition mounted:", identifier)
    }, [identifier])

    return (
      <div
        id={`fn-${identifier}`}
        className="flex gap-2 text-sm text-tuatara-600 mb-2"
      >
        <div className="flex-none">[{label}]</div>
        <div className="flex-1">
          {children}
          <button
            type="button"
            className="text-anakiwa-500 hover:text-orange duration-200 ml-1"
            onClick={handleBackClick}
          >
            ↩
          </button>
        </div>
      </div>
    )
  },
  footnotes: ({ children }) => {
    return (
      <div className="mt-8 pt-8 border-t border-tuatara-200">
        <h2 className="text-xl font-bold mb-4">Footnotes</h2>
        {children}
      </div>
    )
  },
})

interface MarkdownProps {
  children: string
  components?: Components // components overrides the default components
  darkMode?: boolean
}

export const Markdown = ({
  children,
  components,
  darkMode = false,
}: MarkdownProps) => {
  const [content, setContent] = React.useState<React.ReactNode[]>([])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const hash = window.location.hash
      if (hash) {
        const id = hash.slice(1) // Remove the # from the hash
        const element = document.getElementById(id)
        if (element) {
          scrollToElementWithOffset(element)
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [content])

  React.useEffect(() => {
    if (!children) {
      setContent([])
      return
    }

    try {
      // Preprocess the content to convert $$ blocks to custom components
      const processedContent = preprocessMathBlocks(children)

      const mathComponents = {
        ...REACT_MARKDOWN_CONFIG(darkMode),
        "math-block": MathBlockComponent,
        ...components,
      }

      const rehypePlugins = [rehypeRaw as any, rehypeProcessBrTags as any]

      setContent([
        <ReactMarkdown
          key="markdown"
          skipHtml={false}
          rehypePlugins={rehypePlugins}
          components={mathComponents}
          remarkPlugins={[remarkGfm, remarkCustomNewlines]}
        >
          {processedContent}
        </ReactMarkdown>,
      ])
    } catch (error) {
      console.error("Error processing markdown with math:", error)
      setContent([
        <ReactMarkdown
          key="fallback"
          skipHtml={false}
          rehypePlugins={[rehypeRaw as any, rehypeProcessBrTags as any]}
          components={{
            ...REACT_MARKDOWN_CONFIG(darkMode),
            ...components,
          }}
          remarkPlugins={[remarkGfm, remarkCustomNewlines]}
        >
          {children}
        </ReactMarkdown>,
      ])
    }
  }, [children, darkMode, components])

  return <>{content}</>
}
