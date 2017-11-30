const CTX = document.getElementById('chart');

var data = [];
var colors = [];
var votes = [];
var length = <%- poll.pollOptions.length %>;


for (var i=0; i < length; i++) {
    data.push(<%- poll.pollOption[i].option %>);
    var color = randomRGB();
    colors.push(color);
    votes.push(<%- poll.pollOption[i].tally %>);
}



var chart = new chart(CTX, {
    type: 'doughnut',
    data: {
        labels: data,
        datasets: [{
            label: 'Votes',
            data: votes,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 0
        }]
    }
})

function randomRGB() {
    var red = Math.floor(Math.random() * 255);
    var green = Math.floor(Math.random() * 255);
    var blue = Math.floor(Math.random() * 255);
    console.log('rgba(' + red + ',' + green + ',' + blue + ',' + 0.5 + ')');
    var color = 'rgba(' + red + ',' + green + ',' + blue + ',' + 0.5 + ')';
    return color;
}

