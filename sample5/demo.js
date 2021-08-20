var cubeRotation = 0.0;

main();

class robot {

    constructor() {
        this.com = class {
            constructor() {
                this.e = new tensor_tool.vec3();
                this.rb = new tensor_tool.vec3();
                this.a = new tensor_tool.vec3(1.0, 0.0, 0.0);
                this.rd = new tensor_tool.quat(1.0, 0.0, 0.0, 0.0);
                this.o = null;
            }

            trans_f(f) {
                this.rb = f.xyz;
                this.rd = f.abc;
            }

            trans(arc, c) {
                var d = tensor_tool.quat.gen_axi(this.a, arc);
                this.rb = c.rb.add(c.rd.rot_vec(c.e));
                this.rd = c.rd.cook(d);
            }

            async init(world, name, op, or2, end, axi) {

                this.e = end;
                this.a = axi;

                this.o = await world.open_obj(name);
                this.rev = new tensor_tool.frame(or2.rot_vec(op.rev()), or2);

                return op.add(or2.rev().rot_vec(end));
            }

            show(world) {
                world.draw_obj(this.o, this.rev.on(new tensor_tool.frame(this.rb, this.rd)));
            }

        }

        this.coms = [];
        for (var i = 0; i < 7; i++) this.coms.push(new this.com());

        this.base = new tensor_tool.frame();
    }

    async init(world, t0, t1, t2, t3, t4, t5, t6,
        o0, o1, o2, o3, o4, o5, o6) {

        var cquat = tensor_tool.cquat;
        var cvec3 = tensor_tool.cvec3;

        var trs = cvec3.o;

        trs = await this.coms[0].init(world, o0, trs, cquat.o, t0, cvec3._y);
        trs = await this.coms[1].init(world, o1, trs, cquat.o, t1, cvec3._y);
        trs = await this.coms[2].init(world, o2, trs, cquat.z270, t2, cvec3._z);
        trs = await this.coms[3].init(world, o3, trs, cquat.o, t3, cvec3._z);
        trs = await this.coms[4].init(world, o4, trs, cquat.o, t4, cvec3._x);
        trs = await this.coms[5].init(world, o5, trs, cquat.o, t5, cvec3._z);
        trs = await this.coms[6].init(world, o6, trs, cquat.o, t6, cvec3._x);
        /*etup({
                    vec2(t1),
                    vec2(t2),
                    vec2(t3),
                    vec2(t4),
                    vec2(t5),
                    vec2(t6)
                });*/
    }

    async init_kr6(world) {
        var vec3 = tensor_tool.vec3;

        await this.init(world,
            new vec3(0.0, 0.0, 0.0), new vec3(25.0, 400.0, 0.0),
            new vec3(455.0, 0.0, 0.0), new vec3(420.0, 35.0, 0.0),
            new vec3(0.0, 0.0, 0.0), new vec3(80.0, 0.0, 0.0),
            new vec3(0.0, 0.0, 0.0),
            "model/kr6/0.obj", "model/kr6/1.obj",
            "model/kr6/2.obj", "model/kr6/3.obj",
            "model/kr6/4.obj", "model/kr6/5.obj",
            "model/kr6/6.obj");
    }

    async init_kr16(world) {
        var vec3 = tensor_tool.vec3;

        await this.init(world,
            new vec3(0.0, 0.0, 0.0), new vec3(160.0, 400.0, 0.0),
            new vec3(980.0, 0.0, 0.0), new vec3(860.0, 150.0, 0.0),
            new vec3(0.0, 0.0, 0.0), new vec3(153.0, 0.0, 0.0),
            new vec3(0.0, 0.0, 0.0),
            "model/kr16_2010/0.obj", "model/kr16_2010/1.obj",
            "model/kr16_2010/2.obj", "model/kr16_2010/3.obj",
            "model/kr16_2010/4.obj", "model/kr16_2010/5.obj",
            "model/kr16_2010/6.obj");
    }

    async init_kr20(world) {
        var vec3 = tensor_tool.vec3;

        await this.init(world,
            new vec3(0.0, 0.0, 0.0), new vec3(160.0, 400.0, 0.0),
            new vec3(780.0, 0.0, 0.0), new vec3(860.0, 150.0, 0.0),
            new vec3(0.0, 0.0, 0.0), new vec3(153.0, 0.0, 0.0),
            new vec3(0.0, 0.0, 0.0),
            "model/kr6/0.obj", "model/kr6/1.obj",
            "model/kr6/2.obj", "model/kr6/3.obj",
            "model/kr6/4.obj", "model/kr6/5.obj",
            "model/kr6/6.obj");
    }

    async init_kr210(world) {
        var vec3 = tensor_tool.vec3;

        await this.init(world,
            new vec3(0.0, 0.0, 0.0), new vec3(350.0, 675.0, 0.0),
            new vec3(1150.0, 0.0, 0.0), new vec3(1200.0, -41.0, 0.0),
            new vec3(0.0, 0.0, 0.0), new vec3(215.0, 0.0, 0.0),
            new vec3(0.0, 0.0, 0.0),
            "model/kr210/0.obj", "model/kr210/1.obj",
            "model/kr210/2.obj", "model/kr210/3.obj",
            "model/kr210/4.obj", "model/kr210/5.obj",
            "model/kr210/6.obj");
    }

    show(world, ax, tool = null) {
        this.coms[0].trans_f(this.base);
        for (var i = 0; i < 6; i++) this.coms[i + 1].trans(ax[i], this.coms[i]);
        for (var i = 0; i < 7; i++) this.coms[i].show(world);
        //if (tool) tool.show(world, coms[6].rb, coms[6].rd);
    }
}

var rbt = new robot();

async function main() {

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


    const obj = await obs.open_obj("model/kr210/0.obj");

    await rbt.init_kr210(obs);


    var then = 0;

    function render(now) {
        now *= 0.001; // convert to seconds
        const deltaTime = now - then;
        then = now;

        draw(gl, obj, deltaTime, info);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function draw(gl, obj, deltaTime, info) {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    obs.update();
    var res = obs.transform();


    var frm = new tensor_tool.frame();
    frm = new tensor_tool.frame(
        new tensor_tool.vec3(),
        tensor_tool.quat.gen_axi(new tensor_tool.vec3(0.0, 1.0, 0.0), cubeRotation)
    );

    //frm = frm.on(frm.rev());


    //obs.draw_obj(obj, frm);

    rbt.show(obs, [cubeRotation, cubeRotation, cubeRotation, cubeRotation, 0.1, 0.1]);

    cubeRotation += deltaTime;

}