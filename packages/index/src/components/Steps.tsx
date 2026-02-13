'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// 动态导入代码高亮组件，减少初始bundle
const CodeHighlight = dynamic(() => import('./CodeHighlight').then((mod) => ({ default: mod.CodeHighlight })), {
  ssr: false,
  loading: () => (
    <div
      style={{
        padding: '24px',
        background: 'var(--color-background)',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'var(--font-jetbrains)',
      }}
    >
      Loading...
    </div>
  ),
});

interface StepProps {
  number: number;
  titleKey: string;
  descriptionKey: string;
  codeKey?: string;
  showImage?: boolean;
  imageUrl?: string;
  onImageClick?: () => void;
}

function Step({ number, titleKey, descriptionKey, codeKey, showImage, imageUrl, onImageClick }: StepProps) {
  const t = useTranslations();

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
        <div className="step-image-wrapper step-image-clickable" onClick={onImageClick}>
          <Image
            src={imageUrl}
            alt={t(titleKey)}
            width={1200}
            height={630}
            className="step-image"
          />
        </div>
      ) : codeKey ? (
        <div className="step-code-block">
          <CodeHighlight code={t(codeKey)} language="bash" />
        </div>
      ) : null}
    </div>
  );
}

export function Steps({ onImageClick }: { onImageClick?: () => void }) {
  const t = useTranslations();

  return (
    <div className="steps" id="steps">
      <div className="container">
        {/* Section Title */}
        <h2 className="steps-title">{t('getStarted')}</h2>

        {/* Steps */}
        <div>
          <Step number={1} titleKey="step1Title" descriptionKey="step1Description" codeKey="step1Code" />

          <Step number={2} titleKey="step2Title" descriptionKey="step2Description" codeKey="step2Code" />

          <Step
            number={3}
            titleKey="step3Title"
            descriptionKey="step3Description"
            showImage={true}
            imageUrl="https://static-small.vincentqiao.com/webcc.png"
            onImageClick={onImageClick}
          />
        </div>
      </div>
    </div>
  );
}
