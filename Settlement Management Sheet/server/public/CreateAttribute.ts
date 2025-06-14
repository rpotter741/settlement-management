import {
  g as W,
  c as K,
  r as m,
  u as G,
  j as n,
  s as E,
  d as X,
  e as B,
  f as Y,
  S as we,
  m as $,
  h as le,
  i as ye,
  l as je,
  k as Le,
  n as Te,
  o as me,
  v as F,
  R as C,
  B as v,
  p as A,
  q as g,
  a as q,
  t as D,
  F as Se,
  w as Me,
  x as ke,
  A as ze,
  T as Pe,
  D as _,
  C as Ee,
  y as Ie,
  P as _e,
  z as ee,
  E as P,
  G as Be,
  H as O,
} from './main.js';
import { I as V, C as Re, O as Ae, P as He } from './ThresholdPreview.js';
import { u as J, M as R, I as $e, C as De } from './CreateShell.js';
function Ne(e) {
  return K('MuiSwitch', e);
}
const j = W('MuiSwitch', [
    'root',
    'edgeStart',
    'edgeEnd',
    'switchBase',
    'colorPrimary',
    'colorSecondary',
    'sizeSmall',
    'sizeMedium',
    'checked',
    'disabled',
    'input',
    'thumb',
    'track',
  ]),
  Fe = (e) => {
    const {
        classes: t,
        edge: a,
        size: o,
        color: r,
        checked: s,
        disabled: i,
      } = e,
      l = {
        root: ['root', a && `edge${B(a)}`, `size${B(o)}`],
        switchBase: [
          'switchBase',
          `color${B(r)}`,
          s && 'checked',
          i && 'disabled',
        ],
        thumb: ['thumb'],
        track: ['track'],
        input: ['input'],
      },
      c = Y(l, Ne, t);
    return { ...t, ...c };
  },
  Oe = E('span', {
    name: 'MuiSwitch',
    slot: 'Root',
    overridesResolver: (e, t) => {
      const { ownerState: a } = e;
      return [t.root, a.edge && t[`edge${B(a.edge)}`], t[`size${B(a.size)}`]];
    },
  })({
    display: 'inline-flex',
    width: 34 + 12 * 2,
    height: 14 + 12 * 2,
    overflow: 'hidden',
    padding: 12,
    boxSizing: 'border-box',
    position: 'relative',
    flexShrink: 0,
    zIndex: 0,
    verticalAlign: 'middle',
    '@media print': { colorAdjust: 'exact' },
    variants: [
      { props: { edge: 'start' }, style: { marginLeft: -8 } },
      { props: { edge: 'end' }, style: { marginRight: -8 } },
      {
        props: { size: 'small' },
        style: {
          width: 40,
          height: 24,
          padding: 7,
          [`& .${j.thumb}`]: { width: 16, height: 16 },
          [`& .${j.switchBase}`]: {
            padding: 4,
            [`&.${j.checked}`]: { transform: 'translateX(16px)' },
          },
        },
      },
    ],
  }),
  Ue = E(we, {
    name: 'MuiSwitch',
    slot: 'SwitchBase',
    overridesResolver: (e, t) => {
      const { ownerState: a } = e;
      return [
        t.switchBase,
        { [`& .${j.input}`]: t.input },
        a.color !== 'default' && t[`color${B(a.color)}`],
      ];
    },
  })(
    $(({ theme: e }) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      color: e.vars
        ? e.vars.palette.Switch.defaultColor
        : `${e.palette.mode === 'light' ? e.palette.common.white : e.palette.grey[300]}`,
      transition: e.transitions.create(['left', 'transform'], {
        duration: e.transitions.duration.shortest,
      }),
      [`&.${j.checked}`]: { transform: 'translateX(20px)' },
      [`&.${j.disabled}`]: {
        color: e.vars
          ? e.vars.palette.Switch.defaultDisabledColor
          : `${e.palette.mode === 'light' ? e.palette.grey[100] : e.palette.grey[600]}`,
      },
      [`&.${j.checked} + .${j.track}`]: { opacity: 0.5 },
      [`&.${j.disabled} + .${j.track}`]: {
        opacity: e.vars
          ? e.vars.opacity.switchTrackDisabled
          : `${e.palette.mode === 'light' ? 0.12 : 0.2}`,
      },
      [`& .${j.input}`]: { left: '-100%', width: '300%' },
    })),
    $(({ theme: e }) => ({
      '&:hover': {
        backgroundColor: e.vars
          ? `rgba(${e.vars.palette.action.activeChannel} / ${e.vars.palette.action.hoverOpacity})`
          : le(e.palette.action.active, e.palette.action.hoverOpacity),
        '@media (hover: none)': { backgroundColor: 'transparent' },
      },
      variants: [
        ...Object.entries(e.palette)
          .filter(ye(['light']))
          .map(([t]) => ({
            props: { color: t },
            style: {
              [`&.${j.checked}`]: {
                color: (e.vars || e).palette[t].main,
                '&:hover': {
                  backgroundColor: e.vars
                    ? `rgba(${e.vars.palette[t].mainChannel} / ${e.vars.palette.action.hoverOpacity})`
                    : le(e.palette[t].main, e.palette.action.hoverOpacity),
                  '@media (hover: none)': { backgroundColor: 'transparent' },
                },
                [`&.${j.disabled}`]: {
                  color: e.vars
                    ? e.vars.palette.Switch[`${t}DisabledColor`]
                    : `${e.palette.mode === 'light' ? je(e.palette[t].main, 0.62) : Le(e.palette[t].main, 0.55)}`,
                },
              },
              [`&.${j.checked} + .${j.track}`]: {
                backgroundColor: (e.vars || e).palette[t].main,
              },
            },
          })),
      ],
    }))
  ),
  qe = E('span', {
    name: 'MuiSwitch',
    slot: 'Track',
    overridesResolver: (e, t) => t.track,
  })(
    $(({ theme: e }) => ({
      height: '100%',
      width: '100%',
      borderRadius: 14 / 2,
      zIndex: -1,
      transition: e.transitions.create(['opacity', 'background-color'], {
        duration: e.transitions.duration.shortest,
      }),
      backgroundColor: e.vars
        ? e.vars.palette.common.onBackground
        : `${e.palette.mode === 'light' ? e.palette.common.black : e.palette.common.white}`,
      opacity: e.vars
        ? e.vars.opacity.switchTrack
        : `${e.palette.mode === 'light' ? 0.38 : 0.3}`,
    }))
  ),
  Ve = E('span', {
    name: 'MuiSwitch',
    slot: 'Thumb',
    overridesResolver: (e, t) => t.thumb,
  })(
    $(({ theme: e }) => ({
      boxShadow: (e.vars || e).shadows[1],
      backgroundColor: 'currentColor',
      width: 20,
      height: 20,
      borderRadius: '50%',
    }))
  ),
  ae = m.forwardRef(function (t, a) {
    const o = G({ props: t, name: 'MuiSwitch' }),
      {
        className: r,
        color: s = 'primary',
        edge: i = !1,
        size: l = 'medium',
        sx: c,
        ...u
      } = o,
      d = { ...o, color: s, edge: i, size: l },
      h = Fe(d),
      x = n.jsx(Ve, { className: h.thumb, ownerState: d });
    return n.jsxs(Oe, {
      className: X(h.root, r),
      sx: c,
      ownerState: d,
      children: [
        n.jsx(Ue, {
          type: 'checkbox',
          icon: x,
          checkedIcon: x,
          ref: a,
          ownerState: d,
          ...u,
          classes: { ...h, root: h.switchBase },
        }),
        n.jsx(qe, { className: h.track, ownerState: d }),
      ],
    });
  });
function We(e) {
  return K('MuiTable', e);
}
W('MuiTable', ['root', 'stickyHeader']);
const Ke = (e) => {
    const { classes: t, stickyHeader: a } = e;
    return Y({ root: ['root', a && 'stickyHeader'] }, We, t);
  },
  Ge = E('table', {
    name: 'MuiTable',
    slot: 'Root',
    overridesResolver: (e, t) => {
      const { ownerState: a } = e;
      return [t.root, a.stickyHeader && t.stickyHeader];
    },
  })(
    $(({ theme: e }) => ({
      display: 'table',
      width: '100%',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      '& caption': {
        ...e.typography.body2,
        padding: e.spacing(2),
        color: (e.vars || e).palette.text.secondary,
        textAlign: 'left',
        captionSide: 'bottom',
      },
      variants: [
        {
          props: ({ ownerState: t }) => t.stickyHeader,
          style: { borderCollapse: 'separate' },
        },
      ],
    }))
  ),
  ie = 'table',
  Xe = m.forwardRef(function (t, a) {
    const o = G({ props: t, name: 'MuiTable' }),
      {
        className: r,
        component: s = ie,
        padding: i = 'normal',
        size: l = 'medium',
        stickyHeader: c = !1,
        ...u
      } = o,
      d = { ...o, component: s, padding: i, size: l, stickyHeader: c },
      h = Ke(d),
      x = m.useMemo(
        () => ({ padding: i, size: l, stickyHeader: c }),
        [i, l, c]
      );
    return n.jsx(Te.Provider, {
      value: x,
      children: n.jsx(Ge, {
        as: s,
        role: s === ie ? null : 'table',
        ref: a,
        className: X(h.root, r),
        ownerState: d,
        ...u,
      }),
    });
  });
function Ye(e) {
  return K('MuiTableBody', e);
}
W('MuiTableBody', ['root']);
const Je = (e) => {
    const { classes: t } = e;
    return Y({ root: ['root'] }, Ye, t);
  },
  Qe = E('tbody', {
    name: 'MuiTableBody',
    slot: 'Root',
    overridesResolver: (e, t) => t.root,
  })({ display: 'table-row-group' }),
  Ze = { variant: 'body' },
  ce = 'tbody',
  et = m.forwardRef(function (t, a) {
    const o = G({ props: t, name: 'MuiTableBody' }),
      { className: r, component: s = ce, ...i } = o,
      l = { ...o, component: s },
      c = Je(l);
    return n.jsx(me.Provider, {
      value: Ze,
      children: n.jsx(Qe, {
        className: X(c.root, r),
        as: s,
        ref: a,
        role: s === ce ? null : 'rowgroup',
        ownerState: l,
        ...i,
      }),
    });
  });
function tt(e) {
  return K('MuiTableHead', e);
}
W('MuiTableHead', ['root']);
const nt = (e) => {
    const { classes: t } = e;
    return Y({ root: ['root'] }, tt, t);
  },
  ot = E('thead', {
    name: 'MuiTableHead',
    slot: 'Root',
    overridesResolver: (e, t) => t.root,
  })({ display: 'table-header-group' }),
  rt = { variant: 'head' },
  de = 'thead',
  at = m.forwardRef(function (t, a) {
    const o = G({ props: t, name: 'MuiTableHead' }),
      { className: r, component: s = de, ...i } = o,
      l = { ...o, component: s },
      c = nt(l);
    return n.jsx(me.Provider, {
      value: rt,
      children: n.jsx(ot, {
        as: s,
        className: X(c.root, r),
        ref: a,
        role: s === de ? null : 'rowgroup',
        ownerState: l,
        ...i,
      }),
    });
  }),
  fe = [
    {
      name: 'Boxes Stacked',
      viewBox: '0 0 576 512',
      d: 'M248 0L208 0c-26.5 0-48 21.5-48 48l0 112c0 35.3 28.7 64 64 64l128 0c35.3 0 64-28.7 64-64l0-112c0-26.5-21.5-48-48-48L328 0l0 80c0 8.8-7.2 16-16 16l-48 0c-8.8 0-16-7.2-16-16l0-80zM64 256c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l160 0c35.3 0 64-28.7 64-64l0-128c0-35.3-28.7-64-64-64l-40 0 0 80c0 8.8-7.2 16-16 16l-48 0c-8.8 0-16-7.2-16-16l0-80-40 0zM352 512l160 0c35.3 0 64-28.7 64-64l0-128c0-35.3-28.7-64-64-64l-40 0 0 80c0 8.8-7.2 16-16 16l-48 0c-8.8 0-16-7.2-16-16l0-80-40 0c-15 0-28.8 5.1-39.7 13.8c4.9 10.4 7.7 22 7.7 34.2l0 160c0 12.2-2.8 23.8-7.7 34.2C323.2 506.9 337 512 352 512z',
    },
    {
      name: 'Bricks',
      viewBox: '0 0 448 512',
      d: 'M96 32l0 80 256 0 0-80L96 32zM64 112l0-80C28.7 32 0 60.7 0 96l0 16 64 0zM0 144l0 96 208 0 0-96L0 144zM0 368l64 0 0-96L0 272l0 96zm0 32l0 16c0 35.3 28.7 64 64 64l144 0 0-80L0 400zm240 0l0 80 144 0c35.3 0 64-28.7 64-64l0-16-208 0zm208-32l0-96-64 0 0 96 64 0zm-96 0l0-96L96 272l0 96 256 0zm96-224l-208 0 0 96 208 0 0-96zm0-32l0-16c0-35.3-28.7-64-64-64l0 80 64 0z',
    },
    {
      name: 'Deer',
      viewBox: '0 0 512 512',
      d: 'M240 0c8.8 0 16 7.2 16 16l0 24c0 13.3 10.7 24 24 24l8 0 8 0c13.3 0 24-10.7 24-24l0-24c0-8.8 7.2-16 16-16s16 7.2 16 16l0 24c0 8.6-1.9 16.7-5.4 24l30.6 0L416 64c13.3 0 24-10.7 24-24l0-24c0-8.8 7.2-16 16-16s16 7.2 16 16l0 24c0 21.7-12.3 40.4-30.3 49.8c.6 .5 1.1 1.1 1.7 1.6l55.3 55.3c8.5 8.5 13.3 20 13.3 32c0 25-20.3 45.3-45.3 45.3L416 224l-5.3 0L384 304l0 64 0 112c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-112-36.3 0c-28.8 0-55.3-9.8-76.3-26.4c-2.1 16.9-9.8 32.6-21.9 44.8L142.9 397c-4.6 4.6-6.2 11.5-4 17.7l19.3 54.7c7.3 20.8-8.1 42.6-30.2 42.6l-33.9 0c-13.6 0-25.7-8.6-30.2-21.4l-15.5-44c-11.4-32.4-7.4-67.8 10-96.3C65 339.4 65 324.9 56 315.9c-3-3-5.7-6.1-8.1-9.5c-1.3 12.9-12.7 22.5-25.7 21.5C8.9 326.9-.9 315.4 .1 302.2L2.4 272c4.2-54.2 49.3-96 103.7-96l7.9 0 14.1 0 64 0c.6 0 1.2 0 1.7 0c.8 0 1.7 0 2.5 0l106.1 0 9.6-32-38 0c-9.9 0-18-8-18-18c0-8.2 5.6-15.4 13.6-17.4L320 96l-24 0-8 0-8 0c-30.9 0-56-25.1-56-56l0-24c0-8.8 7.2-16 16-16zM400 160a16 16 0 1 0 0-32 16 16 0 1 0 0 32z',
    },
    {
      name: 'Drumstick',
      viewBox: '0 0 512 512',
      d: 'M233.5 352l-58.4 58.3C185.6 421.1 192 435.8 192 452c0 33.1-26.9 60-60 60s-60-26.9-60-60l0-12-12 0c-33.1 0-60-26.9-60-60s26.9-60 60-60c16.2 0 30.9 6.4 41.6 16.8L160 278.5l0-22.5 0-24 0-56C160 78.8 238.8 0 336 0s176 78.8 176 176s-78.8 176-176 176l-56 0-24 0-22.5 0zM256 304l80 0c70.7 0 128-57.3 128-128s-57.3-128-128-128s-128 57.3-128 128l0 80 0 14.1L241.9 304l14.1 0z',
    },
    {
      name: 'Eye',
      viewBox: '0 0 576 512',
      d: 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z',
    },
    {
      name: 'Fish',
      viewBox: '0 0 576 512',
      d: 'M180.5 141.5C219.7 108.5 272.6 80 336 80s116.3 28.5 155.5 61.5c39.1 33 66.9 72.4 81 99.8c4.7 9.2 4.7 20.1 0 29.3c-14.1 27.4-41.9 66.8-81 99.8C452.3 403.5 399.4 432 336 432s-116.3-28.5-155.5-61.5c-16.2-13.7-30.5-28.5-42.7-43.1L48.1 379.6c-12.5 7.3-28.4 5.3-38.7-4.9S-3 348.7 4.2 336.1L50 256 4.2 175.9c-7.2-12.6-5-28.4 5.3-38.6s26.1-12.2 38.7-4.9l89.7 52.3c12.2-14.6 26.5-29.4 42.7-43.1zM448 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z',
    },
    {
      name: 'Fortress',
      viewBox: '0 0 640 512',
      d: 'M0 0L64 0l0 64 32 0L96 0l64 0 0 64 32 0 0-64 64 0 0 64 0 64 0 32 128 0 0-32 0-64 0-64 64 0 0 64 32 0 0-64 64 0 0 64 32 0 0-64 64 0 0 64 0 64 0 64-32 32 0 288-224 0 0-128c0-35.3-28.7-64-64-64s-64 28.7-64 64l0 128L32 512l0-288L0 192l0-64L0 64 0 0z',
    },
    {
      name: 'Hammer Brush',
      viewBox: '0 0 640 512',
      d: 'M144 0C64.5 0 0 64.5 0 144c0 5.5 2.9 10.7 7.6 13.6s10.6 3.2 15.6 .7l51.3-25.6c13.9 17.1 34.8 27.3 57.4 27.3l66.3 0c21.9 0 42-12.4 51.8-32l38.1 0c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l-38.1 0C240.1 12.4 220 0 198.1 0L144 0zM112 192L99.2 448.1c-1.7 34.8 26 63.9 60.8 63.9s62.5-29.1 60.8-63.9L208 192l-96 0zM418.2 505.4l20.7-62.1c2.9-8.8 15.3-8.8 18.2 0l20.7 62.1c1.3 3.9 5 6.6 9.1 6.6L592 512c26.5 0 48-21.5 48-48l0-144-288 0 0 144c0 26.5 21.5 48 48 48l9.1 0c4.1 0 7.8-2.6 9.1-6.6zM380.5 237c-17.2 11.5-27.7 30.5-28.5 51L640 288c-.7-20.5-11.3-39.5-28.5-51l-65.1-43.4c-.8-.5-1.6-.9-2.4-1.2L544 48c0-26.5-21.5-48-48-48s-48 21.5-48 48l0 144.5c-.9 .3-1.7 .7-2.4 1.2L380.5 237zM496 64a16 16 0 1 1 0-32 16 16 0 1 1 0 32z',
    },
    {
      name: 'Helmet',
      viewBox: '0 0 576 512',
      d: 'M80 17.1c.6-8.3-5.3-15.7-13.6-17s-16.1 4.1-18 12.2L.8 218.8c-.5 2.2-.8 4.5-.8 6.8C0 242.4 13.6 256 30.4 256l2.2 0c17.1 0 31.3-13.2 32.5-30.2L80 17.1zM320 352l0 136c0 18.4 20.8 30.1 36.5 20.5l144-88c9.2-5.6 13.5-16.7 10.6-27.1C494.1 333.6 480 270.2 480 208c0-85-89.1-149.2-153.1-189c-1.9-1.2-4-2.6-6.3-4.1C311.2 8.4 298.7 0 288 0s-23.2 8.4-32.7 14.9c-2.3 1.5-4.4 3-6.3 4.1C185.1 58.8 96 123 96 208c0 62.2-14.1 125.6-31.1 185.4c-3 10.4 1.4 21.4 10.6 27.1l144 88c15.7 9.6 36.5-2.1 36.5-20.5l0-192s0 0 0 0l0-28.5c0-6.9-4.4-13-10.9-15.2l-72.3-24.1c-7.6-2.5-12.7-9.6-12.7-17.6c0-10.3 8.3-18.6 18.6-18.6l218.8 0c10.3 0 18.6 8.3 18.6 18.6c0 8-5.1 15.1-12.7 17.6l-72.3 24.1c-6.5 2.2-10.9 8.3-10.9 15.2l0 84.5s0 0 0 0zM509.6 .2c-8.3 1.2-14.2 8.6-13.6 17l14.9 208.6c1.2 17 15.4 30.2 32.5 30.2l2.2 0c16.8 0 30.4-13.6 30.4-30.4c0-2.3-.3-4.6-.8-6.8L527.6 12.4c-1.9-8.1-9.7-13.5-18-12.2z',
    },
    {
      name: 'House Tree',
      viewBox: '0 0 640 512',
      d: 'M417.4 7.5C412.9 2.7 406.6 0 400 0s-12.9 2.7-17.4 7.5l-103.5 109 35.4 32.4 85.5-90L496.1 160 448 160c-9.6 0-18.2 5.7-22 14.5s-2 19 4.6 26L528.3 304 480 304c-9.4 0-17.9 5.4-21.8 13.9s-2.6 18.5 3.5 25.6L564.1 464 416 464c0 18-6 34.6-16 48l216 0c9.4 0 17.9-5.4 21.8-13.9s2.6-18.5-3.5-25.6L531.9 352l52.1 0c9.6 0 18.2-5.7 22-14.5s2-19-4.6-26L503.7 208l48.3 0c9.6 0 18.3-5.7 22.1-14.5s2-19-4.7-26l-152-160zM20.8 237C7.5 249.1 0 266.2 0 284.2L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-163.8c0-17.9-7.5-35.1-20.8-47.2l-128-117.3c-24.5-22.4-62-22.4-86.5 0L20.8 237zM48 284.2c0-4.5 1.9-8.8 5.2-11.8L181.2 155c6.1-5.6 15.5-5.6 21.6 0l128 117.3c3.3 3 5.2 7.3 5.2 11.8L336 448c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-163.8zM144 296l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24z',
    },
    {
      name: 'Medical',
      viewBox: '0 0 576 512',
      d: 'M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l32 0L96 32 64 32zm64 0l0 448 320 0 0-448L128 32zM512 480c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-32 0 0 448 32 0zM256 176c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 48 48 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-48 0 0 48c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-48-48 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l48 0 0-48z',
    },
    {
      name: 'People Group',
      viewBox: '0 0 640 512',
      d: 'M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3l0-84.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5l0 21.5c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-26.8C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112l32 0c24 0 46.2 7.5 64.4 20.3zM448 416l0-21.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176l32 0c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2l0 26.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3l0-84.7c-10 11.3-16 26.1-16 42.3zm144-42.3l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2l0 42.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-42.8c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112l32 0c61.9 0 112 50.1 112 112z',
    },
    {
      name: 'Pickaxe',
      viewBox: '0 0 512 512',
      d: 'M462.4 373.5s0 0 0 0l-.1-.2-.3-.8c-.3-.7-.7-1.8-1.3-3.3c-1.2-2.9-3-7.2-5.5-12.7c-5-11-12.6-26.7-23.1-45.3c-21-37.3-53.6-86-99.5-132s-94.7-78.5-132-99.5c-18.6-10.5-34.3-18.1-45.3-23.1c-5.5-2.5-9.8-4.3-12.7-5.5c-1.4-.6-2.5-1-3.3-1.3l-.8-.3-.2-.1s0 0 0 0s0 0 0 0c-6.2-2.3-10.4-8.2-10.5-14.8s3.9-12.6 10-15.1C169.5 7 204 0 240 0c59.6 0 114.7 19.2 159.5 51.6l9.4-9.8c6-6.2 14.2-9.7 22.8-9.8s16.9 3.3 22.9 9.4l16 16c6.1 6.1 9.5 14.3 9.4 22.9s-3.6 16.8-9.8 22.8l-9.8 9.4C492.8 157.3 512 212.4 512 272c0 36-7 70.5-19.8 102c-2.5 6.1-8.5 10.1-15.1 10s-12.5-4.3-14.8-10.5c0 0 0 0 0 0zM9.4 502.6C-3 490.3-3.1 470.4 8.9 457.8l272-282.9c9.7 8.4 19.5 17.4 29.1 27s18.6 19.4 27 29.1L54.2 503.1c-12.6 12.1-32.5 11.9-44.8-.4z',
    },
    {
      name: 'Plant Seedling',
      viewBox: '0 0 512 512',
      d: 'M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0l32 0c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64l32 0c123.7 0 224 100.3 224 224l0 32 0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160C100.3 320 0 219.7 0 96z',
    },
    {
      name: 'Scales Balanced',
      viewBox: '0 0 640 512',
      d: 'M384 32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L398.4 96c-5.2 25.8-22.9 47.1-46.4 57.3L352 448l160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0-192 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0 0-294.7c-23.5-10.3-41.2-31.6-46.4-57.3L128 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l128 0c14.6-19.4 37.8-32 64-32s49.4 12.6 64 32zm55.6 288l144.9 0L512 195.8 439.6 320zM512 416c-62.9 0-115.2-34-126-78.9c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C627.2 382 574.9 416 512 416zM126.8 195.8L54.4 320l144.9 0L126.8 195.8zM.9 337.1c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C242 382 189.7 416 126.8 416S11.7 382 .9 337.1z',
    },
    {
      name: 'Scroll',
      viewBox: ' 0 0 576 512',
      d: 'M0 80l0 48c0 17.7 14.3 32 32 32l16 0 48 0 0-80c0-26.5-21.5-48-48-48S0 53.5 0 80zM112 32c10 13.4 16 30 16 48l0 304c0 35.3 28.7 64 64 64s64-28.7 64-64l0-5.3c0-32.4 26.3-58.7 58.7-58.7L480 320l0-192c0-53-43-96-96-96L112 32zM464 480c61.9 0 112-50.1 112-112c0-8.8-7.2-16-16-16l-245.3 0c-14.7 0-26.7 11.9-26.7 26.7l0 5.3c0 53-43 96-96 96l176 0 96 0z',
    },
    {
      name: 'Sheep',
      viewBox: '0 0 640 512',
      d: 'M384 135.8l0 72.2c0 44.2 35.8 80 80 80l32 0c44.2 0 80-35.8 80-80l0-72.2 14.5 6.2c12.2 5.2 26.3-.4 31.5-12.6s-.4-26.3-12.6-31.5L561.6 77.4C544.7 50.2 514.5 32 480 32s-64.7 18.2-81.6 45.4L350.5 97.9c-12.2 5.2-17.8 19.3-12.6 31.5s19.3 17.8 31.5 12.6l14.5-6.2zm80-7.8a16 16 0 1 1 0 32 16 16 0 1 1 0-32zm48 16a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zm-203.1-1l-.4-.9c-6.9-16.1-5.7-33.5 1.8-47.9c-7.4-11.8-18.5-21-31.7-26C271.6 65.5 264 64 256 64c-19.2 0-36.5 8.5-48.2 21.9C196.9 77.2 183 72 168 72c-30.1 0-55.3 20.8-62.2 48.8c-3.2-.5-6.5-.8-9.8-.8c-35.3 0-64 28.7-64 64c0 5.3 .7 10.5 1.9 15.5C13.7 210.3 0 231.5 0 256s13.7 45.7 33.9 56.5c-1.2 5-1.9 10.2-1.9 15.5c0 35.3 28.7 64 64 64c.5 0 1 0 1.5 0l17.6 93.9c2.8 15.1 16.1 26.1 31.5 26.1l29.4 0c17.7 0 32-14.3 32-32l0-53.7c11.7 13.3 28.9 21.7 48 21.7s36.3-8.4 48-21.7l0 53.7c0 17.7 14.3 32 32 32l29.4 0c15.4 0 28.6-11 31.4-26.1L414.5 392c.5 0 1 0 1.5 0c35.3 0 64-28.7 64-64c0-2.7-.2-5.4-.5-8L464 320c-11.8 0-23.2-1.8-33.8-5.2c.2 3.1 .6 6.2 1.4 9.3c.3 1.2 .5 2.5 .5 3.9c0 8.8-7.2 16-16 16c-.9 0-1.7-.1-2.5-.2c-24.6-3.8-48 11.9-53.9 36c-1.7 7-8.1 12.1-15.5 12.1c-3.8 0-7.2-1.3-9.9-3.4c-20.1-16-49.1-13.3-66 6c-3 3.4-7.3 5.5-12.1 5.5s-9.1-2.1-12.1-5.5c-16.9-19.3-45.9-21.9-66-6c-2.7 2.2-6.1 3.4-9.9 3.4c-7.5 0-13.8-5.1-15.5-12.1c-5.9-24.2-29.3-39.8-53.9-36c-.8 .1-1.6 .2-2.5 .2c-8.8 0-16-7.2-16-16c0-1.4 .2-2.7 .5-3.9c5.3-21.3-4.6-43.6-24-53.9C51.3 267.4 48 262 48 256s3.3-11.4 8.5-14.2c19.4-10.4 29.3-32.6 24-53.9c-.3-1.2-.5-2.5-.5-3.9c0-8.8 7.2-16 16-16c.9 0 1.7 .1 2.5 .2c24.6 3.8 48-11.9 53.9-36c1.7-7 8.1-12.1 15.5-12.1c3.8 0 7.2 1.3 9.9 3.5c20.1 16 49.1 13.3 66-6c3-3.4 7.3-5.5 12.1-5.5c5.8 0 10.9 3 13.7 7.8c8 13.3 22 21.9 37.4 23.1c.6 0 1.2 .1 1.7 .1z',
    },
    {
      name: 'Shield',
      viewBox: '0 0 512 512',
      d: 'M267.5 10.1L256 5.7l-11.5 4.4L37 90.2 17.8 97.6l-1.2 20.6C13.6 167.8 21.4 243.7 53.9 318C86.6 392.8 145 467.1 243.4 509.4l12.6 5.4 12.6-5.4C367 467.1 425.4 392.8 458.1 318c32.5-74.2 40.3-150.2 37.3-199.8l-1.2-20.6L475 90.2l-207.5-80zM256 74.3s0 0 0 0l176 67.9c-.5 40.6-8.8 96-32.5 150.2C373.3 352.2 328.9 409.5 256 444.8l0-370.5z',
    },
    {
      name: 'Swords',
      viewBox: '0 0 512 512',
      d: 'M96 329.4l50.7-50.7 86.6 86.6L182.6 416l20.7 20.7c6.2 6.2 6.2 16.4 0 22.6l-16 16c-4.7 4.7-11.8 6-17.8 3.3l-62-27.5L51.3 507.3c-6.2 6.2-16.4 6.2-22.6 0l-24-24c-6.2-6.2-6.2-16.4 0-22.6l56.2-56.2-27.5-62c-2.7-6.1-1.4-13.1 3.3-17.8l16-16c6.2-6.2 16.4-6.2 22.6 0L96 329.4zM484.5 114.2L365.3 233.4l-86.6-86.6L397.8 27.5c6.7-6.7 15.2-11.3 24.5-13.1L492.9 .3c5.2-1 10.7 .6 14.5 4.4s5.4 9.2 4.4 14.5L497.6 89.6c-1.9 9.3-6.4 17.8-13.1 24.5zM4.7 4.7C8.5 .9 13.9-.7 19.1 .3L89.6 14.4c9.3 1.9 17.8 6.4 24.5 13.1L393.4 306.7l-86.6 86.6L27.5 114.2c-6.7-6.7-11.3-15.2-13.1-24.5L.3 19.1C-.7 13.9 .9 8.5 4.7 4.7zm454.6 304l16 16c4.7 4.7 6 11.8 3.3 17.8l-27.5 62 56.2 56.2c6.2 6.2 6.2 16.4 0 22.6l-24 24c-6.2 6.2-16.4 6.2-22.6 0l-56.2-56.2-62 27.5c-6.1 2.7-13.1 1.4-17.8-3.3l-16-16c-6.2-6.2-6.2-16.4 0-22.6l128-128c6.2-6.2 16.4-6.2 22.6 0z',
    },
    {
      name: 'Tents',
      viewBox: '0 0 640 512',
      d: 'M396.6 6.5L235.8 129.1c9.6 1.8 18.9 5.8 27 12l168 128c13.2 10.1 22 24.9 24.5 41.4l6.2 41.5L608 352c9.3 0 18.2-4.1 24.2-11.1s8.8-16.4 7.4-25.6l-24-160c-1.2-8.2-5.6-15.7-12.3-20.7l-168-128c-11.5-8.7-27.3-8.7-38.8 0zm-153.2 160c-11.5-8.7-27.3-8.7-38.8 0l-168 128c-6.6 5-11 12.5-12.3 20.7l-24 160c-1.4 9.2 1.3 18.6 7.4 25.6S22.7 512 32 512l144 0 16 0c17.7 0 32-14.3 32-32l0-118.1c0-5.5 4.4-9.9 9.9-9.9c3.7 0 7.2 2.1 8.8 5.5l68.4 136.8c5.4 10.8 16.5 17.7 28.6 17.7l60.2 0 16 0c9.3 0 18.2-4.1 24.2-11.1s8.8-16.4 7.4-25.6l-24-160c-1.2-8.2-5.6-15.7-12.3-20.7l-168-128z',
    },
    {
      name: 'Theater Masks',
      viewBox: '0 0 640 512',
      d: 'M74.6 373.2c41.7 36.1 108 82.5 166.1 73.7c6.1-.9 12.1-2.5 18-4.5c-9.2-12.3-17.3-24.4-24.2-35.4c-21.9-35-28.8-75.2-25.9-113.6c-20.6 4.1-39.2 13-54.7 25.4c-6.5 5.2-16.3 1.3-14.8-7c6.4-33.5 33-60.9 68.2-66.3c2.6-.4 5.3-.7 7.9-.8l19.4-131.3c2-13.8 8-32.7 25-45.9C278.2 53.2 310.5 37 363.2 32.2c-.8-.7-1.6-1.4-2.4-2.1C340.6 14.5 288.4-11.5 175.7 5.6S20.5 63 5.7 83.9C0 91.9-.8 102 .6 111.8L24.8 276.1c5.5 37.3 21.5 72.6 49.8 97.2zm87.7-219.6c4.4-3.1 10.8-2 11.8 3.3c.1 .5 .2 1.1 .3 1.6c3.2 21.8-11.6 42-33.1 45.3s-41.5-11.8-44.7-33.5c-.1-.5-.1-1.1-.2-1.6c-.6-5.4 5.2-8.4 10.3-6.7c9 3 18.8 3.9 28.7 2.4s19.1-5.3 26.8-10.8zM261.6 390c29.4 46.9 79.5 110.9 137.6 119.7s124.5-37.5 166.1-73.7c28.3-24.5 44.3-59.8 49.8-97.2l24.2-164.3c1.4-9.8 .6-19.9-5.1-27.9c-14.8-20.9-57.3-61.2-170-78.3S299.4 77.2 279.2 92.8c-7.8 6-11.5 15.4-12.9 25.2L242.1 282.3c-5.5 37.3-.4 75.8 19.6 107.7zM404.5 235.3c-7.7-5.5-16.8-9.3-26.8-10.8s-19.8-.6-28.7 2.4c-5.1 1.7-10.9-1.3-10.3-6.7c.1-.5 .1-1.1 .2-1.6c3.2-21.8 23.2-36.8 44.7-33.5s36.3 23.5 33.1 45.3c-.1 .5-.2 1.1-.3 1.6c-1 5.3-7.4 6.4-11.8 3.3zm136.2 15.5c-1 5.3-7.4 6.4-11.8 3.3c-7.7-5.5-16.8-9.3-26.8-10.8s-19.8-.6-28.7 2.4c-5.1 1.7-10.9-1.3-10.3-6.7c.1-.5 .1-1.1 .2-1.6c3.2-21.8 23.2-36.8 44.7-33.5s36.3 23.5 33.1 45.3c-.1 .5-.2 1.1-.3 1.6zM530 350.2c-19.6 44.7-66.8 72.5-116.8 64.9s-87.1-48.2-93-96.7c-1-8.3 8.9-12.1 15.2-6.7c23.9 20.8 53.6 35.3 87 40.3s66.1 .1 94.9-12.8c7.6-3.4 16 3.2 12.6 10.9z',
    },
    {
      name: 'Wheat',
      viewBox: '0 0 512 512',
      d: 'M472 0c-48.6 0-88 39.4-88 88l0 24c0 8.8 7.2 16 16 16l24 0c48.6 0 88-39.4 88-88l0-24c0-8.8-7.2-16-16-16L472 0zM305.5 27.3c-6.2-6.2-16.4-6.2-22.6 0L271.5 38.6c-37.5 37.5-37.5 98.3 0 135.8l10.4 10.4-30.5 30.5c-3.4-27.3-15.5-53.8-36.5-74.8l-11.3-11.3c-6.2-6.2-16.4-6.2-22.6 0l-11.3 11.3c-37.5 37.5-37.5 98.3 0 135.8l10.4 10.4-30.5 30.5c-3.4-27.3-15.5-53.8-36.5-74.8L101.8 231c-6.2-6.2-16.4-6.2-22.6 0L67.9 242.3c-37.5 37.5-37.5 98.3 0 135.8l10.4 10.4L9.4 457.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l68.9-68.9 12.2 12.2c37.5 37.5 98.3 37.5 135.8 0l11.3-11.3c6.2-6.2 6.2-16.4 0-22.6l-11.3-11.3c-21.8-21.8-49.6-34.1-78.1-36.9l31.9-31.9 12.2 12.2c37.5 37.5 98.3 37.5 135.8 0l11.3-11.3c6.2-6.2 6.2-16.4 0-22.6l-11.3-11.3c-21.8-21.8-49.6-34.1-78.1-36.9l31.9-31.9 12.2 12.2c37.5 37.5 98.3 37.5 135.8 0L486.5 231c6.2-6.2 6.2-16.4 0-22.6L475.2 197c-34.1-34.1-82.6-44.9-125.9-32.5c12.4-43.3 1.5-91.8-32.5-125.9L305.5 27.3z',
    },
  ];
function st() {
  const e = [9, 29, 49, 69, 84, 99, 100],
    t = { data: {}, order: [] };
  t.order = e.map((r) => {
    const s = F();
    return (t.data[s] = { name: '', max: r }), s;
  });
  const a = { data: {}, order: [] },
    o = F();
  return (
    (a.data[o] = { name: 'default', value: 1 }),
    (a.order = [o]),
    {
      id: F(),
      refId: F(),
      version: 1,
      positive: !0,
      name: '',
      description: '',
      balance: { maxPerLevel: 0, healthPerLevel: 0, costPerLevel: 0 },
      thresholds: t,
      settlementPointCost: a,
      icon: { ...fe[0] },
      iconColor: '#000000',
      tags: [],
      isValid: !1,
      status: 'DRAFT',
      createdBy: '',
    }
  );
}
function Q() {
  return (Q =
    Object.assign ||
    function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var o in a)
          Object.prototype.hasOwnProperty.call(a, o) && (e[o] = a[o]);
      }
      return e;
    }).apply(this, arguments);
}
function ve(e, t) {
  if (e == null) return {};
  var a,
    o,
    r = {},
    s = Object.keys(e);
  for (o = 0; o < s.length; o++) t.indexOf((a = s[o])) >= 0 || (r[a] = e[a]);
  return r;
}
function te(e) {
  var t = m.useRef(e),
    a = m.useRef(function (o) {
      t.current && t.current(o);
    });
  return (t.current = e), a.current;
}
var N = function (e, t, a) {
    return (
      t === void 0 && (t = 0),
      a === void 0 && (a = 1),
      e > a ? a : e < t ? t : e
    );
  },
  H = function (e) {
    return 'touches' in e;
  },
  ne = function (e) {
    return (e && e.ownerDocument.defaultView) || self;
  },
  ue = function (e, t, a) {
    var o = e.getBoundingClientRect(),
      r = H(t)
        ? (function (s, i) {
            for (var l = 0; l < s.length; l++)
              if (s[l].identifier === i) return s[l];
            return s[0];
          })(t.touches, a)
        : t;
    return {
      left: N((r.pageX - (o.left + ne(e).pageXOffset)) / o.width),
      top: N((r.pageY - (o.top + ne(e).pageYOffset)) / o.height),
    };
  },
  he = function (e) {
    !H(e) && e.preventDefault();
  },
  ge = C.memo(function (e) {
    var t = e.onMove,
      a = e.onKey,
      o = ve(e, ['onMove', 'onKey']),
      r = m.useRef(null),
      s = te(t),
      i = te(a),
      l = m.useRef(null),
      c = m.useRef(!1),
      u = m.useMemo(
        function () {
          var S = function (y) {
              he(y),
                (H(y) ? y.touches.length > 0 : y.buttons > 0) && r.current
                  ? s(ue(r.current, y, l.current))
                  : I(!1);
            },
            Z = function () {
              return I(!1);
            };
          function I(y) {
            var b = c.current,
              T = ne(r.current),
              M = y ? T.addEventListener : T.removeEventListener;
            M(b ? 'touchmove' : 'mousemove', S),
              M(b ? 'touchend' : 'mouseup', Z);
          }
          return [
            function (y) {
              var b = y.nativeEvent,
                T = r.current;
              if (
                T &&
                (he(b),
                !(function (p, f) {
                  return f && !H(p);
                })(b, c.current) && T)
              ) {
                if (H(b)) {
                  c.current = !0;
                  var M = b.changedTouches || [];
                  M.length && (l.current = M[0].identifier);
                }
                T.focus(), s(ue(T, b, l.current)), I(!0);
              }
            },
            function (y) {
              var b = y.which || y.keyCode;
              b < 37 ||
                b > 40 ||
                (y.preventDefault(),
                i({
                  left: b === 39 ? 0.05 : b === 37 ? -0.05 : 0,
                  top: b === 40 ? 0.05 : b === 38 ? -0.05 : 0,
                }));
            },
            I,
          ];
        },
        [i, s]
      ),
      d = u[0],
      h = u[1],
      x = u[2];
    return (
      m.useEffect(
        function () {
          return x;
        },
        [x]
      ),
      C.createElement(
        'div',
        Q({}, o, {
          onTouchStart: d,
          onMouseDown: d,
          className: 'react-colorful__interactive',
          ref: r,
          onKeyDown: h,
          tabIndex: 0,
          role: 'slider',
        })
      )
    );
  }),
  se = function (e) {
    return e.filter(Boolean).join(' ');
  },
  xe = function (e) {
    var t = e.color,
      a = e.left,
      o = e.top,
      r = o === void 0 ? 0.5 : o,
      s = se(['react-colorful__pointer', e.className]);
    return C.createElement(
      'div',
      { className: s, style: { top: 100 * r + '%', left: 100 * a + '%' } },
      C.createElement('div', {
        className: 'react-colorful__pointer-fill',
        style: { backgroundColor: t },
      })
    );
  },
  w = function (e, t, a) {
    return (
      t === void 0 && (t = 0),
      a === void 0 && (a = Math.pow(10, t)),
      Math.round(a * e) / a
    );
  },
  lt = function (e) {
    return ht(oe(e));
  },
  oe = function (e) {
    return (
      e[0] === '#' && (e = e.substring(1)),
      e.length < 6
        ? {
            r: parseInt(e[0] + e[0], 16),
            g: parseInt(e[1] + e[1], 16),
            b: parseInt(e[2] + e[2], 16),
            a: e.length === 4 ? w(parseInt(e[3] + e[3], 16) / 255, 2) : 1,
          }
        : {
            r: parseInt(e.substring(0, 2), 16),
            g: parseInt(e.substring(2, 4), 16),
            b: parseInt(e.substring(4, 6), 16),
            a: e.length === 8 ? w(parseInt(e.substring(6, 8), 16) / 255, 2) : 1,
          }
    );
  },
  it = function (e) {
    return ut(dt(e));
  },
  ct = function (e) {
    var t = e.s,
      a = e.v,
      o = e.a,
      r = ((200 - t) * a) / 100;
    return {
      h: w(e.h),
      s: w(
        r > 0 && r < 200 ? ((t * a) / 100 / (r <= 100 ? r : 200 - r)) * 100 : 0
      ),
      l: w(r / 2),
      a: w(o, 2),
    };
  },
  re = function (e) {
    var t = ct(e);
    return 'hsl(' + t.h + ', ' + t.s + '%, ' + t.l + '%)';
  },
  dt = function (e) {
    var t = e.h,
      a = e.s,
      o = e.v,
      r = e.a;
    (t = (t / 360) * 6), (a /= 100), (o /= 100);
    var s = Math.floor(t),
      i = o * (1 - a),
      l = o * (1 - (t - s) * a),
      c = o * (1 - (1 - t + s) * a),
      u = s % 6;
    return {
      r: w(255 * [o, l, i, i, c, o][u]),
      g: w(255 * [c, o, o, l, i, i][u]),
      b: w(255 * [i, i, c, o, o, l][u]),
      a: w(r, 2),
    };
  },
  U = function (e) {
    var t = e.toString(16);
    return t.length < 2 ? '0' + t : t;
  },
  ut = function (e) {
    var t = e.r,
      a = e.g,
      o = e.b,
      r = e.a,
      s = r < 1 ? U(w(255 * r)) : '';
    return '#' + U(t) + U(a) + U(o) + s;
  },
  ht = function (e) {
    var t = e.r,
      a = e.g,
      o = e.b,
      r = e.a,
      s = Math.max(t, a, o),
      i = s - Math.min(t, a, o),
      l = i
        ? s === t
          ? (a - o) / i
          : s === a
            ? 2 + (o - t) / i
            : 4 + (t - a) / i
        : 0;
    return {
      h: w(60 * (l < 0 ? l + 6 : l)),
      s: w(s ? (i / s) * 100 : 0),
      v: w((s / 255) * 100),
      a: r,
    };
  },
  pt = C.memo(function (e) {
    var t = e.hue,
      a = e.onChange,
      o = se(['react-colorful__hue', e.className]);
    return C.createElement(
      'div',
      { className: o },
      C.createElement(
        ge,
        {
          onMove: function (r) {
            a({ h: 360 * r.left });
          },
          onKey: function (r) {
            a({ h: N(t + 360 * r.left, 0, 360) });
          },
          'aria-label': 'Hue',
          'aria-valuenow': w(t),
          'aria-valuemax': '360',
          'aria-valuemin': '0',
        },
        C.createElement(xe, {
          className: 'react-colorful__hue-pointer',
          left: t / 360,
          color: re({ h: t, s: 100, v: 100, a: 1 }),
        })
      )
    );
  }),
  mt = C.memo(function (e) {
    var t = e.hsva,
      a = e.onChange,
      o = { backgroundColor: re({ h: t.h, s: 100, v: 100, a: 1 }) };
    return C.createElement(
      'div',
      { className: 'react-colorful__saturation', style: o },
      C.createElement(
        ge,
        {
          onMove: function (r) {
            a({ s: 100 * r.left, v: 100 - 100 * r.top });
          },
          onKey: function (r) {
            a({
              s: N(t.s + 100 * r.left, 0, 100),
              v: N(t.v - 100 * r.top, 0, 100),
            });
          },
          'aria-label': 'Color',
          'aria-valuetext':
            'Saturation ' + w(t.s) + '%, Brightness ' + w(t.v) + '%',
        },
        C.createElement(xe, {
          className: 'react-colorful__saturation-pointer',
          top: 1 - t.v / 100,
          left: t.s / 100,
          color: re(t),
        })
      )
    );
  }),
  be = function (e, t) {
    if (e === t) return !0;
    for (var a in e) if (e[a] !== t[a]) return !1;
    return !0;
  },
  ft = function (e, t) {
    return e.toLowerCase() === t.toLowerCase() || be(oe(e), oe(t));
  };
function vt(e, t, a) {
  var o = te(a),
    r = m.useState(function () {
      return e.toHsva(t);
    }),
    s = r[0],
    i = r[1],
    l = m.useRef({ color: t, hsva: s });
  m.useEffect(
    function () {
      if (!e.equal(t, l.current.color)) {
        var u = e.toHsva(t);
        (l.current = { hsva: u, color: t }), i(u);
      }
    },
    [t, e]
  ),
    m.useEffect(
      function () {
        var u;
        be(s, l.current.hsva) ||
          e.equal((u = e.fromHsva(s)), l.current.color) ||
          ((l.current = { hsva: s, color: u }), o(u));
      },
      [s, e, o]
    );
  var c = m.useCallback(function (u) {
    i(function (d) {
      return Object.assign({}, d, u);
    });
  }, []);
  return [s, c];
}
var gt = typeof window < 'u' ? m.useLayoutEffect : m.useEffect,
  xt = function () {
    return typeof __webpack_nonce__ < 'u' ? __webpack_nonce__ : void 0;
  },
  pe = new Map(),
  bt = function (e) {
    gt(function () {
      var t = e.current ? e.current.ownerDocument : document;
      if (t !== void 0 && !pe.has(t)) {
        var a = t.createElement('style');
        (a.innerHTML = `.react-colorful{position:relative;display:flex;flex-direction:column;width:200px;height:200px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.react-colorful__saturation{position:relative;flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(0deg,#000,transparent),linear-gradient(90deg,#fff,hsla(0,0%,100%,0))}.react-colorful__alpha-gradient,.react-colorful__pointer-fill{content:"";position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;border-radius:inherit}.react-colorful__alpha-gradient,.react-colorful__saturation{box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}.react-colorful__alpha,.react-colorful__hue{position:relative;height:24px}.react-colorful__hue{background:linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)}.react-colorful__last-control{border-radius:0 0 8px 8px}.react-colorful__interactive{position:absolute;left:0;top:0;right:0;bottom:0;border-radius:inherit;outline:none;touch-action:none}.react-colorful__pointer{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}.react-colorful__interactive:focus .react-colorful__pointer{transform:translate(-50%,-50%) scale(1.1)}.react-colorful__alpha,.react-colorful__alpha-pointer{background-color:#fff;background-image:url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')}.react-colorful__saturation-pointer{z-index:3}.react-colorful__hue-pointer{z-index:2}`),
          pe.set(t, a);
        var o = xt();
        o && a.setAttribute('nonce', o), t.head.appendChild(a);
      }
    }, []);
  },
  Ct = function (e) {
    var t = e.className,
      a = e.colorModel,
      o = e.color,
      r = o === void 0 ? a.defaultColor : o,
      s = e.onChange,
      i = ve(e, ['className', 'colorModel', 'color', 'onChange']),
      l = m.useRef(null);
    bt(l);
    var c = vt(a, r, s),
      u = c[0],
      d = c[1],
      h = se(['react-colorful', t]);
    return C.createElement(
      'div',
      Q({}, i, { ref: l, className: h }),
      C.createElement(mt, { hsva: u, onChange: d }),
      C.createElement(pt, {
        hue: u.h,
        onChange: d,
        className: 'react-colorful__last-control',
      })
    );
  },
  wt = {
    defaultColor: '000',
    toHsva: lt,
    fromHsva: function (e) {
      return it({ h: e.h, s: e.s, v: e.v, a: 1 });
    },
    equal: ft,
  },
  yt = function (e) {
    return C.createElement(Ct, Q({}, e, { colorModel: wt }));
  };
const jt = ({ onChange: e, sourceColor: t = '#000000' }) => {
    const [a, o] = m.useState(t),
      r = (s) => {
        o(s), e(s);
      };
    return n.jsx(v, {
      sx: { mt: 2, display: 'flex', alignItems: 'center', gap: 1 },
      children: n.jsx(yt, { color: a, onChange: r }),
    });
  },
  Lt = ({ tool: e, setShowModal: t, id: a }) => {
    const { edit: o, updateTool: r } = A(e, a),
      [s, i] = m.useState(o.icon),
      l = (d, h) => {
        i(h), r('icon', h);
      },
      c = (d) => {
        r('iconColor', d);
      },
      u = (d, h) => {
        r('icon', d), r('iconColor', h), t(null);
      };
    return n.jsxs(v, {
      sx: {
        display: 'grid',
        gap: 1,
        gridTemplateColumns: 'repeat(6, 1fr)',
        width: '100%',
        minWidth: ['100%', 800],
      },
      children: [
        n.jsxs(v, {
          sx: {
            my: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: 1,
            gridColumn: 'span 6',
          },
          children: [
            n.jsxs(v, {
              sx: {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexDirection: 'column',
              },
              children: [
                n.jsx(g, { children: 'Selected Icon:' }),
                n.jsx(V, {
                  viewBox: s.viewBox,
                  path: s.d,
                  size: 48,
                  color: o.iconColor,
                }),
              ],
            }),
            n.jsx(jt, { onChange: c, sourceColor: o.iconColor }),
          ],
        }),
        fe.map(
          (d, h) =>
            d.name !== s.name &&
            n.jsx(
              Re,
              {
                sx: { display: 'flex', justifyContent: 'center' },
                children: n.jsx(q, {
                  onClick: () => l(null, d),
                  sx: {
                    display: 'flex',
                    justifyContent: 'center',
                    width: ['60px', '80px', '100px'],
                    height: ['60px', '80px', '100px'],
                  },
                  children: n.jsx(V, {
                    viewBox: d.viewBox,
                    path: d.d,
                    size: 48,
                    color: o.iconColor,
                  }),
                }),
              },
              h
            )
        ),
        n.jsx(q, {
          variant: 'contained',
          sx: { gridColumn: 'span 6', mt: 2 },
          onClick: () => u(s, o.iconColor),
          children: 'Confirm',
        }),
      ],
    });
  },
  z = {
    name: {
      name: 'name',
      label: 'Attribute Name',
      type: 'text',
      tooltip:
        "The unique name of the attribute. This should clearly convey the attribute's purpose and role within the settlement mechanics.",
      validate: (e) =>
        e
          ? e.length < 3
            ? 'Attribute name must be at least 3 characters long'
            : null
          : 'Attribute name is required',
      keypath: 'name',
    },
    costPerLevel: {
      name: 'costPerLevel',
      label: 'Currency Cost Per Level',
      type: 'number',
      tooltip:
        "The amount of currency required per level to acquire this attribute. This cost scales with the settlement's level.",
      validate: (e) =>
        e
          ? e <= 0
            ? 'Cost per level must be greater than 0'
            : null
          : 'Cost per level is required',
      keypath: 'balance.costPerLevel',
    },
    healthPerLevel: {
      name: 'healthPerLevel',
      label: 'Health Drain Per Level',
      type: 'number',
      tooltip:
        'This value represents the health damage the settlement takes for each missing unit of this attribute, scaled by settlement level.',
      validate: (e) =>
        e == null
          ? 'Health per level is required'
          : e < 0
            ? 'Health per level cannot be negative'
            : null,
      keypath: 'balance.healthPerLevel',
    },
    maxPerLevel: {
      name: 'maxPerLevel',
      label: 'Max Per Level',
      type: 'number',
      tooltip:
        'The maximum number of units of this attribute that can provide benefits to the settlement per level.',
      validate: (e) =>
        e
          ? e <= 0
            ? 'Max per level must be greater than 0'
            : e > 10
              ? 'Max per level cannot be greater than 10'
              : null
          : 'Max per level is required',
      keypath: 'balance.maxPerLevel',
    },
    description: {
      name: 'description',
      label: 'Description',
      type: 'text',
      tooltip:
        "A brief explanation of the attribute's purpose and impact. This provides essential context for understanding its role in the settlement.",
      multiline: !0,
      minRows: 3,
      validate: (e) =>
        e
          ? e.length < 30
            ? `Description must be at least 30 characters long. You need ${30 - e.length} more characters.`
            : null
          : 'Description is required',
      keypath: 'description',
    },
  },
  Tt = ({ setShowModal: e }) => {
    var u, d;
    const { tool: t, id: a } = J(),
      { edit: o, errors: r, updateTool: s, validateToolField: i } = A(t, a),
      l = (h, { keypath: x }) => {
        s(x, h);
      },
      c = (h, { keypath: x }) => {
        i(x, h);
      };
    return n.jsxs(n.Fragment, {
      children: [
        n.jsxs(v, {
          sx: {
            gridColumn: 'span 3',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          },
          children: [
            n.jsxs(v, {
              sx: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                flexGrow: 1,
                flexShrink: 2,
              },
              children: [
                n.jsx(g, { variant: 'h6', children: 'Icon' }),
                n.jsx(q, {
                  onClick: () => e('Change Icon'),
                  sx: { boxShadow: 4, borderRadius: 4 },
                  children: n.jsx(V, {
                    viewBox:
                      ((u = o == null ? void 0 : o.icon) == null
                        ? void 0
                        : u.viewBox) || '0 0 664 512',
                    path:
                      ((d = o == null ? void 0 : o.icon) == null
                        ? void 0
                        : d.d) || '',
                    size: 24,
                    color: o == null ? void 0 : o.iconColor,
                  }),
                }),
              ],
            }),
            n.jsx(R, {
              initialValues: { name: (o == null ? void 0 : o.name) || '' },
              field: z.name,
              boxSx: { flexGrow: 2, flexShrink: 1, px: 1 },
              externalUpdate: l,
              shrink: !0,
              parentError: r == null ? void 0 : r.name,
              onError: c,
            }),
          ],
        }),
        n.jsx(R, {
          initialValues: {
            description: (o == null ? void 0 : o.description) || '',
          },
          field: z.description,
          boxSx: { gridColumn: 'span 3', px: 1 },
          externalUpdate: l,
          shrink: !0,
          parentError: r == null ? void 0 : r.description,
          onError: c,
        }),
        n.jsx(v, {
          sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pl: 2,
            gap: 16,
            gridColumn: 'span 3',
          },
          children: n.jsxs(v, {
            sx: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            },
            children: [
              n.jsx(D, {
                title:
                  'Positive type is best a high scores. Negative type is best a low scores.',
                children: n.jsx(g, {
                  variant: 'h6',
                  children: 'Attribute Type',
                }),
              }),
              n.jsxs(v, {
                sx: { display: 'flex', alignItems: 'center', gap: 1 },
                children: [
                  n.jsx(g, {
                    variant: 'body1',
                    children: o != null && o.positive ? 'Positive' : 'Negative',
                  }),
                  n.jsx(ae, {
                    checked: (o == null ? void 0 : o.positive) === !0,
                    onChange: (h) => {
                      s('positive', h.target.checked);
                    },
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    });
  },
  St = ({ values: e, id: t, columns: a }) => {
    const {
        edit: o,
        updateTool: r,
        validateToolField: s,
        errors: i,
      } = A('attribute', t),
      [l, c] = m.useState(!1),
      u = (h, { keypath: x }) => {
        r(x, h);
      },
      d = (h, { keypath: x }) => {
        s(x, h);
      };
    return n.jsxs(v, {
      children: [
        n.jsxs(Se, {
          sx: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
            gridColumn: 'span 3',
          },
          children: [
            n.jsxs(Me, {
              sx: { display: 'flex', alignItems: 'center', gap: 0.5 },
              children: [
                n.jsx(g, { children: 'Autobalance' }),
                n.jsx(D, {
                  title:
                    'Automatically adjust related values to maintain a balanced configuration.',
                  children: n.jsx($e, {
                    sx: {
                      fontSize: 18,
                      color: 'text.secondary',
                      cursor: 'pointer',
                    },
                  }),
                }),
              ],
            }),
            n.jsx(ae, { checked: l, onChange: (h) => c(h.target.checked) }),
          ],
        }),
        n.jsxs(v, {
          sx: {
            display: 'grid',
            gridTemplateColumns: ['1fr', '1fr', `repeat(${a}, 1fr)`],
            gridTemplateRows: 'auto',
            alignItems: 'start',
            justifyContent: 'center',
            my: 2,
            gap: 2,
            backgroundColor: 'background.paper',
            width: '100%',
            position: 'relative',
            gridColumn: 'span 3',
          },
          children: [
            n.jsx(R, {
              initialValues: { maxPerLevel: o.balance.maxPerLevel || 0 },
              validate: z.maxPerLevel.validate,
              field: z.maxPerLevel,
              externalUpdate: u,
              shrink: !0,
              parentError: i.balance.maxPerLevel,
              onError: d,
              isExpanded: e,
            }),
            n.jsx(R, {
              initialValues: { healthPerLevel: o.balance.healthPerLevel || 0 },
              validate: z.healthPerLevel.validate,
              field: z.healthPerLevel,
              externalUpdate: u,
              shrink: !0,
              parentError: i.balance.healthPerLevel,
              onError: d,
              isExpanded: e,
            }),
            n.jsx(R, {
              initialValues: { costPerLevel: o.balance.costPerLevel || 0 },
              validate: z.costPerLevel.validate,
              field: z.costPerLevel,
              externalUpdate: u,
              shrink: !0,
              parentError: i.balance.costPerLevel,
              onError: d,
              isExpanded: e,
            }),
          ],
        }),
      ],
    });
  },
  Mt = ke(
    n.jsx('path', {
      d: 'm12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
    }),
    'ArrowForward'
  ),
  kt = {
    name: '',
    tooltip: '',
    type: 'number',
    validate: (e) => (e <= -1 ? 'Value must be 0 or greater' : null),
    keypath: '',
  },
  zt = [
    {
      name: 'Fortified',
      description:
        'Fortified Settlements put their trust in theirs walls, preemptive reconnaissance, and well-trained troops.',
      id: '789',
    },
    {
      name: 'Mercantile',
      description:
        'Mercantile Settlements focus on establishing and expanding trade, developing vibrant culture, and welcoming artisans.',
      id: '456',
    },
    {
      name: 'Survivalist',
      description:
        'Survivalists focus on gathering food, supplies, medical items, and constructing durable shelters.',
      id: '123',
    },
  ],
  Pt = () => {
    const { id: e } = J(),
      {
        edit: t,
        selectValue: a,
        updateTool: o,
        validateToolField: r,
        errors: s,
      } = A('attribute', e),
      i = a('settlementPointCost'),
      l = t == null ? void 0 : t.settlementPointCost.data,
      c = s.settlementPointCost,
      u = t == null ? void 0 : t.settlementPointCost.order,
      [d, h] = m.useState(null),
      [x, S] = m.useState(''),
      Z = m.useMemo(() => {
        const p = Object.keys(l || {}).reduce((L, k) => (L.push(k), L), []);
        return zt.filter((L) => !p.includes(L.id));
      }, [l]),
      I = m.useMemo(
        () =>
          Object.entries(l || {}).map(([p, f]) => ({
            ...kt,
            name: f.name,
            label: f.name.charAt(0).toUpperCase() + f.name.slice(1),
            tooltip: null,
            id: p,
          })),
        [l, t]
      ),
      y = (p, { id: f }) => {
        r(`settlementPointCost.${f}.value`, p);
      },
      b = m.useCallback(
        (p, { id: f }) => {
          o(`settlementPointCost.data.${f}.value`, p);
        },
        [l]
      ),
      T = m.useCallback(
        (p) => {
          const f = { ...l };
          delete f[p], o('settlementPointCost.data', f);
          const L = { ...c };
          delete L[p], r('settlementPointCost', L);
          const k = u.filter((Ce) => Ce !== p);
          o('settlementPointCost.order', k);
        },
        [l, c]
      ),
      M = () => {
        if (!(d != null && d.id)) return;
        const p = d,
          f = { ...l },
          L = { ...c },
          k = [...u];
        (f[p.id] = { name: p.name.toLowerCase(), value: 1 }),
          (L[p.id] = { name: null, value: null }),
          k.push(p.id),
          o('settlementPointCost.data', f),
          r('settlementPointCost', L),
          o('settlementPointCost.order', k),
          S(''),
          h(null);
      };
    return i
      ? n.jsxs(v, {
          sx: { display: 'grid', gridTemplateColumns: '1fr 0.1fr 1fr', gap: 2 },
          children: [
            n.jsxs(v, {
              sx: { gridColumn: 'span 3', p: 2 },
              children: [
                'Define the',
                ' ',
                n.jsx(D, {
                  title: n.jsx(g, {
                    children:
                      'Settlements earn 1 settlement point per level per turn, barring other boons or banes. Click for for more information.',
                  }),
                  children: n.jsxs(g, {
                    component: 'span',
                    sx: {
                      textDecoration: 'underline',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    },
                    children: ['Settlement Point Cost', ' '],
                  }),
                }),
                'of this attribute per Settlement Type. A value of ',
                n.jsx('strong', { children: '0' }),
                ' ',
                'means this cannot be purchased with settlement points for that settlement type.',
              ],
            }),
            n.jsx(v, {
              sx: { display: 'flex', alignItems: 'start', width: '100%' },
              children: n.jsx(ze, {
                inputValue: x,
                options: Z,
                getOptionLabel: (p) => p.name,
                renderInput: (p) =>
                  n.jsx(Pe, {
                    ...p,
                    label: 'Settlement Type',
                    variant: 'outlined',
                    error: !!(c != null && c.name),
                    helperText: c == null ? void 0 : c.name,
                    onChange: (f) => {
                      S(f.target.value);
                    },
                    onKeyDown: (f) => {
                      f.key === 'Enter' && M();
                    },
                  }),
                onChange: (p, f) => {
                  h(f), S((f == null ? void 0 : f.name) || '');
                },
                renderOption: (p, f) =>
                  m.createElement(
                    v,
                    {
                      ...p,
                      key: f.name,
                      sx: { display: 'flex', alignItems: 'center' },
                    },
                    n.jsx(D, {
                      title: n.jsx(g, { children: f.description }),
                      placement: 'left',
                      arrow: !0,
                      children: n.jsx(g, { children: f.name }),
                    })
                  ),
                sx: { my: 2, width: '100%' },
              }),
            }),
            n.jsx(_, {
              orientation: 'vertical',
              flexItem: !0,
              children: n.jsx(Ee, {
                label: n.jsx(Mt, {}),
                onClick: M,
                sx: { width: '100%', color: 'white' },
              }),
            }),
            n.jsx(v, {
              children: u.map((p, f) => {
                const L = I.find((k) => k.id === p);
                return L
                  ? n.jsx(
                      R,
                      {
                        initialValues: { [l[p].name]: l[p].value || 1 },
                        field: L,
                        validate: L.validate,
                        externalUpdate: b,
                        boxSx: { width: '100%', m: 0, p: 0 },
                        onRemove: l[p].name !== 'default' ? () => T(p) : null,
                        onMoreDetails:
                          l[p].name !== 'default'
                            ? () => console.log('More details')
                            : null,
                        shrink: !0,
                        parentError: c[p] ? c[p].value : null,
                        onError: y,
                      },
                      l[p].name
                    )
                  : null;
              }),
            }),
          ],
        })
      : n.jsx(v, { children: 'Loading...' });
  },
  Et = {
    flammable: {
      enabled: !1,
      tooltip: 'Vulnerable to fire.',
      eventTags: [
        {
          name: 'Fire',
          description: 'Events which involve fire or burning.',
          weight: 1,
        },
        {
          name: 'Arson',
          description: 'Events which involve intentional fire damage.',
          weight: 0.75,
        },
      ],
    },
    durable: {
      enabled: !1,
      tooltip: 'Resistant to damage or wear.',
      eventTags: [
        {
          name: 'Infrastructure',
          description:
            'Events which affect the durability of structures or resources.',
          weight: 1,
        },
        {
          name: 'Maintenance',
          description:
            'Events which require upkeep or repair of structures or resources.',
          weight: 1,
        },
      ],
    },
    perishable: {
      enabled: !1,
      tooltip: 'Degrades over time without proper storage.',
      eventTags: [
        {
          name: 'Famine',
          description:
            'A shortage of food or other perishable resources consumed for survival.',
          weight: 1,
        },
        {
          name: 'Spoilage',
          description:
            'A loss of resources due to improper storage or handling.',
          weight: 1,
        },
      ],
    },
    valuable: {
      enabled: !1,
      tooltip: 'High worth; a frequent target for theft or trade.',
      eventTags: [
        {
          name: 'Theft',
          description: 'Events which involve the loss of valuable resources.',
          weight: 1,
        },
        {
          name: 'Trade',
          description:
            'Events which involve the exchange of valuable resources.',
          weight: 1,
        },
      ],
    },
    renewable: {
      enabled: !1,
      tooltip: 'Can replenish naturally over time.',
      eventTags: [
        {
          name: 'Harvest',
          description:
            'Events which involve the collection of renewable resources.',
          weight: 1,
        },
        {
          name: 'Replanting',
          description:
            'Events which involve the restoration of renewable resources.',
          weight: 1,
        },
      ],
    },
    scarce: {
      enabled: !1,
      tooltip: 'Difficult to obtain or maintain in this region.',
      eventTags: [
        {
          name: 'Scarcity',
          description: 'Events which involve a shortage of scarce resources.',
          weight: 1,
        },
        {
          name: 'Rationing',
          description:
            'Events which involve the controlled distribution of scarce resources.',
          weight: 1,
        },
        {
          name: 'Surplus',
          description: 'Events which involve an excess of scarce resources.',
          weight: 0.5,
        },
      ],
    },
    agricultural: {
      enabled: !1,
      tooltip: 'Tied to farming or rural industries.',
      eventTags: [
        {
          name: 'Harvest',
          description:
            'Events which involve the collection of agricultural resources.',
          weight: 1,
        },
        {
          name: 'Planting',
          description:
            'Events which involve the cultivation of agricultural resources.',
          weight: 1,
        },
      ],
    },
    industrial: {
      enabled: !1,
      tooltip: 'Related to manufacturing or heavy labor.',
      eventTags: [
        {
          name: 'Industrial Accident',
          description:
            'Events which involve the loss of life or resources due to industrial activity.',
          weight: 1,
        },
        {
          name: 'Labor Shortage',
          description:
            'Events which involve a lack of ready or willing workers',
          weight: 1,
        },
      ],
    },
    arcane: {
      enabled: !1,
      tooltip: 'Linked to magic or the supernatural.',
      eventTags: [
        {
          name: 'Magic',
          description: 'Events which involve the use of arcane resources.',
          weight: 1,
        },
        {
          name: 'Curses',
          description:
            'Events which involve the misuse or backlash of arcane resources.',
          weight: 1,
        },
      ],
    },
    religious: {
      enabled: !1,
      tooltip: 'A resource important to faith or rituals.',
      eventTags: [
        {
          name: 'Religious Ceremony',
          description: 'Events which involve the use of religious resources.',
          weight: 1,
        },
        {
          name: 'Sacrifice',
          description: 'Events which involve the loss of religious resources.',
          weight: 1,
        },
      ],
    },
    exotic: {
      enabled: !1,
      tooltip: 'Uncommon or unique to the region.',
      eventTags: [
        {
          name: 'Exotic Trade',
          description:
            'Events which involve the exchange of rare or unique resources.',
          weight: 1,
        },
        {
          name: 'Discovery',
          description:
            'Events which involve the identification of rare or unique resources.',
          weight: 1,
        },
      ],
    },
    edible: {
      enabled: !1,
      tooltip: 'Can be consumed for survival.',
      eventTags: [
        {
          name: 'Feast',
          description:
            'Events which involve the consumption of edible resources.',
          weight: 1,
        },
        {
          name: 'Famine',
          description:
            'A shortage of food or other perishable resources consumed for survival.',
          weight: 1,
        },
        {
          name: 'Plague',
          description: 'Events which involve the spread of disease.',
          weight: 1,
        },
      ],
    },
    toxic: {
      enabled: !1,
      tooltip: 'Harmful if improperly handled or consumed.',
      eventTags: [
        {
          name: 'Poisoning',
          description:
            'Events which involve the harmful effects of toxic resources.',
          weight: 1,
        },
        {
          name: 'Contamination',
          description: 'Events which involve the spread of toxic resources.',
          weight: 1,
        },
      ],
    },
    strategic: {
      enabled: !1,
      tooltip: 'Important in warfare or diplomacy.',
      eventTags: [
        {
          name: 'War',
          description: 'Events which involve the use of strategic resources.',
          weight: 1,
        },
        {
          name: 'Diplomacy',
          description: 'Events which involve the use of strategic resources.',
          weight: 1,
        },
      ],
    },
    contested: {
      enabled: !1,
      tooltip: 'Frequently the focus of disputes or events.',
      eventTags: [
        {
          name: 'Conflict',
          description: 'Events which involve the use of contested resources.',
          weight: 1,
        },
        {
          name: 'Dispute',
          description: 'Events which involve the use of contested resources.',
          weight: 1,
        },
      ],
    },
  },
  It = {
    'Resource Properties': [
      'flammable',
      'durable',
      'perishable',
      'valuable',
      'renewable',
      'scarce',
    ],
    'Thematic Tags': [
      'agricultural',
      'industrial',
      'arcane',
      'religious',
      'exotic',
    ],
    'Situational Tags': ['edible', 'toxic', 'strategic', 'contested'],
  },
  _t = () => {
    const [e, t] = m.useState(Et),
      a = (o) => {
        t((r) => ({ ...r, [o]: { ...r[o], enabled: !r[o].enabled } }));
      };
    return n.jsx(v, {
      sx: {
        padding: 2,
        boxShadow: 4,
        borderRadius: 4,
        backgroundColor: 'background.default',
      },
      children: n.jsx(Ie, {
        component: _e,
        sx: { maxHeight: '340px', overflow: 'auto', boxShadow: 0 },
        children: n.jsxs(Xe, {
          stickyHeader: !0,
          size: 'small',
          children: [
            n.jsx(at, {
              children: n.jsxs(ee, {
                children: [
                  n.jsx(P, {
                    sx: { backgroundColor: 'background.default' },
                    children: n.jsx(g, { variant: 'h6', children: 'Category' }),
                  }),
                  n.jsx(P, {
                    sx: { backgroundColor: 'background.default' },
                    children: n.jsx(g, { variant: 'h6', children: 'Tag' }),
                  }),
                  n.jsx(P, {
                    align: 'center',
                    sx: { backgroundColor: 'background.paper' },
                    children: n.jsx(g, { variant: 'h6', children: 'Enabled' }),
                  }),
                ],
              }),
            }),
            n.jsx(et, {
              children: Object.entries(It).map(([o, r]) =>
                n.jsxs(
                  C.Fragment,
                  {
                    children: [
                      n.jsx(ee, {
                        children: n.jsx(P, {
                          colSpan: 3,
                          sx: {
                            position: 'sticky',
                            top: 40,
                            zIndex: 1,
                            fontWeight: 'bold',
                            backgroundColor: 'secondary.main',
                            color: 'common.white',
                          },
                          children: n.jsx(g, { variant: 'h6', children: o }),
                        }),
                      }),
                      r.map((s, i) =>
                        n.jsxs(
                          ee,
                          {
                            sx: {
                              backgroundColor: (l) =>
                                i % 2 === 0
                                  ? l.palette.divider
                                  : l.palette.background.default,
                            },
                            children: [
                              n.jsx(P, {}),
                              n.jsx(P, {
                                children: n.jsx(D, {
                                  title: e[s].tooltip,
                                  arrow: !0,
                                  children: n.jsx('span', {
                                    children: n.jsx('strong', {
                                      children:
                                        s.charAt(0).toUpperCase() + s.slice(1),
                                    }),
                                  }),
                                }),
                              }),
                              n.jsx(P, {
                                align: 'center',
                                children: n.jsx(ae, {
                                  checked: e[s].enabled,
                                  onChange: () => a(s),
                                  color: 'secondary',
                                }),
                              }),
                            ],
                          },
                          s
                        )
                      ),
                    ],
                  },
                  o
                )
              ),
            }),
          ],
        }),
      }),
    });
  },
  Bt = ({ setShowModal: e }) => {
    var S;
    const { isSplit: t } = Be(),
      { id: a } = J(),
      { edit: o } = A('attribute', a),
      [r, s] = m.useState(!1),
      [i, l] = m.useState(!1),
      [c, u] = m.useState(!1),
      [d, h] = m.useState(!1),
      x = t ? 1 : 3;
    return n.jsxs(v, {
      sx: {
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr', `repeat(${x}, 1fr)`],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'start',
        my: 2,
        gap: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 200px)',
      },
      children: [
        n.jsx(Tt, { setShowModal: e, id: a }),
        n.jsx(_, { sx: { gridColumn: 'span 3' } }),
        n.jsx(O, {
          title: 'Values',
          titleType: 'h6',
          defaultState: r,
          styles: { width: '100%', mb: 2 },
          boxSx: { gridColumn: `span ${x}` },
          toggleOpen: () => s(!r),
          children: n.jsx(St, { values: r, id: a, columns: x }),
        }),
        n.jsx(O, {
          title: 'Settlement Point Costs',
          titleType: 'h6',
          defaultState: d,
          styles: { width: '100%', mb: 2 },
          boxSx: { gridColumn: 'span 3' },
          toggleOpen: () => h(!d),
          children: n.jsx(Pt, { id: a }),
        }),
        n.jsx(O, {
          title: 'Thresholds',
          titleType: 'h6',
          defaultState: i,
          styles: { width: '100%', mb: 2 },
          boxSx: { gridColumn: 'span 3' },
          toggleOpen: () => l(!i),
          children: n.jsx(Ae, { tool: 'attribute', id: a }),
        }),
        n.jsx(O, {
          title: `Tags (${(S = o == null ? void 0 : o.tags) == null ? void 0 : S.length} / 5)`,
          titleType: 'h6',
          defaultState: c,
          styles: { width: '100%', mb: 2 },
          boxSx: { gridColumn: 'span 3' },
          toggleOpen: () => u(!c),
          children: n.jsx(_t, { attr: o }),
        }),
      ],
    });
  },
  Rt = () => {
    var s, i, l, c, u;
    const { tool: e, id: t, mode: a, side: o } = J(),
      { current: r } = A('attribute', t);
    return n.jsxs(v, {
      sx: {
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'center',
        mt: 2,
        gap: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
        pb: 4,
      },
      children: [
        n.jsxs(v, {
          sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            height: '100%',
          },
          children: [
            n.jsx(g, {
              variant: 'body1',
              sx: { fontWeight: 'bold', fontSize: '1.25rem' },
              children: 'Icon',
            }),
            n.jsx(q, {
              sx: { boxShadow: 4, borderRadius: 4 },
              disabled: !0,
              children: n.jsx(V, {
                viewBox:
                  ((s = r == null ? void 0 : r.icon) == null
                    ? void 0
                    : s.viewBox) || '0 0 664 512',
                path:
                  ((i = r == null ? void 0 : r.icon) == null ? void 0 : i.d) ||
                  '',
                size: 24,
                color: r == null ? void 0 : r.iconColor,
              }),
            }),
          ],
        }),
        n.jsxs(v, {
          sx: {
            gridColumn: 'span 2',
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'start',
            height: '100%',
          },
          children: [
            n.jsx(g, { variant: 'h6', children: 'Name:' }),
            n.jsx(g, { children: (r == null ? void 0 : r.name) || 'None' }),
          ],
        }),
        n.jsx(_, {
          sx: { gridColumn: 'span 3', borderColor: '#ccc', fontWeight: 'bold' },
          children: 'DESCRIPTION',
        }),
        n.jsxs(v, {
          sx: {
            gridColumn: 'span 3',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'start',
            justifyContent: 'center',
          },
          children: [
            n.jsx(g, {
              sx: { textAlign: 'start' },
              variant: 'body1',
              children:
                (r == null ? void 0 : r.description) || 'No description',
            }),
            n.jsxs(v, {
              sx: {
                gridColumn: 'span 3',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
              },
              children: [
                n.jsx(g, {
                  variant: 'body1',
                  sx: { fontWeight: 'bold' },
                  children: 'Type:',
                }),
                n.jsx(g, {
                  variant: 'body1',
                  children: r != null && r.positive ? 'Positive' : 'Negative',
                }),
              ],
            }),
          ],
        }),
        n.jsxs(_, {
          sx: { gridColumn: 'span 3', borderColor: '#ccc', fontWeight: 'bold' },
          children: [' ', 'SCALING PER LEVEL', ' '],
        }),
        n.jsxs(v, {
          sx: {
            display: 'grid',
            gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
            gridColumn: 'span 3',
          },
          children: [
            n.jsxs(v, {
              sx: {
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'start',
              },
              children: [
                n.jsx(g, {
                  variant: 'body1',
                  sx: { fontWeight: 'bold', width: '50%', textAlign: 'start' },
                  children: 'Max:',
                }),
                n.jsx(g, {
                  children:
                    (l = r == null ? void 0 : r.balance) == null
                      ? void 0
                      : l.maxPerLevel,
                }),
              ],
            }),
            n.jsxs(v, {
              sx: {
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'start',
                backgroundColor: 'background.default',
              },
              children: [
                n.jsx(g, {
                  variant: 'body1',
                  sx: { fontWeight: 'bold', width: '50%', textAlign: 'start' },
                  children: 'Health:',
                }),
                n.jsx(g, {
                  children:
                    (c = r == null ? void 0 : r.balance) == null
                      ? void 0
                      : c.healthPerLevel,
                }),
              ],
            }),
            n.jsxs(v, {
              sx: {
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'start',
              },
              children: [
                n.jsx(g, {
                  variant: 'body1',
                  sx: { fontWeight: 'bold', width: '50%', textAlign: 'start' },
                  children: 'Cost:',
                }),
                n.jsx(g, {
                  children:
                    (u = r == null ? void 0 : r.balance) == null
                      ? void 0
                      : u.costPerLevel,
                }),
              ],
            }),
          ],
        }),
        n.jsx(_, {
          sx: { gridColumn: 'span 3', borderColor: '#ccc', fontWeight: 'bold' },
          children: 'SETTLEMENT POINT COSTS',
        }),
        r.settlementPointCost.order.map((d) =>
          n.jsxs(
            v,
            {
              sx: {
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'start',
                gridColumn: 'span 3',
              },
              children: [
                n.jsxs(g, {
                  variant: 'body1',
                  sx: { fontWeight: 'bold', width: '20%', textAlign: 'start' },
                  children: [
                    r.settlementPointCost.data[d].name.charAt(0).toUpperCase() +
                      r.settlementPointCost.data[d].name.slice(1),
                    ':',
                  ],
                }),
                n.jsx(g, {
                  children: n.jsx('strong', {
                    children: r.settlementPointCost.data[d].value,
                  }),
                }),
              ],
            },
            d
          )
        ),
        n.jsx(_, {
          sx: { gridColumn: 'span 3', borderColor: '#ccc', fontWeight: 'bold' },
          children: 'THRESHOLDS',
        }),
        n.jsx(He, { data: r.thresholds.data, order: r.thresholds.order }),
      ],
    });
  },
  At = [
    { keypath: 'name', label: 'Name' },
    { keypath: 'description', label: 'Description' },
    { keypath: 'balance.maxPerLevel', label: 'Max Per Level' },
    { keypath: 'balance.healthPerLevel', label: 'Health Per Level' },
    { keypath: 'balance.costPerLevel', label: 'Cost Per Level' },
    {
      keypath: 'settlementPointCost.data',
      label: 'Settlement Point Cost',
      type: 'group',
    },
    { keypath: 'thresholds.data', label: 'Thresholds', type: 'group' },
  ],
  Nt = ({ id: e, mode: t, side: a, tabId: o, setModalContent: r }) =>
    n.jsx(De, {
      tool: 'attribute',
      id: e,
      initializeTool: st,
      validationFields: [
        'name',
        'description',
        'balance',
        'thresholds',
        'settlementPointCost',
      ],
      editComponent: Bt,
      previewComponent: Rt,
      checklistContent: At,
      loadDisplayName: 'Load Attribute',
      modalComponents: { 'Change Icon': Lt },
      modalComponentsProps: { 'Change Icon': { tool: 'attribute', id: e } },
      side: a,
      mode: t,
      tabId: o,
      setModalContent: r,
    });
export { Nt as default };
