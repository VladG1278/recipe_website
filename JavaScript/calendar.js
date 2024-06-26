// https://www.geeksforgeeks.org/how-to-create-a-dynamic-calendar-in-html-css-javascript/


//populate calendar
today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();


let calendar = document.getElementById("calendar"); 
let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


let days = [
    "Sun", "Mon", "Tue", "Wed",
    "Thu", "Fri", "Sat"];
 
$dataHead = "<tr>";
for (dhead in days) {
    $dataHead += "<th data-days='" +
        days[dhead] + "'>" +
        days[dhead] + "</th>";
}
$dataHead += "</tr>";
document.getElementById("thead-month").innerHTML = $dataHead;
showCalendar(currentMonth, currentYear)

// Function to navigate to the next month
function next() {
    currentYear = currentMonth === 11 ?
        currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}
 
// Function to navigate to the previous month
function previous() {
    currentYear = currentMonth === 0 ?
        currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ?
        11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

//Function to Display Clendar
function showCalendar(month, year) {
    let firstDay = new Date(year, month, 1).getDay();
    tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";
    monthAndYear.innerHTML = months[month] + " " + year;
    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                cell = document.createElement("td");
                cell.setAttribute("data-date", date);
                cell.setAttribute("data-month", month + 1);
                cell.setAttribute("data-year", year);
                cell.setAttribute("data-month_name", months[month]);
                cell.className = "date-picker";
                //cell.innerHTML = "<span>" + date + "</span";
                cell.innerHTML = date;
                if (
                    date === today.getDate() &&
                    year === today.getFullYear() &&
                    month === today.getMonth()
                ) {
                    cell.className = "date-picker selected";
                }
  
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row);
    }
    setUpClicking1();
}
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

//Intialize Date at Bottom Header
var cellDate = {number:today.getDate(), month:currentMonth, year:currentYear, monthName:months[currentMonth]};
dateHeader(cellDate);

//Add Event Listeners to All Cells that highlight and change date when clicked
function setUpClicking1 () { 
    cellClassNames = document.getElementsByClassName("date-picker");
    for (var i =0; i < cellClassNames.length; i++) {
        cellClassNames[i].addEventListener('click', function(e) {
            e = e || window.event;
            var element = e.target || e.srcElement;
                cellDate = {number:element.getAttribute("data-date"), month:element.getAttribute("data-month"), year: element.getAttribute("data-year"), monthName: element.getAttribute("data-month_name")};
                dateHeader();
                unHighlightAll(cellClassNames);
                element.style.backgroundColor = "yellow";
        }, false);
        if (cellClassNames[i].getAttribute("data-date") == today.getDate() && cellClassNames[i].getAttribute("data-month") - 1 == today.getMonth() && cellClassNames[i].getAttribute("data-year") == today.getFullYear()) {
            cellClassNames[i].style.backgroundColor = "yellow";
        }
    }
}

//Set the Date at the Bottom Header
function dateHeader(){
    dateHeader1 = document.getElementById("currentDateAdder");
    dateHeader1.innerHTML = cellDate.monthName + " " + cellDate.number + ", " + cellDate.year;
}


function unHighlightAll (cellClassNames) {
    for(i =0; i < cellClassNames.length; i++) {
        cellClassNames[i].style.backgroundColor = "";
    }
}
