/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.66666666666667, "KoPercent": 8.333333333333334};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9158333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "52 /bawu2/errorPage"], "isController": false}, {"data": [1.0, 500, 1500, "63 /tb/favicon.ico"], "isController": false}, {"data": [1.0, 500, 1500, "53 /"], "isController": false}, {"data": [1.0, 500, 1500, "58 /tb/static-bawu/img/liucheng_f9b7bc0.png"], "isController": false}, {"data": [1.0, 500, 1500, "54 /"], "isController": false}, {"data": [1.0, 500, 1500, "55 /"], "isController": false}, {"data": [1.0, 500, 1500, "59 /tb/cms/app_download.png"], "isController": false}, {"data": [0.0, 500, 1500, "51 /f"], "isController": false}, {"data": [1.0, 500, 1500, "60 /tb/static-bawu/img/bawu/erweima_073af91.png"], "isController": false}, {"data": [0.99, 500, 1500, "61 /static/img/liucheng.png"], "isController": false}, {"data": [1.0, 500, 1500, "56 /tb/static-common/img/search_logo.png"], "isController": false}, {"data": [1.0, 500, 1500, "57 /tb/zt/tengfei/404-error.png"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 100, 8.333333333333334, 90.40999999999994, 6, 20062, 80.60000000000036, 567.95, 671.99, 47.541698030981344, 879.2499678103086, 24.18095806426053], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["52 /bawu2/errorPage", 100, 0, 0.0, 68.75999999999999, 49, 252, 81.50000000000003, 89.74999999999994, 251.46999999999974, 10.43079169708981, 23.71945733806196, 4.889433608010848], "isController": false}, {"data": ["63 /tb/favicon.ico", 100, 0, 0.0, 29.97, 19, 286, 38.900000000000006, 52.64999999999992, 284.12999999999903, 4.1637173668651375, 71.60674925573552, 1.7362376129408337], "isController": false}, {"data": ["53 /", 100, 0, 0.0, 12.689999999999998, 6, 28, 20.0, 21.94999999999999, 27.969999999999985, 10.484378276368211, 94.46209815343887, 3.829255347032921], "isController": false}, {"data": ["58 /tb/static-bawu/img/liucheng_f9b7bc0.png", 100, 0, 0.0, 19.550000000000004, 11, 70, 28.900000000000006, 35.89999999999998, 69.77999999999989, 10.484378276368211, 220.357980086234, 4.228562722793038], "isController": false}, {"data": ["54 /", 100, 0, 0.0, 21.279999999999994, 13, 58, 28.0, 36.799999999999955, 57.989999999999995, 10.478885046631039, 13.1190728806455, 3.6123500209577704], "isController": false}, {"data": ["55 /", 100, 0, 0.0, 29.519999999999992, 19, 73, 41.80000000000001, 58.94999999999999, 72.91999999999996, 10.465724751439037, 1057.1345785910519, 3.607813317634746], "isController": false}, {"data": ["59 /tb/cms/app_download.png", 100, 0, 0.0, 11.65, 6, 48, 16.0, 19.0, 47.76999999999988, 10.48987726843596, 87.88345418546103, 4.066876245672926], "isController": false}, {"data": ["51 /f", 100, 100, 100.0, 605.26, 514, 1059, 700.8000000000002, 827.9999999999995, 1058.0999999999995, 9.535615523982074, 267.19316177171737, 12.347877133593974], "isController": false}, {"data": ["60 /tb/static-bawu/img/bawu/erweima_073af91.png", 100, 0, 0.0, 10.930000000000001, 6, 35, 15.900000000000006, 19.0, 34.97999999999999, 10.495382031905962, 61.97256605531066, 4.27399834697733], "isController": false}, {"data": ["61 /static/img/liucheng.png", 100, 0, 0.0, 240.09, 27, 20062, 54.00000000000006, 127.6499999999997, 19862.9699999999, 4.162157662532257, 15.321739664842255, 3.6540817759926747], "isController": false}, {"data": ["56 /tb/static-common/img/search_logo.png", 100, 0, 0.0, 20.469999999999988, 14, 63, 27.0, 28.94999999999999, 62.679999999999836, 10.472300764477955, 24.258102942716516, 4.193011048277307], "isController": false}, {"data": ["57 /tb/zt/tengfei/404-error.png", 100, 0, 0.0, 14.75, 8, 39, 20.900000000000006, 22.94999999999999, 38.95999999999998, 10.478885046631039, 229.17505796133293, 4.103547757518601], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \/&lt;title&gt;\u57CE\u9F99\u663E\u5427-\u767E\u5EA6\u8D34\u5427 &lt;\/title&gt;\/", 100, 100.0, 8.333333333333334], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1200, 100, "Test failed: text expected to contain \/&lt;title&gt;\u57CE\u9F99\u663E\u5427-\u767E\u5EA6\u8D34\u5427 &lt;\/title&gt;\/", 100, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["51 /f", 100, 100, "Test failed: text expected to contain \/&lt;title&gt;\u57CE\u9F99\u663E\u5427-\u767E\u5EA6\u8D34\u5427 &lt;\/title&gt;\/", 100, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
