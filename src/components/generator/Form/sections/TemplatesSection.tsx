import { useFormContext, Controller } from 'react-hook-form'
import { primary } from '../../../../theme/colors' 
import { darken } from 'polished'

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
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, background 0.3s ease',
                  background: `linear-gradient(135deg, ${primary}, ${darken(0.1, primary)})`, 
                  color: '#fff', 
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)', 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.background = `linear-gradient(135deg, ${darken(0.1, primary)}, ${darken(0.15, primary)})`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.background = `linear-gradient(135deg, ${primary}, ${darken(0.1, primary)})`
                }}
              >
                <input
                  type="radio"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={templateId}
                  checked={field.value === templateId}
                  style={{ display: 'none' }}
                />
                <span style={{ fontWeight: 'bold', marginBottom: '8px' }}>Template {templateId}</span>

                {field.value === templateId && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#fff', 
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
