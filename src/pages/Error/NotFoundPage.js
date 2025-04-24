import { useRouteError } from 'react-router-dom';

export default function NotFoundPage() {
  const error = useRouteError();

  return (
    <div className="h-80 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl mb-6 font-semibold text-gray-600">Oops!</h1>
        <p>
          <span className="font-semibold">{error.status}.</span>{' '}
          <span className="text-gray-600 italic">{error.statusText}</span>
        </p>
      </div>
    </div>
  );
}
