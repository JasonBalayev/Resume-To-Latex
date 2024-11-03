import { useFormContext, Controller } from 'react-hook-form'
import { primary, foreground } from '../../../../theme/colors' // Adjust the import path if necessary

import { FormSection } from './FormSection'
import { TEMPLATES } from '../../../../lib/templates/constants'

import { FormValues } from '../../../../types'

export function TemplatesSection() {
  const { control } = useFormContext<FormValues>()

  return (
    <FormSection title="Choose a Template">
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {TEMPLATES.map((templateId) => (
          <Controller
            key={templateId}
            control={control}
            name="selectedTemplate"
            render={({ field }) => (
              <label
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: `2px solid ${primary}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  backgroundColor: primary,
                  color: foreground,
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <input
                  type="radio"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={templateId}
                  checked={field.value === templateId}
                  style={{ display: 'none' }}
                />
                <span style={{ fontWeight: 'bold', marginBottom: '8px' }}>Template {templateId}</span>

                {/* Checkmark */}
                {field.value === templateId && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: foreground,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: primary,
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    ✓
                  </div>
                )}
              </label>
            )}
          />
        ))}
      </div>
    </FormSection>
  )
}
// import { useFormContext, Controller } from 'react-hook-form'

// import { FormSection } from './FormSection'
// import { TEMPLATES } from '../../../../lib/templates/constants'

// import { FormValues } from '../../../../types'

// export function TemplatesSection() {
//   const { control } = useFormContext<FormValues>()

//   return (
//     <FormSection title="Choose a Template">
//       {TEMPLATES.map((templateId) => (
//         <label key={templateId} style={{ display: 'inline-block', padding: 8 }}>
//           Template {templateId}
//           <Controller
//             control={control}
//             name="selectedTemplate"
//             render={({ field }) => (
//               <input
//                 type="radio"
//                 onChange={(e) => field.onChange(Number(e.target.value))}
//                 value={templateId}
//                 checked={field.value === templateId}
//               />
//             )}
//           />
//         </label>
//       ))}
//     </FormSection>
//   )
// }
