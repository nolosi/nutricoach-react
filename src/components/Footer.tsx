import { Box, Container, Flex, Link, Text, Stack, useColorModeValue } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      as="footer"
      borderTop="1px"
      borderColor={borderColor}
      py={4}
      mt="auto"
    >
      <Container maxW="container.xl">
        <Stack spacing={4} align="center">
          <Flex
            wrap="wrap"
            justify="center"
            align="center"
            gap={2}
          >
            <Text>Entwickelt mit ❤️ von</Text>
            <Link
              href="https://github.com/nolosi"
              isExternal
              display="flex"
              alignItems="center"
              color="blue.500"
            >
              <FaGithub style={{ marginRight: '4px' }} />
              nolosi
            </Link>
          </Flex>
          
          <Flex
            wrap="wrap"
            justify="center"
            align="center"
            gap={4}
          >
            <Link
              href="https://cursor.sh"
              isExternal
              color="blue.500"
            >
              Cursor IDE
            </Link>
            <Text>•</Text>
            <Link
              href="https://www.anthropic.com/claude"
              isExternal
              color="blue.500"
            >
              Claude 3.7
            </Link>
            <Text>•</Text>
            <Link
              href="https://github.com/nolosi/nutricoach-react"
              isExternal
              color="blue.500"
            >
              GitHub Repository
            </Link>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer; 