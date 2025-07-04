// AIFormatter.tsx
import React from "react"
import DOMPurify from "dompurify"
import parse from "html-react-parser"

export type ResponseType = "output" | "debug" | "optimize" | "analyze"

export interface FormatOptions {
  enableSyntaxHighlighting?: boolean
  maxCodeBlockHeight?: string
  customTypeClasses?: Partial<Record<ResponseType, string>>
  theme?: "light" | "dark"
}

interface Props {
  response: string
  type: ResponseType
  options?: FormatOptions
}

export const AIFormatter: React.FC<Props> = ({ response, type, options = {} }) => {
  const formattedHtml = formatAIResponse(response, type, options)
  return <div>{parse(DOMPurify.sanitize(formattedHtml))}</div>
}

export function formatAIResponse(response: string, _type: ResponseType, options: FormatOptions = {}): string {
  if (!response?.trim()) return ""

  const {
    enableSyntaxHighlighting = true,
    maxCodeBlockHeight = "600px"
  } = options

  let formatted = escapeHtml(response)

  formatted = processCodeBlocks(formatted, enableSyntaxHighlighting, maxCodeBlockHeight)
  formatted = processHeaders(formatted)
  formatted = processSectionHeaders(formatted)
  formatted = processTextFormatting(formatted)
  formatted = processLists(formatted)
  formatted = processLinks(formatted)
  formatted = processTables(formatted)
  formatted = processBlockquotes(formatted)
  formatted = processCallouts(formatted)
  formatted = processParagraphs(formatted)

  // ChatGPT-style clean container
  return `<div class="ai-response" style="
    font-family: 'Söhne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    font-size: 16px;
    line-height: 1.75;
    color: #374151;
    max-width: none;
    word-wrap: break-word;
  ">${formatted}</div>`
}

function escapeHtml(text: string): string {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function processCodeBlocks(text: string, enableHighlighting: boolean, maxHeight: string): string {
  return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, language, code) => {
    const lang = language || "text"
    const escapedCode = escapeHtml(code.trim())
    const langClass = enableHighlighting ? `language-${lang}` : ""

    return `
      <div style="margin: 24px 0; position: relative; border-radius: 8px; overflow: hidden; background: #0d1117; border: 1px solid #21262d;">
        ${language ? `
          <div style="
            position: absolute;
            top: 12px;
            right: 16px;
            font-size: 12px;
            color: #7d8590;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            z-index: 1;
            font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
          ">${language}</div>
        ` : ""}
        <div style="
          padding: 16px 20px;
          overflow-x: auto;
          background: #0d1117;
          scrollbar-width: thin;
          scrollbar-color: #30363d #0d1117;
        ">
          <pre style="
            margin: 0;
            font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
            line-height: 1.5;
            color: #e6edf3;
            max-height: ${maxHeight};
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-all;
          "><code class="${langClass}">${escapedCode}</code></pre>
        </div>
      </div>
    `
  })
}

function processHeaders(text: string): string {
  return text
    .replace(/^#{1}\s+(.*$)/gm, '<h1 style="font-size: 28px; font-weight: 700; color: #111827; margin: 32px 0 16px 0; line-height: 1.3;">$1</h1>')
    .replace(/^#{2}\s+(.*$)/gm, '<h2 style="font-size: 24px; font-weight: 600; color: #111827; margin: 28px 0 14px 0; line-height: 1.3;">$1</h2>')
    .replace(/^#{3}\s+(.*$)/gm, '<h3 style="font-size: 20px; font-weight: 600; color: #111827; margin: 24px 0 12px 0; line-height: 1.3;">$1</h3>')
    .replace(/^#{4}\s+(.*$)/gm, '<h4 style="font-size: 18px; font-weight: 500; color: #111827; margin: 20px 0 10px 0; line-height: 1.3;">$1</h4>')
    .replace(/^#{5}\s+(.*$)/gm, '<h5 style="font-size: 16px; font-weight: 500; color: #111827; margin: 18px 0 8px 0; line-height: 1.3;">$1</h5>')
    .replace(/^#{6}\s+(.*$)/gm, '<h6 style="font-size: 14px; font-weight: 500; color: #6b7280; margin: 16px 0 6px 0; line-height: 1.3; text-transform: uppercase; letter-spacing: 0.5px;">$1</h6>')
}

function processSectionHeaders(text: string): string {
  return text.replace(
    /^=== (.*?) ===/gm,
    `<div style="
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      border-left: 4px solid #3b82f6;
      padding: 16px 20px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    ">
      <h3 style="
        font-weight: 500;
        color: #1e40af;
        margin: 0;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style="flex-shrink: 0;">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        $1
      </h3>
    </div>`
  )
}

function processTextFormatting(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #111827;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #374151;">$1</em>')
    .replace(/~~(.*?)~~/g, '<del style="text-decoration: line-through; color: #6b7280;">$1</del>')
    .replace(/`([^`]+)`/g, '<code style="background: #f3f4f6; color: #1f2937; padding: 2px 6px; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, \'SF Mono\', Consolas, \'Liberation Mono\', Menlo, monospace; font-size: 14px; border: 1px solid #e5e7eb;">$1</code>')
    .replace(/==(.*?)==/g, '<mark style="background: #fef3c7; padding: 2px 4px; border-radius: 3px; color: #92400e;">$1</mark>')
}

function processLists(text: string): string {
  // Process numbered lists
  text = text.replace(/^(\d+\.\s+.*(?:\n\d+\.\s+.*)*)/gm, (match) => {
    const items = match.split("\n")
      .map(line => line.match(/^\d+\.\s+(.*)$/)?.[1])
      .filter(Boolean)
      .map(item => `<li style="margin-bottom: 8px; padding-left: 8px; color: #374151; line-height: 1.6;">${item}</li>`)  
      .join("")
    return `<ol style="margin: 16px 0; padding-left: 24px; list-style: decimal; list-style-position: outside;">${items}</ol>`
  })

  // Process bullet lists
  text = text.replace(/^([•\-*]\s+.*(?:\n[•\-*]\s+.*)*)/gm, (match) => {
    const items = match.split("\n")
      .map(line => line.match(/^[•\-*]\s+(.*)$/)?.[1])
      .filter(Boolean)
      .map(item => `<li style="margin-bottom: 8px; padding-left: 8px; color: #374151; line-height: 1.6;">${item}</li>`)  
      .join("")
    return `<ul style="margin: 16px 0; padding-left: 24px; list-style: disc; list-style-position: outside;">${items}</ul>`
  })

  return text
}

function processLinks(text: string): string {
  // Process markdown links
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" style="color: #2563eb; text-decoration: underline; text-decoration-color: #93c5fd; text-underline-offset: 2px; transition: all 0.2s ease;" target="_blank" rel="noopener noreferrer" onmouseover="this.style.color=\'#1d4ed8\'; this.style.textDecorationColor=\'#2563eb\';" onmouseout="this.style.color=\'#2563eb\'; this.style.textDecorationColor=\'#93c5fd\';">$1</a>'
  )

  // Process plain URLs
  text = text.replace(
    /(https?:\/\/[^\s<>"']+)/g,
    '<a href="$1" style="color: #2563eb; text-decoration: underline; text-decoration-color: #93c5fd; text-underline-offset: 2px; transition: all 0.2s ease; word-break: break-all;" target="_blank" rel="noopener noreferrer" onmouseover="this.style.color=\'#1d4ed8\'; this.style.textDecorationColor=\'#2563eb\';" onmouseout="this.style.color=\'#2563eb\'; this.style.textDecorationColor=\'#93c5fd\';">$1</a>'
  )

  return text
}

function processTables(text: string): string {
  return text.replace(/^\|(.+)\|\s*\n\|[-\s|:]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm, (_match, header, rows) => {
    const headerCells: string = header.split("|")
      .filter((cell: string): boolean => cell.trim().length > 0)
      .slice(1, -1)
      .map((cell: string): string => `<th style="padding: 12px 16px; text-align: left; font-weight: 500; color: #111827; background: #f9fafb; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${cell.trim()}</th>`)  
      .join("")

    const bodyRows: string = rows.trim().split("\n")
      .map((row: string): string => {
        const cells: string = row.split("|").slice(1, -1)
          .map((cell: string): string => `<td style="padding: 12px 16px; color: #374151; border-bottom: 1px solid #f3f4f6; font-size: 14px;">${cell.trim()}</td>`)  
          .join("")
        return `<tr style="transition: background-color 0.2s ease;" onmouseover="this.style.backgroundColor='#f9fafb';" onmouseout="this.style.backgroundColor='transparent';">${cells}</tr>`
      })
      .join("")

    return `
      <div style="margin: 24px 0; overflow-x: auto; border-radius: 8px; border: 1px solid #e5e7eb; background: white; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>${headerCells ? `<tr>${headerCells}</tr>` : ''}</thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    `
  })
}

function processBlockquotes(text: string): string {
  return text.replace(
    /^>\s+(.*)$/gm,
    '<blockquote style="border-left: 4px solid #d1d5db; padding-left: 16px; margin: 20px 0; font-style: italic; color: #6b7280; background: #f9fafb; padding: 16px; border-radius: 0 8px 8px 0;">$1</blockquote>'
  )
}

function processCallouts(text: string): string {
  // Process info callouts
  text = text.replace(
    /^INFO:\s+(.*)$/gm,
    '<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0; display: flex; align-items: flex-start; gap: 12px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="#3b82f6" style="flex-shrink: 0; margin-top: 2px;"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg><div style="color: #1e40af; font-size: 14px; line-height: 1.5;">$1</div></div>'
  )

  // Process warning callouts
  text = text.replace(
    /^WARNING:\s+(.*)$/gm,
    '<div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 20px 0; display: flex; align-items: flex-start; gap: 12px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="#f59e0b" style="flex-shrink: 0; margin-top: 2px;"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg><div style="color: #b45309; font-size: 14px; line-height: 1.5;">$1</div></div>'
  )

  // Process error callouts
  text = text.replace(
    /^ERROR:\s+(.*)$/gm,
    '<div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin: 20px 0; display: flex; align-items: flex-start; gap: 12px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="#ef4444" style="flex-shrink: 0; margin-top: 2px;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg><div style="color: #dc2626; font-size: 14px; line-height: 1.5;">$1</div></div>'
  )

  return text
}

function processParagraphs(text: string): string {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim())
  return paragraphs.map(paragraph => {
    const trimmed = paragraph.trim()
    // Don't wrap existing HTML elements
    if (trimmed.match(/^<(div|h[1-6]|ul|ol|table|blockquote|pre)/)) return trimmed
    // Create clean paragraphs with perfect ChatGPT-like spacing
    return `<p style="margin-bottom: 16px; color: #374151; line-height: 1.75;">${trimmed.replace(/\n/g, "<br>")}</p>`
  }).join("")
}