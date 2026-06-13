const authorize = (...allowedRoles) => {
  return (request, response, next) => {

    if (!request.user) {
      return response.status(401).json({
        error: 'authentication required'
      })
    }

    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({
        error: 'insufficient permissions'
      })
    }

    next()
  }
}

module.exports = authorize