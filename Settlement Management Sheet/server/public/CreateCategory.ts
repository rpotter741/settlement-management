import {
  v as w,
  r as c,
  j as s,
  B as h,
  q as l,
  p as y,
  I as T,
  H as b,
  a as v,
  D as g,
  C as H,
  J as R,
  K as C,
  L as k,
} from './main.js';
import { M as L, u as A, C as P, L as S } from './CreateShell.js';
import { E as B } from './EditNameDescription.js';
import { C as F, I as O, O as z, P as M } from './ThresholdPreview.js';
const U = () => {
    const e = [9, 29, 49, 69, 84, 99, 100],
      n = {},
      t = e.map((a) => {
        const r = w();
        return (n[r] = { name: '', max: a }), r;
      });
    return {
      id: w(),
      refId: w(),
      version: 1,
      name: '',
      description: '',
      attributes: [],
      thresholds: { data: n, order: t },
      dependencies: { data: {}, order: [] },
      tags: [],
      isValid: !1,
      status: 'DRAFT',
      createdBy: '',
    };
  },
  $ = [
    { keypath: 'name', label: 'Name' },
    { keypath: 'description', label: 'Description' },
    { keypath: 'thresholds.data', label: 'Thresholds', type: 'group' },
    { keypath: 'dependencies.data', label: 'Dependencies', type: 'group' },
  ],
  q = ({
    threshold: e,
    errors: n,
    index: t,
    id: a,
    handleModifierValidation: r,
    handleModifierChange: i,
  }) =>
    s.jsxs(
      h,
      {
        sx: {
          display: 'flex',
          alignItems: 'center',
          px: 12,
          transition: 'top 0.3s ease, left 0.3s ease',
          gap: 2,
        },
        children: [
          s.jsxs(l, {
            sx: { width: '33%', textAlign: 'left' },
            variant: 'h6',
            children: [e.name.charAt(0).toUpperCase() + e.name.slice(1), ':'],
          }),
          s.jsx(L, {
            initialValues: { modifier: e.modifier },
            field: {
              name: 'modifier',
              label: 'Modifier',
              value: e.modifier,
              type: 'number',
              textSx: { width: '100%' },
              validate: (o) =>
                o < 0 || o > 5 ? 'Value must be between 0 and 5' : null,
              id: a,
              index: t,
            },
            boxSx: { width: '66%' },
            shrink: !0,
            externalUpdate: i,
            parentError: (n == null ? void 0 : n.max) || null,
            onError: r,
          }),
        ],
      },
      e.id
    ),
  Q = c.memo(q),
  V = ({ tool: e, id: n }) => {
    const { selectValue: t, updateTool: a, validateToolField: r } = y(e, n),
      i = t('dependencies.data'),
      o = t('dependencies.order'),
      { showSnackbar: d } = T(),
      [u, x] = c.useState(new Array(o.length).fill(!1)),
      j = c.useCallback(
        (p, { id: f, index: m }) => {
          a(`dependencies.data.${f}.thresholds.${m}.modifier`, p),
            r(`dependencies.data.${f}.modifier`, p);
        },
        [a, r]
      ),
      N = c.useCallback((p) => {
        const f = o.filter((D) => D !== p),
          m = { ...i };
        delete m[p], a('dependencies.data', m), a('dependencies.order', f);
      });
    return s.jsx(h, {
      children: o.map(
        (p, f) =>
          i[p] &&
          s.jsxs(
            b,
            {
              defaultState: u[f],
              title: i[p].name,
              toggleOpen: () => {
                const m = [...u];
                (m[f] = !m[f]), x(m);
              },
              children: [
                i[p].thresholds.map((m, D) =>
                  s.jsx(
                    Q,
                    { threshold: m, index: D, id: p, handleModifierChange: j },
                    m.name
                  )
                ),
                s.jsxs(v, {
                  variant: 'contained',
                  onClick: () => N(p),
                  children: ['Remove ', i[p].name, ' Dependency'],
                }),
              ],
            },
            p
          )
      ),
    });
  },
  K = ({ tool: e, setShowModal: n, id: t }) => {
    const { selectValue: a } = y(e, t);
    a('dependencies');
    const [r, i] = c.useState(!1),
      { showSnackbar: o } = T(),
      [d, u] = c.useState(null);
    return s.jsxs(h, {
      children: [
        s.jsxs(l, {
          variant: 'h6',
          children: [e.charAt(0).toUpperCase() + e.slice(1), ' Dependencies'],
        }),
        s.jsxs(l, {
          children: [
            'Dependencies reflect how this ',
            e,
            ' interacts with others. For instance, if this ',
            e,
            ' is dependent on another ',
            e,
            ', its own score will be modulated by the thresholds of the other ',
            e,
            '. A dependency modifier of 0.75 means this ',
            e,
            ' will be 25% less at the other ',
            e,
            "'s threshold.",
          ],
        }),
        s.jsx(V, { tool: e, id: t }),
        s.jsx(v, {
          variant: 'contained',
          color: 'success',
          'aria-label': 'Add threshold',
          sx: { px: 4 },
          onClick: () => {
            n('Select Category');
          },
          children: 'Add Dependency',
        }),
      ],
    });
  },
  Y = {
    name: {
      name: 'name',
      label: 'Category Name',
      type: 'text',
      tooltip:
        "The unique name of the category. This should clearly convey the category's purpose and role within the settlement mechanics.",
      validate: (e) =>
        e
          ? e.length < 3
            ? 'Category name must be at least 3 characters long'
            : null
          : 'Category name is required',
      keypath: 'name',
    },
    description: {
      name: 'description',
      label: 'Description',
      type: 'text',
      tooltip:
        'A brief description of the category and its role within the settlement mechanics.',
      multiline: !0,
      minRows: 3,
      validate: (e) =>
        e
          ? e.length < 30
            ? `Description must be at least 30 characters. You have ${30 - e.length} characters remaining.`
            : null
          : 'Description is required',
      keypath: 'description',
    },
  };
function J(e, n = 2) {
  return e
    .split(' ')
    .map((t) => Math.floor(Number(t) / n))
    .join(' ');
}
const I = ({ attr: e }) => {
    const [n, t] = c.useState(!1);
    return s.jsxs(F, {
      sx: { pb: 4, boxShadow: 3, backgroundColor: 'background.default' },
      children: [
        s.jsxs(h, {
          sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            minHeight: 100,
          },
          children: [
            s.jsx(l, {
              variant: 'h6',
              sx: { textAlign: 'center' },
              children: e.name,
            }),
            s.jsx(O, {
              viewBox: J(e.icon.viewBox, 1),
              path: e.icon.d,
              size: 40,
              color: e.iconColor,
            }),
          ],
        }),
        s.jsx(g, { sx: { fontSize: '0.75rem' }, children: 'Per Level' }),
        s.jsxs(l, {
          variant: 'body2',
          sx: { textAlign: 'left', pl: 2 },
          children: ['Max: ', e.balance.maxPerLevel],
        }),
        s.jsxs(l, {
          variant: 'body2',
          sx: { textAlign: 'left', pl: 2 },
          children: ['Cost: ', e.balance.costPerLevel],
        }),
        s.jsxs(l, {
          variant: 'body2',
          sx: { textAlign: 'left', pl: 2 },
          children: ['Health: ', e.balance.healthPerLevel],
        }),
        s.jsx(g, {
          children: s.jsx(H, {
            sx: {
              backgroundColor: 'background.default',
              color: 'primary.main',
            },
            label: n ? 'Hide Description' : 'Show Description',
            size: 'small',
            onClick: () => t((a) => !a),
          }),
        }),
        s.jsx(R, {
          in: n,
          children: s.jsx(l, {
            variant: 'body2',
            sx: { textAlign: 'center', px: 2 },
            children: e.description,
          }),
        }),
      ],
    });
  },
  E = (e, n = []) => {
    const [t, a] = c.useState([]);
    return (
      c.useEffect(() => {
        const r = n.map((o) => C.getQueryData([e, o])),
          i = n.filter((o, d) => r[d] === void 0);
        i.length > 0
          ? k
              .post('/tools/fetchByIds', { tool: e, ids: i })
              .then(({ data: o }) => {
                o.forEach((d) => {
                  C.setQueryData([e, d.id], d);
                }),
                  a(n.map((d) => C.getQueryData([e, d])));
              })
          : a(r);
      }, [e, n]),
      t
    );
  },
  W = ({ setShowModal: e, id: n }) => {
    const { edit: t } = y('category', n),
      a = E('attribute', t.attributes),
      r = () => {
        e('Select Attribute');
      };
    return s.jsx(h, {
      children: s.jsxs(l, {
        variant: 'h6',
        sx: { textAlign: 'center', mb: 2 },
        children: [
          s.jsx(h, {
            sx: {
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
            },
            children: a.map((i) => s.jsx(I, { attr: i }, i.refId)),
          }),
          t.attributes.length < 6 &&
            s.jsx(v, { onClick: r, children: 'Add Attribute' }),
        ],
      }),
    });
  },
  _ = ({ setShowModal: e }) => {
    const { tool: n, id: t } = A();
    y(n, t);
    const [a, r] = c.useState(!1),
      [i, o] = c.useState(!1),
      [d, u] = c.useState(!1),
      [x, j] = c.useState(!1);
    return s.jsxs(h, {
      sx: {
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'center',
        my: 2,
        gap: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
        pb: 2,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 200px)',
      },
      children: [
        s.jsx(B, { tool: 'category', fields: Y, id: t }),
        s.jsx(g, { sx: { gridColumn: 'span 3' } }),
        s.jsx(b, {
          title: 'Attributes',
          titleType: 'h6',
          defaultState: a,
          styles: { width: '100%', mb: 2 },
          boxSx: { gridColumn: 'span 3' },
          toggleOpen: () => r(!a),
          children: s.jsx(W, { setShowModal: e, id: t }),
        }),
        s.jsx(b, {
          title: 'Thresholds',
          titleType: 'h6',
          defaultState: i,
          styles: { width: '100%', mb: 2 },
          boxSx: { gridColumn: 'span 3' },
          toggleOpen: () => o(!i),
          children: s.jsx(z, { tool: 'category', id: t }),
        }),
        s.jsx(b, {
          title: 'Dependencies',
          titleType: 'h6',
          defaultState: d,
          styles: { width: '100%', mb: 2 },
          boxSx: { gridColumn: 'span 3' },
          toggleOpen: () => u(!d),
          children: s.jsx(K, { tool: 'category', setShowModal: e, id: t }),
        }),
        s.jsx(b, {
          title: 'Tags',
          titleType: 'h6',
          defaultState: x,
          styles: { width: '100%', mb: 2 },
          boxSx: { gridColumn: 'span 3' },
          toggleOpen: () => j(!x),
          children: 'tags',
        }),
      ],
    });
  },
  G = ({ label: e, data: n, isLoading: t, edit: a, type: r = 'h6' }) =>
    s.jsxs(h, {
      sx: {
        ...a,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        gap: 2,
      },
      children: [
        s.jsxs(l, { variant: 'h6', children: [e, ':'] }),
        s.jsx(l, { variant: r, children: n || 'None' }),
      ],
    }),
  X = ({ threshold: e, style: n }) =>
    e.name !== ''
      ? s.jsxs(h, {
          sx: {
            display: 'flex',
            alignItems: 'start',
            transition: 'top 0.3s ease, left 0.3s ease',
            gap: 2,
            ...n,
          },
          children: [
            s.jsxs(l, {
              sx: { width: '66%', textAlign: 'left' },
              children: [e.name, ':'],
            }),
            s.jsx(l, { children: e.modifier }),
          ],
        })
      : null,
  Z = ({ data: e, name: n }) =>
    s.jsxs(h, {
      sx: {
        gridColumn: 'span 3',
        display: 'grid',
        gridTemplateRows: `repeat(${e.length + 1}, 1fr)`,
        gridAutoFlow: 'column',
      },
      children: [
        s.jsx(l, {
          variant: 'body1',
          sx: {
            textAlign: 'left',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            pl: '25%',
          },
          children: n,
        }),
        e.map((t, a) =>
          s.jsx(
            X,
            {
              threshold: t,
              style: {
                backgroundColor:
                  a % 2 === 0 ? 'background.paper' : 'background.default',
              },
            },
            t.name
          )
        ),
      ],
    }),
  ee = () => {
    var r, i, o;
    const { tool: e, id: n } = A(),
      { current: t } = y(e, n),
      a = E('attribute', t.attributes);
    return s.jsxs(h, {
      sx: {
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'center',
        my: 2,
        gap: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
      },
      children: [
        s.jsx(G, {
          data: t == null ? void 0 : t.name,
          label: 'Name',
          edit: { gridColumn: 'span 3' },
          type: 'body1',
        }),
        s.jsxs(h, {
          sx: {
            gridColumn: 'span 3',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'start',
            justifyContent: 'center',
          },
          children: [
            s.jsx(l, { variant: 'h6', children: 'Description:' }),
            s.jsx(l, {
              sx: { textAlign: 'start' },
              variant: 'body1',
              children:
                (t == null ? void 0 : t.description) || 'No description',
            }),
          ],
        }),
        s.jsx(g, {
          sx: { gridColumn: 'span 3', borderColor: '#000' },
          children: 'ATTRIBUTES',
        }),
        a.map((d) => s.jsx(I, { attr: d }, d.refId)),
        s.jsx(g, {
          sx: { gridColumn: 'span 3', borderColor: '#000' },
          children: 'THRESHOLDS',
        }),
        s.jsx(M, {
          data:
            (r = t == null ? void 0 : t.thresholds) == null ? void 0 : r.data,
          order:
            (i = t == null ? void 0 : t.thresholds) == null ? void 0 : i.order,
          innerSx: { gridColumn: 'span 3' },
        }),
        s.jsx(g, {
          sx: { gridColumn: 'span 3', borderColor: '#000' },
          children: 'DEPENDENCIES',
        }),
        (o = t == null ? void 0 : t.dependencies) == null
          ? void 0
          : o.order.map((d) =>
              s.jsx(
                h,
                {
                  sx: {
                    gridColumn: 'span 1',
                    display: 'flex',
                    flexDirection: 'column',
                    display: 'grid',
                    gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
                    gap: 2,
                  },
                  children: s.jsx(Z, {
                    data: t.dependencies.data[d].thresholds,
                    name: t.dependencies.data[d].name,
                  }),
                },
                d
              )
            ),
      ],
    });
  },
  te = async ({ edit: e, selected: n, tool: t }) => {
    ({ ...e.dependencies.data });
    const a = { ...e.dependencies.data };
    return (
      await k
        .post('/tools/fetchByIds', { tool: t, ids: n.ids })
        .then(({ data: r }) => {
          r.forEach((i) => {
            C.setQueryData([t, i.refId, i.id], i);
          });
        }),
      n.ids.forEach((r, i) => {
        const o = C.getQueryData([t, n.refIds[i], r]),
          d = {
            ...e.dependencies.data[r],
            name: o.name,
            thresholds: o.thresholds.order.map((u) => {
              var x;
              return {
                name: o.thresholds.data[u].name,
                modifier:
                  ((x = e.dependencies.data[r]) == null
                    ? void 0
                    : x.modifier) || 1,
              };
            }),
          };
        a[r] = d;
      }),
      a
    );
  },
  ie = ({ id: e }) => {
    var o;
    const { updateTool: n, edit: t } = y('category', e),
      [a, r] = c.useState([]);
    c.useEffect(() => {
      var d;
      t &&
        r((d = t == null ? void 0 : t.dependencies) == null ? void 0 : d.order);
    }, [(o = t == null ? void 0 : t.dependencies) == null ? void 0 : o.order]);
    const i = async (d, u) => {
      const x = await te({ edit: t, selected: u, tool: 'category' });
      n('dependencies.data', x),
        n('dependencies.order', u.ids),
        n('dependencies.refIds', u.refIds);
    };
    return s.jsx(P, {
      tool: 'category',
      id: e,
      initializeTool: U,
      validationFields: ['name', 'description', 'thresholds', 'dependencies'],
      editComponent: _,
      previewComponent: ee,
      checklistContent: $,
      loadDisplayName: 'Load Category',
      modalComponents: { 'Select Attribute': S, 'Select Category': S },
      modalComponentsProps: {
        'Select Attribute': {
          tool: 'attribute',
          displayName: 'Attributes',
          keypath: 'attributes',
          selectionMode: !0,
          outerUpdate: n,
          outerTool: t,
        },
        'Select Category': {
          tool: 'category',
          displayName: 'Categories',
          keypath: 'dependencies.order',
          refKeypath: 'dependencies.refIds',
          selectionMode: !0,
          outerUpdate: i,
          outerTool: t,
          dependency: !0,
        },
      },
    });
  };
export { ie as default };
