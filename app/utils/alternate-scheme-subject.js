export function alternateSchemeSubject(subject) {
  if (subject.startsWith('https://')) return `http://${subject.slice(8)}`;
  if (subject.startsWith('http://')) return `https://${subject.slice(7)}`;
  return null;
}
