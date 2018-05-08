export default function cusError(message, { statusCode, code, params, constructorOpt } = {}) {
  const error = new Error(message)
  // error.type = type // db, server, client etc

  error.cusError = true // is a custom error, faster than using instanceof
  error.params = params // hopefully params is not circular
  error.code = code || statusCode

  if (process.env.APP_ENV === 'server') {
    Error.captureStackTrace(error, constructorOpt)
    error.statusCode = statusCode
  } else {
    Error.captureStackTrace && Error.captureStackTrace(error, constructorOpt)
  }

  return error
}

// export const E4001 = 'Email has been registed'
// export const E4002 = 'Phone has been registed'
// export const E4003 = 'Name has been registed'
// export const E4004 = 'Content is needed'

export function errInput(params) {
  return cusError('Invalid input', {
    statusCode: 400,
    params,
    constructorOpt: errInput
  })
}

export function errAuth() {
  return cusError('Unauthorized', {
    statusCode: 401,
    constructorOpt: errAuth
  })
}

export function errOAuth(message = '', params) {
  return cusError('Error autheneticating with ' + message, {
    statusCode: 520,
    params,
    constructorOpt: errOAuth
  })
}