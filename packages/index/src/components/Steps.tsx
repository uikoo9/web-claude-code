'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

interface StepProps {
  number: number;
  titleKey: string;
  descriptionKey: string;
  codeKey?: string;
  showImage?: boolean;
  imageUrl?: string;
}

function Step({ number, titleKey, descriptionKey, codeKey, showImage, imageUrl }: StepProps) {
  const t = useTranslations();
  const [imageEnlarged, setImageEnlarged] = useState(false);

  // Special handling for step3 description with URL
  const renderDescription = () => {
    if (descriptionKey === 'step3Description') {
      const description = t(descriptionKey);
      const urlPattern = /(http:\/\/localhost:\d+)/;
      const parts = description.split(urlPattern);

      return (
        <p className="step-description">
          {parts.map((part, index) => {
            if (part.match(urlPattern)) {
              return (
                <a
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="step-link"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    }

    return <p className="step-description">{t(descriptionKey)}</p>;
  };

  return (
    <div className="step-card">
      {/* Title */}
      <h3 className="step-title">{t(titleKey)}</h3>

      {/* Description */}
      {renderDescription()}

      {/* Code Block or Image */}
      {showImage && imageUrl ? (
        <>
          <div
            className="step-image-wrapper"
            onClick={() => setImageEnlarged(true)}
            style={{ cursor: 'pointer' }}
          >
            <Image
              src={imageUrl}
              alt={t(titleKey)}
              width={1200}
              height={630}
              className="step-image"
            />
          </div>

          {/* Enlarged Image Modal */}
          {imageEnlarged && (
            <div className="image-modal-overlay" onClick={() => setImageEnlarged(false)}>
              <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="image-modal-close" onClick={() => setImageEnlarged(false)}>
                  ×
                </button>
                <Image
                  src={imageUrl}
                  alt={t(titleKey)}
                  width={1200}
                  height={630}
                  className="image-modal-image"
                />
              </div>
            </div>
          )}
        </>
      ) : codeKey ? (
        <div className="step-code-block">
          <code className="step-code">{t(codeKey)}</code>
        </div>
      ) : null}
    </div>
  );
}

export function Steps() {
  const t = useTranslations();

  return (
    <div className="steps" id="steps">
      <div className="container">
        {/* Section Title */}
        <h2 className="steps-title">{t('getStarted')}</h2>

        {/* Steps */}
        <div>
          <Step number={0} titleKey="step0Title" descriptionKey="step0Description" codeKey="step0Code" />

          <Step number={1} titleKey="step1Title" descriptionKey="step1Description" codeKey="step1Code" />

          <Step number={2} titleKey="step2Title" descriptionKey="step2Description" codeKey="step2Code" />

          <Step
            number={3}
            titleKey="step3Title"
            descriptionKey="step3Description"
            showImage={true}
            imageUrl="https://static-small.vincentqiao.com/webcc.png"
          />
        </div>
      </div>
    </div>
  );
}
