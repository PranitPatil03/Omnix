export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen min-w-screen h-full flex items-center justify-center px-6 py-12">
      {children}
    </div>
  );
};
