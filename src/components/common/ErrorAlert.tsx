interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: Props) {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger ms-3 flex-shrink-0" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
