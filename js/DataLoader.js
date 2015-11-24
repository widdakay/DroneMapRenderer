function listSensors() {
    return Object.keys(data["data"][0]);
}

function selectSensor(newSensor) {
    guiManager.sensor = newSensor;
    removeData();
    displayData(data);
}

var data;

function addData(url) {
    loadingData = true;

    $.getJSON(url, function(newData) {
        data = newData;
        guiManager.sensor = listSensors()[0];
        displayData(data);

        loadingData = false;
        debug("loaded data");
    });
}

function displayData(data) {

    var geometry = new THREE.Geometry();
    var i = 0;

    var scale = 100000;//data["scale"];      // 50000
    var offset = data["offset"];    // [122.2787, 37.46244, 220]
    var rotation = data["rotation"];

    var sensor = guiManager.sensor;

    console.log("loading data...");
    console.log(scale, offset, rotation, sensor);

    var min = data["maxmin"][sensor][0];
    var max = data["maxmin"][sensor][1];



    for (var point in data["data"]) {
        var p = data["data"][point];

        var lon = (p["pos"][0] + offset[0])/180.0*Math.PI;
        var lat = (p["pos"][1] + offset[1])/180.0*Math.PI;
        var alt = p["pos"][2] + offset[2] + 63;// + 6378100;

        lon = lon*100000;
        lat = lat*100000;

        var x = alt*Math.cos(lat)*Math.sin(lon);
        var y = alt*Math.cos(lon) - 63;//-6378100;
        var z = alt*Math.sin(lat)*Math.sin(lon);

        var datapoint = new THREE.Vector3(x, y, z);
        console.log(lat, lon, alt, datapoint);

        geometry.vertices.push(datapoint);
        geometry.colors[i++] = new THREE.Color(0.1, 1-(p[sensor]-min)/(max-min), (p[sensor]-min)/(max-min));
    }

    var material = new THREE.LineBasicMaterial({
        linewidth: 20,
        color: 0xffffff,
        vertexColors: THREE.VertexColors
    });

    line = new THREE.Line(geometry, material, THREE.Line);

    scene.add(line);
    
}

function removeData() {
    scene.remove(line);
}