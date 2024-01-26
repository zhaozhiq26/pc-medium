export const getTime = (data: any, formate = "YYYY-MM-DD HH:mm:ss") => {
    let value = Number(data.toString().split(".")[0]);
    let dt = new Date(value);
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1 + "").padStart(2, "0");
    let day = (dt.getDate() + "").padStart(2, "0");

    let hour = (dt.getHours() + "").padStart(2, "0");
    let min = (dt.getMinutes() + "").padStart(2, "0");
    let second = (dt.getSeconds() + "").padStart(2, "0");
    if (formate == 'YYYY') {
        return year;
    } else if (formate == 'YYYY-MM') {
        return `${year}-${month}`;
    } else if (formate == 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    } else if (formate == 'YYYY-MM-DD HH') {
        return `${year}-${month}-${day} ${hour}:00`;
    } else if (formate == 'YYYY-MM-DD HH:mm') {
        return `${year}-${month}-${day} ${hour}:${min}`;
    } else if (formate == 'YYYY-MM-DD HH:mm:ss') {
        return `${year}-${month}-${day} ${hour}:${min}:${second}`;
    }
}
