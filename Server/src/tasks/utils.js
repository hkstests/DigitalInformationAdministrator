exports.getWeekNumberByDate = (d) => {
    var onejan = new Date(d.getFullYear(), 0, 1);
    var millisecsInDay = 86400000;
    return Math.ceil((((d - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
};

exports.logDivider = () => {
    console.log("------------------------");
}