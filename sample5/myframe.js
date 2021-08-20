function init_ctrl(canvas, log = false) {
    info = {
        mouse: new Array(8),
        mouse_v: new Array(8),
        scale: 1.0,
        scale_i: 0.0,
        scale_v: 0,
        key: new Array(256),
        key_v: new Array(256),
        pt: {
            x: 0.0,
            y: 0.0
        },
        pt_v: 0,
        canvas: canvas
    }

    for (var i in info.key) info.key[i] = 0;
    for (var i in info.key_v) info.key_v[i] = 0;

    var logout = (...args) => {};
    if (log) logout = console.log;

    function add_event(flag, on_call) {
        window.addEventListener(flag, event => {
            if (on_call) on_call(event);
            if (event.keyCode >= 112) return;
            if (event.keyCode <= 123) return;
            event.preventDefault();
        }, {
            passive: false
        });
    }

    add_event("keydown", event => {
        var i = event.keyCode;
        if (!info.key[i]) {
            info.key[i] = true;
            info.key_v++;
            logout("dn", i);
        }
    });
    add_event("keyup", event => {
        var i = event.keyCode;
        if (info.key[i]) info.key[i] = false;
        logout("up", i);
    });

    add_event("mousemove", event => {
        info.pt.x = event.pageX * 1.0;
        info.pt.y = event.pageY * 1.0;
        //logout(info.pt.x, info.pt.y);
        info.pt_v++;
    });
    add_event("mousedown", event => {
        var i = event.button;
        if (!info.mouse[i]) {
            info.mouse[i] = true;
            info.mouse_v++;
            logout("ms dn", i);
        }
    });
    add_event("mouseup", event => {
        var i = event.button;
        if (info.mouse[i]) info.mouse[i] = false;
        logout("ms up", i);
    });
    add_event("wheel", event => {
        if (!event.ctrlKey) {
            info.scale_i -= event.wheelDelta / 180.0;
            info.scale = Math.pow(1.3, info.scale_i);
            logout("wh ", info.scale);
        }
    });

    add_event("touchstart", event => {
        logout("tch");
    });

    add_event("selectstart", event => {});

    return info;
}

function fetch_file(url, timeout = 5000) {
    return new Promise((resolve) => {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.timeout = timeout;
        xhr.onload = function() {
            if (this.status == 200) resolve(this.response);
            else resolve(null);
        };
        xhr.ontimeout = function() { resolve(null); };
        xhr.send();
    });
}

async function init_prog(gl, vsSource, fsSource, attr = [], unif = []) {

    async function loadShader(gl, type, file) {

        const src = await fetch_file(file);
        if (src == null) return null;

        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("shader compiling err: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vs = await loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = await loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const prog = gl.createProgram();

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        alert("shader prog err: " + gl.getProgramInfoLog(prog));
        return null;
    }


    function prog_locate(gl, prog, attr = [], unif = []) {
        var info = { prog: prog, attr: {}, unif: {} };
        for (var t in attr) info.attr[attr[t]] = gl.getAttribLocation(prog, attr[t]);
        for (var t in unif) info.unif[unif[t]] = gl.getUniformLocation(prog, unif[t]);
        return info;
    }

    return prog_locate(gl, prog, attr, unif);
}



class OBSERVE_3D {
    init(info, gl, prog_info, angle = 60.0) {
        this.gl = gl;
        this.info = info;
        this.prog_info = prog_info;

        this.a = angle;
        this.bc = false;

        this.cen = new tensor_tool.vec3(0.0);
        this.dc = new tensor_tool.vec3(0.0);

        this.ang = new tensor_tool.vec2(0.0);
        this.mem_ang = new tensor_tool.vec2(0.0);
        this.d = 2000.0;
    }

    update() {
        var f = this.info;
        if (!f) return;

        this.d = f.scale * 2000.0;

        var tmp = new tensor_tool.vec2(f.pt.x, -f.pt.y).mul(0.006);

        if (f.mouse[1] && !f.key[16]) this.ang = tmp.add(this.mem_ang);
        else this.mem_ang = this.ang.sub(tmp);

        if (f.mouse[1] && f.key[16]) {
            var px = new tensor_tool.vec2(
                f.pt.x / f.canvas.width - 0.5,
                0.5 - f.pt.y / f.canvas.height);
            px.mul_(2.0);
            console.log(px.x, px.y);

            var a_xz = tensor_tool.vec2.gen_arc(this.ang.x);
            var a_y = tensor_tool.vec2.gen_arc(this.ang.y);

            var k = new tensor_tool.vec3(a_xz.y * a_y.x, a_y.y, -a_xz.x * a_y.x).vec();
            var j = new tensor_tool.vec3(-a_xz.y * a_y.y, a_y.x, a_xz.x * a_y.y).vec();
            var i = j.crs(k);

            var h = Math.sin(this.a * 0.5 * Math.PI / 180.0);
            j.mul_(h);
            i.mul_(h * f.canvas.width / f.canvas.height);

            var ds = i.mul(-px.x).add(j.mul(-px.y)).mul(this.d);

            if (!this.bc) this.dc = this.cen.sub(ds);
            this.cen = this.dc.add(ds);
            this.bc = true;
        } else this.bc = false;

    }

    transform() {
        var f = this.info;
        if (!f) return;

        this.mat_proj = mat4.create();
        mat4.perspective(this.mat_proj,
            this.a * Math.PI / 180.0,
            f.canvas.width / f.canvas.height,
            0.1,
            100000.0);

        console.log(this.ang.x, this.ang.y, this.cen.x, this.cen.y, this.cen.z);
        this.mat_view = mat4.create();
        mat4.translate(this.mat_view, this.mat_view, [0.0, 0.0, -this.d]);
        mat4.rotate(this.mat_view, this.mat_view, -this.ang.y, [1.0, 0.0, 0.0]);
        mat4.rotate(this.mat_view, this.mat_view, this.ang.x, [0.0, 1.0, 0.0]);
        mat4.translate(this.mat_view, this.mat_view, [-this.cen.x, -this.cen.y, -this.cen.z]);

    }

    async open_obj(name) {
        var gl = this.gl;
        if (!gl) return null;

        const obj = await fetch_file(name);
        if (!obj) return null;
        //console.log(obj);


        var ps = [];
        var fs = [];

        var objs = obj.split(/\s/);
        for (var key in objs) {
            var k = Number(key);
            if (objs[k] == "v") {
                if (k + 3 < objs.length) {
                    ps.push(new tensor_tool.vec3(
                        Number.parseInt(objs[k + 1]),
                        Number.parseInt(objs[k + 2]),
                        Number.parseInt(objs[k + 3])
                    ));
                }
            } else if (objs[k] == "f") {
                if (k + 3 < objs.length) {
                    fs.push({
                        a: Number.parseInt(objs[k + 1].match(/\d+/)),
                        b: Number.parseInt(objs[k + 2].match(/\d+/)),
                        c: Number.parseInt(objs[k + 3].match(/\d+/))
                    });
                }
            }
        }



        var pos = [];
        var idx = [];
        var nor = [];

        var cnt = 0;
        for (var i in fs) {

            function push(l, p) {
                l.push(p.x, p.y, p.z);
            }

            var f = fs[i];
            var pa = ps[f.a - 1];
            var pb = ps[f.b - 1];
            var pc = ps[f.c - 1];

            var n = (pb.sub(pa).vec()).crs(pc.sub(pa).vec()).vec();

            push(nor, n);
            push(nor, n);
            push(nor, n);

            push(pos, pa);
            push(pos, pb);
            push(pos, pc);

            idx.push(cnt, cnt + 1, cnt + 2);
            cnt += 3;
        }

        const buf_pos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf_pos);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

        const buf_nor = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf_nor);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nor), gl.STATIC_DRAW);

        const buf_idx = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf_idx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

        return {
            gl: gl,
            pos: buf_pos,
            idx: buf_idx,
            nor: buf_nor,
            cnt: cnt
        };
    }

    draw_obj(obj, frm = new tensor_tool.frame()) {

        var p = frm.xyz;
        var x = frm.x();
        var y = frm.y();
        var z = frm.z();

        var mat = mat4.create();
        mat4.set(mat,
            x.x, x.y, x.z, 0,
            y.x, y.y, y.z, 0,
            z.x, z.y, z.z, 0,
            p.x, p.y, p.z, 1);


        var prog_in = this.prog_info;
        var gl = this.gl;
        gl.useProgram(prog_in.prog);

        gl.frontFace(gl.CW);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.pos);
        gl.vertexAttribPointer(prog_in.attr.vertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(prog_in.attr.vertex);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.nor);
        gl.vertexAttribPointer(prog_in.attr.normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(prog_in.attr.normal);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.idx);

        gl.uniformMatrix4fv(prog_in.unif.mat_proj, false, this.mat_proj);
        gl.uniformMatrix4fv(prog_in.unif.mat_view, false, this.mat_view);
        gl.uniformMatrix4fv(prog_in.unif.mat_mod, false, mat);
        gl.enable(gl.DEPTH_TEST);
        gl.drawElements(gl.TRIANGLES, obj.cnt, gl.UNSIGNED_SHORT, 0);
    }


    /*vec2 to_screen(vec3 p = 0.0 f) {
        vec2 a_xz, a_y;
        a_xz.vec(ang.x);
        a_y.vec(ang.y);

        vec3 vk = -vec3(a_xz.x * a_y.x, a_y.y, a_xz.y * a_y.x);
        vec3 vj = vec3(-a_xz.x * a_y.y, a_y.x, -a_xz.y * a_y.y);
        vec3 vi = crs(vj, vk);

        p += vk * d - cen;

        auto z = dot(vk, p);
        if (z < 0) return -2.0 f;
        auto pt = vec2(dot(vi, p) / r, dot(vj, p)) / (z * tan(cfloat::to_arc * a * 0.5 f));
        if (in_screen(pt)) return pt;
        return -1000.0 f;
    }

    static bool in_screen(vec2_ p) {
        return p.x <= 1.0 f && p.y <= 1.0 f && p.x >= -1.0 f && p.y >= -1.0 f;
    }

    vec2 to_screen_px(vec3_ pt = 0.0 f) {
        return (to_screen(pt) * 0.5 f + vec2(0.5 f)) * vec2(f - > rect[2], f - > rect[3]);
    }

    vec3 proj_plane(vec3 dir, float c = 0.0 f) {
        vec2 a_xz, a_y;
        a_xz.vec(ang.x);
        a_y.vec(ang.y);

        vec3 vk = -vec3(a_xz.x * a_y.x, a_y.y, a_xz.y * a_y.x);
        vec3 vj = vec3(-a_xz.x * a_y.y, a_y.x, -a_xz.y * a_y.y);
        vec3 vi = crs(vj, vk);

        vec3 p = cen;
        vec3 t = p + -vk * d;
        vec3 u = p + vj;

        r = float(f - > rect[2]) / float(f - > rect[3]);
        vec2 tmp = vec2(
            f - > pt.x - float(f - > rect[0]), -f - > pt.y + float(f - > rect[1]) + float(f - > rect[3]));
        tmp /= vec2(f - > rect[2], f - > rect[3]);
        tmp = (tmp - vec2(0.5 f)) * 2.0 f;



        float rate = tan(cfloat::to_arc * a * 0.5 f);

        vec3 dr = vec3(tmp.x * rate * r, tmp.y * rate, 1.0 f);
        //cout << dr.x << " " << dr.y << endl;
        //cout << vi.x << " " << vi.y << " " << vi.z << endl;
        dr = vi * dr.x + vj * dr.y + vk * dr.z;
        float k = (c - t.dot(dir)) / dr.dot(dir);
        return t + dr * k;
    }

    vec2 mouse_pt() const {
        vec2 tmp = vec2(
            f - > pt.x - float(f - > rect[0]), -f - > pt.y + float(f - > rect[1]) + float(f - > rect[3]));
        tmp /= vec2(f - > rect[2], f - > rect[3]);
        tmp = (tmp - vec2(0.5 f)) * 2.0 f;
        return tmp;
    }

    vec2 mouse_px() const {
        vec2 tmp = vec2(
            f - > pt.x - float(f - > rect[0]), -f - > pt.y + float(f - > rect[1]) + float(f - > rect[3]));
        return tmp;
    }

    vec3 get_eye_pos() {
        if (!f) return {};

        vec2 a_xz, a_y;
        a_xz.vec(ang.x);
        a_y.vec(ang.y);
        vec3 p = vec3(0.0 f);
        vec3 t = p + vec3(a_xz.x * a_y.x, a_y.y, a_xz.y * a_y.x) * d;
        return t;
    }*/

}

obs = new OBSERVE_3D();