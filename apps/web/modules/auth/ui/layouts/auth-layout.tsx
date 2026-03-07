export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen min-w-screen h-full flex items-center justify-center bg-[#f8fafc] px-6 py-12">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-100/30 blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
