import 'date-fns/formatDuration';

// Awaiting release of https://github.com/date-fns/date-fns/pull/1881
declare module 'date-fns/formatDuration' {
  function formatDuration(duration: Duration, Options?: any): string;
  export = formatDuration;
}
