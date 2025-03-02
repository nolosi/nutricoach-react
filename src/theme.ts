import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50',
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    accent: {
      50: '#fce8e6',
      100: '#f7c6c0',
      200: '#f1a09a',
      300: '#eb7a73',
      400: '#e65f57',
      500: '#e0453a',
      600: '#dd3e37',
      700: '#d93632',
      800: '#d52e2c',
      900: '#cc1f20',
    },
  },
  fonts: {
    heading: '"Nunito", sans-serif',
    body: '"Open Sans", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? `${props.colorScheme}.200` : `${props.colorScheme}.500`,
          color: props.colorMode === 'dark' ? 'gray.800' : 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? `${props.colorScheme}.300` : `${props.colorScheme}.600`,
          },
        }),
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          overflow: 'hidden',
          boxShadow: 'md',
        },
      },
    },
  },
});

export default theme; 