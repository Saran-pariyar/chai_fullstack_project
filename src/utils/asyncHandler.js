const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
    }
}

export { asyncHandler }

// THIS IS TRY CATCH WAY. WE USE HIGH ORDER FUNCTION TOO HERE
/*
const asyncHandler = (func) => {
    async (req, res, next) => {

        try {
            await func(req, res, next)
        }
        catch (error) {
            res.status(eror.code || 500).json({
                success: false,
                message: error.message
            })
        }
    }
}

*/ 