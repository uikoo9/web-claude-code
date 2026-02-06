'use client';

import { Box, Container, Heading, Text, Code, Stack, Image } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

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

  return (
    <Box
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      borderRadius="xl"
      borderWidth="1px"
      p={{ base: 10, md: 12 }}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'xl',
      }}
      css={{
        '&:hover': {
          borderColor: 'var(--color-primary)',
        },
      }}
    >
      <Stack gap={8}>
        {/* Title */}
        <Heading
          as="h3"
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="bold"
          style={{ color: 'var(--color-text)' }}
          fontFamily="'IBM Plex Sans', sans-serif"
        >
          {t(titleKey)}
        </Heading>

        {/* Description */}
        <Text
          style={{ color: 'var(--color-text-secondary)' }}
          fontSize={{ base: 'md', md: 'lg' }}
          lineHeight="1.75"
          fontFamily="'IBM Plex Sans', sans-serif"
        >
          {t(descriptionKey)}
        </Text>

        {/* Code Block or Image */}
        {showImage && imageUrl ? (
          <Box
            borderRadius="lg"
            overflow="hidden"
            borderWidth="1px"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <Image
              src={imageUrl}
              alt={t(titleKey)}
              w="full"
              h="auto"
              objectFit="cover"
            />
          </Box>
        ) : codeKey ? (
          <Box
            as="pre"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
            p={6}
            borderRadius="lg"
            overflow="auto"
            borderWidth="1px"
          >
            <Code
              bg="transparent"
              style={{ color: 'var(--color-accent)' }}
              fontFamily="'JetBrains Mono', monospace"
              fontSize={{ base: 'sm', md: 'md' }}
              whiteSpace="pre"
              display="block"
              lineHeight="1.6"
            >
              {t(codeKey)}
            </Code>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}

export function Steps() {
  const t = useTranslations();

  return (
    <Box py={{ base: 24, md: 32 }} id="steps">
      <Container maxW="container.lg">
        {/* Section Title */}
        <Heading
          as="h2"
          fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
          fontWeight="bold"
          textAlign="center"
          style={{ color: 'var(--color-primary)' }}
          fontFamily="'IBM Plex Sans', sans-serif"
          letterSpacing="tight"
          mb={{ base: 20, md: 24 }}
        >
          {t('getStarted')}
        </Heading>

        {/* Steps */}
        <Box>
          <Step
            number={0}
            titleKey="step0Title"
            descriptionKey="step0Description"
            codeKey="step0Code"
          />
          <Box mb={{ base: 20, md: 24 }} />

          <Step
            number={1}
            titleKey="step1Title"
            descriptionKey="step1Description"
            codeKey="step1Code"
          />
          <Box mb={{ base: 20, md: 24 }} />

          <Step
            number={2}
            titleKey="step2Title"
            descriptionKey="step2Description"
            codeKey="step2Code"
          />
          <Box mb={{ base: 20, md: 24 }} />

          <Step
            number={3}
            titleKey="step3Title"
            descriptionKey="step3Description"
            showImage={true}
            imageUrl="https://static-small.vincentqiao.com/webcc.png"
          />
        </Box>
      </Container>
    </Box>
  );
}
