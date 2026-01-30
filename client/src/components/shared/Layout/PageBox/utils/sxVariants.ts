import { PageBoxVariant } from '../PageBox.js';

const variants: Record<PageBoxVariant, React.CSSProperties> = {
  default: {},
  blend: {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 2,
    marginBottom: 0,
    boxShadow: 'none',
    borderRadius: 0,
    backgroundColor: 'inherit',
    boxSizing: 'border-box',
    overflowY: 'scroll',
  },
  fullWidth: {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 0,
    boxShadow: 'none',
    borderRadius: 0,
    backgroundColor: 'inherit',
    boxSizing: 'border-box',
    overflowY: 'scroll',
  },
};

export default variants;
