import {staticFile} from 'remotion';

export const brand = {
  colors: {
    blue: '#00339A',
    cyan: '#33C5F3',
    ink: '#061B47',
    white: '#FFFFFF',
    mist: '#EAF8FD',
  },
  fonts: {
    display: 'AWE Poppins',
    body: 'AWE Libre Franklin',
  },
  safeArea: 72,
} as const;

export const brandAsset = (path: string) => staticFile(path);

export const brandFontFaces = `
  @font-face { font-family: '${brand.fonts.display}'; src: url('${brandAsset('brand/fonts/poppins/Poppins-Medium.ttf')}') format('truetype'); font-weight: 500; font-display: block; }
  @font-face { font-family: '${brand.fonts.display}'; src: url('${brandAsset('brand/fonts/poppins/Poppins-ExtraBold.ttf')}') format('truetype'); font-weight: 800; font-display: block; }
  @font-face { font-family: '${brand.fonts.display}'; src: url('${brandAsset('brand/fonts/poppins/Poppins-Black.ttf')}') format('truetype'); font-weight: 900; font-display: block; }
  @font-face { font-family: '${brand.fonts.body}'; src: url('${brandAsset('brand/fonts/libre-franklin/LibreFranklin-Variable.ttf')}') format('truetype'); font-weight: 100 900; font-display: block; }
`;
