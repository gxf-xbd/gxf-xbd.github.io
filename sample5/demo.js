let tensor_tool = {};

{
    let cfloat = {
        pi2: Math.PI * 2.0,
        pi: Math.PI,
        pi_2: Math.PI * 0.5,
        pi_4: Math.PI * 0.35,

        to_deg: 180.0 / Math.PI,
        to_arc: Math.PI / 180.0,
    };

    class vec2 {
        constructor(x = 0.0, y = null) {
            if (y == null) {
                this.x = this.y = x;
            } else {
                this.x = x;
                this.y = y;
            }
        }

        rev () { return new vec2(-this.x, -this.y); }
        len2 () { return this.x * this.x + this.y * this.y; }
        len () { return Math.sqrt(this.len2()); }
        dot (v) { return this.x * v.x + this.y * v.y; }

        add (v) { return new vec2(this.x + v.x, this.y + v.y); }
        sub (v) { return new vec2(this.x - v.x, this.y - v.y); }
        mul (s) { return new vec2(this.x * s, this.y * s); }
        div (s) { return new vec2(this.x / s, this.y / s); }

        add_ (v) {
            this.x += v.x;
            this.y += v.y;
        }
        sub_ (v) {
            this.x -= v.x;
            this.y -= v.y;
        }
        mul_ (s) {
            this.x *= s;
            this.y *= s;
        }
        div_ (s) {
            this.x /= s;
            this.y /= s;
        }

        vec () {
            let s = this.len();
            s = ((s == 0.0) ? 0.0 : (1.0 / s));
            return new vec2(
                this.x * s,
                this.y * s);
        }
        nor () {
            let s = this.len();
            s = ((s == 0.0) ? 0.0 : (1.0 / s));
            this.x *= s;
            this.y *= s;
        }

        ipo (p, r = 0.5) {
            return new vec2(
                this.x * (1.0 - r) + p.x * r,
                this.y * (1.0 - r) + p.y * r);
        }

        static gen_arc (arc, len = 1.0) {
            return new vec2(
                Math.cos(arc) * len,
                Math.sin(arc) * len);
        }
    };

    let cvec2 = {
        o: new vec2(),
        x: new vec2(1.0, 0.0),
        y: new vec2(0.0, 1.0),
        _x: new vec2(-1.0, 0.0),
        _y: new vec2(0.0, -1.0),
        xy: new vec2(1.0, 1.0),
    };

    class vec3 {
        constructor(x = 0.0, y = null, z = null) {
            if (y == null || z == null) {
                this.x = this.y = this.z = x;
            } else {
                this.x = x;
                this.y = y;
                this.z = z;
            }
        }

        rev () { return new vec3(-this.x, -this.y, -this.z); }
        len2 () { return this.x * this.x + this.y * this.y + this.z * this.z; }
        len () { return Math.sqrt(this.len2()); }

        add (v) { return new vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
        sub (v) { return new vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
        mul (s) { return new vec3(this.x * s, this.y * s, this.z * s); }
        div (s) { return new vec3(this.x / s, this.y / s, this.z / s); }

        add_ (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        }
        sub_ (v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
        }
        mul_ (s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
        }
        div_ (s) {
            this.x /= s;
            this.y /= s;
            this.z /= s;
        }

        vec () {
            let s = this.len();
            s = ((s == 0.0) ? 0.0 : (1.0 / s));
            return new vec3(
                this.x * s,
                this.y * s,
                this.z * s);
        }
        nor () {
            let s = this.len();
            s = ((s == 0.0) ? 0.0 : (1.0 / s));
            this.x *= s;
            this.y *= s;
            this.z *= s;
        }

        dot (v) { return this.x * v.x + this.y * v.y + this.z * v.z; }

        crs (v) {
            return new vec3(
                v.y * this.z - v.z * this.y,
                v.z * this.x - v.x * this.z,
                v.x * this.y - v.y * this.x);
        }

        ipo (p, r = 0.5) {
            return new vec3(
                this.x * (1.0 - r) + p.x * r,
                this.y * (1.0 - r) + p.y * r,
                this.z * (1.0 - r) + p.z * r);
        }
    };

    let cvec3 = {
        o: new vec3(),
        x: new vec3(1.0, 0.0, 0.0),
        y: new vec3(0.0, 1.0, 0.0),
        z: new vec3(0.0, 0.0, 1.0),
        _x: new vec3(-1.0, 0.0, 0.0),
        _y: new vec3(0.0, -1.0, 0.0),
        _z: new vec3(0.0, 0.0, -1.0),
        xyz: new vec3(1.0, 1.0, 1.0),

        black: new vec3(0.0),
        dark: new vec3(0.3),
        gray: new vec3(0.5),
        light: new vec3(0.7),
        white: new vec3(1.0),
        red: new vec3(1.0, 0.0, 0.0),
        orange: new vec3(0.9, 0.5, 0.1),
        yellow: new vec3(0.9, 0.9, 0.1),
        chartreuse: new vec3(0.5, 0.9, 0.1),
        green: new vec3(0.0, 1.0, 0.0),
        cyan: new vec3(0.1, 0.9, 0.5),
        indigo: new vec3(0.1, 0.5, 0.9),
        blue: new vec3(0.0, 0.0, 1.0),
        purple: new vec3(0.5, 0.1, 0.9),
        rose: new vec3(0.9, 0.1, 0.5),
    };

    class quat {
        constructor(s = 1.0, i = 0.0, j = 0.0, k = 0.0) {
            this.s = s;
            this.i = i;
            this.j = j;
            this.k = k;
        }

        identity () {
            this.s = 1.0;
            this.i = this.j = this.k = 0.0;
        }

        len2 () {
            return this.s * this.s +
                this.i * this.i +
                this.j * this.j +
                this.k * this.k;
        }

        nor () {
            let div = this.len2();
            if (div <= 0.0) return;

            div = 1.0 / Math.sqrt(div);
            this.s *= div;
            this.i *= div;
            this.j *= div;
            this.k *= div;
        }

        rotate_axi (axi, arc) {
            this.s = Math.sin(arc * 0.5) / axi.len();
            this.i = axi.x * this.s;
            this.j = axi.y * this.s;
            this.k = axi.z * this.s;
            this.s = Math.cos(arc * 0.5);
        }

        rotate_abc (abc) {
            let arc = abc.len();
            this.s = Math.sin(arc * 0.5) / arc;
            this.i = abc.x * this.s;
            this.j = abc.y * this.s;
            this.k = abc.z * this.s;
            this.s = Math.cos(arc * 0.5);
        }

        rotate_ft (from, to) {
            let ln2 = from.len2() * to.len2();
            let ln = Math.sqrt(ln2);
            let dt = from.dot(to);
            let cr = to.crs(from);

            let dv = Math.sqrt(0.5 / (ln2 + ln * dt));

            this.s = dv * (dt + ln);
            this.i = dv * cr.x;
            this.j = dv * cr.y;
            this.k = dv * cr.z;
        }

        static gen_axi (axi, arc) {
            let q = new quat();
            q.rotate_axi(axi, arc);
            return q;
        }

        static gen_abc (abc) {
            let q = new quat();
            q.rotate_abc(abc);
            return q;
        }

        static gen_xy (x, y) {
            x = x.vec();
            let z = crs(y, x).vec();
            y = crs(x, z).vec();

            let m = [
                [x.x, x.y, x.z],
                [y.x, y.y, y.z],
                [z.x, z.y, z.z]
            ];

            let sqrt2 = a => { return a > 0.0 ? sqrt(a) : 0.0; };

            q = new quat(
                sqrt2(1.0 + m[0][0] + m[1][1] + m[2][2]) * 0.5,
                sqrt2(1.0 + m[0][0] - m[1][1] - m[2][2]) * 0.5,
                sqrt2(1.0 - m[0][0] + m[1][1] - m[2][2]) * 0.5,
                sqrt2(1.0 - m[0][0] - m[1][1] + m[2][2]) * 0.5);

            if (q.s != 0.0) {
                if ((m[1][2] < m[2][1]) ^ (q.s < 0.0)) q.i = -q.i;
                if ((m[2][0] < m[0][2]) ^ (q.s < 0.0)) q.j = -q.j;
                if ((m[0][1] < m[1][0]) ^ (q.s < 0.0)) q.k = -q.k;
            } else if (q.i != 0.0) {
                if ((m[0][1] + m[1][0] < 0.0) ^ (q.i < 0.0)) q.j = -q.j;
                if ((m[2][0] + m[0][2] < 0.0) ^ (q.i < 0.0)) q.k = -q.k;
            } else if (q.j != 0.0) {
                if ((m[1][2] + m[2][1] < 0.0) ^ (q.j < 0.0)) q.k = -q.k;
            }
            return q;
        }

        as_cooked (a) {
            let bs = this.s;
            let bi = this.i;
            let bj = this.j;
            let bk = this.k;
            this.s = bs * a.s - bi * a.i - bj * a.j - bk * a.k;
            this.i = bs * a.i + bi * a.s + bj * a.k - bk * a.j;
            this.j = bs * a.j + bj * a.s + bk * a.i - bi * a.k;
            this.k = bs * a.k + bk * a.s + bi * a.j - bj * a.i;
        }

        rev () { return new quat(-this.s, this.i, this.j, this.k); }

        cook (a) {
            return new quat(
                this.s * a.s - this.i * a.i - this.j * a.j - this.k * a.k,
                this.s * a.i + this.i * a.s + this.j * a.k - this.k * a.j,
                this.s * a.j + this.j * a.s + this.k * a.i - this.i * a.k,
                this.s * a.k + this.k * a.s + this.i * a.j - this.j * a.i);
        }

        rot_vec (a) {
            let ii = this.i * this.i;
            let jj = this.j * this.j;
            let kk = this.k * this.k;
            let ij = this.i * this.j;
            let jk = this.j * this.k;
            let ki = this.k * this.i;
            let is = this.i * this.s;
            let js = this.j * this.s;
            let ks = this.k * this.s;

            return new vec3(
                ((0.5 - jj - kk) * a.x + (ij - ks) * a.y + (ki + js) * a.z) * 2.0,
                ((ij + ks) * a.x + (0.5 - ii - kk) * a.y + (jk - is) * a.z) * 2.0,
                ((ki - js) * a.x + (jk + is) * a.y + (0.5 - ii - jj) * a.z) * 2.0);
        }

        sin () {
            return Math.sqrt(
                this.i * this.i +
                this.j * this.j +
                this.k * this.k);
        }

        cos () {
            return Math.abs(s);
        }

        ipo (q2, r = 0.5) {
            let q1 = this;
            //q1 = q1.vec();
            //q2 = q2.vec();

            if (r > 1.0) r = 1.0;
            else if (r < 0.0) r = 0.0;
            let r2 = 1.0 - r;

            let cs = q1.s * q2.s + q1.i * q2.i + q1.j * q2.j + q1.k * q2.k;
            if (cs < 0.0) r = -r;

            let s = q1.s * r2 + q2.s * r;
            let i = q1.i * r2 + q2.i * r;
            let j = q1.j * r2 + q2.j * r;
            let k = q1.k * r2 + q2.k * r;

            let div = 1.0 / Math.sqrt(s * s + i * i + j * j + k * k);
            return new quat(s * div, i * div, j * div, k * div);
        }

        /*axi_align(q) {
            quat best;
            uint best_id = -1;
            let best_gap = -2.0;

            let sqrt2 = [](let a) - >
                let { return a > 0.0 ? sqrt(a) : 0.0; };
            each(i, 3) each(j, 3) {
                if (j == i) continue;
                each(ii, 2) each(jj, 2) {
                    let t = quat.gen_xy(cvec3.axis(i, ii), cvec3.axis(j, jj));
                    let gp = t.rev() * q;
                    let gap = abs(gp.cos());
                    if (gap <= best_gap) continue;
                    best_id = (i * 2 + ii) * 6 + j * 2 + jj;
                    best_gap = gap;
                    best = t;
                }
            }
            return { best, best_gap, best_id };
        }*/

    };

    let cquat = {
        o: new quat(),
        x90: quat.gen_axi(cvec3.x, cfloat.pi_2),
        y90: quat.gen_axi(cvec3.y, cfloat.pi_2),
        z90: quat.gen_axi(cvec3.z, cfloat.pi_2),
        x180: quat.gen_axi(cvec3.x, cfloat.pi),
        y180: quat.gen_axi(cvec3.y, cfloat.pi),
        z180: quat.gen_axi(cvec3.z, cfloat.pi),
        x270: quat.gen_axi(cvec3.x, -cfloat.pi_2),
        y270: quat.gen_axi(cvec3.y, -cfloat.pi_2),
        z270: quat.gen_axi(cvec3.z, -cfloat.pi_2),

        x: deg => { return quat.gen_axi(cvec3.x, cfloat.to_arc * deg); },
        y: deg => { return quat.gen_axi(cvec3.y, cfloat.to_arc * deg); },
        z: deg => { return quat.gen_axi(cvec3.z, cfloat.to_arc * deg); },
    }

    class frame {
        constructor(p = cvec3.o, q = cquat.o) {
            this.xyz = p;
            this.abc = q;
        }

        from_3pt (po, px, py) {
            this.xyz = po;
            this.abc = quat.gen_xy(px.sub(po), py.sub(po));
        }

        gap (f) { return { x: (this.xyz.sub(f.xyz)).len(), y: quat.interval(this.abc, f.abc) }; }

        rev () { return new frame(this.abc.rev().rot_vec(this.xyz.rev()), this.abc.rev()); }

        on (f) { return new frame(f.abc.rot_vec(this.xyz).add(f.xyz), f.abc.cook(this.abc)); }

        at (f) { return new constructor(f.abc.rev().rot_vec(xyz - f.xyz), f.abc.rev().cook(this.abc)); }

        on_ (f) {
            this.xyz = f.abc.rot_vec(xyz).add(f.xyz);
            this.abc = f.abc.cook(this.abc);
        }

        at_ (f) {
            xyz = f.abc.rev().rot_vec(xyz - f.xyz);
            abc = f.abc.rev().cook(this.abc);
        }

        trans (p) { return this.abc.rot_vec(p).add(this.xyz); }
        measure (p) { return this.abc.rev().rot_vec(p.sub(this.xyz)); }

        move (ds) { return new frame(this.xyz.add(ds), this.abc); }
        move_ (ds) { this.xyz.add_(ds); }

        x () { return this.abc.rot_vec(new vec3(1.0, 0.0, 0.0)); }
        y () { return this.abc.rot_vec(new vec3(0.0, 1.0, 0.0)); }
        z () { return this.abc.rot_vec(new vec3(0.0, 0.0, 1.0)); }

        /*vec6 to_kuka() let {
            float a, b, c, l;

            auto x = -this - > y();
            auto z = this - > z();

            l = x.x * x.x + x.z * x.z;
            if (l != 0.0) {
                a = cfloat.to_deg * atan2(-x.z, x.x);
                auto d = 1.0 f / (l = sqrt(l));
                z = {
                    (z.x * x.x + z.z * x.z) * d,
                    z.y,
                    (z.z * x.x - z.x * x.z) * d
                };
            } else a = 0.0 f;

            b = cfloat.to_deg * atan2(-x.y, l);
            c = cfloat.to_deg * atan2(z.x * x.y - z.y * l, z.z);

            return { xyz.x, -xyz.z, xyz.y, a, b, c };
        }

        void from_kuka(vec6_ f) {
            xyz = vec3(f.a, f.c, -f.b);
            abc = quat(cvec3.y, cdouble.to_arc * f.d) *
                quat(-cvec3.z, cdouble.to_arc * f.e) *
                quat(cvec3.x, cdouble.to_arc * f.f) * cquat.z90;
        }


        vec6 to_xyzabc() let {
            float a, b, c, l;

            auto x = this - > x();
            auto z = this - > z();

            l = x.x * x.x + x.z * x.z;
            if (l != 0.0) {
                a = cfloat.to_deg * atan2(-x.z, x.x);
                auto d = 1.0 f / (l = sqrt(l));
                z = {
                    (z.x * x.x + z.z * x.z) * d,
                    z.y,
                    (z.z * x.x - z.x * x.z) * d
                };
            } else a = 0.0 f;

            b = cfloat.to_deg * atan2(-x.y, l);
            c = cfloat.to_deg * atan2(z.x * x.y - z.y * l, z.z);

            return { xyz.x, -xyz.z, xyz.y, a, b, c };
        }

        void from_xyzabc(vec6_ f) {
            xyz = vec3(f.a, f.c, -f.b);
            abc = quat(cvec3.y, cdouble.to_arc * f.d) *
                quat(-cvec3.z, cdouble.to_arc * f.e) *
                quat(cvec3.x, cdouble.to_arc * f.f);
        }*/

        ipo (f2, r = 0.5) {
            if (r > 1.0) r = 1.0;
            else if (r < 0.0) r = 0.0;
            return new constructor(this.xyz.ipo(f2.xyz, r), this.abc.ipo(f2.abc, r));
        }
    };

    let cframe = {
        o: new frame(),
        x90: new frame(cvec3.o, cquat.x90),
        y90: new frame(cvec3.o, cquat.x90),
        z90: new frame(cvec3.o, cquat.z90),
        x180: new frame(cvec3.o, cquat.x180),
        y180: new frame(cvec3.o, cquat.y180),
        z180: new frame(cvec3.o, cquat.z180),
        x270: new frame(cvec3.o, cquat.x270),
        y270: new frame(cvec3.o, cquat.y270),
        z270: new frame(cvec3.o, cquat.z270),

        x: deg => { return new frame(cvec3.o, cquat.x(deg)); },
        y: deg => { return new frame(cvec3.o, cquat.y(deg)); },
        z: deg => { return new frame(cvec3.o, cquat.z(deg)); },
    }


    function deepFreeze (obj) {
        Object.getOwnPropertyNames(obj).forEach(name => {
            let prop = obj[name];
            if (typeof prop == 'object' && prop !== null) deepFreeze(prop);
        });
        return Object.freeze(obj);
    }

    tensor_tool.cfloat = deepFreeze(cfloat);
    tensor_tool.vec2 = vec2;
    tensor_tool.cvec2 = deepFreeze(cvec2);
    tensor_tool.vec3 = vec3;
    tensor_tool.cvec3 = deepFreeze(cvec3);
    tensor_tool.quat = quat;
    tensor_tool.cquat = deepFreeze(cquat);
    tensor_tool.frame = frame;
    tensor_tool.cframe = deepFreeze(cframe);
}

let lab_tool = null;

{
    let cvec3 = tensor_tool.cvec3;

    let showing = null;


    class label_robot {
        constructor(body, p = cvec3.o) {
            this.pos = p;
            this.w = this.h = 150.0;
            this.scale = 3000.0;

            this.side0 = 0.0;
            this.side = 0.0;

            this.min = { x: 0.0, y: 0.0, w: 0.0, h: 0.0, a: 1.0, s: 0.0 };
            this.max = { x: 500.0, y: 100.0, w: 800.0, h: 500.0, a: 1.0, s: 1.0 };


            this.body = body;
            this.div = append_element(body, "div");
            this.div.style.position = "absolute";

            function callback (e) { this.on_click(e); };
            this.div.onclick = callback.bind(this);




            this.div1 = document.createElement("div");
            append_text(this.div1, "KUKA<br/>KR210-R2700<br/>kuka robot<br/>", "20px");

            this.div2 = document.createElement("div");

            this.div2.style.overflowX = "hide";
            this.div2.style.overflowY = "scroll";
            this.div2.style.width = "800px";
            this.div2.style.height = "500px";

            {
                append_text(this.div2, "KUKA KR210-R2700<br/>", "60px");
                append_text(this.div2, "robot #01<br/>", "40px");


                let t = document.createElement("div");
                t.style.width = "370px";
                t.style.height = "300px";
                t.style.backgroundColor = "";
                t.style.display = "inline-block";
                this.div2.appendChild(t);

                let t2 = document.createElement("div");
                t2.style.width = "370px";
                t2.style.height = "300px";
                t2.style.backgroundColor = "";
                t2.style.display = "inline-block";
                this.div2.appendChild(t2);

                append_text(this.div2, "<br/>");

                append_text(this.div2, "KUKA KR210-R2700<br/>", "30px");
                append_text(this.div2, "robot #01<br/>", "30px");
                append_text(this.div2, "KUKA KR210-R2700<br/>", "30px");
                append_text(this.div2, "robot #01<br/>", "30px");



                let myChart = echarts.init(t);
                let myChart2 = echarts.init(t2);

                this.charts = [];
                this.charts.push(myChart);
                this.charts.push(myChart2);
            }


            this.div.className = "pad2";
            this.div.appendChild(this.div1);
            this.which = false;
        }

        on_click (e) {
            showing = showing === this ? null : this;
        }

        update (obs) {
            let px = obs.to_screen(this.pos);
            if (px) {
                let sc = this.scale * px.z;
                if (sc < 0.1) sc = 0.1;
                else if (sc > 2.0) sc = 2.0;

                this.min.x = px.x - this.div.clientWidth * 0.5;
                this.min.y = px.y - this.div.clientHeight * 0.5 * (1.0 + sc);
                this.min.w = this.w;
                this.min.h = this.h;
                this.min.s = sc;
                this.a = 1.0;
            } else {
                this.min.a = 0.0;
            }

            if ((this.side > 0.7) != this.which) {
                this.which = !this.which;
                this.div.removeChild(this.which ? this.div1 : this.div2);
                this.div.appendChild(this.which ? this.div2 : this.div1);
                this.div.className = this.which ? "pad2_max" : "pad2";


                let option = {
                    backgroundColor: '',
                    title: { text: "ECharts 数据统计" },
                    tooltip: {},
                    legend: { data: ['用户来源'] },
                    series: [{ name: '访问量', type: 'pie', data: [500, 200, 360, 100] }]
                };

                for (let a in this.charts) this.charts[a].setOption(this.which ? option : {}, true);
            }

            this.side += ((showing === this ? 1.0 : 0.0) - this.side) * 0.15;
            let ipo = {};
            for (let a in this.min) ipo[a] = this.max[a] * this.side + this.min[a] * (1.0 - this.side);

            {
                let style = this.div.style
                style.left = ipo.x + "px";
                style.top = ipo.y + "px";
                style.width = ipo.w + "px";
                style.height = ipo.h + "px";
                style.transform = "scale(" + ipo.s + ")";
                style.zIndex = this.side > 0.1 ? 1 : 0;
            }
        }
    };

    lab_tool = label_robot;
}


let robot_tool = {};

{
    class com {
        constructor() {
            this.e = new tensor_tool.vec3();
            this.rb = new tensor_tool.vec3();
            this.a = new tensor_tool.vec3(1.0, 0.0, 0.0);
            this.rd = new tensor_tool.quat(1.0, 0.0, 0.0, 0.0);
            this.o = null;
        }

        trans_f (f) {
            this.rb = f.xyz;
            this.rd = f.abc;
        }

        trans (arc, c) {
            let d = tensor_tool.quat.gen_axi(this.a, arc);
            this.rb = c.rb.add(c.rd.rot_vec(c.e));
            this.rd = c.rd.cook(d);
        }

        async init (world, name, op, or2, end, axi) {

            this.e = end;
            this.a = axi;

            this.o = await world.open_obj(name);
            this.rev = new tensor_tool.frame(or2.rot_vec(op.rev()), or2);

            return op.add(or2.rev().rot_vec(end));
        }

        show (world) {
            world.draw_obj(this.o, this.rev.on(new tensor_tool.frame(this.rb, this.rd)));
        }

    };

    class robot {
        constructor() {

            this.coms = [];
            for (let i = 0; i < 7; i++) this.coms.push(new com());

            this.base = new tensor_tool.frame();
        }

        async init (world, t0, t1, t2, t3, t4, t5, t6,
            o0, o1, o2, o3, o4, o5, o6) {

            let cquat = tensor_tool.cquat;
            let cvec3 = tensor_tool.cvec3;

            let trs = cvec3.o;

            trs = await this.coms[0].init(world, o0, trs, cquat.o, t0, cvec3._y);
            trs = await this.coms[1].init(world, o1, trs, cquat.o, t1, cvec3._y);
            trs = await this.coms[2].init(world, o2, trs, cquat.z270, t2, cvec3._z);
            trs = await this.coms[3].init(world, o3, trs, cquat.o, t3, cvec3._z);
            trs = await this.coms[4].init(world, o4, trs, cquat.o, t4, cvec3._x);
            trs = await this.coms[5].init(world, o5, trs, cquat.o, t5, cvec3._z);
            trs = await this.coms[6].init(world, o6, trs, cquat.o, t6, cvec3._x);
        }

        async init_kr6 (world) {
            let vec3 = tensor_tool.vec3;

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

        async init_kr16 (world) {
            let vec3 = tensor_tool.vec3;

            await this.init(world,
                new vec3(0.0, 0.0, 0.0), new vec3(160.0, 520.0, 0.0),
                new vec3(980.0, 0.0, 0.0), new vec3(860.0, 150.0, 0.0),
                new vec3(0.0, 0.0, 0.0), new vec3(153.0, 0.0, 0.0),
                new vec3(0.0, 0.0, 0.0),
                "model/kr16_2010/0.obj", "model/kr16_2010/1.obj",
                "model/kr16_2010/2.obj", "model/kr16_2010/3.obj",
                "model/kr16_2010/4.obj", "model/kr16_2010/5.obj",
                "model/kr16_2010/6.obj");
        }

        async init_kr20 (world) {
            let vec3 = tensor_tool.vec3;

            await this.init(world,
                new vec3(0.0, 0.0, 0.0), new vec3(160.0, 520.0, 0.0),
                new vec3(780.0, 0.0, 0.0), new vec3(860.0, 150.0, 0.0),
                new vec3(0.0, 0.0, 0.0), new vec3(153.0, 0.0, 0.0),
                new vec3(0.0, 0.0, 0.0),
                "model/kr20/0.obj", "model/kr20/1.obj",
                "model/kr20/2.obj", "model/kr20/3.obj",
                "model/kr20/4.obj", "model/kr20/5.obj",
                "model/kr20/6.obj");
        }

        async init_kr210 (world) {
            let vec3 = tensor_tool.vec3;

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

        show (world, ax, base = tensor_tool.cframe.o) {
            this.coms[0].trans_f(base);
            for (let i = 0; i < 6; i++) this.coms[i + 1].trans(ax[i], this.coms[i]);
            for (let i = 0; i < 7; i++) this.coms[i].show(world);
            //if (tool) tool.show(world, this.coms[6].rb, this.coms[6].rd);
        }
    };

    robot_tool.robot = robot;


    let frmae = tensor_tool.frame;

    class robot_sys {

        constructor(body, base) {
            let vec3 = tensor_tool.vec3;

            this.r = new robot();
            this.base = base;
            this.lab = new lab_tool(body, this.base.xyz.add(new vec3(0, 1000, 0)));
        }

        show (obs, axis) {
            this.r.show(obs, axis, this.base);
            this.lab.update(obs);
        }
    };
    robot_tool.robot_sys = robot_sys;
}

let rbt = null;
let rbt2 = null;


async function setup () {

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

    window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let prog_in = await init_prog(gl, "shader/vs2.glsl", "shader/fs2.glsl", [
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

        ws.onopen = function () {
            console.log("open");
            ws.send("hello777777723432424");
        }
        ws.onerror = function () {
            console.log("err");
        }
        ws.onmessage = function (e) {
            console.log(e.data);
        }
        ws.onclose = function (e) {
            console.log("close");
        }
        ws.onerror = function (e) {
            console.log(e.error);
        }
        console.log("ok");
    } else {
        console.log("您的浏览器不支持WebSocket");
    }

    let obj = await obs.open_obj("model/0.obj");



    let then = 0;

    function render (now) {
        now *= 0.001; // convert to seconds
        let deltaTime = now - then;
        then = now;

        loop(gl, obj, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

let ang = 0.0;

function loop (gl, obj, dt) {

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