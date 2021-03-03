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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9166666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "52 /bawu2/errorPage"], "isController": false}, {"data": [1.0, 500, 1500, "63 /tb/favicon.ico"], "isController": false}, {"data": [1.0, 500, 1500, "53 /"], "isController": false}, {"data": [1.0, 500, 1500, "58 /tb/static-bawu/img/liucheng_f9b7bc0.png"], "isController": false}, {"data": [1.0, 500, 1500, "54 /"], "isController": false}, {"data": [1.0, 500, 1500, "55 /"], "isController": false}, {"data": [1.0, 500, 1500, "59 /tb/cms/app_download.png"], "isController": false}, {"data": [0.0, 500, 1500, "51 /f"], "isController": false}, {"data": [1.0, 500, 1500, "60 /tb/static-bawu/img/bawu/erweima_073af91.png"], "isController": false}, {"data": [1.0, 500, 1500, "61 /static/img/liucheng.png"], "isController": false}, {"data": [1.0, 500, 1500, "56 /tb/static-common/img/search_logo.png"], "isController": false}, {"data": [1.0, 500, 1500, "57 /tb/zt/tengfei/404-error.png"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 100, 8.333333333333334, 75.52583333333332, 7, 1126, 79.80000000000018, 571.95, 737.8800000000001, 111.92985728943196, 2075.296785368669, 56.930469405839006], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["52 /bawu2/errorPage", 100, 0, 0.0, 74.19, 52, 304, 89.40000000000003, 139.95, 303.6399999999998, 10.423181154888471, 23.7028636061601, 4.8858661663539715], "isController": false}, {"data": ["63 /tb/favicon.ico", 100, 0, 0.0, 29.280000000000005, 18, 239, 34.70000000000002, 47.0, 237.8399999999994, 10.515247108307046, 180.83750246451103, 4.384775893796005], "isController": false}, {"data": ["53 /", 100, 0, 0.0, 12.799999999999999, 7, 46, 17.0, 25.899999999999977, 45.83999999999992, 10.48767697954903, 94.49325265469324, 3.8304601468274777], "isController": false}, {"data": ["58 /tb/static-bawu/img/liucheng_f9b7bc0.png", 100, 0, 0.0, 19.809999999999995, 12, 45, 31.80000000000001, 34.89999999999998, 44.989999999999995, 10.485477613505296, 220.38661512399077, 4.22900610779071], "isController": false}, {"data": ["54 /", 100, 0, 0.0, 21.13999999999999, 14, 47, 28.0, 32.94999999999999, 46.91999999999996, 10.474494605635279, 13.113678544307112, 3.610836519325442], "isController": false}, {"data": ["55 /", 100, 0, 0.0, 30.690000000000005, 20, 73, 44.80000000000001, 48.0, 72.7999999999999, 10.479983232026829, 1058.5207790230036, 3.6127285946342487], "isController": false}, {"data": ["59 /tb/cms/app_download.png", 100, 0, 0.0, 12.03, 7, 31, 16.0, 20.0, 30.929999999999964, 10.484378276368211, 87.83748640307192, 4.064744312224785], "isController": false}, {"data": ["51 /f", 100, 100, 100.0, 618.04, 517, 1126, 749.9, 842.75, 1124.7199999999993, 9.565716472163764, 273.45169911038835, 12.386855509852687], "isController": false}, {"data": ["60 /tb/static-bawu/img/bawu/erweima_073af91.png", 100, 0, 0.0, 10.980000000000002, 7, 28, 15.900000000000006, 17.94999999999999, 27.969999999999985, 10.492078480747036, 61.95736281607386, 4.272653053194838], "isController": false}, {"data": ["61 /static/img/liucheng.png", 100, 0, 0.0, 41.02999999999999, 28, 197, 57.400000000000034, 74.89999999999998, 196.17999999999958, 10.494280617063701, 38.63032830701018, 9.213240502676042], "isController": false}, {"data": ["56 /tb/static-common/img/search_logo.png", 100, 0, 0.0, 20.63, 14, 45, 28.0, 30.0, 44.949999999999974, 10.479983232026829, 24.276001002148398, 4.196087036260742], "isController": false}, {"data": ["57 /tb/zt/tengfei/404-error.png", 100, 0, 0.0, 15.69, 9, 37, 22.900000000000006, 25.899999999999977, 36.95999999999998, 10.484378276368211, 229.28720971377646, 4.105698914866848], "isController": false}]}, function(index, item){
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
