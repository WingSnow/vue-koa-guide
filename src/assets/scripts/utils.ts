function saveToken(token: string): void{
    sessionStorage.setItem("token", token);
}

function getToken(): string | null{
    return sessionStorage.getItem("token")
}

function clearToken(): void{
    sessionStorage.removeItem("token");
}

function verifyToken(): boolean{
    return !!getToken()
}

async function wrappedFetch(resource: RequestInfo, init: RequestInit): Promise<any> {
    const token = getToken()
    if (token) {
        init.headers = {'Authorization': 'Bearer ' + token} //添加header
    }
    const res = await fetch(resource, init)
    if (res.ok) {
        return res.json()
    } else {
        return Promise.reject({
            resource: resource,
            status: res.status,
            statusText: res.statusText
        })
    }
}


export default {saveToken, getToken, clearToken,  verifyToken, wrappedFetch}