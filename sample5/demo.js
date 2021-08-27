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
        txt2.innerHTML = "kuka robot<br />";
        txt2.style.fontSize = "20px";
        div.appendChild(txt2);

        div.iiii = div.iii = 1.0;

        div.onclick = (e) => {
            console.log("fefffffe");
            div.iiii = 1.0 - div.iiii;
            div.style.left = 0 + "px";
            div.style.top = 0 + "px";
            div.style.transform = "scale(" + 1 + ")";
        };

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
        let sc = 3000.0 * px.z;
        if (sc < 0.1) sc = 0.1;
        else if (sc > 2.0) sc = 2.0;
        let left = px.x - btn.clientWidth * 0.5;
        let right = px.y - btn.clientHeight * 0.5 * (1.0 + sc);

        btn.iii += (btn.iiii - btn.iii) * 0.1;
        let i1 = btn.iii;
        let i2 = 1.0 - i1;


        let sc2 = 3.0;
        let left2 = 400.0;
        let right2 = 400.0;

        btn.style.left = (left * i1 + left2 * i2) + "px";
        btn.style.top = (right * i1 + right2 * i2) + "px";
        btn.style.transform = "scale(" + (sc * i1 + sc2 * i2) + ")";
    }

}

setup();