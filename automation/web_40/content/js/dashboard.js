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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 100, 8.333333333333334, 74.5208333333334, 6, 1015, 80.80000000000018, 568.0, 705.94, 111.76306230790723, 2073.374524133836, 56.845633091180034], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["52 /bawu2/errorPage", 100, 0, 0.0, 71.37, 50, 284, 88.50000000000003, 103.64999999999992, 283.36999999999966, 10.444955086693128, 23.753296688949238, 4.896072696887403], "isController": false}, {"data": ["63 /tb/favicon.ico", 100, 0, 0.0, 26.089999999999996, 17, 62, 36.50000000000003, 43.89999999999998, 61.909999999999954, 10.555203715431707, 181.526826709943, 4.401437486805995], "isController": false}, {"data": ["53 /", 100, 0, 0.0, 12.140000000000002, 7, 28, 17.0, 20.94999999999999, 27.949999999999974, 10.509721492380452, 94.69371962033631, 3.8385115606936413], "isController": false}, {"data": ["58 /tb/static-bawu/img/liucheng_f9b7bc0.png", 100, 0, 0.0, 18.32999999999999, 12, 43, 25.0, 27.94999999999999, 42.929999999999964, 10.506408909434755, 220.82645218270645, 4.23744812460601], "isController": false}, {"data": ["54 /", 100, 0, 0.0, 22.1, 13, 62, 29.900000000000006, 38.69999999999993, 61.89999999999995, 10.495382031905962, 13.139726332913517, 3.618036969983207], "isController": false}, {"data": ["55 /", 100, 0, 0.0, 30.219999999999995, 19, 58, 43.0, 50.94999999999999, 57.969999999999985, 10.514141520344864, 1062.002426466723, 3.624503863947009], "isController": false}, {"data": ["59 /tb/cms/app_download.png", 100, 0, 0.0, 12.070000000000004, 7, 30, 19.0, 23.0, 29.97999999999999, 10.51745898190997, 88.11453184160708, 4.077569546697518], "isController": false}, {"data": ["51 /f", 100, 100, 100.0, 610.84, 517, 1015, 708.9, 823.6499999999994, 1014.5299999999997, 9.540164090822362, 273.89205527928834, 12.353767172295365], "isController": false}, {"data": ["60 /tb/static-bawu/img/bawu/erweima_073af91.png", 100, 0, 0.0, 11.270000000000003, 6, 28, 17.0, 21.94999999999999, 27.95999999999998, 10.519671786240268, 62.119997402956024, 4.28388978013886], "isController": false}, {"data": ["61 /static/img/liucheng.png", 100, 0, 0.0, 44.260000000000005, 26, 258, 60.80000000000001, 112.29999999999984, 257.2299999999996, 10.52853232259423, 38.757953977153086, 9.243311091808803], "isController": false}, {"data": ["56 /tb/static-common/img/search_logo.png", 100, 0, 0.0, 20.709999999999994, 13, 69, 27.900000000000006, 32.94999999999999, 68.74999999999987, 10.495382031905962, 24.31044110122796, 4.202252571368597], "isController": false}, {"data": ["57 /tb/zt/tengfei/404-error.png", 100, 0, 0.0, 14.849999999999994, 9, 36, 20.900000000000006, 25.899999999999977, 35.95999999999998, 10.520778537611783, 230.07791951604418, 4.119953314045239], "isController": false}]}, function(index, item){
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
