
export class ErrorException{
    statusCode : number;
    message : string;

    constructor(statusCode : number, message : string){
        this.statusCode = statusCode;
        this.message = message;
    }
}