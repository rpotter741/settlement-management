/*
Wanna know what this is? An objectively boring orchestrator of system features. It's going to return a box that takes children. Those children *must* return empty fragments and be used exclusively for orchestrating complex side effects. Don't be a dumb-ass. Be smart, use this as a 'headless service' and we'll be alright.
*/

const SystemOrchestrator = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default SystemOrchestrator;
