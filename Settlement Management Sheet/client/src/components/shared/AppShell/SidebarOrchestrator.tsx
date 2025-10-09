import { useLocation } from 'react-router-dom';
import pageRoutes from './routes.js';
import { AnimatePresence } from 'framer-motion';

const SidebarOrchestrator = () => {
  const location = useLocation();
  const SideBarComponent = pageRoutes.find(
    (route) => route.path === location.pathname
  )?.sidebar;
  const SidebarProps = pageRoutes.find(
    (route) => route.path === location.pathname
  )?.sidebarProps;

  const props = SidebarProps ? { ...SidebarProps } : {};

  if (!SideBarComponent) {
    return null; // or a default component
  }

  // Cast props to 'any' to bypass type incompatibility if you are sure the shape is correct
  return (
    <AnimatePresence>
      <SideBarComponent {...(props as any)} />
    </AnimatePresence>
  );
};

export default SidebarOrchestrator;
