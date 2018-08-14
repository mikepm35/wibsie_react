// Functions to allow for custom calendar

var months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'
];

var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

module.exports = {
  monthObject: function() {
    // Returns object {<monthStr>: <monthInt>}
    var object = {};
    for (stepMo = 1; stepMo <= 12; stepMo++) {
      object[stepMo] = months[stepMo-1];
    }
    return object;
  },

  monthDayIntegerObject: function () {
    // Returns object {<month1>: [1...31], <month2>: [1...30]}
    var object = {};
    for (stepMo = 1; stepMo <= 12; stepMo++) {
      object[stepMo] = [];
      for (stepDay = 1; stepDay <= daysInMonth[stepMo-1]; stepDay++) {
        object[stepMo].push(stepDay);
      }
    }
    return object;
  },

  monthStrFromInteger: function (intMo) {
    return months[intMo-1];
  }
}
