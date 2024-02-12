const extractUUID = (path: string | undefined): string => {
  if (!path) return '';
  const segs = path.split('/');
  const uuid = segs[segs.length - 1];
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  if (uuid != null) {
    return uuid.match(uuidRegex) ? uuid : '';
  }
  return '';
};

export { extractUUID };
