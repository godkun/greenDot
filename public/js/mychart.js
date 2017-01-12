var button = document.querySelector('#ajax');
var container = document.getElementById('container');
button.addEventListener('click', function() {
    var input = document.querySelector('#user');
    if (!input.value) {
        input.focus();
        return false;
    }
    var xhr = new XMLHttpRequest();
    url = window.location.href + 'ajax/' + input.value;
    console.log(url);

    function data2label(data) { //请求的数据生成chart label和value数据
        var monthdata = JSON.parse(data);
        var monthTotal = {}; //一个月份和总贡献值的对象{‘01’：23 ...}
        for (key in monthdata) {
            if (monthdata.hasOwnProperty(key)) {
                monthTotal[key] = monthdata[key].reduce(function(prev, cur) {
                    return prev + cur.data;
                }, 0);
            }
        }
        var labels = Object.keys(monthTotal).sort();
        var values = [];
        labels.forEach(function(i) {
            values.push(monthTotal[i]);
        });
        return { chartLabel: labels, chartvalue: values };

    }
    xhr.open('get', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState  ==  4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                var Alldata = JSON.parse(xhr.responseText);
                console.log(Alldata);
                var chartD = data2label(Alldata.monthData);
                var chartdata = {
                    labels: chartD.chartLabel,
                    title: '月贡献值表',
                    datasets: [{
                        label: '月活跃度',
                        backgroundColor: "#44a340",
                        borderColor: "rgba(220,220,220,1)",
                        data: chartD.chartvalue
                    }]
                };
                //绘制chart
                function createCanvas(id) {
                    var canvas = document.createElement('canvas');
                    canvas.id = id;
                    return canvas;
                }
                if (!document.getElementById('bar')) {
                    var cvsBar = createCanvas('bar');
                    container.appendChild(cvsBar);
                }
                var cvsBar = document.getElementById('bar');
                console.log(cvsBar);
                ctx = cvsBar.getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: chartdata,
                    xAxisID: '月份',
                    options: {
                        responsive: true
                    }
                });
                container.querySelector('.title').innerHTML = Alldata.user + '2016年活跃度'

            } else {
                alert("Request was unsuccessful: " + xhr.status);
            }
        }
    }
    xhr.send(null);
});