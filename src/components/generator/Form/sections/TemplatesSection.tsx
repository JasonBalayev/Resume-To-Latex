import { useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { primary } from '../../../../theme/colors'
import { darken, lighten } from 'polished'
import Image from 'next/image'

import { FormSection } from './FormSection'
import { TEMPLATES, TEMPLATE_IMAGES } from '../../../../lib/templates/constants'
import { FormValues } from '../../../../types'

export function TemplatesSection() {
  const { control } = useFormContext<FormValues>()
  const [zoomedImage, setZoomedImage] = useState<string | null>(null) // Track zoomed image

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
                  padding: '16px 20px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  background: `linear-gradient(135deg, ${lighten(
                    0.1,
                    primary
                  )}, ${primary})`,
                  color: '#fff',
                  border: `1px solid ${darken(0.05, primary)}`,
                  boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow =
                    '0px 12px 20px rgba(0, 0, 0, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow =
                    '0px 6px 14px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div
                  style={{
                    width: '200px',
                    height: '250px',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    position: 'relative',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <Image
                    src={TEMPLATE_IMAGES[templateId - 1]}
                    alt={`Template ${templateId}`}
                    width={200}
                    height={250}
                    onClick={() =>
                      setZoomedImage(TEMPLATE_IMAGES[templateId - 1])
                    } // Open zoom modal
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>
                <input
                  type="radio"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={templateId}
                  checked={field.value === templateId}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginTop: '12px',
                    letterSpacing: '0.5px'
                  }}
                >
                  Template {templateId}
                </span>

                {field.value === templateId && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: primary,
                      fontWeight: 'bold',
                      fontSize: '16px',
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
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

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <button
            onClick={() => setZoomedImage(null)} // Close modal
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
          <Image
            src={zoomedImage}
            alt="Zoomed Template"
            width={800}
            height={1000}
            style={{
              borderRadius: '12px',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      )}
    </FormSection>
  )
}
