import template1 from './template1'
import template2 from './template2'
import template3 from './template3'
import template4 from './template4'
import template5 from './template5'
import template6 from './template6'
import {
  TEMPLATE1,
  TEMPLATE2,
  TEMPLATE3,
  TEMPLATE4,
  TEMPLATE5,
  TEMPLATE6
} from './constants'
import { FormValues, TemplateData } from '../../types'

/**
 * Generates the LaTeX document based on the selected template
 * as well as the necessary options needed for it to create a pdf.
 *
 * @param data - The sanitized form data from the request body.
 *
 * @return The generated LaTeX document as well as its additional opts.
 */
export default function getTemplateData(data: FormValues): TemplateData {
  switch (data.selectedTemplate) {
    case TEMPLATE1:
      return {
        texDoc: template1(data),
        opts: {
          cmd: 'pdflatex'
        }
      }

    case TEMPLATE2:
      return {
        texDoc: template2(data),
        opts: {
          cmd: 'xelatex',
          inputs: [
            '/templates/template2/awesome-cv.cls',
            '/templates/template2/fontawesome.sty'
          ],
          fonts: [
            '/templates/template2/fonts/FontAwesome.otf',
            '/templates/template2/fonts/Roboto-Bold.ttf',
            '/templates/template2/fonts/Roboto-BoldItalic.ttf',
            '/templates/template2/fonts/Roboto-Italic.ttf',
            '/templates/template2/fonts/Roboto-Light.ttf',
            '/templates/template2/fonts/Roboto-LightItalic.ttf',
            '/templates/template2/fonts/Roboto-Medium.ttf',
            '/templates/template2/fonts/Roboto-MediumItalic.ttf',
            '/templates/template2/fonts/Roboto-Regular.ttf',
            '/templates/template2/fonts/Roboto-Thin.ttf',
            '/templates/template2/fonts/Roboto-ThinItalic.ttf',
            '/templates/template2/fonts/SourceSansPro-Bold.otf',
            '/templates/template2/fonts/SourceSansPro-BoldIt.otf',
            '/templates/template2/fonts/SourceSansPro-It.otf',
            '/templates/template2/fonts/SourceSansPro-Light.otf',
            '/templates/template2/fonts/SourceSansPro-LightIt.otf',
            '/templates/template2/fonts/SourceSansPro-Regular.otf',
            '/templates/template2/fonts/SourceSansPro-Semibold.otf',
            '/templates/template2/fonts/SourceSansPro-SemiboldIt.otf'
          ]
        }
      }

    case TEMPLATE3:
      return {
        texDoc: template3(data),
        opts: {
          cmd: 'xelatex',
          inputs: ['/templates/template3/deedy-resume-openfont.cls'],
          fonts: [
            '/templates/template3/fonts/Raleway-Bold.otf',
            '/templates/template3/fonts/Raleway-ExtraBold.otf',
            '/templates/template3/fonts/Raleway-ExtraLight.otf',
            '/templates/template3/fonts/Raleway-Heavy.otf',
            '/templates/template3/fonts/Raleway-Light.otf',
            '/templates/template3/fonts/Raleway-Medium.otf',
            '/templates/template3/fonts/Raleway-Regular.otf',
            '/templates/template3/fonts/Raleway-SemiBold.otf',
            '/templates/template3/fonts/Raleway-Thin.otf'
          ]
        }
      }

    case TEMPLATE4:
      return {
        texDoc: template4(data),
        opts: {
          cmd: 'xelatex',
          inputs: [
            '/templates/template4/helvetica.sty',
            '/templates/template4/res.cls'
          ]
        }
      }

    case TEMPLATE5:
      return {
        texDoc: template5(data),
        opts: {
          cmd: 'xelatex',
          inputs: [
            '/templates/template5/custom-command.tex',
            '/templates/template5/minimal-resume-config.tex',
            '/templates/template5/minimal-resume.sty'
          ],
          fonts: [
            '/templates/template5/fonts/CrimsonText-Bold.ttf',
            '/templates/template5/fonts/CrimsonText-BoldItalic.ttf',
            '/templates/template5/fonts/CrimsonText-Italic.ttf',
            '/templates/template5/fonts/CrimsonText-Regular.ttf',
            '/templates/template5/fonts/CrimsonText-Roman.ttf',
            '/templates/template5/fonts/CrimsonText-SemiBold.ttf',
            '/templates/template5/fonts/CrimsonText-SemiBoldItalic.ttf',
            '/templates/template5/fonts/Montserrat-Bold.ttf',
            '/templates/template5/fonts/Montserrat-Light.otf',
            '/templates/template5/fonts/Montserrat-Regular.ttf'
          ]
        }
      }

    case TEMPLATE6:
      return {
        texDoc: template6(data),
        opts: {
          cmd: 'xelatex',
          inputs: ['/templates/template6/mcdowellcv.cls']
        }
      }

    default:
      return {
        texDoc: template1(data),
        opts: {
          cmd: 'pdflatex'
        }
      }
  }
}
