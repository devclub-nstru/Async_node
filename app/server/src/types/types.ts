export type thttpResponse = {
    success:boolean,
    status:number,
    message:string,
    data?:unknown,
    request:{
        ip?:string,
        method?:string,
        url?:string

    }

}

export type thttpError= {
    success:boolean,
    status:number,
    request:{
        ip?:string,
        method?:string,
        url?:string
    }
    message:string,
    data?:unknown,
    trace:object | null


}