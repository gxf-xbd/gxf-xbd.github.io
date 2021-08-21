const tensor_tool = {};

{
    cfloat = {
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

        rev() { return new vec2(-this.x, -this.y); }
        len2() { return this.x * this.x + this.y * this.y; }
        len() { return Math.sqrt(this.len2()); }
        dot(v) { return this.x * v.x + this.y * v.y; }

        add(v) { return new vec2(this.x + v.x, this.y + v.y); }
        sub(v) { return new vec2(this.x - v.x, this.y - v.y); }
        mul(s) { return new vec2(this.x * s, this.y * s); }
        div(s) { return new vec2(this.x / s, this.y / s); }

        add_(v) {
            this.x += v.x;
            this.y += v.y;
        }
        sub_(v) {
            this.x -= v.x;
            this.y -= v.y;
        }
        mul_(s) {
            this.x *= s;
            this.y *= s;
        }
        div_(s) {
            this.x /= s;
            this.y /= s;
        }

        vec() {
            var s = this.len();
            s = ((s == 0.0) ? 0.0 : (1.0 / s));
            return new vec2(
                this.x * s,
                this.y * s);
        }
        nor() {
            var s = this.len();
            s = ((s == 0.0) ? 0.0 : (1.0 / s));
            this.x *= s;
            this.y *= s;
        }

        ipo(p, r = 0.5) {
            return new vec2(
                this.x * (1.0 - r) + p.x * r,
                this.y * (1.0 - r) + p.y * r);
        }

        static gen_arc(arc, len = 1.0) {
            return new vec2(
                Math.cos(arc) * len,
                Math.sin(arc) * len);
        }
    };

    cvec2 = {
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

        rev() { return new vec3(-this.x, -this.y, -this.z); }
        len2() { return this.x * this.x + this.y * this.y + this.z * this.z; }
        len() { return Math.sqrt(this.len2()); }

        add(v) { return new vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
        sub(v) { return new vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
        mul(s) { return new vec3(this.x * s, this.y * s, this.z * s); }
        div(s) { return new vec3(this.x / s, this.y / s, this.z / s); }

        add_(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        }
        sub_(v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
        }
        mul_(s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
        }
        div_(s) {
            this.x /= s;
            this.y /= s;
            this.z /= s;
        }

        vec() {
            var s = this.len();
            s = ((s == 0.0) ? 0.0 : (1.0 / s));
            return new vec3(
                this.x * s,
                this.y * s,
                this.z * s);
        }
        nor() {
            var s = this.len();
            s = ((s == 0.0) ? 0.0 : (1.0 / s));
            this.x *= s;
            this.y *= s;
            this.z *= s;
        }

        dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }

        crs(v) {
            return new vec3(
                v.y * this.z - v.z * this.y,
                v.z * this.x - v.x * this.z,
                v.x * this.y - v.y * this.x);
        }

        ipo(p, r = 0.5) {
            return new vec3(
                this.x * (1.0 - r) + p.x * r,
                this.y * (1.0 - r) + p.y * r,
                this.z * (1.0 - r) + p.z * r);
        }
    };

    cvec3 = {
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

        identity() {
            this.s = 1.0;
            this.i = this.j = this.k = 0.0;
        }

        len2() {
            return this.s * this.s +
                this.i * this.i +
                this.j * this.j +
                this.k * this.k;
        }

        nor() {
            var div = this.len2();
            if (div <= 0.0) return;

            div = 1.0 / Math.sqrt(div);
            this.s *= div;
            this.i *= div;
            this.j *= div;
            this.k *= div;
        }

        rotate_axi(axi, arc) {
            this.s = Math.sin(arc * 0.5) / axi.len();
            this.i = axi.x * this.s;
            this.j = axi.y * this.s;
            this.k = axi.z * this.s;
            this.s = Math.cos(arc * 0.5);
        }

        rotate_abc(abc) {
            var arc = abc.len();
            this.s = Math.sin(arc * 0.5) / arc;
            this.i = abc.x * this.s;
            this.j = abc.y * this.s;
            this.k = abc.z * this.s;
            this.s = Math.cos(arc * 0.5);
        }

        rotate_ft(from, to) {
            var ln2 = from.len2() * to.len2();
            var ln = Math.sqrt(ln2);
            var dt = from.dot(to);
            var cr = to.crs(from);

            var dv = Math.sqrt(0.5 / (ln2 + ln * dt));

            this.s = dv * (dt + ln);
            this.i = dv * cr.x;
            this.j = dv * cr.y;
            this.k = dv * cr.z;
        }

        static gen_axi(axi, arc) {
            var q = new quat();
            q.rotate_axi(axi, arc);
            return q;
        }

        static gen_abc(abc) {
            var q = new quat();
            q.rotate_abc(abc);
            return q;
        }

        static gen_xy(x, y) {
            x = x.vec();
            var z = crs(y, x).vec();
            y = crs(x, z).vec();

            var m = [
                [x.x, x.y, x.z],
                [y.x, y.y, y.z],
                [z.x, z.y, z.z]
            ];

            var sqrt2 = a => { return a > 0.0 ? sqrt(a) : 0.0; };

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

        as_cooked(a) {
            var bs = this.s;
            var bi = this.i;
            var bj = this.j;
            var bk = this.k;
            this.s = bs * a.s - bi * a.i - bj * a.j - bk * a.k;
            this.i = bs * a.i + bi * a.s + bj * a.k - bk * a.j;
            this.j = bs * a.j + bj * a.s + bk * a.i - bi * a.k;
            this.k = bs * a.k + bk * a.s + bi * a.j - bj * a.i;
        }

        rev() { return new quat(-this.s, this.i, this.j, this.k); }

        cook(a) {
            return new quat(
                this.s * a.s - this.i * a.i - this.j * a.j - this.k * a.k,
                this.s * a.i + this.i * a.s + this.j * a.k - this.k * a.j,
                this.s * a.j + this.j * a.s + this.k * a.i - this.i * a.k,
                this.s * a.k + this.k * a.s + this.i * a.j - this.j * a.i);
        }

        rot_vec(a) {
            var ii = this.i * this.i;
            var jj = this.j * this.j;
            var kk = this.k * this.k;
            var ij = this.i * this.j;
            var jk = this.j * this.k;
            var ki = this.k * this.i;
            var is = this.i * this.s;
            var js = this.j * this.s;
            var ks = this.k * this.s;

            return new vec3(
                ((0.5 - jj - kk) * a.x + (ij - ks) * a.y + (ki + js) * a.z) * 2.0,
                ((ij + ks) * a.x + (0.5 - ii - kk) * a.y + (jk - is) * a.z) * 2.0,
                ((ki - js) * a.x + (jk + is) * a.y + (0.5 - ii - jj) * a.z) * 2.0);
        }

        sin() {
            return Math.sqrt(
                this.i * this.i +
                this.j * this.j +
                this.k * this.k);
        }

        cos() {
            return Math.abs(s);
        }

        ipo(q2, r = 0.5) {
            var q1 = this;
            //q1 = q1.vec();
            //q2 = q2.vec();

            if (r > 1.0) r = 1.0;
            else if (r < 0.0) r = 0.0;
            var r2 = 1.0 - r;

            var cs = q1.s * q2.s + q1.i * q2.i + q1.j * q2.j + q1.k * q2.k;
            if (cs < 0.0) r = -r;

            var s = q1.s * r2 + q2.s * r;
            var i = q1.i * r2 + q2.i * r;
            var j = q1.j * r2 + q2.j * r;
            var k = q1.k * r2 + q2.k * r;

            var div = 1.0 / Math.sqrt(s * s + i * i + j * j + k * k);
            return new quat(s * div, i * div, j * div, k * div);
        }

        /*axi_align(q) {
            quat best;
            uint best_id = -1;
            var best_gap = -2.0;

            var sqrt2 = [](var a) - >
                var { return a > 0.0 ? sqrt(a) : 0.0; };
            each(i, 3) each(j, 3) {
                if (j == i) continue;
                each(ii, 2) each(jj, 2) {
                    var t = quat.gen_xy(cvec3.axis(i, ii), cvec3.axis(j, jj));
                    var gp = t.rev() * q;
                    var gap = abs(gp.cos());
                    if (gap <= best_gap) continue;
                    best_id = (i * 2 + ii) * 6 + j * 2 + jj;
                    best_gap = gap;
                    best = t;
                }
            }
            return { best, best_gap, best_id };
        }*/

    };

    cquat = {
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

        from_3pt(po, px, py) {
            this.xyz = po;
            this.abc = quat.gen_xy(px.sub(po), py.sub(po));
        }

        gap(f) { return { x: (this.xyz.sub(f.xyz)).len(), y: quat.interval(this.abc, f.abc) }; }

        rev() { return new frame(this.abc.rev().rot_vec(this.xyz.rev()), this.abc.rev()); }

        on(f) { return new frame(f.abc.rot_vec(this.xyz).add(f.xyz), f.abc.cook(this.abc)); }

        at(f) { return new constructor(f.abc.rev().rot_vec(xyz - f.xyz), f.abc.rev().cook(this.abc)); }

        on_(f) {
            this.xyz = f.abc.rot_vec(xyz).add(f.xyz);
            this.abc = f.abc.cook(this.abc);
        }

        at_(f) {
            xyz = f.abc.rev().rot_vec(xyz - f.xyz);
            abc = f.abc.rev().cook(this.abc);
        }

        trans(p) { return this.abc.rot_vec(p).add(this.xyz); }
        measure(p) { return this.abc.rev().rot_vec(p.sub(this.xyz)); }

        move(ds) { return new frame(this.xyz.add(ds), this.abc); }
        move_(ds) { this.xyz.add_(ds); }

        x() { return this.abc.rot_vec(new vec3(1.0, 0.0, 0.0)); }
        y() { return this.abc.rot_vec(new vec3(0.0, 1.0, 0.0)); }
        z() { return this.abc.rot_vec(new vec3(0.0, 0.0, 1.0)); }

        /*vec6 to_kuka() const {
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


        vec6 to_xyzabc() const {
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

        ipo(f2, r = 0.5) {
            if (r > 1.0) r = 1.0;
            else if (r < 0.0) r = 0.0;
            return new constructor(this.xyz.ipo(f2.xyz, r), this.abc.ipo(f2.abc, r));
        }
    };

    cframe = {
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

    tensor_tool.cfloat = cfloat;
    tensor_tool.vec2 = vec2;
    tensor_tool.cvec2 = cvec2;
    tensor_tool.vec3 = vec3;
    tensor_tool.cvec3 = cvec3;
    tensor_tool.quat = quat;
    tensor_tool.cquat = cquat;
    tensor_tool.frame = frame;
    tensor_tool.cframe = cframe;
}