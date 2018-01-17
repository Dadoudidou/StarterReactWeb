type authorizeOptions = {
    callback: (auth: boolean) => void
    droitsATester: () => any
    droitsUtilisateur: () => any
    compareFn?: (droitsATester: any, droitsUtilisateur: any) => boolean
}
export const authorize = (options: authorizeOptions) => {
    let _defaultOptions: Partial<authorizeOptions> = {
        compareFn: (a,b) => JSON.stringify(a) == JSON.stringify(b)
    }
    options.callback(options.compareFn(options.droitsATester(), options.droitsUtilisateur()));
}



type authorizeRightsArrayOptions = {
    droitsATester: () => any[]
    droitsUtilisateur: () => any[]
    callback: (auth: boolean) => void
}
export const authorize_RightsArray = (options: authorizeRightsArrayOptions) => {
    return authorize({
        ...options,
        compareFn: (droitsATester: any[], droitsUtilisateur: any[]) => {
            let _auth = true;
            let i = 0;
            while(_auth == true && i < droitsATester.length){
                if(droitsUtilisateur.indexOf(droitsATester[i]) == -1)
                    _auth = false;
                i++;
            }
            return _auth;
        }
    })
}

