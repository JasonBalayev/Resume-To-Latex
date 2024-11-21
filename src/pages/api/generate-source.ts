import type { NextApiRequest, NextApiResponse } from 'next'
import Archiver from 'archiver'
import { stripIndent } from 'common-tags'
import getTemplateData from '../../lib/templates'
import { FormValues } from '../../types'
import OpenAI from 'openai'
import pdf from 'pdf-parse'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const systemPrompt = `
You are an AI assistant specializing in converting PDF resume content to LaTeX format. Your task is to:

1. Analyze the provided text content extracted from a PDF resume.
2. Fill out the given LaTeX template, replacing comments with appropriate content from the PDF.
3. Ensure that the LaTeX code is properly formatted and compilable.
4. Maintain the structure and style of the original LaTeX template.
5. If certain information is not available in the PDF content, leave the corresponding LaTeX comments unchanged.

Please provide only the filled LaTeX code as your response, without any additional explanations or comments.
`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST' && req.body.pdfToLatex) {
    // Handle PDF to LaTeX conversion request
    try {
      const pdfBuffer = Buffer.from(req.body.pdfFile, 'base64')
      const pdfData = await pdf(pdfBuffer)
      const pdfContent = pdfData.text

      const { latexTemplate } = req.body
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `PDF Content: ${pdfContent}\n\nLaTeX Template:\n${latexTemplate}` },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      })
      const latexCode = response.choices[0]?.message?.content?.trim() ?? ''
      res.status(200).json({ latexCode })
    } catch (error) {
      console.error('Error processing PDF or generating LaTeX:', error)
      res.status(500).json({ error: 'Error processing PDF or generating LaTeX code.' })
    }
  } else if (req.method === 'POST') {
    // Handle original resume generation request
    const sourceCode = await generateSourceCode(req.body as FormValues)
    sourceCode
      .pipe(res)
      .setHeader('content-type', 'application/zip')
      .setHeader('content-disposition', 'attachment; filename="resume.zip"')
  } else {
    res.status(405).end()
  }
}

/**
 * Generates resume source files from the request body,
 * and then saves it to a zip which is then sent to the client.
 *
 * @param formData The request body received from the client.
 *
 * @return The generated zip.
 */
function generateSourceCode(formData: FormValues) {
  const { texDoc, opts } = getTemplateData(formData)
  const prettyDoc = /*prettify(texDoc)*/ texDoc
  const zip = Archiver('zip')
  const readme = makeReadme(formData.selectedTemplate, opts.cmd)

  zip.append(prettyDoc, { name: 'resume.tex' })
  zip.append(readme, { name: 'README.md' })

  if (opts.inputs && opts.inputs.length > 0) {
    zip.directory(opts.inputs[0], '../')
  }

  zip.finalize()

  return zip
}

/**
 * Generates a README to include in the output zip.
 * It details how to use the generated LaTeX source code.
 *
 * @param template The specified resume template.
 * @param cmd The LaTeX command that is used to generate the PDF.
 *
 * @return The generated README text.
 */
function makeReadme(template: number, cmd: string): string {
  return stripIndent`
    # Resumake Template ${template}
    > LaTeX code generated at [resumake.io](https://resumake.io)
    ## Usage
    To generate a PDF from this LaTeX code, navigate to this folder in a terminal and run:
        ${cmd} resume.tex
    ## Requirements
    You will need to have \`${cmd}\` installed on your machine.
    Alternatively, you can use a site like [ShareLaTeX](https://sharelatex.com) to build and edit your LaTeX instead.
  `
}
