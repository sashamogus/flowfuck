import FlowCore from "./engine/FlowCore.js";

var fc = new FlowCore("");
document.querySelector("#bt_play").onclick = function () {
    fc = new FlowCore(document.querySelector("#ta_code").value);
    document.querySelector("#ta_play").value = fc.render();

    console.log(fc);
};

document.querySelector("#bt_test").onclick = function () {
    fc.move_particles();
    fc.update_blocks();
    document.querySelector("#ta_play").value = fc.render();
};
