export function toDateString(date: string) {
    if (date.length > 10) { date = date.substring(0, 10) }
    return new Date(date.replaceAll('-', '/')!).toDateString().substring(4)
}
