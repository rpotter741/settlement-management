import React, { lazy, Suspense } from 'react';

// In-memory component cache
const componentCache = {};

// Lazy loader with preloading support
const lazyLoad = (keypath) => {
  if (!componentCache[keypath]) {
    const loader = () =>
      import(`../${keypath}`)
        .then((module) => {
          componentCache[keypath] = module.default;
          return module;
        })
        .catch((err) => {
          console.error(`Failed to load ${keypath}:`, err);
          return null;
        });

    componentCache[keypath] = lazy(loader);
    componentCache[`${keypath}-loader`] = loader;
  }

  return componentCache[keypath];
};

// Preload function for early loading
export const preloadComponent = (keypath) => {
  if (componentCache[keypath]) return;
  if (componentCache[`${keypath}-loader`]) {
    componentCache[`${keypath}-loader`]();
  }
};

// Wrapper for lazy-loaded components
export const ToolWrapper = ({ keypath, ...props }) => {
  const ToolComponent = lazyLoad(keypath);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolComponent {...props} />
    </Suspense>
  );
};
