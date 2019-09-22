export function noop(data?: any) {
    return data;
}

export function wait(time:number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}