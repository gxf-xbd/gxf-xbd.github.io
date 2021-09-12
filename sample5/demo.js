let rbt = null;
let rbt2 = null;

let lab0 = null;
let lab1 = null;



async function setup() {

    let frame = tensor_tool.frame;
    let cframe = tensor_tool.cframe;
    let cquat = tensor_tool.cquat;
    let vec3 = tensor_tool.vec3;
    let cfloat = tensor_tool.cfloat;

    let canvas = document.querySelector("#glcanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let info = init_ctrl(canvas, true);



    let gl = canvas.getContext("webgl");
    if (!gl) {
        alert("init WebGL err.");
        return;
    }

    window.onresize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let prog_in = await init_prog(gl, "vs2.glsl", "fs2.glsl", [
        "vertex", "normal"
    ], [
        "mat_proj", "mat_view", "mat_mod"
    ]);

    obs.init(info, gl, prog_in, 60.0);


    {

        let body = document.body;
        rbt = new robot_tool.robot_sys(body, new frame(new vec3(0, 0, 0), cquat.o));
        rbt2 = new robot_tool.robot_sys(body, new frame(new vec3(0, 0, -2000), cquat.o));
        await rbt.r.init_kr20(obs);
        await rbt2.r.init_kr210(obs);
    }


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

    let obj = await obs.open_obj("0.obj");



    let then = 0;

    function render(now) {
        now *= 0.001; // convert to seconds
        let deltaTime = now - then;
        then = now;

        loop(gl, obj, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

let ang = 0.0;

function loop(gl, obj, dt) {

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    obs.update();

    let frame = tensor_tool.frame;
    let cframe = tensor_tool.cframe;
    let cquat = tensor_tool.cquat;
    let vec3 = tensor_tool.vec3;
    let cfloat = tensor_tool.cfloat;

    obs.draw_obj(obj, cframe.o);

    ang += dt;
    let s = Math.sin(ang * 2.0) * 0.5;

    rbt.show(obs, [0, s - cfloat.pi_2, -s + cfloat.pi_2, 0, cfloat.pi_2, 0]);
    rbt2.show(obs, [0, -s - cfloat.pi_2, s + cfloat.pi_2, 0, cfloat.pi_2, 0]);

}

setup();