var cubeRotation = 0.0;
var rbt = new robot_tool.robot();


async function setup() {

    var canvas = document.querySelector("#glcanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    var info = init_ctrl(canvas, true);

    var gl = canvas.getContext("webgl");
    if (!gl) {
        alert("init WebGL err.");
        return;
    }

    const prog_in = await init_prog(gl, "vs2.glsl", "fs2.glsl", [
        "vertex", "normal"
    ], [
        "mat_proj", "mat_view", "mat_mod"
    ]);

    obs.init(info, gl, prog_in, 60.0);



    if ("WebSocket" in window) {

        ws = new WebSocket("ws://127.0.0.1:8183");
        console.log(ws);

        ws.onopen = function() {
            console.log("open");　　
            ws.send("hello777777723432424");
        }
        ws.onerror = function() {
            console.log("err");　
        }
        ws.onmessage = function(e) {
            console.log(e.data);
        }
        ws.onclose = function(e) {
            console.log("close");
        }
        ws.onerror = function(e) {
            console.log(e.error);
        }
        console.log("ok");　
    } else {
        console.log("您的浏览器不支持WebSocket");　
    }




    const obj = await obs.open_obj("0.obj");

    await rbt.init_kr210(obs);


    var then = 0;

    function render(now) {
        now *= 0.001; // convert to seconds
        const deltaTime = now - then;
        then = now;

        loop(gl, obj, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function loop(gl, obj, deltaTime) {

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    obs.update();

    var cframe = tensor_tool.cframe;

    obs.draw_obj(obj, cframe.o);

    rbt.show(obs, [0, cubeRotation, -cubeRotation, cubeRotation, 0.1, 0.1]);

    cubeRotation += deltaTime;

}

setup();