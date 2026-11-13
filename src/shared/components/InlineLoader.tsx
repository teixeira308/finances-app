interface InlineLoaderProps {
  label?: string;
}

export function InlineLoader({ label = 'Carregando' }: InlineLoaderProps) {
  return <span className="inline-loader" role="status" aria-label={label} />;
}
