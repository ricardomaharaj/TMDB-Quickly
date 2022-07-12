export function toDateString(date: string) {
    if (date.length > 10) { date = date.substring(0, 10) }
    return new Date(date.replaceAll('-', '/')!).toDateString().substring(4)
}

export function runtimeCalc(runtime: number) {
    if (runtime === 60) {
        return <span> 1h </span>
    } else if (runtime > 60) {
        return <span> {`${runtime / 60}`.substring(0, 1)}h{runtime % 60}m </span>
    } else {
        return <span> {runtime % 60}m </span>
    }
}
