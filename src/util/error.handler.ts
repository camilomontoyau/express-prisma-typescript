import { Response, Request, NextFunction }  from 'express'
import { v4 as uuidV4 } from 'uuid'


const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.log('=====errror handler=======')
  const status = err.status ?? 500
  const formatError = {
    id: uuidV4(),
    message: err.message,
    errors: err.errors ?? err.error,
    stack: (process.env.NODE_ENV === 'local') ? err.stack : undefined
  }
  console.log(formatError) // TODO: define error logging

  const { stack, ...errorResponse } = formatError

  if(status === 500 && process.env.NODE_ENV !== 'local') {
    res.status(status).json(
      { 
        id: formatError.id,
        message: 'internal server error'
      }
    );
  }

  res.status(status).json(
    errorResponse
  );
}

export default errorHandler