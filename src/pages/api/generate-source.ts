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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = await processRequest(req.body)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
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
