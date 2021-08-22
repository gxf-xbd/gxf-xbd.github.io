let cubeRotation = 0.0;
let rbt = new robot_tool.robot();

let btn = null;

async function setup() {

    let canvas = document.querySelector("#glcanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    let info = init_ctrl(canvas, true);

    let gl = canvas.getContext("webgl");
    if (!gl) {
        alert("init WebGL err.");
        return;
    }

    let prog_in = await init_prog(gl, "vs2.glsl", "fs2.glsl", [
        "vertex", "normal"
    ], [
        "mat_proj", "mat_view", "mat_mod"
    ]);

    obs.init(info, gl, prog_in, 60.0);

    {
        let body = document.body;

        let div = document.createElement("div");
        div.style.position = "absolute";
        div.className = "pad2";
        body.appendChild(div);
        btn = div;

        let txt1 = document.createElement("font");
        txt1.innerHTML = "KUKA<br />";
        txt1.style.fontSize = "20px";
        div.appendChild(txt1);

        let txt3 = document.createElement("font");
        txt3.innerHTML = "KR210-R2700<br />";
        txt3.style.fontSize = "20px";
        div.appendChild(txt3);

        let txt2 = document.createElement("font");
        txt2.innerHTML = "aefffffffffffffffffffffffffaf<br />";
        txt2.style.fontSize = "20px";
        div.appendChild(txt2);


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

    await rbt.init_kr210(obs);


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

function loop(gl, obj, deltaTime) {

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

    obs.draw_obj(obj, cframe.o);

    rbt.show(obs, [cubeRotation, cubeRotation * 3, -cubeRotation, cubeRotation / 4, cubeRotation, 0.1]);

    cubeRotation += deltaTime;

    let px = obs.to_screen(new vec3(0, 1000, 0));
    if (px) {
        btn.style.left = px.x - btn.clientWidth / 2 + "px";
        btn.style.top = px.y - btn.clientHeight + "px";
        let sc = 3000.0 * px.z;
        if (sc < 0.1) sc = 0.1;
        else if (sc > 2.0) sc = 2.0;
        btn.style.transform = "scale(" + sc + ")";
    }
    console.log(document.activeElement.tagName);

}

setup();