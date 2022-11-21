import FlowCore from "./engine/FlowCore.js";

var fc = null;
var interval = null;
document.querySelector("#bt_play").onclick = function () {
    if (interval != null) {
        clearInterval(interval);
    }

    fc = new FlowCore(
        document.querySelector("#ta_code").value,
        document.querySelector("#ta_input").value
    );
    interval = setInterval(() => {
        fc.move_particles();
        fc.update_blocks();
        document.querySelector("#ta_play").value = fc.render();
        document.querySelector("#ta_output").value = fc.output;
    }, 100);
};

document.querySelector("#bt_test").onclick = function () {
    if (interval != null) {
        clearInterval(interval);
        interval = null;
    }
};
