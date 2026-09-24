interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = 'Une erreur est survenue.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="state-card error-state" role="alert">
      <strong>Oups.</strong>
      <p>{message}</p>
      {onRetry && (
        <button className="button secondary" type="button" onClick={onRetry}>
          Réessayer
        </button>
      )}
    </div>
  );
}
