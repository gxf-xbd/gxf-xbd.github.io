function init_ctrl(canvas, log = false) {
    info = {
        mouse: new Array(8),
        mouse_v: new Array(8),
        scale: 1.0,
        scale_i: 0.0,
        scale_v: 0,
        key: new Array(256),
        key_v: new Array(256),
        pt: { x: 0.0, y: 0.0 },
        pt_v: 0,
        touch: [],
        canvas: canvas
    }

    for (let i in info.key) info.key[i] = false;
    for (let i in info.key_v) info.key_v[i] = 0;

    let logout = (...args) => {};
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
        let i = event.keyCode;
        if (!info.key[i]) {
            info.key[i] = true;
            info.key_v++;
            logout("dn", i);
        }
    });
    add_event("keyup", event => {
        let i = event.keyCode;
        if (info.key[i]) info.key[i] = false;
        logout("up", i);
    });

    add_event("mousemove", event => {
        info.pt.x = event.pageX;
        info.pt.y = event.pageY;
        //logout(info.pt.x, info.pt.y);
        info.pt_v++;
    });
    add_event("mousedown", event => {
        let i = event.button;
        if (!info.mouse[i]) {
            info.mouse[i] = true;
            info.mouse_v++;
            logout("ms dn", i);
        }
    });
    add_event("mouseup", event => {
        let i = event.button;
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

    let on_touch = event => {
        if (!event.touches) info.touch = [];
        else info.touch = event.touches;
        //logout("tch", event.touches);
    };

    add_event("touchstart", on_touch);
    add_event("touchmove", on_touch);
    add_event("touchend", on_touch);

    add_event("selectstart", event => {});

    return info;
}

function fetch_file(url, timeout = 5000) {
    return new Promise((resolve) => {
        let xhr = new XMLHttpRequest();
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

        let src = await fetch_file(file);
        if (src == null) return null;

        let shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("shader compiling err: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    let vs = await loadShader(gl, gl.VERTEX_SHADER, vsSource);
    let fs = await loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    let prog = gl.createProgram();

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        alert("shader prog err: " + gl.getProgramInfoLog(prog));
        return null;
    }

    let info = { prog: prog, attr: {}, unif: {} };
    for (let t in attr) info.attr[attr[t]] = gl.getAttribLocation(prog, attr[t]);
    for (let t in unif) info.unif[unif[t]] = gl.getUniformLocation(prog, unif[t]);
    return info;
}



class OBSERVE_3D {
    init(info, gl, prog_info, angle = 60.0) {
        this.gl = gl;
        this.info = info;
        this.prog_info = prog_info;

        this.a = angle;
        this.d = 2000.0;
        this.cen = new tensor_tool.vec3(0.0);
        this.ang = new tensor_tool.vec2(0.0);

        this.mode = 0; // 1: mouse, 2: touch

        this.last_pt = null;
        this.touch = {};
        this.num_ctrl = -1;

        this.base_sc0 = 1.0 / 2000.0;
        this.base_sc1 = 0.0;
    }

    update() {
        let f = this.info;
        if (!f) return;

        let vec2 = tensor_tool.vec2;
        let vec3 = tensor_tool.vec3;
        let cvec3 = tensor_tool.cvec3;
        let quat = tensor_tool.quat;

        function move_cam(self, mode, dx, dy) {
            if (mode) {
                let a_xz = vec2.gen_arc(self.ang.x);
                let a_y = vec2.gen_arc(self.ang.y);

                let k = new vec3(a_xz.y * a_y.x, a_y.y, -a_xz.x * a_y.x).vec();
                let j = new vec3(-a_xz.y * a_y.y, a_y.x, a_xz.x * a_y.y).vec();
                let i = j.crs(k);

                let h = Math.tan(self.a * 0.5 * Math.PI / 180.0) * 2.0 * self.d / f.canvas.height;
                self.cen.add_(i.mul(-dx * h).add(j.mul(dy * h)));
            } else self.ang.add_(new vec2(dx, -dy).mul(0.006));
        }

        this.d = f.scale / this.base_sc0;

        if (this.mode != 2) {

            if (f.mouse[1]) {
                if (this.last_pt != null) {
                    let dx = f.pt.x - this.last_pt.x;
                    let dy = f.pt.y - this.last_pt.y;
                    move_cam(this, f.key[16], dx, dy);
                }
                this.last_pt = { x: f.pt.x, y: f.pt.y };
            } else this.last_pt = null;

            if (!f.key[16]) {

                let vel = this.d * 0.01;
                let up = cvec3.y.mul(vel);
                let g = quat.gen_axi(cvec3.y, -this.ang.x);
                let front = g.rot_vec(cvec3._z).mul(vel);
                let right = g.rot_vec(cvec3.x).mul(vel);

                if (f.key[81]) this.cen.add_(up);
                if (f.key[69]) this.cen.sub_(up);

                if (f.key[87]) this.cen.add_(front);
                if (f.key[83]) this.cen.sub_(front);

                if (f.key[68]) this.cen.add_(right);
                if (f.key[65]) this.cen.sub_(right);
            }

            if (f.mouse[1] ||
                f.key[81] || f.key[69] ||
                f.key[87] || f.key[83] ||
                f.key[68] || f.key[65])
                this.mode = 1;
            else this.mode = 0;
        }

        {
            let changed = false;
            let ctrl = [];
            let tch = {};

            for (let i = 0; i < f.touch.length; i++) {
                let t1 = f.touch[i];
                let p = new vec2(t1.pageX, t1.pageY);

                let t2 = this.touch[t1.identifier];

                if (!t2) t2 = { p: p, s: false };
                else if (t2.s) ctrl.push(t2);
                t2.dp = p.sub(t2.p);
                t2.p = p;
                tch[t1.identifier] = t2;
            }
            this.touch = tch;

            for (let i in tch) {
                if (ctrl.length >= 2) break;
                if (tch[i].s) continue;
                tch[i].s = true;
                ctrl.push(tch[i]);
                changed = true;
            }

            if (this.mode != 1) {
                if (ctrl.length > 0) {
                    let p = new vec2();
                    let dp = new vec2();
                    for (let i in ctrl) {
                        p.add_(ctrl[i].p);
                        dp.add_(ctrl[i].dp);
                    }
                    p.div_(ctrl.length);
                    dp.div_(ctrl.length);

                    let dst = 0.0;
                    for (let i in ctrl) dst += ctrl[i].p.sub(p).len();
                    dst /= ctrl.length;

                    if (this.num_ctrl == ctrl.length &&
                        ctrl.length > 1 && !changed) this.base_sc0 *= dst / this.base_sc1;
                    this.base_sc1 = dst;

                    move_cam(this, ctrl.length > 1, dp.x, dp.y);

                    this.mode = 2;
                } else this.mode = 0;
            }
            this.num_ctrl = ctrl.length;
        }

        this.mat_proj = mat4.create();
        mat4.perspective(this.mat_proj,
            this.a * Math.PI / 180.0,
            f.canvas.width / f.canvas.height,
            0.1, 100000.0);

        this.mat_view = mat4.create();
        mat4.translate(this.mat_view, this.mat_view, [0.0, 0.0, -this.d]);
        mat4.rotate(this.mat_view, this.mat_view, -this.ang.y, [1.0, 0.0, 0.0]);
        mat4.rotate(this.mat_view, this.mat_view, this.ang.x, [0.0, 1.0, 0.0]);
        mat4.translate(this.mat_view, this.mat_view, [-this.cen.x, -this.cen.y, -this.cen.z]);
    }

    async open_obj(name) {
        let gl = this.gl;
        if (!gl) return null;

        let obj = await fetch_file(name);
        if (!obj) return null;
        //console.log(obj);


        let ps = [];
        let fs = [];

        let objs = obj.split(/\s/);
        for (let key in objs) {
            let k = Number(key);
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



        let pos = [];
        let idx = [];
        let nor = [];

        let cnt = 0;
        for (let i in fs) {

            function push(l, p) {
                l.push(p.x, p.y, p.z);
            }

            let f = fs[i];
            let pa = ps[f.a - 1];
            let pb = ps[f.b - 1];
            let pc = ps[f.c - 1];

            let n = (pb.sub(pa).vec()).crs(pc.sub(pa).vec()).vec();

            push(nor, n);
            push(nor, n);
            push(nor, n);

            push(pos, pa);
            push(pos, pb);
            push(pos, pc);

            idx.push(cnt, cnt + 1, cnt + 2);
            cnt += 3;
        }

        let buf_pos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf_pos);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

        let buf_nor = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf_nor);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nor), gl.STATIC_DRAW);

        let buf_idx = gl.createBuffer();
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

    draw_obj(obj, frm = tensor_tool.cframe.o) {

        let p = frm.xyz;
        let x = frm.x();
        let y = frm.y();
        let z = frm.z();

        let mat = mat4.create();
        mat4.set(mat,
            x.x, x.y, x.z, 0,
            y.x, y.y, y.z, 0,
            z.x, z.y, z.z, 0,
            p.x, p.y, p.z, 1);


        let prog_in = this.prog_info;
        let gl = this.gl;
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


    to_screen(pp = tensor_tool.cvec3.o) {

        let f = this.info;
        if (!f) return null;

        function in_screen(p) {
            return p.x <= 1.0 && p.y <= 1.0 && p.x >= -1.0 && p.y >= -1.0;
        }

        let vec2 = tensor_tool.vec2;
        let vec3 = tensor_tool.vec3;

        let a_xz = vec2.gen_arc(this.ang.x);
        let a_y = vec2.gen_arc(this.ang.y);

        let k = new vec3(-a_xz.y * a_y.x, -a_y.y, a_xz.x * a_y.x).vec();
        let j = new vec3(-a_xz.y * a_y.y, a_y.x, a_xz.x * a_y.y).vec();
        let i = k.crs(j);

        let p = pp.sub(this.cen);
        let z = -k.dot(p) + this.d;
        if (z < 0) return null;
        let x = i.dot(p);
        let y = j.dot(p);
        let h = f.canvas.height / (Math.tan(this.a * 0.5 * Math.PI / 180.0) * 2.0 * z);
        let pt = new vec3(
            x * h + f.canvas.width / 2, -y * h + f.canvas.height / 2,
            1.0 / z);
        return pt;
    }

    /*vec2 to_screen_px(vec3_ pt = 0.0 f) {
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

    vec2 mouse_pt() let {
        vec2 tmp = vec2(
            f - > pt.x - float(f - > rect[0]), -f - > pt.y + float(f - > rect[1]) + float(f - > rect[3]));
        tmp /= vec2(f - > rect[2], f - > rect[3]);
        tmp = (tmp - vec2(0.5 f)) * 2.0 f;
        return tmp;
    }

    vec2 mouse_px() let {
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
    } */

}

obs = new OBSERVE_3D();