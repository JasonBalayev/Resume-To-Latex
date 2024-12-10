import type { NextApiRequest, NextApiResponse } from 'next'
import Archiver from 'archiver'
import { stripIndent } from 'common-tags'
import getTemplateData from '../../lib/templates'
import { FormValues } from '../../types'
import OpenAI from 'openai'
import pdf from 'pdf-parse'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 

const MAX_RETRIES = 3
const systemPrompt = `
You are an AI assistant specializing in converting PDF resume content to a JSON format. Here is the JSON Foramt. 
{
  "basics": {
    "name": "John Doe",
    "label": "Programmer",
    "image": "",
    "email": "john@gmail.com",
    "phone": "(912) 555-4321",
    "url": "https://johndoe.com",
    "summary": "A summary of John Doe…",
    "location": {
      "address": "2712 Broadway St",
      "postalCode": "CA 94115",
      "city": "San Francisco",
      "countryCode": "US",
      "region": "California"
    },
    "profiles": [{
      "network": "Twitter",
      "username": "john",
      "url": "https://twitter.com/john"
    }]
  },
  "work": [{
    "name": "Company",
    "position": "President",
    "url": "https://company.com",
    "startDate": "2013-01-01",
    "endDate": "2014-01-01",
    "summary": "Description…",
    "highlights": [
      "Started the company"
    ]
  }],
  "volunteer": [{
    "organization": "Organization",
    "position": "Volunteer",
    "url": "https://organization.com/",
    "startDate": "2012-01-01",
    "endDate": "2013-01-01",
    "summary": "Description…",
    "highlights": [
      "Awarded 'Volunteer of the Month'"
    ]
  }],
  "education": [{
    "institution": "University",
    "url": "https://institution.com/",
    "area": "Software Development",
    "studyType": "Bachelor",
    "startDate": "2011-01-01",
    "endDate": "2013-01-01",
    "score": "4.0",
    "courses": [
      "DB1101 - Basic SQL"
    ]
  }],
  "awards": [{
    "title": "Award",
    "date": "2014-11-01",
    "awarder": "Company",
    "summary": "There is no spoon."
  }],
  "certificates": [{
    "name": "Certificate",
    "date": "2021-11-07",
    "issuer": "Company",
    "url": "https://certificate.com"
  }],
  "publications": [{
    "name": "Publication",
    "publisher": "Company",
    "releaseDate": "2014-10-01",
    "url": "https://publication.com",
    "summary": "Description…"
  }],
  "skills": [{
    "name": "Web Development",
    "level": "Master",
    "keywords": [
      "HTML",
      "CSS",
      "JavaScript"
    ]
  }],
  "languages": [{
    "language": "English",
    "fluency": "Native speaker"
  }],
  "interests": [{
    "name": "Wildlife",
    "keywords": [
      "Ferrets",
      "Unicorns"
    ]
  }],
  "references": [{
    "name": "Jane Doe",
    "reference": "Reference…"
  }],
  "projects": [{
    "name": "Project",
    "startDate": "2019-01-01",
    "endDate": "2021-01-01",
    "description": "Description...",
    "highlights": [
      "Won award at AIHacks 2016"
    ],
    "url": "https://project.com/"
  }]
}

Your task is to:

1. Analyze the provided text content extracted from a PDF resume.
2. return a JSON following this format in a string, and nothing else. Give the full JSON template, not just the parts that are filled.
3. Ensure that the JSON properly formatted and compilable, following exactly the shown template.
4. Maintain the structure and style of the original JSON template, we will be using pdf-parse to extract the content from the string result.
5. If certain information is not available in the PDF content, simply leave it as an empty string.

Please provide only the filled JSON as your response, without any additional explanations or comments.
`
const retryPromptUser = ""
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const MAX_RETRIES = 3;

  if (req.method === 'POST' && req.body.pdfToLatex) {
    let retryCount = 0;
    let responseData = '';

    while (retryCount < MAX_RETRIES) {
      try {
        console.log("Starting PDF parsing...");
        const pdfBuffer = Buffer.from(req.body.pdfFile, 'base64');
        const pdfData = await pdf(pdfBuffer);
        const pdfContent = pdfData.text;

        console.log("PDF parsed successfully, making OpenAI API call...");
        const { latexTemplate } = req.body;

        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `PDF Content: ${pdfContent}\n\nLaTeX Template:\n${latexTemplate}` },
          ],
          max_tokens: 1000,
          temperature: 0.2,
        });

        responseData = response.choices[0]?.message?.content?.trim() ?? '';

        if (isValidJSON(responseData)) {
          console.log("Valid JSON response received");
          return res.status(200).json({ responseData }); // Adjusted to match client expectation
        } else {
          console.log(`Invalid JSON response. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          retryCount++;
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error during API call: ${error.message}`);
        } else {
          console.error("Unknown error occurred:", error);
        }
        retryCount++;
      }
    }

    return res.status(500).json({ error: 'Failed to retrieve valid JSON after multiple attempts.' });
  } else {
    res.status(405).end();
  }
}




function isValidJSON(jsonString: string){
  try {
    const parsed = JSON.parse(jsonString);
    // Add schema validation here if needed.
    return parsed && typeof parsed === "object";
  } catch (e) {
    console.log("Did not get a valid JSON String")
    return false;
  }
};




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
