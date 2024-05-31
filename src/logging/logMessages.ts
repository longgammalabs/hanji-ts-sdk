export const getErrorLogMessage = (error: any): string => {
  if (!error)
    return `[error is ${error === null ? 'null' : 'undefined'}]`;

  if (typeof error === 'string')
    return error;
  else if (typeof error?.message === 'string')
    return error.message;

  return '[unknown error type]';
};
