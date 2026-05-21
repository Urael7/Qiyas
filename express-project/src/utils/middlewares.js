export const loginMiddleware = (req, res, next) => {
    console.log("LOGIN .....")
    next();
  }

  export const sessionMiddleware = (req, res, next) => {
    console.log("SESSION SETTING .....") ;
    next();
  }

// export { loginMiddleware, sessionMiddleware };