interface AppLoaderProps {
  message?: string;
}

export function AppLoader({ message = 'Carregando seu Nexo...' }: AppLoaderProps) {
  return (
    <div className="app-loader" role="status" aria-live="polite" aria-label={message}>
      <div className="app-loader__content">
        <div className="app-loader__logo-wrap">
          <span className="app-loader__mark" aria-hidden="true">N</span>
        </div>
        <div className="app-loader__indicator" aria-hidden="true">
          <span />
        </div>
        <p className="app-loader__message">{message}</p>
      </div>
    </div>
  );
}
