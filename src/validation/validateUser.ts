export const validateUser = (
  user: Record<string, string | number | string[]>,
): boolean => {
  const allowedProperties = ['username', 'age', 'hobbies'];
  const invalidProperties = Object.keys(user).filter(
    (key) => !allowedProperties.includes(key),
  );
  if (invalidProperties.length > 0) {
    return false;
  }
  if (typeof user !== 'object') return false;
  if (typeof user.username !== 'string') return false;
  if (typeof user.age !== 'number') return false;
  if (
    !(
      Array.isArray(user.hobbies) &&
      user.hobbies.every((hobby) => typeof hobby === 'string')
    )
  )
    return false;
  return true;
};
