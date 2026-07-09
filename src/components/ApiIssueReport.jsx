import {
  SUPPORT_PHONE,
  describeApiError,
  getEmailReportHref,
  getWhatsAppReportHref,
  isReportableApiIssue,
} from '../utils/api';

export default function ApiIssueReport({
  error,
  context = 'Website request',
  payloadText = '',
  className = '',
  dark = false,
  align = 'left',
}) {
  if (!isReportableApiIssue(error)) return null;

  const details = describeApiError(error);
  const telHref = `tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`;
  const panelClass = dark
    ? 'border-amber-300/40 bg-amber-300/10 text-amber-100'
    : 'border-amber-200 bg-amber-50 text-amber-800';
  const mutedClass = dark ? 'text-amber-100/80' : 'text-amber-700';
  const detailClass = dark ? 'bg-black/20 text-amber-50' : 'bg-white/70 text-amber-950';
  const emailClass = dark
    ? 'rounded border border-white/20 px-3 py-2 text-xs font-bold text-white'
    : 'rounded border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900';
  const callClass = dark
    ? 'rounded bg-white px-3 py-2 text-xs font-bold text-black'
    : 'rounded bg-black px-3 py-2 text-xs font-bold text-white';
  const alignment = align === 'center' ? 'text-center' : 'text-left';
  const actionsAlignment = align === 'center' ? 'justify-center' : '';

  return (
    <div className={`rounded-lg border p-4 text-sm ${panelClass} ${alignment} ${className}`} role="alert">
      <p className="font-extrabold">Report error to admin</p>
      <p className={`mt-1 ${mutedClass}`}>
        The request did not complete through the API. Use these direct options while we check it.
      </p>

      <dl className={`mt-3 space-y-1 rounded p-3 text-xs ${detailClass}`}>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <dt className="font-extrabold uppercase tracking-widest opacity-70">Status</dt>
          <dd>{details.status}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <dt className="font-extrabold uppercase tracking-widest opacity-70">Message</dt>
          <dd className="break-words">{details.message}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <dt className="font-extrabold uppercase tracking-widest opacity-70">API</dt>
          <dd className="break-all">{details.url}</dd>
        </div>
      </dl>

      <div className={`mt-3 flex flex-wrap gap-2 ${actionsAlignment}`}>
        <a
          href={getWhatsAppReportHref(context, error, payloadText)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-green-600 px-3 py-2 text-xs font-bold text-white"
        >
          WhatsApp
        </a>
        <a href={telHref} className={callClass}>Call</a>
        <a href={getEmailReportHref(context, error, payloadText)} className={emailClass}>Email owner</a>
      </div>
    </div>
  );
}
