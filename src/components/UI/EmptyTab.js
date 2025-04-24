export default function EmptyTab(props) {
  return (
    <div className="h-96 flex justify-center items-center">
      <h1 className="text-2xl font-medium text-slate-600">
        Your {props.tab} tab is empty.
      </h1>
    </div>
  );
}
