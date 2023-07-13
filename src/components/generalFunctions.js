export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function getRemainingTime(expiresAtTime,crTime) {
    const currentTime = new Date(crTime)
    const expiresAt = new Date(expiresAtTime)
    const remainingTime = new Date(expiresAt - currentTime);
    // const days = remainingTime.getUTCDate() - 1
    // let hours = remainingTime.getUTCHours();
    // let minutes = remainingTime.getUTCMinutes();

    const days    = Math.floor( remainingTime / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));


    if (days < 0) {
        return 'File Expired'
    }else {
        return `${days} days ${hours} hours ${minutes} minutes`
    }
}

export function removeExtension(filename) {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  }