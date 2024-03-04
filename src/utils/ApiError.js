// we create error message class so that we can send errors message more better way

class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        //now we can change these datas and give use this to show error messages next time
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false; //it's false because this is error message
        this.errors = errors

        //this below is optional, understanding it is better but

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}