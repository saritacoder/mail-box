export default function AuthCard({ children }) {
  return (
    <div className="bg-blue-50  h-screen">
      <div className="rounded-3xl bg-white w-11/12 m-auto px-5 sm:px-10 py-10 sm:w-[50rem] flex flex-col gap-8 sm:flex-row justify-between relative top-10 sm:top-20 drop-shadow-md">
        {children}
      </div>
    </div>
  );
}
