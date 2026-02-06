'use client';

import { Box, Container, Heading, Text, Button, Stack, Flex, Code, useColorModeValue } from '@chakra-ui/react';

export default function Home() {
  const bgGradient = useColorModeValue('linear(to-br, blue.50, purple.50)', 'linear(to-br, gray.900, purple.900)');

  return (
    <Box minH="100vh" bg={bgGradient}>
      <Container maxW="container.xl" py={20}>
        <Stack spacing={12} align="center" textAlign="center">
          {/* Hero Section */}
          <Stack spacing={6} maxW="3xl">
            <Heading as="h1" size="3xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
              webcc.dev
            </Heading>
            <Heading as="h2" size="xl" fontWeight="medium">
              Claude Code Web Interface
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Use Claude Code directly in your web browser with a powerful terminal interface
            </Text>
          </Stack>

          {/* Installation Section */}
          <Stack spacing={4} w="full" maxW="2xl">
            <Heading size="lg">Quick Start</Heading>
            <Box bg={useColorModeValue('white', 'gray.800')} p={6} borderRadius="lg" boxShadow="lg">
              <Stack spacing={4}>
                <Text fontWeight="semibold">Install globally:</Text>
                <Code p={4} borderRadius="md" fontSize="md" colorScheme="blue">
                  npm install -g @webccc/cli
                </Code>
                <Text fontWeight="semibold" mt={4}>
                  Run:
                </Text>
                <Code p={4} borderRadius="md" fontSize="md" colorScheme="purple">
                  webcc
                </Code>
              </Stack>
            </Box>
          </Stack>

          {/* CTA Buttons */}
          <Flex gap={4} flexWrap="wrap" justify="center">
            <Button
              size="lg"
              colorScheme="blue"
              as="a"
              href="https://github.com/uikoo9/web-claude-code"
              target="_blank"
            >
              View on GitHub
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="purple"
              as="a"
              href="https://www.npmjs.com/package/@webccc/cli"
              target="_blank"
            >
              View on npm
            </Button>
          </Flex>

          {/* Features */}
          <Stack spacing={6} w="full" maxW="4xl" pt={12}>
            <Heading size="lg">Features</Heading>
            <Flex gap={6} flexWrap="wrap" justify="center">
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                flex="1"
                minW="250px"
              >
                <Heading size="md" mb={2}>
                  🚀 Quick Start
                </Heading>
                <Text color="gray.600">Fast server startup to access Claude Code via browser</Text>
              </Box>
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                flex="1"
                minW="250px"
              >
                <Heading size="md" mb={2}>
                  🔧 Auto Config
                </Heading>
                <Text color="gray.600">Auto-detect .env files or interactive configuration</Text>
              </Box>
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                flex="1"
                minW="250px"
              >
                <Heading size="md" mb={2}>
                  🎨 Beautiful UI
                </Heading>
                <Text color="gray.600">Colored logs and elegant terminal interface</Text>
              </Box>
            </Flex>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
