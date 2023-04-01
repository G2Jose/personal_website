export type TextOrTextGroup =
  | string
  | { text: string; subText: TextOrTextGroup[] }

export type ResumeSection = {
  title: string
  sections?: ResumeSection[]
  subtitle?: string
  text?: TextOrTextGroup[]
}
