// components/generator/Form/index.tsx
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import { useAtom } from 'jotai'
import styled from 'styled-components'

import { TemplatesSection } from './sections/TemplatesSection'
import { ProfileSection } from './sections/ProfileSection'
import { EducationSection } from './sections/EducationSection'
import { WorkSection } from './sections/WorkSection'
import { SkillsSection } from './sections/SkillsSection'
import { AwardSection } from './sections/AwardsSection'
import { ProjectsSection } from './sections/projectsSection'
import { resumeAtom } from '../../../atoms/resume'
import { FormValues } from '../../../types'

import latex from '../../../lib/latex'
import getTemplateData from '../../../lib/templates'

async function generateResume(formData: FormValues): Promise<string> {
  const { texDoc, opts } = getTemplateData(formData)
  return latex(texDoc, opts)
}

const StyledForm = styled.form`
  grid-area: form;
  overflow-y: auto;
  padding: 2rem;
  background: #0d0d0d; /* Updated background color to match the preview page */
  color: #f0f0f0;

  border-right: 1px solid #333; /* Added right border for consistent dividers */

  /* Custom scrollbar for dark theme */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
`

const initialFormValues: FormValues = {
  headings: {},
  sections: ['profile', 'education', 'work', 'skills', 'projects', 'awards'],
  selectedTemplate: 1
}

export function Form() {
  const router = useRouter()
  const { section: currSection = 'basics' } = router.query

  const [resume, setResume] = useAtom(resumeAtom)
  const formContext = useForm<FormValues>({ defaultValues: initialFormValues })

  // Add state to prevent multiple submissions
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const lastSession = localStorage.getItem('jsonResume')
    if (lastSession) {
      const jsonResume = JSON.parse(lastSession) as FormValues
      formContext.reset(jsonResume)
    }
    const subscription = formContext.watch((data) => {
      localStorage.setItem('jsonResume', JSON.stringify(data))
    })
    return () => subscription.unsubscribe()
  }, [formContext])

  const handleFormSubmit = useCallback(async () => {
    if (isGenerating) return // Prevent multiple submissions

    setIsGenerating(true)
    const formValues = formContext.getValues()
    setResume({ ...resume, isLoading: true })
    try {
      const newResumeUrl = await generateResume(formValues)
      setResume({ ...resume, url: newResumeUrl, isLoading: false })
    } catch (error) {
      console.error(error)
      setResume({ ...resume, isError: true, isLoading: false })
    } finally {
      setIsGenerating(false)
    }
  }, [formContext, resume, setResume, isGenerating])

  return (
    <FormProvider {...formContext}>
      <StyledForm
        id="resume-form"
        onSubmit={formContext.handleSubmit(handleFormSubmit)}
        autoComplete="off"
      >
        {currSection === 'templates' && <TemplatesSection />}
        {currSection === 'basics' && <ProfileSection />}
        {currSection === 'education' && <EducationSection />}
        {currSection === 'work' && <WorkSection />}
        {currSection === 'skills' && <SkillsSection />}
        {currSection === 'awards' && <AwardSection />}
        {currSection === 'projects' && <ProjectsSection />}
      </StyledForm>
    </FormProvider>
  )
}
// import { useCallback, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import { FormProvider, useForm } from 'react-hook-form'
// import { useAtom } from 'jotai'
// import styled from 'styled-components'

// import { TemplatesSection } from './sections/TemplatesSection'
// import { ProfileSection } from './sections/ProfileSection'
// import { EducationSection } from './sections/EducationSection'
// import { WorkSection } from './sections/WorkSection'
// import { SkillsSection } from './sections/SkillsSection'
// import { AwardSection } from './sections/AwardsSection'
// import { ProjectsSection } from './sections/projectsSection'
// import { resumeAtom } from '../../../atoms/resume'
// import { FormValues } from '../../../types'

// import latex from '../../../lib/latex'
// import getTemplateData from '../../../lib/templates'

// async function generateResume(formData: FormValues): Promise<string> {
  
//   const { texDoc, opts } = getTemplateData(formData)
//   return latex(texDoc, opts)
// }

// const StyledForm = styled.form`
//   grid-area: form;
//   overflow: auto;
// `

// const initialFormValues: FormValues = {
//   headings: {},
//   sections: ['profile', 'education', 'work', 'skills', 'projects', 'awards'],
//   selectedTemplate: 1
// }

// export function Form() {
//   const router = useRouter()
//   const { section: currSection = 'basics' } = router.query

//   const [resume, setResume] = useAtom(resumeAtom)
//   const formContext = useForm<FormValues>({ defaultValues: initialFormValues })

//   // TODO: move this to a custom react hook
//   useEffect(() => {
//     const lastSession = localStorage.getItem('jsonResume')
//     if (lastSession) {
//       // TODO: validate JSON schema using Zod
//       const jsonResume = JSON.parse(lastSession) as FormValues
//       formContext.reset(jsonResume)
//     }
//     const subscription = formContext.watch((data) => {
//       localStorage.setItem('jsonResume', JSON.stringify(data))
//     })
//     return () => subscription.unsubscribe()
//   }, [formContext])

//   const handleFormSubmit = useCallback(async () => {
//     const formValues = formContext.getValues()
//     setResume({ ...resume, isLoading: true })
//     console.log("Form submitting section")
//     console.log(formValues)
//     console.log(resume)
//     try {
//       const newResumeUrl = await generateResume(formValues)
//       setResume({ ...resume, url: newResumeUrl, isLoading: false })
//     } catch (error) {
//       console.error(error)
//       setResume({ ...resume, isError: true, isLoading: false })
//     }
//   }, [formContext, resume, setResume])

//   return (
//     <FormProvider {...formContext}>
//       <StyledForm
//         id="resume-form"
//         onSubmit={formContext.handleSubmit(handleFormSubmit)}
//       >
//         {currSection === 'templates' && <TemplatesSection />}
//         {currSection === 'basics' && <ProfileSection />}
//         {currSection === 'education' && <EducationSection />}
//         {currSection === 'work' && <WorkSection />}
//         {currSection === 'skills' && <SkillsSection />}
//         {currSection === 'awards' && <AwardSection />}
//         {currSection === 'projects' && <ProjectsSection />}
//       </StyledForm>
//     </FormProvider>
//   )
// }
