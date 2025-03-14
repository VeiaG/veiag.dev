import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { MapPin } from 'lucide-react'
import React from 'react'
import RichText from './RichText'
import { MotionDiv } from './Motion'

type ExperienceCardProps = {
  company: string
  position: string
  startDate: string
  endDate: string
  description: DefaultTypedEditorState
  location: string
  isPresent?: boolean
}
const ExperienceCard: React.FC<ExperienceCardProps> = ({
  company,
  position,
  startDate,
  endDate,
  description,
  location,
  isPresent,
}) => {
  return (
    <MotionDiv
      className="flex flex-col gap-1 border-t border-b py-4"
      initial={{ opacity: 0, y: -16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">{company}</h2>
        <div className="text-sm flex items-center gap-1 text-right">
          {location}
          <MapPin className="h-4 w-4 " />
        </div>
      </div>
      <div className="flex gap-2 justify-between items-center">
        <h3 className="text-lg md:text-xl">{position}</h3>
        <p className="text-zinc-50/80 text-right text-base md:text-base">
          {new Date(startDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })} -{' '}
          {isPresent
            ? 'Present'
            : new Date(endDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
      <div className="mt-2">
        <RichText data={description} enableGutter={false} />
      </div>
    </MotionDiv>
  )
}

export default ExperienceCard
