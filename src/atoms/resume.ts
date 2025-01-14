import { atom } from 'jotai'

interface ResumeState {
  url: string
  isLoading: boolean
  isError: boolean
  errorMessage?: string
}

const initialState: ResumeState = {
  url: '',
  isLoading: false,
  isError: false,
  errorMessage: ''
}

export const resumeAtom = atom<ResumeState>(initialState)

resumeAtom.debugLabel = 'resumeAtom'
