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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 100, 8.333333333333334, 75.40833333333339, 6, 1198, 78.0, 569.8500000000001, 743.8800000000001, 110.31439602868174, 2043.767380262916, 56.108803318624744], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["52 /bawu2/errorPage", 100, 0, 0.0, 67.83, 50, 215, 79.80000000000001, 98.79999999999995, 214.27999999999963, 10.465724751439037, 23.798076923076923, 4.9058084772370485], "isController": false}, {"data": ["63 /tb/favicon.ico", 100, 0, 0.0, 26.64, 17, 139, 33.900000000000006, 44.89999999999998, 138.17999999999958, 10.384215991692628, 178.5848869093977, 4.33013694184839], "isController": false}, {"data": ["53 /", 100, 0, 0.0, 11.770000000000001, 8, 22, 17.900000000000006, 18.0, 21.989999999999995, 10.52853232259423, 94.8610480495894, 3.8453819225100023], "isController": false}, {"data": ["58 /tb/static-bawu/img/liucheng_f9b7bc0.png", 100, 0, 0.0, 18.859999999999992, 11, 42, 25.0, 33.849999999999966, 41.969999999999985, 10.52853232259423, 221.29453240155823, 4.246370946515056], "isController": false}, {"data": ["54 /", 100, 0, 0.0, 21.48, 14, 59, 29.80000000000001, 37.849999999999966, 58.86999999999993, 10.515247108307046, 13.16459647739222, 3.624884989484753], "isController": false}, {"data": ["55 /", 100, 0, 0.0, 30.859999999999996, 21, 66, 43.0, 50.0, 65.91999999999996, 10.521885521885523, 1062.777021517256, 3.6271734269781146], "isController": false}, {"data": ["59 /tb/cms/app_download.png", 100, 0, 0.0, 12.170000000000002, 7, 44, 18.900000000000006, 22.0, 43.8099999999999, 10.54629824931449, 88.35614519616115, 4.088750395486184], "isController": false}, {"data": ["51 /f", 100, 100, 100.0, 624.9200000000001, 516, 1198, 793.7000000000002, 976.7999999999995, 1197.3099999999997, 9.559315553006405, 271.6176826426728, 12.378566819615715], "isController": false}, {"data": ["60 /tb/static-bawu/img/bawu/erweima_073af91.png", 100, 0, 0.0, 11.120000000000005, 6, 30, 15.900000000000006, 20.899999999999977, 29.989999999999995, 10.536297545042672, 62.219718022336956, 4.290660230744916], "isController": false}, {"data": ["61 /static/img/liucheng.png", 100, 0, 0.0, 43.68000000000002, 26, 299, 75.40000000000015, 103.5499999999999, 297.41999999999916, 10.364842454394692, 38.152236052808874, 9.099602896973467], "isController": false}, {"data": ["56 /tb/static-common/img/search_logo.png", 100, 0, 0.0, 21.21, 14, 58, 28.900000000000006, 40.74999999999994, 57.91999999999996, 10.518565267697486, 24.365475767855266, 4.211534921636689], "isController": false}, {"data": ["57 /tb/zt/tengfei/404-error.png", 100, 0, 0.0, 14.360000000000003, 10, 34, 19.0, 20.94999999999999, 33.889999999999944, 10.540739959945189, 230.50663078423105, 4.127770238220723], "isController": false}]}, function(index, item){
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
