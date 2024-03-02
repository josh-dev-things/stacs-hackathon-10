function Time()
{
    const date = new Date();
    let stamp = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return stamp;
}

module.exports = Time;