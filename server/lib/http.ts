export const ok = <T>(data: T, message = 'OK') => ({
  success: true,
  data,
  message,
});

export const fail = (message: string, errors: unknown[] = []) => ({
  success: false,
  message,
  errors,
});
