"use strict";

function parseInput() {
    var params = {};
    params.case = [];

    var text = document.getElementById("code").value;
    var array = text.split(/(?:\r\n|\r|\n)/);
    var metaInfo = array[0];
    var [B,L,D] = metaInfo.split(" ").map(i => parseInt(i,10));
    params.B = B;
    params.L = L;
    params.D = D;

    params.values = array[1].split(" ").map(i => parseInt(i,10));

    for(var n=0;n<L;n++) {
        params.case[n] = {
          id: n,
          meta: array[2*n + 2].split(" ").map(i => parseInt(i,10)),
          books: array[2*n + 3].split(" ").map(i => parseInt(i,10))
        };
    }
    return params;
}
