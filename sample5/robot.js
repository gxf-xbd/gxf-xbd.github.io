let lab_tool = null; { let cvec3 = tensor_tool.cvec3, showing = null; class label_robot { constructor(body, p = cvec3.o) { function callback (e) { this.on_click(e) } this.pos = p, this.w = this.h = 150, this.scale = 3e3, this.side0 = 0, this.side = 0, this.min = { x: 0, y: 0, w: 0, h: 0, a: 1, s: 0 }, this.max = { x: 500, y: 100, w: 800, h: 500, a: 1, s: 1 }, this.body = body, this.div = append_element(body, "div"), this.div.style.position = "absolute", this.div.onclick = callback.bind(this), this.div1 = document.createElement("div"), append_text(this.div1, "KUKA<br/>KR210-R2700<br/>kuka robot<br/>", "20px"), this.div2 = document.createElement("div"), this.div2.style.overflowX = "hide", this.div2.style.overflowY = "scroll", this.div2.style.width = "800px", this.div2.style.height = "500px"; { append_text(this.div2, "KUKA KR210-R2700<br/>", "60px"), append_text(this.div2, "robot #01<br/>", "40px"); let t = document.createElement("div"); t.style.width = "370px", t.style.height = "300px", t.style.backgroundColor = "", t.style.display = "inline-block", this.div2.appendChild(t); let t2 = document.createElement("div"); t2.style.width = "370px", t2.style.height = "300px", t2.style.backgroundColor = "", t2.style.display = "inline-block", this.div2.appendChild(t2), append_text(this.div2, "<br/>"), append_text(this.div2, "KUKA KR210-R2700<br/>", "30px"), append_text(this.div2, "robot #01<br/>", "30px"), append_text(this.div2, "KUKA KR210-R2700<br/>", "30px"), append_text(this.div2, "robot #01<br/>", "30px"); let myChart = echarts.init(t), myChart2 = echarts.init(t2); this.charts = [], this.charts.push(myChart), this.charts.push(myChart2) } this.div.className = "pad2", this.div.appendChild(this.div1), this.which = !1 } on_click (e) { showing = showing === this ? null : this } update (obs) { let px = obs.to_screen(this.pos); if (px) { let sc = this.scale * px.z; sc < .1 ? sc = .1 : sc > 2 && (sc = 2), this.min.x = px.x - .5 * this.div.clientWidth, this.min.y = px.y - .5 * this.div.clientHeight * (1 + sc), this.min.w = this.w, this.min.h = this.h, this.min.s = sc, this.a = 1 } else this.min.a = 0; if (this.side > .7 != this.which) { this.which = !this.which, this.div.removeChild(this.which ? this.div1 : this.div2), this.div.appendChild(this.which ? this.div2 : this.div1), this.div.className = this.which ? "pad2_max" : "pad2"; let option = { backgroundColor: "", title: { text: "ECharts 数据统计" }, tooltip: {}, legend: { data: ["用户来源"] }, series: [{ name: "访问量", type: "pie", data: [500, 200, 360, 100] }] }; for (let a in this.charts) this.charts[a].setOption(this.which ? option : {}, !0) } this.side += .15 * ((showing === this ? 1 : 0) - this.side); let ipo = {}; for (let a in this.min) ipo[a] = this.max[a] * this.side + this.min[a] * (1 - this.side); { let style = this.div.style; style.left = ipo.x + "px", style.top = ipo.y + "px", style.width = ipo.w + "px", style.height = ipo.h + "px", style.transform = "scale(" + ipo.s + ")", style.zIndex = this.side > .1 ? 1 : 0 } } } lab_tool = label_robot } let robot_tool = {}; { class com { constructor() { this.e = new tensor_tool.vec3, this.rb = new tensor_tool.vec3, this.a = new tensor_tool.vec3(1, 0, 0), this.rd = new tensor_tool.quat(1, 0, 0, 0), this.o = null } trans_f (f) { this.rb = f.xyz, this.rd = f.abc } trans (arc, c) { let d = tensor_tool.quat.gen_axi(this.a, arc); this.rb = c.rb.add(c.rd.rot_vec(c.e)), this.rd = c.rd.cook(d) } async init (world, name, op, or2, end, axi) { return this.e = end, this.a = axi, this.o = await world.open_obj(name), this.rev = new tensor_tool.frame(or2.rot_vec(op.rev()), or2), op.add(or2.rev().rot_vec(end)) } show (world) { world.draw_obj(this.o, this.rev.on(new tensor_tool.frame(this.rb, this.rd))) } } class robot { constructor() { this.coms = []; for (let i = 0; i < 7; i++)this.coms.push(new com); this.base = new tensor_tool.frame } async init (world, t0, t1, t2, t3, t4, t5, t6, o0, o1, o2, o3, o4, o5, o6) { let cquat = tensor_tool.cquat, cvec3 = tensor_tool.cvec3, trs = cvec3.o; trs = await this.coms[0].init(world, o0, trs, cquat.o, t0, cvec3._y), trs = await this.coms[1].init(world, o1, trs, cquat.o, t1, cvec3._y), trs = await this.coms[2].init(world, o2, trs, cquat.z270, t2, cvec3._z), trs = await this.coms[3].init(world, o3, trs, cquat.o, t3, cvec3._z), trs = await this.coms[4].init(world, o4, trs, cquat.o, t4, cvec3._x), trs = await this.coms[5].init(world, o5, trs, cquat.o, t5, cvec3._z), trs = await this.coms[6].init(world, o6, trs, cquat.o, t6, cvec3._x) } async init_kr6 (world) { let vec3 = tensor_tool.vec3; await this.init(world, new vec3(0, 0, 0), new vec3(25, 400, 0), new vec3(455, 0, 0), new vec3(420, 35, 0), new vec3(0, 0, 0), new vec3(80, 0, 0), new vec3(0, 0, 0), "model/kr6/0.obj", "model/kr6/1.obj", "model/kr6/2.obj", "model/kr6/3.obj", "model/kr6/4.obj", "model/kr6/5.obj", "model/kr6/6.obj") } async init_kr16 (world) { let vec3 = tensor_tool.vec3; await this.init(world, new vec3(0, 0, 0), new vec3(160, 520, 0), new vec3(980, 0, 0), new vec3(860, 150, 0), new vec3(0, 0, 0), new vec3(153, 0, 0), new vec3(0, 0, 0), "model/kr16_2010/0.obj", "model/kr16_2010/1.obj", "model/kr16_2010/2.obj", "model/kr16_2010/3.obj", "model/kr16_2010/4.obj", "model/kr16_2010/5.obj", "model/kr16_2010/6.obj") } async init_kr20 (world) { let vec3 = tensor_tool.vec3; await this.init(world, new vec3(0, 0, 0), new vec3(160, 520, 0), new vec3(780, 0, 0), new vec3(860, 150, 0), new vec3(0, 0, 0), new vec3(153, 0, 0), new vec3(0, 0, 0), "model/kr20/0.obj", "model/kr20/1.obj", "model/kr20/2.obj", "model/kr20/3.obj", "model/kr20/4.obj", "model/kr20/5.obj", "model/kr20/6.obj") } async init_kr210 (world) { let vec3 = tensor_tool.vec3; await this.init(world, new vec3(0, 0, 0), new vec3(350, 675, 0), new vec3(1150, 0, 0), new vec3(1200, -41, 0), new vec3(0, 0, 0), new vec3(215, 0, 0), new vec3(0, 0, 0), "model/kr210/0.obj", "model/kr210/1.obj", "model/kr210/2.obj", "model/kr210/3.obj", "model/kr210/4.obj", "model/kr210/5.obj", "model/kr210/6.obj") } show (world, ax, base = tensor_tool.cframe.o) { this.coms[0].trans_f(base); for (let i = 0; i < 6; i++)this.coms[i + 1].trans(ax[i], this.coms[i]); for (let i = 0; i < 7; i++)this.coms[i].show(world) } } robot_tool.robot = robot; let frmae = tensor_tool.frame; class robot_sys { constructor(body, base) { let vec3 = tensor_tool.vec3; this.r = new robot, this.base = base, this.lab = new lab_tool(body, this.base.xyz.add(new vec3(0, 1e3, 0))) } show (obs, axis) { this.r.show(obs, axis, this.base), this.lab.update(obs) } } robot_tool.robot_sys = robot_sys }