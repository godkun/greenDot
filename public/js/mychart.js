var $ = function(sel) {
    return document.querySelector(sel);
}
var button = $('#ajax'),
    preloader = $('#preloader5'),
    pk = $('#pk'), //开启pk模式
    container = $('#container'),
    pkGo = $('#go'),
    TIMEOUT = 30000;
var getJSON = function(url) {
    var promise = new Promise(function(resolve, reject) {
        var client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.timeout = TIMEOUT;
        client.ontimeout = function() {
            client.abort();
            console.log('timeout');
        }
        client.send();

        function handler() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                console.log('success');
                resolve(this.response);
            } else {
                console.log('error');
                reject(new Error(this.statusText));
            }
        };
    });

    return promise;
};



button.addEventListener('click', function() {
    this.disabled = true; //禁用button
    $('#users div:first-child').innerHTML = '';
    $('#users div:last-child').innerHTML = ''; //代码开始乱的不行了，一直在repeat self
    preloader.style.display = "block"; //显示加载动画
    var input = $('#user');
    if (!input.value) {
        input.focus();
        return false;
    }
    getUserInfo(input.value, '#userinfo');
    var year = jQuery('#year span:first').text();
    var url = window.location.href + 'ajax/' + input.value + (/\d{4}/.test(year) ? '?year=' + year : '');
    getJSON(url).then(function(json) {
            button.disabled = false;
            preloader.style.display = "none";
            var Alldata = json;
            if (!Alldata.error) {

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
                container.innerHTML = '';
                var cvsBar = createCanvas('bar');
                container.appendChild(cvsBar);
                var cvsBar = document.getElementById('bar');
                ctx = cvsBar.getContext('2d');
                ctx.clearRect(0, 0, cvsBar.width, cvsBar.height);
                var chart = new Chart(ctx, {
                    type: 'bar',
                    data: chartdata,
                    xAxisID: '月份',
                    options: {
                        responsive: true,
                        layout: {
                            padding: 20
                        },
                        title: {
                            display: true,
                            text: Alldata.user + (/\d{4}/.test(year) ? year : new Date().getFullYear()) + '年活跃度',
                            fontSize: 24
                        }
                    }
                });
            } else {
                // console.log(Alldata.error);
                container.innerHTML = "请检查id输入是否正确";
            }

        },
        function(e) {
            alert("Request was unsuccessful: " + e);
        });
});
go.addEventListener('click', function() {
    this.disabled = true; //禁用button
    $('#userinfo').innerHTML = '';
    preloader.style.display = "block";
    var userA = $('#user1'),
        userB = $('#user2');
    if (!userA.value || !userB.value) {
        !userA.value ? userA.focus() : userB.focus();
        return false;
    };
    getUserInfo(userA.value, '#users div:first-child');
    getUserInfo(userB.value, '#users div:last-child');
    var url = window.location.href + 'pk' + '?' + 'userA=' + userA.value + '&userB=' + userB.value;
    getJSON(url).then(function(json) {
            go.disabled = false;
            preloader.style.display = "none";
            var Alldata = json;
            var userA_data = data2label_pk(Alldata.userA.wdata);
            var userB_data = data2label_pk(Alldata.userB.wdata);
            var chartdata = {
                labels: userA_data.chartLabel,
                title: '月贡献值表',
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                pointHitRadius: 10,
                borderWidth: 2,
                datasets: [{
                        label: Alldata.userA.name,
                        borderColor: "#529",
                        data: userA_data.chartvalue
                    },
                    {
                        label: Alldata.userB.name,
                        borderColor: "#f66",
                        data: userB_data.chartvalue
                    }
                ]
            };
            //绘制chart
            container.innerHTML = '';
            var cvsBar = createCanvas('bar');
            container.appendChild(cvsBar);
            var cvsBar = document.getElementById('bar');
            ctx = cvsBar.getContext('2d');
            ctx.clearRect(0, 0, cvsBar.width, cvsBar.height);
            var chart = new Chart(ctx, {
                type: 'line',
                data: chartdata,
                xAxisID: '周',
                options: {
                    responsive: true,
                    layout: {
                        padding: 20
                    },
                    title: {
                        display: true,
                        text: Alldata.userA.name + ' VS ' + Alldata.userB.name,
                        fontSize: 24
                    }
                }
            });

        },
        function(e) {
            alert("Request was unsuccessful: " + xhr.status);
        });
});

function createCanvas(id) {
    var canvas = document.createElement('canvas');
    canvas.id = id;
    return canvas;
}

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

function data2label_pk(data) { //请求的数据生成chart label和value数据
    var weekdata = JSON.parse(data),
        labels = [],
        values = [];
    for (var i = 0; i < weekdata.length; i++) {
        labels.push((i + 1).toString());
        var weektotal = weekdata[i].reduce(function(prev, curr) {
            return prev + curr.data;

        }, 0);
        values.push(weektotal);
    }

    return { chartLabel: labels, chartvalue: values };

}


function toggleInput() {
    var single = $('#single'),
        vs = $('#vs');
    if (getComputedStyle(single).display !== 'none') {
        // console.log(getComputedStyle(single).display);
        single.style.display = 'none';
        vs.style.display = 'table';
    } else {
        single.style.display = 'table';
        vs.style.display = 'none';

    }

}
pk.addEventListener('click', function() {
    getComputedStyle(this).color == 'rgb(255, 255, 255)' ? this.style.color = '#fc6c22' : this.style.color = '#fff';
    // console.log(getComputedStyle(this).color);
    toggleInput();

})