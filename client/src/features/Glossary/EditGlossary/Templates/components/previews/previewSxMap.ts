import { SubTypePropertyTypes } from '@/app/slice/subTypeSlice.js';

const getPreviewSx = (
  inputType: SubTypePropertyTypes,
  colSpan: 1 | 2 | 4 = 2,
  isCompound: boolean
) => {
  switch (inputType) {
    case 'text': {
      switch (colSpan) {
        case 1:
          return isCompound
            ? {
                wrapper: {},
              }
            : {};
        case 2:
          return isCompound
            ? {
                wrapper: {},
              }
            : {};

        case 4:
          return isCompound
            ? {
                wrapper: {},
              }
            : {
                useSideLabel: true,
              };
      }
    }
    case 'date':
    case 'dropdown': {
      switch (colSpan) {
        case 1:
          return isCompound
            ? {
                wrapper: {},
              }
            : {};
        case 2:
          return isCompound
            ? {
                wrapper: {},
              }
            : {};

        case 4:
          return isCompound
            ? {
                wrapper: {},
              }
            : {
                useSideLabel: true,
              };
      }
    }
    case 'range':
      switch (colSpan) {
        case 1:
          return isCompound
            ? {
                wrapper: {
                  flexDirection: 'row',
                  gap: 4,
                },
              }
            : {
                wrapper: {
                  flexDirection: 'column',
                  gap: 0.5,
                },
                textBox: {
                  width: '100%',
                },
                sliderBox: {
                  px: 2,
                },
              };
        case 2:
          return isCompound
            ? {
                wrapper: {
                  flexDirection: 'row',
                  gap: 4,
                },
              }
            : {
                wrapper: {
                  flexDirection: 'row',
                  gap: 0.5,
                },
                textBox: {
                  width: '100%',
                  textAlign: 'left',
                },
              };
        case 4:
          return isCompound
            ? {
                wrapper: {
                  flexDirection: 'row',
                  gap: 4,
                },
              }
            : {
                wrapper: {
                  flexDirection: 'row',
                  gap: 4,
                },
                textBox: {
                  width: '50%',
                  textAlign: 'left',
                },
                text: {
                  fontSize: '1.25rem',
                },
                sliderText: {
                  fontSize: '1rem',
                  bottom: -30,
                },
              };
      }
    case 'compound':
    case 'checkbox':
    default:
      return {
        gridColumn: isCompound ? 'span 1' : `span ${colSpan}`,
        width: '100%',
      };
  }
};

export default getPreviewSx;
