// AIFormatter.tsx
import React from "react"
import DOMPurify from "dompurify"
import parse from "html-react-parser"
import { formatAIResponse, type ResponseType, type FormatOptions } from "./aiFormatterUtils"

interface Props {
  response: string
  type: ResponseType
  options?: FormatOptions
}

export const AIFormatter: React.FC<Props> = ({ response, type, options = {} }) => {
  const formattedHtml = formatAIResponse(response, type, options)
  return <div>{parse(DOMPurify.sanitize(formattedHtml))}</div>
}

export default AIFormatter