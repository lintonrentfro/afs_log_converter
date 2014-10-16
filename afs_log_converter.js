afsData = {
    dataDate : "",
    rawData : "",
    batchClosings : [],
    finalArray : [],
    withBoxNumbers : [],
    institutionCodes : [
        { code: "005", box : 5478 },
        { code: "015", box : 2111 },
        { code: "025", box : 9874 },
        { code: "035", box : 1234 },
        { code: "045", box : 2345 },
        { code: "055", box : 7732 },
        { code: "065", box : 9879 },
        { code: "071", box : 9999 },
        { code: "085", box : 4343 },
        { code: "095", box : 9879 }
    ]
};
afsReader = {
    getRawData : function(callback) {
        var logfile = document.querySelector("#fileInput").files[0];
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                afsData.dataDate = logfile.name.substring(0, 2) + "-" + logfile.name.substring(2, 4) + "-" + logfile.name.substring(4, 8);
                afsData.rawData = evt.target.result;
                callback();
            };
        };
        reader.readAsText(logfile);
    },
    getBatchClosings : function(callback) {
        var passone = afsData.rawData.replace(/index/g,"\nindex");
        var passtwo = passone.replace(/Trlb/g,"\nTrlb");
        var passthree = passtwo.replace(/TRLB/g,"\nTRLB");
        var array1 = passthree.match(/index.+Closed/g);
        var array2 = passthree.match(/Trlb.+Closed/g);
        var array3 = passthree.match(/TRLB.+Closed/g);
        var array4 = array1.concat(array2);
        var array5 = array3.concat(array4);
        for(var i = 0; i < array5.length; i++) {
            array5[i] = array5[i].replace(/\0+/g," ");
            array5[i] = array5[i].replace(/Set/g," Set");
            array5[i] = array5[i].replace(/Login/g,"Login ");
            array5[i] = array5[i].replace(/IV/g," IV");
            array5[i] = array5[i].replace(/09172014/g," 09172014 ");
            array5[i] = array5[i].replace(/^.+local/g,"");
            array5[i] = array5[i].replace(/^.+INDEX.../g,"");
            array5[i] = array5[i].replace(/^.+SUP.../g,"");
            array5[i] = array5[i].replace(/^index\d+/g,"");
            array5[i] = array5[i].replace(/^Trlb-+\w+/g,"");
            array5[i] = array5[i].replace(/^TRLB-+\w+/g,"");
            array5[i] = array5[i].replace(/\s{2,}/g," ");
            array5[i] = array5[i].replace(/\sSet File Closed/g,"");
            array5[i] = array5[i].replace(/\sIVLogin/g,"");
        };
        afsData.batchClosings = array5;
        callback();
    },
    showReport : function() {
        var element = document.getElementById("fileInput");
        element.parentNode.removeChild(element);
        var target = document.getElementById("target");
        var newp = document.createElement("p");
        var html = "<h2>Batch Closing and QC Report</h2>";
        html += "<h3>Date: " + afsData.dataDate + "</h3>";
        html += "<table>";
        html += "<tr><th>Box</th><th>Batch</th><th>User</th></tr>";
        for (var i=0; i < afsData.finaldata.length; i++) {
            html += "<tr><td>" + afsData.finaldata[i].box + "</td><td>" + afsData.finaldata[i].batch + "</td><td>" + afsData.finaldata[i].user + "</td></tr>";
        };
        html += "</table>";
        newp.innerHTML = html;
        target.appendChild(newp);
    },
    makeBatchClosingArray : function(callback) {
        var finaldata = [];
        for (var i=0; i < afsData.batchClosings.length; i++) {
            var obj = {};
            var box = afsData.batchClosings[i].match(/\d\d\d/);
            obj.box = box[0];
            var batch = afsData.batchClosings[i].match(/\w+$/);
            obj.batch = batch[0];
            var user = afsData.batchClosings[i].match(/\s[a-zA-Z]+\s/);
            var user_with_spaces = user[0];
            var user_without_spaces = user_with_spaces.trim();
            obj.user = user_without_spaces;
            finaldata[i] = obj;
        };
        function sort_by_box(a,b) {
            if (a.box < b.box)
                return -1;
            if (a.box > b.box)
                return 1;
            return 0;
        };
        afsData.finaldata = finaldata.sort(sort_by_box);
        callback();
    },
    addBoxNumbers : function(callback) {
        for (var i=0; i < afsData.finaldata.length; i++) {
            // var code = afsData.finaldata[i].code;
            for (var ii=0; ii < afsData.institutionCodes.length; ii++) {
                if (afsData.finaldata[i].box == afsData.institutionCodes[ii].code) {
                    afsData.finaldata[i].box = afsData.institutionCodes[ii].box;
                };
            };
        };
        function sort_by_box(a,b) {
            if (a.box < b.box)
                return -1;
            if (a.box > b.box)
                return 1;
            return 0;
        };
        afsData.finaldata.sort(sort_by_box);
        callback();
    }
};
document.getElementById("fileInput").addEventListener("change", function(e) {
    afsReader.getRawData(function() {
        afsReader.getBatchClosings(function() {
            afsReader.makeBatchClosingArray(function() {
                afsReader.addBoxNumbers(function() {
                    afsReader.showReport();
                    console.log(afsData);
                });
            });
        });
    });
}, false);