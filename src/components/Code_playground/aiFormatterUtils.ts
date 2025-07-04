// utils/aiFormatterUtils.ts
export type ResponseType = "output" | "debug" | "optimize" | "analyze"

export interface FormatOptions {
  enableSyntaxHighlighting?: boolean
  maxCodeBlockHeight?: string
  customTypeClasses?: Partial<Record<ResponseType, string>>
  theme?: "light" | "dark"
}

export function formatAIResponse(response: string, type: ResponseType, options: FormatOptions = {}): string {
  if (!response?.trim()) return ""

  const {
    maxCodeBlockHeight = "600px"
  } = options

  let formatted = escapeHtml(response)

  // Process in order for best results
  formatted = processCodeBlocks(formatted, maxCodeBlockHeight, type)
  formatted = processHeaders(formatted)
  formatted = processSectionHeaders(formatted)
  formatted = processTextFormatting(formatted)
  formatted = processLists(formatted)
  formatted = processLinks(formatted)
  formatted = processTables(formatted)
  formatted = processBlockquotes(formatted)
  formatted = processCallouts(formatted)
  formatted = processParagraphs(formatted)

  // ChatGPT/Claude-style container with enhanced typography
  return `<div class="ai-response-content" style="
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    font-size: 15px;
    line-height: 1.7;
    color: #374151;
    max-width: none;
    word-wrap: break-word;
    letter-spacing: 0.01em;
  ">${formatted}</div>`
}

function escapeHtml(text: string): string {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function processCodeBlocks(text: string, maxHeight: string, type: ResponseType): string {
  return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, language, code) => {
    const escapedCode = escapeHtml(code.trim())
    
    // Type-specific styling
    const typeColors = {
      output: { bg: '#0f172a', border: '#1e293b', accent: '#10b981' },
      debug: { bg: '#1c1917', border: '#292524', accent: '#ef4444' },
      optimize: { bg: '#18181b', border: '#27272a', accent: '#f59e0b' },
      analyze: { bg: '#0c1426', border: '#1e293b', accent: '#3b82f6' }
    }
    
    const colors = typeColors[type] || typeColors.analyze

    return `
      <div style="
        margin: 24px 0; 
        position: relative; 
        border-radius: 12px; 
        overflow: hidden; 
        background: ${colors.bg}; 
        border: 1px solid ${colors.border};
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      ">
        ${language ? `
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid ${colors.border};
          ">
            <div style="
              font-size: 12px;
              color: #94a3b8;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
            ">${language}</div>
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
            ">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${colors.accent};
                opacity: 0.7;
              "></div>
              <span style="
                font-size: 11px;
                color: #64748b;
                font-family: ui-monospace, monospace;
              ">Code</span>
            </div>
          </div>
        ` : ""}
        <div style="
          padding: 20px;
          overflow-x: auto;
          background: ${colors.bg};
        ">
          <pre style="
            margin: 0;
            font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
            line-height: 1.6;
            color: #e2e8f0;
            max-height: ${maxHeight};
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-all;
            font-feature-settings: 'liga' 1, 'calt' 1;
          "><code>${escapedCode}</code></pre>
        </div>
      </div>
    `
  })
}

function processHeaders(text: string): string {
  return text
    .replace(/^#{1}\s+(.*$)/gm, '<h1 style="font-size: 32px; font-weight: 700; color: #111827; margin: 40px 0 20px 0; line-height: 1.2; letter-spacing: -0.025em;">$1</h1>')
    .replace(/^#{2}\s+(.*$)/gm, '<h2 style="font-size: 26px; font-weight: 600; color: #111827; margin: 32px 0 16px 0; line-height: 1.3; letter-spacing: -0.02em;">$1</h2>')
    .replace(/^#{3}\s+(.*$)/gm, '<h3 style="font-size: 22px; font-weight: 600; color: #111827; margin: 28px 0 14px 0; line-height: 1.3;">$1</h3>')
    .replace(/^#{4}\s+(.*$)/gm, '<h4 style="font-size: 18px; font-weight: 500; color: #111827; margin: 24px 0 12px 0; line-height: 1.4;">$1</h4>')
    .replace(/^#{5}\s+(.*$)/gm, '<h5 style="font-size: 16px; font-weight: 500; color: #374151; margin: 20px 0 10px 0; line-height: 1.4;">$1</h5>')
    .replace(/^#{6}\s+(.*$)/gm, '<h6 style="font-size: 14px; font-weight: 500; color: #6b7280; margin: 18px 0 8px 0; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.05em;">$1</h6>')
}

function processSectionHeaders(text: string): string {
  return text.replace(
    /^=== (.*?) ===/gm,
    `<div style="
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid #e2e8f0;
      border-left: 4px solid #3b82f6;
      padding: 20px 24px;
      margin: 32px 0 24px 0;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    ">
      <h3 style="
        font-weight: 600;
        color: #1e40af;
        margin: 0;
        font-size: 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        letter-spacing: -0.01em;
      ">
        <div style="
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="white" style="flex-shrink: 0;">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        </div>
        $1
      </h3>
    </div>`
  )
}

function processTextFormatting(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #111827;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
    .replace(/~~(.*?)~~/g, '<del style="text-decoration: line-through; color: #9ca3af; opacity: 0.8;">$1</del>')
    .replace(/`([^`]+)`/g, '<code style="background: linear-gradient(135deg, #f1f5f9, #e2e8f0); color: #1e293b; padding: 3px 8px; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, \'SF Mono\', Consolas, \'Liberation Mono\', Menlo, monospace; font-size: 13px; border: 1px solid #cbd5e1; font-weight: 500;">$1</code>')
    .replace(/==(.*?)==/g, '<mark style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 2px 6px; border-radius: 4px; color: #92400e; border: 1px solid #f59e0b20;">$1</mark>')
}

function processLists(text: string): string {
  // Enhanced numbered lists
  text = text.replace(/^(\d+\.\s+.*(?:\n\d+\.\s+.*)*)/gm, (match) => {
    const items = match.split("\n")
      .map(line => line.match(/^\d+\.\s+(.*)$/)?.[1])
      .filter(Boolean)
      .map((item, index) => `
        <li style="
          margin-bottom: 12px; 
          padding-left: 12px; 
          color: #374151; 
          line-height: 1.7;
          position: relative;
        ">
          <span style="
            position: absolute;
            left: -24px;
            top: 0;
            font-weight: 600;
            color: #3b82f6;
            font-size: 14px;
          ">${index + 1}.</span>
          ${item}
        </li>
      `)  
      .join("")
    return `<ol style="margin: 20px 0; padding-left: 32px; list-style: none; position: relative;">${items}</ol>`
  })

  // Enhanced bullet lists
  text = text.replace(/^([•\-*]\s+.*(?:\n[•\-*]\s+.*)*)/gm, (match) => {
    const items = match.split("\n")
      .map(line => line.match(/^[•\-*]\s+(.*)$/)?.[1])
      .filter(Boolean)
      .map(item => `
        <li style="
          margin-bottom: 12px; 
          padding-left: 12px; 
          color: #374151; 
          line-height: 1.7;
          position: relative;
        ">
          <span style="
            position: absolute;
            left: -16px;
            top: 8px;
            width: 6px;
            height: 6px;
            background: #3b82f6;
            border-radius: 50%;
          "></span>
          ${item}
        </li>
      `)  
      .join("")
    return `<ul style="margin: 20px 0; padding-left: 24px; list-style: none; position: relative;">${items}</ul>`
  })

  return text
}

function processLinks(text: string): string {
  // Enhanced markdown links
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" style="color: #2563eb; text-decoration: none; font-weight: 500; border-bottom: 1px solid #93c5fd; padding-bottom: 1px; transition: all 0.2s ease;" target="_blank" rel="noopener noreferrer" onmouseover="this.style.color=\'#1d4ed8\'; this.style.borderBottomColor=\'#2563eb\';" onmouseout="this.style.color=\'#2563eb\'; this.style.borderBottomColor=\'#93c5fd\';">$1</a>'
  )

  // Enhanced plain URLs  
  text = text.replace(
    /(https?:\/\/[^\s<>"']+)/g,
    '<a href="$1" style="color: #2563eb; text-decoration: none; font-weight: 500; border-bottom: 1px solid #93c5fd; padding-bottom: 1px; transition: all 0.2s ease; word-break: break-all; font-family: ui-monospace, monospace; font-size: 14px;" target="_blank" rel="noopener noreferrer" onmouseover="this.style.color=\'#1d4ed8\'; this.style.borderBottomColor=\'#2563eb\';" onmouseout="this.style.color=\'#2563eb\'; this.style.borderBottomColor=\'#93c5fd\';">$1</a>'
  )

  return text
}

function processTables(text: string): string {
  return text.replace(/^\|(.+)\|\s*\n\|[-\s|:]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm, (_match, header, rows) => {
    const headerCells = header.split("|")
      .filter((cell: string) => cell.trim().length > 0)
      .slice(1, -1)
      .map((cell: string) => `
        <th style="
          padding: 16px 20px; 
          text-align: left; 
          font-weight: 600; 
          color: #111827; 
          background: linear-gradient(135deg, #f9fafb, #f3f4f6); 
          border-bottom: 2px solid #e5e7eb; 
          font-size: 14px;
          border-right: 1px solid #f3f4f6;
        ">${cell.trim()}</th>
      `)  
      .join("")

    const bodyRows = rows.trim().split("\n")
      .map((row: string, rowIndex: number) => {
        const cells = row.split("|").slice(1, -1)
          .map((cell: string) => `
            <td style="
              padding: 16px 20px; 
              color: #374151; 
              border-bottom: 1px solid #f9fafb; 
              font-size: 14px;
              border-right: 1px solid #f9fafb;
              transition: background-color 0.2s ease;
            ">${cell.trim()}</td>
          `)  
          .join("")
        return `
          <tr style="
            transition: background-color 0.2s ease;
            ${rowIndex % 2 === 0 ? 'background: #fafafa;' : 'background: white;'}
          " 
          onmouseover="this.style.backgroundColor='#f0f9ff';" 
          onmouseout="this.style.backgroundColor='${rowIndex % 2 === 0 ? '#fafafa' : 'white'}';">
            ${cells}
          </tr>
        `
      })
      .join("")

    return `
      <div style="margin: 32px 0; overflow-x: auto; border-radius: 12px; border: 1px solid #e5e7eb; background: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">
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
    '<blockquote style="border-left: 4px solid #e5e7eb; padding: 20px 24px; margin: 24px 0; font-style: italic; color: #6b7280; background: linear-gradient(135deg, #f9fafb, #f3f4f6); border-radius: 0 12px 12px 0; position: relative; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);"><span style="position: absolute; top: 16px; left: 8px; font-size: 24px; color: #d1d5db; line-height: 1;">"</span>$1</blockquote>'
  )
}

function processCallouts(text: string): string {
  // Enhanced info callouts
  text = text.replace(
    /^INFO:\s+(.*)$/gm,
    '<div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 24px 0; display: flex; align-items: flex-start; gap: 16px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);"><div style="width: 24px; height: 24px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><svg width="14" height="14" viewBox="0 0 20 20" fill="white"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg></div><div style="color: #1e40af; font-size: 15px; line-height: 1.6; font-weight: 500;">$1</div></div>'
  )

  // Enhanced warning callouts
  text = text.replace(
    /^WARNING:\s+(.*)$/gm,
    '<div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 24px 0; display: flex; align-items: flex-start; gap: 16px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);"><div style="width: 24px; height: 24px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><svg width="14" height="14" viewBox="0 0 20 20" fill="white"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg></div><div style="color: #b45309; font-size: 15px; line-height: 1.6; font-weight: 500;">$1</div></div>'
  )

  // Enhanced error callouts
  text = text.replace(
    /^ERROR:\s+(.*)$/gm,
    '<div style="background: linear-gradient(135deg, #fef2f2, #fecaca); border: 1px solid #fca5a5; border-radius: 12px; padding: 20px; margin: 24px 0; display: flex; align-items: flex-start; gap: 16px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);"><div style="width: 24px; height: 24px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><svg width="14" height="14" viewBox="0 0 20 20" fill="white"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg></div><div style="color: #dc2626; font-size: 15px; line-height: 1.6; font-weight: 500;">$1</div></div>'
  )

  return text
}

function processParagraphs(text: string): string {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim())
  return paragraphs.map(paragraph => {
    const trimmed = paragraph.trim()
    // Don't wrap existing HTML elements
    if (trimmed.match(/^<(div|h[1-6]|ul|ol|table|blockquote|pre)/)) return trimmed
    // Create elegant paragraphs with ChatGPT-like spacing
    return `<p style="margin-bottom: 20px; color: #374151; line-height: 1.7; font-size: 15px; letter-spacing: 0.01em;">${trimmed.replace(/\n/g, "<br>")}</p>`
  }).join("")
}