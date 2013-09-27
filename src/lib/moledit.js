/*===========================================================================*/
/*                     (c) Copyright 2013, MolSoft L.L.C.                    */
/*                          ALL RIGHTS RESERVED                              */
/*                               v. 1.1                                     */
/*===========================================================================*/
var Elements = {
    "*": 0,
    H: 1,
    He: 2,
    Li: 3,
    Be: 4,
    B: 5,
    C: 6,
    N: 7,
    O: 8,
    F: 9,
    Ne: 10,
    Na: 11,
    Mg: 12,
    Al: 13,
    Si: 14,
    P: 15,
    S: 16,
    Cl: 17,
    Ar: 18,
    K: 19,
    Ca: 20,
    Sc: 21,
    Ti: 22,
    V: 23,
    Cr: 24,
    Mn: 25,
    Fe: 26,
    Co: 27,
    Ni: 28,
    Cu: 29,
    Zn: 30,
    Ga: 31,
    Ge: 32,
    As: 33,
    Se: 34,
    Br: 35,
    Kr: 36,
    Rb: 37,
    Sr: 38,
    Y: 39,
    Zr: 40,
    Nb: 41,
    Mo: 42,
    Tc: 43,
    Ru: 44,
    Rh: 45,
    Pd: 46,
    Ag: 47,
    Cd: 48,
    In: 49,
    Sn: 50,
    Sb: 51,
    Te: 52,
    I: 53,
    Xe: 54,
    Cs: 55,
    Ba: 56,
    La: 57,
    Ce: 58,
    Pr: 59,
    Nd: 60,
    Pm: 61,
    Sm: 62,
    Eu: 63,
    Gd: 64,
    Tb: 65,
    Dy: 66,
    Ho: 67,
    Er: 68,
    Tm: 69,
    Yb: 70,
    Lu: 71
};

var ElementNames = [
    "*",
    "H",
    "He",
    "Li",
    "Be",
    "B",
    "C",
    "N",
    "O",
    "F",
    "Ne",
    "Na",
    "Mg",
    "Al",
    "Si",
    "P",
    "S",
    "Cl",
    "Ar",
    "K",
    "Ca",
    "Sc",
    "Ti",
    "V",
    "Cr",
    "Mn",
    "Fe",
    "Co",
    "Ni",
    "Cu",
    "Zn",
    "Ga",
    "Ge",
    "As",
    "Se",
    "Br",
    "Kr",
    "Rb",
    "Sr",
    "Y",
    "Zr",
    "Nb",
    "Mo",
    "Tc",
    "Ru",
    "Rh",
    "Pd",
    "Ag",
    "Cd",
    "In",
    "Sn",
    "Sb",
    "Te",
    "I",
    "Xe",
    "Cs",
    "Ba",
    "La",
    "Ce",
    "Pr",
    "Nd",
    "Pm",
    "Sm",
    "Eu",
    "Gd",
    "Tb",
    "Dy",
    "Ho",
    "Er",
    "Tm",
    "Yb",
    "Lu"
];

var M_CE = 1 << 0,
    M_AR = 2, /* 1 << 1*/
    M_RNG = 1 << 5,
    M_WK = 1 << 31,
    M_EXPLICT_QFM = 1 << 6,
    M_APO = 1 << 7,
    M_BO_UP = 1 << 6,
    M_BO_DW = 1 << 7,
    M_BO_TREE = 1 << 8,
    M_BO_SLASH = 1 << 9,
    M_BO_BSLASH = 1 << 10;

var HYB_SP1 = 1,
    HYB_SP2 = 2,
    HYB_SP3 = 3;

var CHI_R = 1,
    CHI_S = 2;

var STEREO_LABEL = ["", "(R)", "(S)", "(RS)"];

var E_BOTY_NL = 0,
    E_BOTY_SI = 1,
    E_BOTY_DD = 2,
    E_BOTY_TR = 3,
    E_BOTY_AR = 4,
    E_BOTY_SD = 5,
    E_BOTY_SA = 6,
    E_BOTY_DA = 7,
    E_BOTY_AH = 8,
    E_BOTY_DS = 9;

var E_BOCYTY_AH = 0,
    E_BOCYTY_RN = 1,
    E_BOCYTY_CN = 2;

var ALS_NOOP = 0,
    ALS_HIAND = 1,
    ALS_OR = 2,
    ALS_LOAND = 3,
    ALS_NOT = 4;

var MINVOL = 0.01;

var ATOM_DISPLAY_RS = 1 << 0;

var MODE_NORMAL = 0,
    MODE_ZOOM = 1,
    MODE_ZROT = 2,
    MODE_RECT_SEL = 3,
    MODE_LASSO_SEL = 4,
    MODE_DRAG_ATOMS = 5,
    MODE_CHAIN = 6;

var ICON_SIZE = 24;

var TO_RAD = 0.017453292519943;

var TO_DEG = 57.29577951308232;

Object.prototype.clone = function() {
    var a;
    if (this instanceof Array) {
        a = Array(this.length);
        for (var b = 0; b < this.length; b++) {
            if (this[b] && typeof this[b] === "object") {
                a[b] = this[b].clone();
            } else {
                a[b] = this[b];
            }
        }
    } else {
        a = {};
        for (var b in this) {
            if (b !== "clone" && b !== "count") {
                if (this[b] && typeof this[b] === "object") {
                    a[b] = this[b].clone();
                } else {
                    a[b] = this[b];
                }
            }
        }
    }
    return a;
};

Object.prototype.count = function() {
    var a = 0;
    for (var b in this) {
        if (this.hasOwnProperty(b)) {
            a++;
        }
    }
    return a;
};

Array.prototype.map = function(c) {
    var a = new Array(this.length);
    for (var b = 0; b < this.length; b++) {
        a[b] = c(this[b]);
    }
    return a;
};

Array.prototype.forEach = function(b) {
    for (var a = 0; a < this.length; a++) {
        b(this[a]);
    }
};

Array.prototype.fill = function(b) {
    for (var a = 0; a < this.length; a++) {
        this[a] = b;
    }
};

Array.prototype.sub = function(c, d) {
    var a = new Array(d);
    for (var b = 0; b < d; b++) {
        a[b] = this[b + c];
    }
    return a;
};

Array.prototype.unique = function() {
    var b = [];
    for (var a = 0; a < this.length; a++) {
        if (b.length === 0 || b[b.length - 1] !== this[a]) {
            b.push(this[a]);
        }
    }
    return b;
};

function WMatrix() {
    this.mvm = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

WMatrix.prototype.translate = function(a, c, b) {
    this.mvm[12] += a * this.mvm[0] + c * this.mvm[4] + b * this.mvm[8];
    this.mvm[13] += a * this.mvm[1] + c * this.mvm[5] + b * this.mvm[9];
    this.mvm[14] += a * this.mvm[2] + c * this.mvm[6] + b * this.mvm[10];
    this.mvm[15] += a * this.mvm[3] + c * this.mvm[7] + b * this.mvm[11];
    return this;
};

WMatrix.prototype.rotateZ = function(d, b) {
    var a;
    a = this.mvm[0];
    this.mvm[0] = a * d + this.mvm[4] * b;
    this.mvm[4] = -a * b + this.mvm[4] * d;
    a = this.mvm[1];
    this.mvm[1] = a * d + this.mvm[5] * b;
    this.mvm[5] = -a * b + this.mvm[5] * d;
    a = this.mvm[2];
    this.mvm[2] = a * d + this.mvm[6] * b;
    this.mvm[6] = -a * b + this.mvm[6] * d;
    a = this.mvm[3];
    this.mvm[3] = a * d + this.mvm[7] * b;
    this.mvm[7] = -a * b + this.mvm[7] * d;
    return this;
};

WMatrix.prototype.rotateZAroundPoint = function(b, d, c) {
    return this.translate(b, d, 0).rotateZ(Math.cos(c), Math.sin(c)).translate(-b, -d, 0);
};

WMatrix.prototype.map = function(a) {
    var b = a.x * this.mvm[0] + a.y * this.mvm[4] + this.mvm[12];
    var c = a.x * this.mvm[1] + a.y * this.mvm[5] + this.mvm[13];
    return{x: b, y: c, z: 0};
};

function Chemical() {
    this.atoms = [];
    this.bonds = [];
    this.minx = 0;
    this.maxx = 1.2 * 6;
    this.miny = 0;
    this.maxy = 1.2 * 6;
    this.rings = [];
}

Chemical.prototype.processChemical = function() {
    this.calcConnectivity();
    this.assignHyb();
    this.findRings();
    this.assignCIP();
    this.assignChirality();
};

function bondKey(a) {
    return Math.min(a.fr, a.to).toString() + "x" + Math.max(a.fr, a.to).toString();
}

Chemical.prototype.centerPoint = function() {
    return {
        x: (this.minx + this.maxx) / 2,
        y: (this.miny + this.maxy) / 2,
        z: 0
    };
};

Chemical.prototype.calcConnectivity = function() {
    for (var b = 0; b < this.atoms.length; b++) {
        this.atoms[b].bo = [];
        this.atoms[b].ty = [];
        this.atoms[b].conn = 0;
        this.atoms[b].nHyd = 0;
        this.atoms[b].qfm = 0;
        if (typeof this.atoms[b].ms === "undefined") {
            this.atoms[b].ms = 0;
        }
    }
    for (var b = 0; b < this.bonds.length; b++) {
        var c = this.bonds[b];
        if (typeof c.ms === "undefined") {
            c.ms = 0;
        }
        var a = c.ty;
        if (c.ms & M_AR) {
            a |= 4;
        }
        this.atoms[c.fr].conn += c.ty;
        this.atoms[c.to].conn += c.ty;
        a |= (c.ms & (M_RNG | M_BO_UP | M_BO_DW));
        this.atoms[c.fr].bo.push(c.to);
        this.atoms[c.fr].ty.push(a);
        this.atoms[c.to].bo.push(c.fr);
        this.atoms[c.to].ty.push(a);
        if (this.atoms[c.fr].cd === 1) {
            this.atoms[c.to].nHyd++;
        }
        if (this.atoms[c.to].cd === 1) {
            this.atoms[c.fr].nHyd++;
        }
    }
    this.calcBox();
    for (var b = 0; b < this.atoms.length; b++) {
        this.atoms[b].conn = Math.floor(this.atoms[b].conn);
    }
};

Chemical.prototype.calcBox = function() {
    this.minx = this.miny = Number.MAX_VALUE;
    this.maxx = this.maxy = -Number.MAX_VALUE;
    for (var b = 0; b < this.atoms.length; b++) {
        var a = this.atoms[b];
        this.minx = Math.min(a.x, this.minx);
        this.miny = Math.min(a.y, this.miny);
        this.maxx = Math.max(a.x, this.maxx);
        this.maxy = Math.max(a.y, this.maxy);
    }
};

Chemical.prototype.nbo_all = function(a) {
    return a.bo.length + this.H(a) - a.nHyd;
};

Chemical.prototype.calc_qfm = function(a) {
    var b = function(d) {
        return ((d) === 5) ? (-1) : 1;
    };
    var c = a.conn - this.V(a);
    return c >= 0 ? c * b(a.cd) : 0;
};

Chemical.prototype.get_qfm = function(a) {
    return (a.ms & M_EXPLICT_QFM) ? a.qfm : this.calc_qfm(a);
};

Chemical.prototype.H = function(a) {
    if (a.cd === 1) {
        return 0;
    }
    var b = this.V(a);
    if (b === 0) {
        return 0;
    }
    var c = b - a.conn + a.qfm + a.nHyd;
    return(c < 0) ? 0 : c;
};

Chemical.prototype.V = function(a) {
    switch (a.cd) {
        case 8:
            return 2;
        case 7:
            return (a.conn <= 4) ? 3 : 5;
        case 5:
            return (a.conn <= 4) ? 3 : 5;
        case 6:
            return 4;
        case 34:
        case 16:
            return (a.conn <= 3) ? 2 : (a.conn <= 5) ? 4 : 6;
        case 33:
        case 15:
            return (a.conn <= 4) ? 3 : (a.conn <= 6) ? 5 : 6;
        case 14:
            return 4;
        case 17:
            return (a.conn <= 2) ? 1 : (a.conn <= 4) ? 3 : (a.conn <= 6) ? 5 : 7;
        case 9:
            return 1;
        case 35:
            return (a.conn <= 2) ? 1 : (a.conn <= 4) ? 3 : (a.conn <= 6) ? 5 : 7;
        case 53:
            return (a.conn <= 2) ? 1 : (a.conn <= 4) ? 3 : (a.conn <= 6) ? 5 : 7;
        default:
            return a.conn;
    }
};

Chemical.prototype.findPathToRoot = function(b, c, a) {
    c.length = 0;
    a.fill(false);
    var d = b;
    while (d.pv !== null) {
        c.push(d.at);
        a[d.at] = true;
        d = d.pv;
    }
    c.push(d.at);
    a[d.at] = true;
};

Chemical.prototype.findShortestPath = function(m, l) {
    var g = new Array();
    var h = new Array();
    var c = new Array();
    var d = this.atoms.length;
    for (var a = 0; a < this.atoms.length; a++) {
        g[a] = Number.MAX_VALUE;
        c[a] = -1;
        h[a] = a;
    }
    g[m] = 0;
    while (d > 0) {
        var k = Number.MAX_VALUE;
        var j = -1;
        for (var a = 0; a < g.length; a++) {
            if (h[a] !== -1 && g[a] < k) {
                k = g[a];
                j = a;
            }
        }
        if (j === -1) {
            break
        }
        h[j] = -1;
        d--;
        for (var a = 0; a < this.atoms[j].bo.length; a++) {
            var b = g[j] + 1;
            var f = this.atoms[j].bo[a];
            if (b < g[f]) {
                g[f] = b;
                c[f] = j;
            }
        }
    }
    var o = new Array();
    var e = l;
    while (c[e] !== -1) {
        o.splice(0, 0, e);
        e = c[e];
    }
    return o;
};

Chemical.prototype.treeFromAtom = function(k, f, m, l, h) {
    var o = Array(2);
    o[0] = Array();
    o[1] = Array();
    var g = 0;
    var e = 1;
    l[f] = {at: f, pv: m};
    o[g].push(l[f]);
    var a = 0;
    while (o[g].length) {
        o[e].length = 0;
        for (var c = 0; c < o[g].length; c++) {
            n = o[g][c];
            f = n.at;
            for (var b = 0; b < this.atoms[f].bo.length; b++) {
                var d = this.atoms[f].bo[b];
                if (!h[d] && d !== f) {
                    h[d] = true;
                    l[d] = {at: d, pv: n};
                    o[e].push(l[d]);
                }
            }
        }
        a++;
        if (a >= k) {
            break
        }
        g = 1 - g;
        e = 1 - e;
    }
};

function cmp_rng(d, c) {
    for (var e = 0; e < d.length; e++) {
        if (d[e] !== c[e]) {
            return d[e] - c[e];
        }
    }
    return 0;
}

Chemical.prototype.findRingFromBond = function(b, k) {
    var c = this.atoms.length;
    var g = new Array(c);
    g.fill(null);
    var f = new Array(c);
    f.fill(null);
    var o = new Array(c);
    o.fill(false);
    var h = new Array(c);
    h.fill(false);
    o[b.fr] = true;
    h[b.to] = true;
    h[b.fr] = true;
    o[b.to] = true;
    this.treeFromAtom(10, b.fr, null, g, o);
    this.treeFromAtom(10, b.to, null, f, h);
    var s, q;
    var p = [], m = [];
    for (var e = 0; e < c; e++) {
        s = g[e];
        if (s !== null) {
            q = f[s.at];
            if (q !== null) {
                this.findPathToRoot(s, p, o);
                this.findPathToRoot(q, m, h);
                var l = 0;
                for (var d = 0; d < o.length; d++) {
                    if (o[d] && h[d]) {
                        l++;
                    }
                }
                if (l === 1) {
                    var a = new Array(c);
                    a.fill(0);
                    p.forEach(function(i) {
                        a[i] = 1;
                    });
                    m.forEach(function(i) {
                        a[i] = 1;
                    });
                    var t = false;
                    for (var d = 0; d < k.length; d++) {
                        if (cmp_rng(k[d], a) === 0) {
                            t = true;
                            break;
                        }
                    }
                    if (!t) {
                        k.push(a);
                    }
                }
            }
        }
    }
};

Chemical.prototype.findRings = function() {
    var g = this;
    var l = this.atoms.length;
    var v = Array(l);
    v.fill(0);
    var o = [];
    this.rings.length = 0;
    this.atoms.forEach(function(i) {
        i.ms &= ~(M_AR | M_RNG);
    });
    this.bonds.forEach(function(i) {
        i.ms &= ~(M_AR | M_RNG);
    });
    var d = function(j) {
        var F = 0;
        for (var k = 0; k < j.length; k++) {
            F += j[k];
        }
        return F;
    };
    var D = function(F, k) {
        for (var j = 0; j < F.length; j++) {
            F[j] &= k[j];
        }
    };
    var h = function(F, k) {
        for (var j = 0; j < F.length; j++) {
            F[j] |= k[j];
        }
    };
    var C = function(F, k) {
        for (var j = 0; j < F.length; j++) {
            if (F[j] !== k[j]) {
                return false;
            }
        }
        return true;
    };
    var p = new Array(this.bonds.length);
    var a = new Array(l);
    for (var y = 0; y < this.bonds.length; y++) {
        var E = this.bonds[y];
        E.ms &= ~M_BO_TREE;
        p[y] = {pbo: E, w: Math.min(this.atoms[E.to].bo.length, this.atoms[E.fr].bo.length)};
    }
    p.sort(function(j, i) {
        return i.w - j.w;
    });
    for (var y = 0; y < l; y++) {
        a[y] = y;
    }
    for (var y = 0; y < p.length; y++) {
        var E = p[y].pbo;
        if (a[E.fr] !== a[E.to]) {
            var A = Math.min(a[E.fr], a[E.to]);
            var s = Math.max(a[E.fr], a[E.to]);
            for (var x = 0; x < l; x++) {
                if (a[x] === s) {
                    a[x] = A;
                }
            }
            E.ms |= M_BO_TREE;
        }
    }
    var z = 0;
    for (var y = 0; y < this.bonds.length; y++) {
        var E = this.bonds[y];
        if (!(E.ms & M_BO_TREE)) {
            this.findRingFromBond(E, o);
            z++;
        }
    }
    if (z < o.length) {
        o.sort(function(j, i) {
            return d(i) - d(j);
        });
        var m = new Array(l);
        for (var y = o.length - 1; y >= 0; y--) {
            m.fill(0);
            for (var x = 0; x < o.length; x++) {
                if (y !== x && d(o[x]) <= d(o[y])) {
                    h(m, o[x]);
                }
            }
            D(m, o[y]);
            if (C(m, o[y])) {
                o.splice(y, 1);
            }
            if (o.length === z) {
                break;
            }
        }
    }
    for (var y = 0; y < o.length; y++) {
        this.bonds.forEach(function(i) {
            if (o[y][i.fr] && o[y][i.to]) {
                i.ms |= M_RNG;
                g.atoms[i.fr].ms |= M_RNG;
                g.atoms[i.to].ms |= M_RNG;
            }
        });
    }
    this.calcConnectivity();
    var f = new Array(o.length);
    f.fill(false);
    do {
        var u = false;
        for (var y = 0; y < o.length; y++) {
            if (!f[y]) {
                var e = [];
                for (var x = 0; x < o[y].length; x++) {
                    if (o[y][x]) {
                        e.push(x);
                    }
                }
                var B = 0;
                for (var x = 0; x < e.length; x++) {
                    var q = this.atoms[e[x]];
                    var c = false;
                    var t = 0;
                    for (var w = 0; w < q.bo.length; w++) {
                        var b = q.ty[w] & 7;
                        if (e.indexOf(q.bo[w]) !== -1) {
                            t += (b & 4) ? 1.5 : (b & 3);
                        } else {
                            if ((b & 3) >= 2 && !(q.ty[w] & M_RNG)) {
                                c = true;
                                break;
                            }
                        }
                    }
                    if (c) {
                        break
                    }
                    switch (q.cd) {
                        case 6:
                            if (t === 3 || t === 2.5) {
                                B += 1;
                            } else {
                                c = true;
                                break;
                            }
                            break;
                        case 7:
                        case 15:
                            if (t === 3) {
                                B += 1;
                            } else {
                                if (t === 2 && e.length === 5) {
                                    B += 2;
                                } else {
                                    c = true;
                                    break;
                                }
                            }
                            break;
                        case 8:
                        case 16:
                            if (t === 2 && e.length === 5) {
                                B += 2;
                            } else {
                                c = true;
                                break;
                            }
                            break
                    }
                    if (c) {
                        break
                    }
                }
                if (!c && B > 2 && (B - 2) % 4 === 0) {
                    this.bonds.forEach(function(i) {
                        if (o[y][i.fr] && o[y][i.to]) {
                            i.ms |= M_AR;
                            g.atoms[i.fr].ms |= M_AR;
                            g.atoms[i.to].ms |= M_AR;
                        }
                    });
                    f[y] = true;
                    u = true;
                    this.calcConnectivity();
                }
            }
        }
        if (!u) {
            break
        }
    } while (true);
    for (var y = 0; y < o.length; y++) {
        var e = [];
        for (var x = 0; x < o[y].length; x++) {
            if (o[y][x]) {
                e.push(x);
            }
        }
        this.rings.push(e);
    }
};

Chemical.prototype.atomsInTheSameRing = function(b, a) {
    for (var c = 0; c < this.rings.length; c++) {
        if (this.rings[c].indexOf(b) !== -1 && this.rings[c].indexOf(a) !== -1) {
            return true;
        }
    }
    return false;
};

function cmp_pri_lex(d, c) {
    var e = 0;
    while (e < d.p.length && e < c.p.length) {
        if (d.p[e] !== c.p[e]) {
            return d.p[e] - c.p[e];
        }
        e++;
    }
    return d.p.length - c.p.length;
}

function num_uniq_cip(c) {
    var b, a;
    if (c.length === 0) {
        return 0;
    }
    a = 1;
    for (b = 0; b < c.length - 1; b++) {
        if (cmp_pri_lex(c[b], c[b + 1]) !== 0) {
            a++;
        }
    }
    return a;
}

Chemical.prototype.reassign_priorities = function(g, b) {
    var h, a, f, e, d, c;
    h = 0;
    a = g.length - 1;
    c = 0;
    for (f = h; f <= a; ) {
        b++;
        e = f;
        while (e <= a && cmp_pri_lex(g[f], g[e]) === 0) {
            e++;
        }
        if (e > a) {
            e = a;
        } else {
            e--;
        }
        for (d = f; d <= e; d++) {
            g[d].set(b);
        }
        f = e = e + 1;
    }
};

Chemical.prototype.assignHyb = function() {
    var b = this.atoms.length;
    for (var e = 0; e < b; e++) {
        var g = this.atoms[e];
        var o = 0, m = 0, q = 0, u = 0, p = 0, l = 0, a = 0, f = 0;
        if (g.ms & M_AR) {
            g.hyb = HYB_SP2;
            continue
        }
        for (var d = 0; d < g.ty.length; d++) {
            var t = g.ty[d];
            var h = this.atoms[g.bo[d]];
            if (g.cd === 7 || g.cd === 8 || g.cd === 16) {
                for (var c = 0; c < h.ty.length; c++) {
                    if (h.bo[c] !== e) {
                        var s = h.ty[c];
                        var v = h.bo[c];
                        if (((s & 15) === 2 || (s & 15) === 3 || (s & 4)) && ((t & 15) === 1) && (h.cd === 6 || h.cd === 7 || h.cd === 8)) {
                            if ((s & 15) !== 3) {
                                p++;
                            }
                            u++;
                        }
                        if ((t & 15) === 1 && (s & 15) === 1 && h.cd === 6 && v.cd === 8 && v.bo.length === 1) {
                            l++;
                        }
                        if ((t & 15) === 1 && (s & 15) === 2 && h.cd === 6 && (v.cd === 8 || v.cd === 16)) {
                            f++;
                        }
                    }
                }
            }
            if ((t & 15) === 2) {
                if (g.bo.length === 1) {
                    a++;
                }
                o++;
            } else {
                if ((t & 15) === 3) {
                    m++;
                } else {
                    if ((t & 15) === 1 && h.cd === 8 && h.bo.length === 1) {
                        q++;
                    }
                }
            }
        }
        if (this.nbo_all(g) > 3) {
            g.hyb = HYB_SP3;
            continue
        }
        switch (g.cd) {
            case 6:
            case 14:
                if (m === 1 || (o === 2 && g.bo.length === 2)) {
                    g.hyb = HYB_SP1;
                } else {
                    if (q > 1) {
                        g.hyb = HYB_SP2;
                    } else {
                        if (o === 1) {
                            g.hyb = HYB_SP2;
                        } else {
                            g.hyb = HYB_SP3;
                        }
                    }
                }
                break;
            case 7:
                if (m === 1 || (o === 2 && g.bo.length === 2)) {
                    g.hyb = HYB_SP1;
                } else {
                    if (u >= 1) {
                        g.hyb = HYB_SP2;
                    } else {
                        if (o === 1) {
                            g.hyb = HYB_SP2;
                        } else {
                            g.hyb = HYB_SP3;
                        }
                    }
                }
                break;
            case 8:
                if (m === 1) {
                    g.hyb = HYB_SP1;
                } else {
                    if (l === 1 && g.bo.length === 1) {
                        g.hyb = HYB_SP2;
                    } else {
                        if (p >= 1) {
                            g.hyb = HYB_SP2;
                        } else {
                            if (o === 1) {
                                g.hyb = HYB_SP2;
                            } else {
                                g.hyb = HYB_SP3;
                            }
                        }
                    }
                }
                break;
            case 15:
            case 16:
                if (a === 1 && g.bo.length === 1) {
                    g.hyb = HYB_SP2;
                } else {
                    if (u >= 1 && g.bo.length === 2) {
                        g.hyb = HYB_SP2;
                    } else {
                        g.hyb = HYB_SP3;
                    }
                }
                break;
            default:
                g.hyb = 0;
            }
    }
};

Chemical.prototype.assignChirality = function() {
    var j = function(m) {
        var k, i, p, o, l;
        k = vector(m[0].pat, m[1].pat);
        i = vector(m[0].pat, m[2].pat);
        p = vector(m[0].pat, m[3].pat);
        o = vemul(k, i);
        l = scmul(o, p);
        return l;
    };
    var d = function(i) {
        return ((i & M_BO_DW) ? -1 : (i & M_BO_UP) ? 1 : 0);
    };
    for (var f = 0; f < this.atoms.length; f++) {
        var c = this.atoms[f];
        c.eo = 0;
        c.peo = 0;
        if (c.hyb !== 3 || c.bo.length <= 2 || this.nbo_all(c) !== 4) {
            continue;
        }
        var b = [];
        var a = 0;
        for (var e = 0; e < c.bo.length; e++) {
            b[b.length] = {pat: this.atoms[c.bo[e]], eo: c.ty[e] & (M_BO_UP | M_BO_DW), rng: c.ty[e] & M_RNG, nu: c.bo[e] + 1};
            a += b[e].eo;
        }
        b.sort(function(i, k) {
            return k.pat.ou - i.pat.ou;
        });
        var g = true;
        for (var e = 0; e < b.length - 1; e++) {
            if (b[e].pat.ou === b[e + 1].pat.ou) {
                g = false;
                break;
            }
        }
        if (!g) {
            continue;
        }
        if (a === 0) {
            c.eo = CHI_S | CHI_R;
            continue;
        }
        if (b.length === 3) {
            b[b.length] = {pat: c, eo: 0, rng: 0, nu: Number.MAX_VALUE};
        }
        if (true) {
            for (var e = 0; e < b.length; e++) {
                b[e].pat.z = 0.3 * d(b[e].eo);
            }
        }
        var h = j(b);
        c.eo = h < 0 ? CHI_S : CHI_R;
        b.sort(function(i, k) {
            return i.nu - k.nu;
        });
        var h = j(b);
        c.peo = h < 0 ? 2 : 1;
        if (true) {
            for (var e = 0; e < b.length; e++) {
                b[e].pat.z = 0;
            }
        }
    }
};

Chemical.prototype.assignCIP = function() {
    var b = new Array(this.atoms.length);
    for (var g = 0; g < this.atoms.length; g++) {
        this.atoms[g].ou = 0;
        b[g] = {pat: this.atoms[g], atnum: g, p: [this.atoms[g].cd], set: function(i) {
                this.p = [i];
                this.pat.ou = i;
            }, sort: function() {
                if (this.p.length > 2) {
                    var i = this.p.sub(1, this.p.length - 1);
                    i.sort(function(m, j) {
                        return j > m ? 1 : j < m ? -1 : 0;
                    });
                    i.unshift(this.p[0]);
                    this.p = i;
                }
            }};
    }
    b.sort(cmp_pri_lex);
    this.reassign_priorities(b, 0);
    var g, f, d;
    var c = this.atoms.length;
    do {
        var a, e, l;
        d = 100;
        do {
            l = num_uniq_cip(b);
            a = e = 0;
            while (a < c) {
                while (e < c && cmp_pri_lex(b[a], b[e]) === 0) {
                    e++;
                }
                if (e === c) {
                    e = c - 1;
                } else {
                    e--;
                }
                if (e !== a) {
                    for (g = a; g <= e; g++) {
                        var h = b[g].pat;
                        for (f = 0; f < h.bo.length; f++) {
                            var k = this.atoms[h.bo[f]];
                            if (k.cd === 1) {
                                continue;
                            }
                            switch (h.ty[f] & 15) {
                                case 3:
                                    b[g].p.push(k.ou);
                                case 2:
                                    b[g].p.push(k.ou);
                                    b[g].p.push(k.ou);
                                    break;
                                case 5:
                                case 6:
                                case 4:
                                    b[g].p.push(k.ou * 1.5);
                                    break;
                                default:
                                    b[g].p.push(k.ou);
                                }
                        }
                        b[g].sort();
                    }
                }
                a = e = e + 1;
            }
            b.sort(cmp_pri_lex);
            this.reassign_priorities(b, 0);
            if (l === num_uniq_cip(b)) {
                break;
            }
        } while (true);
        this.reassign_priorities(b, 0);
        break;
    } while (true)
};

Chemical.prototype.mapAtom = function(d) {
    var b = [];
    for (var a = 0; a < this.atoms.length; a++) {
        var c = d(this.atoms[a], a);
        if (c !== null) {
            b.push(c);
        }
    }
    return b;
};

Chemical.prototype.bondLength = function() {
    return this.bonds.length > 0 ? vectorLength(vesub(this.atoms[this.bonds[0].fr], this.atoms[this.bonds[0].to])) : 1.4;
};

Chemical.prototype.moveAtoms = function(b, c) {
    for (var a = 0; a < b.length; a++) {
        vecpy(this.atoms[b[a]], veadd(this.atoms[b[a]], c));
    }
};

Chemical.prototype.updateAtomSelection = function(d) {
    for (var b = 0; b < this.atoms.length; b++) {
        var a = this.atoms[b];
        if (testPolyInclusion(a, d)) {
            a.ms |= M_CE;
        } else {
            a.ms &= ~M_CE;
        }
    }
    for (var b = 0; b < this.bonds.length; b++) {
        var c = this.bonds[b];
        var a = vemulby(veadd(this.atoms[c.fr], this.atoms[c.to]), 0.5);
        if (testPolyInclusion(a, d)) {
            c.ms |= M_CE;
        } else {
            c.ms &= ~M_CE;
        }
    }
};

Chemical.prototype.rotateAtomsVector = function(d, g, e, f) {
    if (f !== -1 && d.length === 1) {
        vecpy(this.atoms[d[0]], this.atoms[f]);
        return;
    }
    if (d.length === 0) {
        return;
    }
    var c = vector(g, this.atoms[d[0]]);
    if (d.length === 1 && vectorLength(c) !== this.bondLength()) {
        c = vectorSetLength(c, this.bondLength());
        vecpy(this.atoms[d[0]], veadd(g, c));
    }
    var b = Math.acos(scmul(c, e) / (vectorLength(c) * vectorLength(e)));
    b = Math.round(b * TO_DEG / 12) * 12 * TO_RAD;
    this.rotateAtomsAround(d, g, b * vemulZSign(c, e));
};

Chemical.prototype.rotateAtomsAround = function(c, f, e) {
    var a = new WMatrix().rotateZAroundPoint(f.x, f.y, e);
    for (var b = 0; b < c.length; b++) {
        var d = a.map(this.atoms[c[b]]);
        this.atoms[c[b]].x = d.x;
        this.atoms[c[b]].y = d.y;
    }
    this.calcBox();
};

Chemical.prototype.setBondLength = function(c) {
    if (!this.bonds.length) {
        return;
    }
    var b = vectorLength(vector(this.atoms[this.bonds[0].fr], this.atoms[this.bonds[0].to]));
    if (Math.abs(1 - c / b) < 0.1) {
        return;
    }
    var a = c / b;
    this.atoms.forEach(function(d) {
        vecpy(d, vemulby(d, a));
    });
};

Chemical.prototype.expHydrogenToImp = function() {
    var a = [];
    for (var b = 0; b < this.atoms.length; b++) {
        if (typeof this.atoms[b].atts === "undefined") {
            this.atoms[b].atts = {};
        }
        if (typeof this.atoms[b].atts.H === "undefined") {
            this.atoms[b].atts.H = 0;
        }
        if (this.atoms[b].cd === 1) {
            a.push(b);
        }
    }
    for (var b = 0; b < this.bonds.length; b++) {
        var c = this.bonds[b];
        if (this.atoms[c.fr].cd === 1) {
            this.atoms[c.to].atts.H++;
        }
        if (this.atoms[c.to].cd === 1) {
            this.atoms[c.fr].atts.H++;
        }
    }
    this.removeAtoms(a);
    return this;
};

Chemical.prototype.apoFromSelection = function(a) {
    var e = [];
    var c = this;
    this.atoms.forEach(function(f) {
        f.ms &= ~M_WK;
    });
    this.bonds.forEach(function(f) {
        if (f.ms & M_CE) {
            c.atoms[f.fr].ms |= M_WK;
            c.atoms[f.to].ms |= M_WK;
        }
    });
    for (var b = 0; b < this.bonds.length; b++) {
        var d = this.bonds[b];
        if ((this.atoms[d.fr].ms & (M_CE | M_WK)) && !(this.atoms[d.to].ms & (M_CE | M_WK))) {
            e.push(d.fr);
        } else {
            if (!(this.atoms[d.fr].ms & (M_CE | M_WK)) && (this.atoms[d.to].ms & (M_CE | M_WK))) {
                e.push(d.to);
            }
        }
    }
    return e.sort(function(g, f) {
        return g - f;
    }).unique();
};

Chemical.prototype.makeAtom = function(a) {
    this.atoms.push({x: 0, y: 0, z: 0, cd: a, ms: 0});
    this.processChemical();
    return this;
};

Chemical.prototype.makeBond = function(b, a) {
    var c = 1.2;
    this.atoms = [];
    this.bonds = [];
    this.atoms.push({x: 0, y: 0, z: 0, cd: 6, ms: 0});
    this.atoms.push({x: c, y: 1.2 * Math.tan(b * TO_RAD), z: 0, cd: 6, ms: 0});
    this.bonds.push({fr: 0, to: 1, ty: a, ms: 0});
    this.processChemical();
    return this;
};

Chemical.prototype.makeMacroCycle = function(l) {
    var c = this.bonds.length ? vectorLength(vector(this.atoms[this.bonds[0].fr], this.atoms[this.bonds[0].to])) : 1.2;
    this.atoms = [];
    this.bonds = [];
    var e = 60 * TO_RAD;
    var k = 0;
    var j = {x: c, y: 0, z: 0};
    var b = {x: 0, y: 0, z: 0};
    var l = 32;
    if (l % 2 === 0) {
        sz = (l - 2) / 2;
    } else {
        sz = (l - 3) / 2;
    }
    var g = [];
    for (var f = 0; f < sz - 1; f++) {
        g.push((f % 2) ? -1 : 1);
    }
    g.push(g[g.length - 1]);
    g.push(0);
    g.push(g[g.length - 2]);
    g.push(g[g.length - 1]);
    for (var f = 0; f < sz - 3; f++) {
        g.push(-g[g.length - 1]);
    }
    for (var f = 0; f < l; f++) {
        var h = {x: b.x, y: b.y, z: b.z, cd: 6, ms: 0, bo: [], ty: []};
        this.atoms[this.atoms.length] = h;
        if (f) {
            this.bonds[this.bonds.length] = {fr: f - 1, to: f, ty: 1, ms: 0};
        }
        var d = new WMatrix().rotateZAroundPoint(0, 0, e * g[f % g.length]);
        vecpy(j, d.map(j));
        b = veadd(b, j);
    }
    this.processChemical();
    console.log(this.atoms.length);
    return this;
};

Chemical.prototype.makeRing = function(g, d) {
    var j = this.bonds.length ? vectorLength(vector(this.atoms[this.bonds[0].fr], this.atoms[this.bonds[0].to])) : 1.2;
    var c = Math.sin(Math.PI / g);
    var h = j / (2 * c);
    this.atoms = [];
    this.bonds = [];
    var f = 0;
    for (var e = 0; e < g; e++) {
        var b = {x: h * Math.sin(e * 2 * Math.PI / g), y: h * Math.cos(e * 2 * Math.PI / g), z: 0, cd: 6, ms: 0, bo: [], ty: []};
        this.atoms[this.atoms.length] = b;
        if (e) {
            this.bonds[this.bonds.length] = {fr: e - 1, to: e, ty: d ? f + 1 : 1, ms: 0};
            f = 1 - f;
        }
    }
    this.bonds.push({fr: 0, to: this.bonds.length, ty: d ? f + 1 : 1, ms: 0});
    this.processChemical();
    return this;
};

Chemical.prototype.atProp = function(a, c, b) {
    return typeof a.atts !== "undefined" && typeof a.atts[c] !== "undefined" && a.atts[c] ? a.atts[c] + 1 : 0;
};

Chemical.prototype.toMol = function() {
    var g;
    var k = new Date();
    var f = 0;
    var j = [7, 6, 6, 0, 3, 2, 1];
    g = sprintf("%s  MOLSOFT %02d%02d%02d%02d%02d2D\n\n", "\n", k.getMonth() + 1, k.getDate(), k.getFullYear() % 100, k.getHours(), k.getMinutes());
    g += sprintf("%3d%3d%3d  0%3d%3d  0  0  0  0999 V2000%s", this.atoms.length, this.bonds.length, 0, f, 0, "\n");
    for (var h = 0; h < this.atoms.length; h++) {
        var m = this.atoms[h];
        var e = ElementNames[m.cd];
        if (e.length === 1) {
            e += " ";
        }
        g += sprintf("%10.4f%10.4f%10.4f %-3s%2d%3d%3d%3d%s", m.x, m.y, 0, e, 0, j[(m.qfm < -3 ? 0 : m.qfm > 3 ? 0 : m.qfm) + 3], m.peo, this.atProp(m, "H", 0), "\n");
    }
    for (var h = 0; h < this.bonds.length; h++) {
        var l = this.bonds[h];
        var c = (l.ms & (M_BO_UP | M_BO_DW)) === M_BO_UP ? 1 : (l.ms & (M_BO_UP | M_BO_DW)) === M_BO_DW ? 6 : 0;
        g += sprintf("%3d%3d%3d%3d%s", l.fr + 1, l.to + 1, l.ty, c, "\n");
    }
    for (var h = 0; h < this.atoms.length; h++) {
        if (this.atoms[h].hasOwnProperty("atts")) {
            var m = this.atoms[h];
            var e = "";
            for (var d in m.atts) {
                if (m.atts.hasOwnProperty(d)) {
                    if (e.length) {
                        e += ";";
                    }
                    e += d + m.atts[d];
                }
            }
            if (e.length) {
                g += sprintf("M  ZLS %d [%s;%s]\n", h + 1, ElementNames[m.cd], e);
            }
        }
    }
    g += "M  END\n";
    return g;
};

Chemical.prototype.parseMol = function(e) {
    var o = [];
    var f = [];
    var s = e.split("\n");
    if (s.length > 4) {
        var c = parseInt(s[3].substring(0, 3));
        var q = parseInt(s[3].substring(3, 6));
        var l = 4;
        for (var g = 0; g < c; g++) {
            o[o.length] = {x: parseFloat(s[l + g].substring(0, 10)), y: parseFloat(s[l + g].substring(10, 20)), z: parseFloat(s[l + g].substring(20, 30)), cd: Elements[s[l + g].substring(31, 33).replace(/\s+$/, "")], ms: 0, bo: [], ty: []};
        }
        l += c;
        for (var g = 0; g < q; g++) {
            f[f.length] = {fr: parseInt(s[l + g].substring(0, 3)) - 1, to: parseInt(s[l + g].substring(3, 6)) - 1, ty: parseInt(s[l + g].substring(6, 9)), ms: 0};
            var a = parseInt(s[l + g].substring(9, 12));
            if (a === 1) {
                f[f.length - 1].ms |= M_BO_UP;
            } else {
                if (a === 6) {
                    f[f.length - 1].ms |= M_BO_DW;
                }
            }
        }
        l += q;
        g = 0;
        for (var g = 0; l + g < s.length && s[l + g].match(/M  ZLS/); g++) {
            var b = s[l + g].substring(7).split(/[ ]+/g);
            for (var d = 0; d < b.length; d++) {
                var m = parseInt(b[d]) - 1;
                if (m < 0 || m >= o.length) {
                    continue
                }
                var k = {};
                var p = /([^\[\];]+);?/g;
                var h = p.exec(b[d + 1]);
                do {
                    if (h[1] in Elements) {
                        o[m].cd = Elements[h[1]];
                    } else {
                        if (h[1].match(/[DHR][0-9]+/)) {
                            k[h[1].substring(0, 1)] = parseInt(h[1].substring(1));
                        }
                    }
                    h = p.exec(b[d + 1]);
                } while(h);
                if (k.count() > 0) {
                    o[m].atts = k;
                }
            }
        }
    }
    this.atoms = o;
    this.bonds = f;
    this.setBondLength(1.2);
    this.processChemical();
    return this;
};

Chemical.prototype.getSmiles = function() {
    var b = this.toMol();
    var a = getXMLObject(false);
    a.open("GET", sprintf("http://mars.molsoft.com/cgi-bin/conv2d3d.cgi?mol=%s&toSmiles=1", encodeURIComponent(b)), false);
    a.send();
    return a.responseText;
};

Chemical.prototype.toSmiles = function(d) {
    var c = this.toMol();
    var b = getXMLObject(true);
    var a = this;
    b.onload = function(f) {
        d(b.responseText);
    };
    b.open("GET", sprintf("http://mars.molsoft.com/cgi-bin/conv2d3d.cgi?mol=%s&toSmiles=1", encodeURIComponent(c)));
    b.send();
};

Chemical.prototype.parseSmiles = function(a, d) {
    var c = getXMLObject(true);
    var b = this;
    c.onload = function(f) {
        b.parseMol(c.responseText);
        if (typeof d === "function") {
            d();
        }
    };
    c.open("GET", sprintf("http://mars.molsoft.com/cgi-bin/conv2d3d.cgi?smi=%s&2D=1", encodeURIComponent(a)));
    c.send();
};

Chemical.prototype.assignCoordinates = function(d) {
    var b = getXMLObject(true);
    var a = this;
    var c = this.toMol();
    b.onload = function(f) {
        a.parseMol(b.responseText);
        if (typeof d === "function") {
            d();
        }
    };
    b.open("GET", sprintf("http://mars.molsoft.com/cgi-bin/conv2d3d.cgi?mol=%s&2D=1", encodeURIComponent(c)));
    b.send();
};

Chemical.prototype.parseString = function(b, a) {
    if (b.indexOf("M  END") !== -1) {
        this.parseMol(b);
        if (typeof a === "function") {
            a();
        }
    } else {
        this.parseSmiles(b, a);
    }
};

Chemical.prototype.removeAtoms = function(c) {
    var a = new Array(this.atoms.length);
    for (var b = 0; b < c.length; b++) {
        a[c[b]] = -1;
    }
    var d = 0;
    for (var b = 0; b < a.length; b++) {
        if (a[b] !== -1) {
            a[b] = d++;
        }
    }
    for (var b = 0; b < this.bonds.length; ) {
        if (a[this.bonds[b].fr] === -1 || a[this.bonds[b].to] === -1) {
            this.bonds.splice(b, 1);
        } else {
            this.bonds[b].fr = a[this.bonds[b].fr];
            this.bonds[b].to = a[this.bonds[b].to];
            b++;
        }
    }
    c.sort(function(f, e) {
        return f - e;
    });
    for (var b = c.length - 1; b >= 0; b--) {
        this.atoms.splice(c[b], 1);
    }
    this.processChemical();
};

Chemical.prototype.removeBonds = function(b) {
    b.sort(function(d, c) {
        return d - c;
    });
    for (var a = b.length - 1; a >= 0; a--) {
        this.bonds.splice(b[a], 1);
    }
    this.processChemical();
};

Chemical.prototype.findClosestBond = function(d) {
    var c = -1;
    for (var b = 0; b < this.bonds.length; b++) {
        var a = vemulby(veadd(this.atoms[this.bonds[b].fr], this.atoms[this.bonds[b].to]), 0.5);
        if (vectorLength(vector(a, d)) <= 0.5) {
            c = b;
            break
        }
    }
    return c;
};

Chemical.prototype.findClosestAtom = function(c) {
    var a = -1;
    for (var b = 0; b < this.atoms.length; b++) {
        if (vectorLength(vector(this.atoms[b], c)) <= 0.5) {
            a = b;
            break
        }
    }
    return a;
};

Chemical.prototype.getSelectedAtoms = function(a) {
    var c = [];
    for (var b = 0; b < this.atoms.length; b++) {
        if (this.atoms[b].ms & a) {
            c.push(b);
        }
    }
    return c;
};

Chemical.prototype.findClosestAtomLong = function(e) {
    if (this.atoms.length === 0) {
        return -1;
    }
    var b = 0;
    var f = vectorLength(vector(this.atoms[0], e));
    var c;
    for (var a = 1; a < this.atoms.length; a++) {
        c = vectorLength(vector(this.atoms[a], e));
        if (c < f) {
            f = c;
            b = a;
        }
    }
    return b;
};

Chemical.prototype.hasCollisions = function(b) {
    for (var a = 0; a < this.atoms.length; a++) {
        if (a !== b && vectorLength(vector(this.atoms[b], this.atoms[a])) <= 0.2) {
            return true;
        }
    }
    return false;
};

Chemical.prototype.gravitateCollisions = function() {
    var d = [];
    var a = new Array(this.atoms.length);
    a.fill(-1);
    for (var c = 0; c < this.atoms.length; c++) {
        for (var b = c + 1; b < this.atoms.length; b++) {
            if (vectorLength(vector(this.atoms[c], this.atoms[b])) <= 0.2) {
                a[b] = c;
                d.push(b);
            }
        }
    }
    if (d.length > 0) {
        d.sort(function(g, f) {
            return g - f;
        });
        var e = [];
        var b = 0;
        for (var c = 0; c < this.atoms.length; c++) {
            if (a[c] === -1) {
                e[c] = b++;
            }
        }
        for (var c = 0; c < this.bonds.length; c++) {
            if (a[this.bonds[c].fr] !== -1) {
                if (a[this.bonds[c].to] !== -1) {
                    this.bonds.splice(c, 1);
                    c--;
                } else {
                    this.bonds[c].fr = e[a[this.bonds[c].fr]];
                    this.bonds[c].to = e[this.bonds[c].to];
                }
            } else {
                if (a[this.bonds[c].to] !== -1) {
                    this.bonds[c].to = e[a[this.bonds[c].to]];
                    this.bonds[c].fr = e[this.bonds[c].fr];
                } else {
                    this.bonds[c].to = e[this.bonds[c].to];
                    this.bonds[c].fr = e[this.bonds[c].fr];
                }
            }
        }
        for (var c = d.length - 1; c >= 0; c--) {
            this.atoms.splice(d[c], 1);
        }
        this.processChemical();
        return true;
    }
    return false;
};

Chemical.prototype.bondToggle = function(f, a) {
    var h = this.bonds[f];
    var d = h.ms;
    h.ms &= ~(M_BO_UP | M_BO_DW);
    if (a === 4) {
        h.ty = 1;
        if (d & M_BO_UP) {
            h.ms |= M_BO_DW;
        } else {
            h.ms |= M_BO_UP;
        }
        var c = this.atoms[h.fr];
        var b = this.atoms[h.to];
        if (c.bo.length === 1 && b.bo.length > 1) {
            var e = h.fr;
            h.fr = h.to;
            h.to = e;
        } else {
            if (!c.eo && b.eo) {
                var e = h.fr;
                h.fr = h.to;
                h.to = e;
            }
        }
    } else {
        if ((a === -1 || a === 1) && !(d & (M_BO_UP | M_BO_DW))) {
            var g = 2;
            if (!(this.atoms[h.fr].ms & M_RNG) && !(this.atoms[h.to].ms & M_RNG) && this.atoms[h.fr].bo.length <= 2 && this.atoms[h.to].bo.length <= 2) {
                g = 3;
            }
            h.ty = h.ty % g + 1;
        } else {
            h.ty = a;
        }
    }
    this.processChemical();
};

Chemical.prototype.chargeAtom = function(b) {
    var a = this.atoms[b];
    if (typeof a.tmp === "undefined") {
        a.tmp = 0;
    } else {
        a.tmp = (a.tmp + 1) % 5;
    }
    switch (a.tmp) {
        case 0:
        case 1:
            a.ms |= M_EXPLICT_QFM;
            a.qfm = (a.tmp + 1);
            break;
        case 2:
            a.ms &= ~M_EXPLICT_QFM;
            a.qfm = this.calc_qfm(a);
            break;
        case 3:
        case 4:
            a.ms |= M_EXPLICT_QFM;
            var c = a.tmp - 2;
            if (c > this.V(a) - a.conn) {
                a.tmp += c - this.V(a) + a.conn - 1;
                c = this.V(a) - a.conn;
            }
            a.qfm = -c;
            break;
        }
};

Chemical.prototype.changeAtom = function(b, c, d) {
    var a = this.atoms[b];
    if (c !== -1) {
        a.cd = c;
    }
    a.atts = d;
    this.processChemical();
};

Chemical.prototype.neibVector2 = function(a, b) {
    var d = vector(a, this.atoms[a.bo[0]]);
    var c = vector(a, this.atoms[a.bo[1]]);
    return vectorSetLength(vemulby(veadd(d, c), b), vectorLength(d));
};

Chemical.prototype.bondOrtho = function(c, b, d, h) {
    var j = this.atoms[c];
    var g = this.atoms[b];
    if ((j.bo.length === 1 && g.bo.length === 1) || d === 3) {
        var m = vectorSetLength(vector(j, g), h);
        return{x: -m.y, y: m.x, z: 0};
    } else {
        var a = -1;
        if (j.bo.length > 1) {
            for (var e = 0; e < j.bo.length; e++) {
                if (j.bo[e] !== b && this.atomsInTheSameRing(j.bo[e], b)) {
                    a = j.bo[e];
                    break
                }
            }
            if (a === -1) {
                for (var e = 0; e < j.bo.length; e++) {
                    if (j.bo[e] !== b) {
                        a = j.bo[e];
                        break
                    }
                }
            }
        } else {
            for (var e = 0; e < g.bo.length; e++) {
                if (g.bo[e] !== c && this.atomsInTheSameRing(g.bo[e], c)) {
                    a = g.bo[e];
                    break
                }
            }
            if (a === -1) {
                for (var e = 0; e < g.bo.length; e++) {
                    if (g.bo[e] !== c) {
                        a = g.bo[e];
                        break
                    }
                }
            }
        }
        var f = this.atoms[a];
        var l = vector(j, g);
        var k = vector(g, f);
        var m = vemul(vemul(l, k), l);
        return vectorSetLength(m, h);
    }
};

Chemical.prototype.placeFragment = function(f, e) {
    var a = this;
    e = e.clone();
    var b = vesub(f, e.centerPoint());
    var c = this.atoms.length;
    e.atoms.forEach(function(d) {
        vecpy(d, veadd(d, b));
        a.atoms.push(d);
    });
    e.bonds.forEach(function(d) {
        a.bonds.push({fr: d.fr + c, to: d.to + c, ty: d.ty, ms: 0});
    });
    this.processChemical();
};

Chemical.prototype.connectToBond = function(u, q) {
    var g = this;
    var b = this.bonds[u];
    var v = 0;
    var h = q.atoms.length === 6 && (q.atoms[0].ms & M_AR);
    q = q.clone();
    if (h) {
        for (var f = 0; f < q.bonds.length; f++) {
            if (q.bonds[f].ty === b.ty) {
                v = f;
                break
            }
        }
        if ((b.ms & M_AR) && q.bonds[v].ty === 1) {
            var s = 0;
            for (var f = 1; f <= 5; f++) {
                q.bonds[(v + f) % q.bonds.length].ty = s + 1;
                s = 1 - s;
            }
        }
    }
    var p = q.bonds[v];
    var l = vemulby(this.bondOrtho(b.fr, b.to, 1, 1), -1);
    var o = vemulby(veadd(this.atoms[b.fr], this.atoms[b.to]), 0.5);
    var k = q.bondOrtho(p.fr, p.to, 1, 1);
    var m = vemulby(veadd(q.atoms[p.fr], q.atoms[p.to]), 0.5);
    var e = Math.acos(scmul(l, k) / (vectorLength(l) * vectorLength(k))) * vemulZSign(k, l);
    var j = vesub(o, m);
    var a = new WMatrix().rotateZAroundPoint(o.x, o.y, e);
    var c = this.atoms.length;
    q.atoms.forEach(function(d) {
        vecpy(d, a.map(veadd(d, j)));
        g.atoms.push(d.clone());
    });
    q.bonds.forEach(function(d) {
        g.bonds.push({fr: d.fr + c, to: d.to + c, ty: d.ty, ms: 0});
    });
    if (!this.gravitateCollisions()) {
        this.processChemical();
    }
};

Chemical.prototype.chainTo = function(m, f, h, g) {
    var j = this;
    var d = this.atoms[m];
    var e = vector(d, g);
    var b = null;
    var k;
    if (d.bo.length === 0) {
        var o = {x: 1.2, y: 0, z: 0};
        var l = Math.acos(scmul(o, e) / (vectorLength(o) * vectorLength(e))) * vemulZSign(o, e);
        l = Math.round(l * TO_DEG / 12) * 12 * TO_RAD;
        o.x = 1.2 * Math.cos(l);
        o.y = 1.2 * Math.sin(l);
        k = veadd(d, o);
    } else {
        var i = this.atoms[d.bo[0]];
        var o = vector(i, d);
        k = veadd(d, o);
        k = (new WMatrix().rotateZAroundPoint(d.x, d.y, -vemulZSign(o, vector(g, i)) * Math.PI / 3)).map(k);
    }
    var c = {x: k.x, y: k.y, z: 0, cd: 6, bo: [], ty: []};
    this.atoms.push(c);
    this.bonds.push({fr: m, to: this.atoms.length - 1, ty: f, ms: 0});
    this.processChemical();
    return this.atoms.length - 1;
};

Chemical.prototype.connectTo = function(q, K, c, w) {
    var o = this;
    var u = this.atoms[q];
    var H = null;
    if (K === 3 && u.bo.length !== 1) {
        return[];
    }
    var h = null;
    if (c !== null) {
        c = c.clone();
        h = c.atoms[w];
        if (u.bo.length === 2 && h.bo.length === 2) {
            H = veadd(h, c.neibVector2(h, -1));
            h = {x: H.x, y: H.y, z: 0, cd: 6, bo: [], ty: []};
            c.atoms.push(h);
            c.bonds.push({fr: w, to: c.atoms.length - 1, ty: 1, ms: 0});
            w = c.atoms.length - 1;
            c.calcConnectivity();
            h = c.atoms[w];
        }
        var x;
        switch (u.bo.length) {
            case 0:
                x = {x: 1.2, y: 0, z: 0};
                break;
            case 1:
                x = vector(u, this.atoms[u.bo[0]]);
                break;
            case 2:
                x = this.neibVector2(u, -1);
                break;
            default:
                return[];
        }
        var p;
        switch (h.bo.length) {
            case 0:
                p = {x: 1.2, y: 0, z: 0};
                break;
            case 1:
                p = vector(h, c.atoms[h.bo[0]]);
                break;
            case 2:
                p = c.neibVector2(h, -1);
                break;
            default:
                return[];
        }
        var I = Math.acos(scmul(p, x) / (vectorLength(p) * vectorLength(x))) * vemulZSign(p, x);
        var g = [];
        var J = vesub(u, h);
        var y = new WMatrix().rotateZAroundPoint(u.x, u.y, I);
        var B = this.atoms.length;
        var C = [], F = 0;
        c.atoms.forEach(function(a) {
            vecpy(a, y.map(veadd(a, J)));
            if (a !== h) {
                C[F] = B;
                g.push(B++);
                o.atoms.push(a.clone());
            } else {
                C[F] = q;
            }
            F++;
        });
        c.bonds.forEach(function(a) {
            o.bonds.push({fr: C[a.fr], to: C[a.to], ty: a.ty, ms: 0});
        });
        this.processChemical();
        return g;
    }
    switch (u.bo.length) {
        case 0:
            H = veadd(u, {x: 1.2, y: 0, z: 0});
            break;
        case 1:
            var b = this.atoms[u.bo[0]];
            var p = vector(b, u);
            if (K === 3 || (K === 2 && u.ty[0] === 2)) {
                H = veadd(u, p);
            } else {
                if (b.bo.length === 2) {
                    var F = b.bo[0] === q ? b.bo[1] : b.bo[0];
                    H = veadd(u, vector(this.atoms[F], b));
                } else {
                    H = veadd(u, p);
                    H = (new WMatrix().rotateZAroundPoint(u.x, u.y, Math.PI / 3)).map(H);
                }
            }
            break;
        case 2:
            var f = vector(u, this.atoms[u.bo[0]]);
            var e = vector(u, this.atoms[u.bo[1]]);
            H = veadd(u, vectorSetLength(vemulby(veadd(f, e), -1), vectorLength(f)));
            break;
        default:
            var O = 0;
            var t = -1, G = -1;
            for (var F = 0; F < u.bo.length; F++) {
                var f = vector(u, this.atoms[u.bo[F]]);
                for (var E = 0; E < u.bo.length; E++) {
                    if (F !== E) {
                        var e = vector(u, this.atoms[u.bo[E]]);
                        var L = Math.acos(scmul(f, e) / (vectorLength(f) * vectorLength(e)));
                        var p = veadd(f, e);
                        var s = true;
                        for (var D = 0; D < u.bo.length; D++) {
                            if (D !== F && D !== E) {
                                var A = vector(u, this.atoms[u.bo[D]]);
                                var N = Math.acos(scmul(f, A) / (vectorLength(f) * vectorLength(A)));
                                var M = Math.acos(scmul(e, A) / (vectorLength(e) * vectorLength(A)));
                                if (Math.abs((N + M) - L) <= 0.001) {
                                    s = false;
                                    break
                                }
                            }
                        }
                        if (!s) {
                            continue
                        }
                        if (L > O) {
                            O = L;
                            t = F;
                            G = E;
                        }
                    }
                }
            }
            if (t !== -1 && G !== -1) {
                var f = vector(u, this.atoms[u.bo[t]]);
                var e = vector(u, this.atoms[u.bo[G]]);
                H = veadd(u, vectorSetLength(veadd(f, e), vectorLength(f)));
            }
            break
    }
    if (H !== null) {
        var l = {x: H.x, y: H.y, z: 0, cd: 6, bo: [], ty: []};
        this.atoms.push(l);
        var z = 0;
        if (K === 4) {
            K = 1;
            z = M_BO_UP;
        }
        this.bonds.push({fr: q, to: this.atoms.length - 1, ty: K, ms: z});
        this.processChemical();
        return[this.atoms.length - 1];
    }
    return[];
};
function ChemicalView(w, y, H, F) {
    var v = this;
    pm_eraser = "data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIjjI+pywkPG3BsorfsmXpTfH1dMHKl6EARGF5su42xKjf2jRQAOw==";
    pm_sel_lasso = "data:image/gif;base64,R0lGODlhGAAYAPECAAAAANDQ0P///wAAACH5BAEAAAMALAAAAAAYABgAAAJvnG+hiu2pgFzvBTkxq+cCGn1cMjlRwHmoJVbXysKN6pbmOy+2ueta+oF5AKNOa6BCLWSIl25AJO2akwuy9arKQpjqRyJICpc+5UcQ1qZWETR6WDQG3GnmGkA/xq/zt754cma1J/USRkhiNki4wVcAADs=";
    pm_search = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAQCAYAAACr+QluAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAuNJREFUWEftltuNEzEUhgcWEFokIOKywBNSeELAC1lx1YK4hQ5SQ1pIB+kgHaSCVJAG0kA6SA/D/83MP+s49qzCZYVWe6RvMj62T45/2ycpyrK8JEH9OLUj8Vp8Ep/FO9EX18WOxcFguVyWo9GIoBW9Xq8cj8fler1W9+7484b8yIvPuC+kfhTFFfFM/BAn4qV4Lt6IoRiIm2LL4mD+0tlsVm42G7nKAkEQCoH+B3H2FeaR+C4Q4BaOxq4JTgziIBYCthYHQ4DhcKjXbT8iMXw6ne70nTf7CuPrc0gjYa/EV3G7ajUWB0OUwWCg121/CsTiinGSCMW81WqlrtMxJB9eS8YsFot2DELjn0wmbT/+VGzPszCcavy8My7etPpRi/KCl4w9FFwzTlZrYSBwogg0n8/b65TCIvp6kShzLQ5+2vhpe7H4PMffh3i0PZe4qdiIYmEQw6eGXN1PG+pHXWipKTm7LxDmcdVqzEFCvHuGBFlAKBK7R1+YCCCWF0mcfr9fvRsvyvMsTBjHsXP1zDGIH/rxhafGTn59KLRXaSSMOvNN3KtajTlIDCKwC+wwi2NoWHy9II83+BnnNnFYKH4Ecyxie3wcB18saEgsrsHH3LbdOF1g+YytJ7hqO8I5yFl4FxGKtheUgzFcC0RikYjCdfCR9wJywqR+AMy+wtwQx4LrQqHl/wzXB6EQhdPyXnQW3y5I1gmTQNeuAmJwDUOfF3WWMH/zxGD8T+En+YtAIECQt+Jj874ljoMAO4zL1T8GUXxivPNxHaDfYjA+TBRcRLuEycU2vyOMjYVTZJ8IasqB4PTwx4//OohzR7RBDQvj+JOci63rDbsYJpv75bCwrk/ux09sxnQJA3FsRHBefyJMzkJxPoi7DhLCAtlt9VeQEIuMdxDBLCTjECE8bfRznRyHdxbDOOYxJieMY3suc8iLvn8hDPZAIM5PwZlvA1806sd+xsmhUD+Ng10kks5LyuIXVdfukM2kDqcAAAAASUVORK5CYII=";
    pm_sel_rect = "data:image/gif;base64,R0lGODlhGAAYAPECAAAAAKCgpP///wAAACH5BAEAAAMALAAAAAAYABgAAAJejI85yxwAo4yh2ZcyqNbt7nEgBi5keY4fuqpil8Kt/F6zXTcxPh6leQNCcqGMYTM0yCYUiOCxUTqMSozgmZT+BsfrFRp0ebHEHmAc/lm/abN1t4W+2zwM/SKCb2GMAgA7";
    pm_cent = "data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIujA+Zx7b8IIpABlov0k3n7zxg9SmjFyoOWqrseokw2aFzFsO6y0F4WEtFgsRAAQA7";
    pm_undo = "data:image/gif;base64,R0lGODlhEAAQAPYAAAAAAAcDBwgAAA4GBhYBBRsCAhQTEhYTEhoXFR4dGyANDignJC8sIysqJzc0JTMyKTw5LDMzMzo5Mj08OEM/L0E7N0pGNFRPOEhFQExJRFNQS2ZHS2lKTmBSTGZXUHFqRmFgWW9gW3BvZnBqaXl4b3p5cIZ9dJOKXIaEe4mHfberdJORhpaUiZuajqGfk6Wjl6ilmaqonK2rnrOwo7i2qby5rL67rs7BhOrbl+3enPblmPTkncjFt8rHucvIus/Nvv/vpv3utf/zvdXSw9jVxdrYyNvZywAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEcALAAAAAAQABAAAAe/gEeCg4SFhoJGPzU9P0SHgh4TApMdM46FRpIvMS8pABEmP4UTBSYwMTU0MBgCLoo+PCMECjM1NT8+PywAFTUOFBAOAQEPEiU+REU+GwIoCSpBQTk3Jww1PkVHRhwCJTQNOEJBOxApPT1G2hwAID8pH0A6FygtQ0OCRQYAIkczCycWSKAyku4IggANWBwhQoOBBhQ97glCYGBACBeCfqBYISOiIA0ZJnhoQWPQEB4+CgrqQUMGDR+EVJr8Ye+RzUAAOw==";
    pm_undo_disabled = "data:image/gif;base64,R0lGODlhEAAQAPUAAEBAQEFBQUJCQkRERElJSUpKSkxMTE5OTlNTU1VVVVZWVlhYWFlZWVxcXF5eXl9fX2JiYmRkZGdnZ2hoaGpqamtra21tbXBwcHJycnR0dHZ2dnd3d3t7e3x8fH9/f4KCgoODg4iIiImJiYyMjI+Pj5GRkZKSkpOTk5SUlJWVlZeXl5qampycnJ2dnZ+fn6KioqOjo6ampqioqKqqqqurq6ysrK2trbCwsLW1tba2tri4uAAAAAAAAAAAAAAAAAAAACH5BAEAADsALAAAAAAQABAAAAafwJ1wSCwahbMYCxabHYWWh2BKQTmLM6lp+xEwPLHiY/DZslamiICkhMEyAgJqxYoxRYLHivF4MAQDfB4wMzYxah8HKDg4NiwgCiuEOzMUAhwrCjY6ODcMH242OzaWFjEgGJ0RH2xXMwQCGTuZHxEeJis2ojuwCiKUmauTQgQEAxgkQjEfIChNQhQQDxYkK0MzoUQwK3MwRLtESTNXT0dBADs=";
    pm_redo = "data:image/gif;base64,R0lGODlhEAAQAPYAAAAAAAYCBwgAAA0FBRcCBhsCAh8MDRYTEhwZFx4dGyooHCgnJC8sIyopJjYzJTMyKTw5KzMzMzo5MkE9LEM/L0E7N0A/OkpGNFVPOEhFQEtIQ1RSSmdITGxMUGdZUm5fWnFqRmZlXXJsanl3b3l4b358cYV8c5SKWoWEeraqc42LgZKQhZaUiZuZjaKglKSilqimmqyqnrOwo7Wzpri2qby5rL27rc3AhOrbl+zdnPfmmcjFt8vIus/Nvv/vpvzttP/zvdLPwNXSw9jVxdrYyNvZywAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEYALAAAAAAQABAAAAe+gEaCg4SFhEM9PDY9RIaDQzIbApMWHo5BJREAKC4wLwIWhUEuAhkwNDYxMCYFoYM2FQAsiUE2NjIGBCI8iigCHDxEQzwlEg8BAQ4QFBMkAh2NRDs2Cic3OT8/KQkhAB2CRDw7KBM6P0A4CzMiAAeNRkJCLSUYOj4gKj0sDQMIgkVEbMAYceHEAhlGXIQYcMCfoCA8UGxgQGOIkRktQkjQsEHQsBgrUAQRxINGjBk8CBURJ+RQjx4WC71zRHNQIAA7";
    pm_redo_disabled = "data:image/gif;base64,R0lGODlhEAAQAPUAAEBAQEFBQUJCQkNDQ0RERElJSUpKSk1NTU5OTlNTU1RUVFZWVlhYWFlZWVxcXF5eXl9fX2JiYmRkZGdnZ2lpaWtra25ubnFxcXJycnR0dHd3d3t7e319fX9/f4GBgYSEhIWFhYeHh4mJiYyMjI+Pj5CQkJKSkpOTk5SUlJeXl5mZmZqampycnJ2dnZ6enqKioqOjo6ampqenp6ioqKqqqqurq6ysrK2trbGxsbW1tbi4uAAAAAAAAAAAAAAAAAAAACH5BAEAADsALAAAAAAQABAAAAaewJ1wSCwSaTJYS0YzDmmpSWAasThlnAbAQyqRAo+i7BsprVqpEocQIbYeAFFS1mqtCgRNsuUJUJhIHA8NUw0Phxt+Nzs0MCsKHi03OTklCBh+Qo0wHg84OTo0CSuJBU07TCQcE58aHjIiCQQIQjc0KyUbER6jOySYBbRCSR4UCitNKyIYDRMTmjApIB6njikrMEcwMKeaSd1Di07jREEAOw==";
    pm_rs = "data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIrhB+pe71vVHwS1GRhy4FX13lYhojjZ20hupnYSkHhFHcjQtF3nbs3GGsFCgA7";
    pm_rs2 = "data:image/gif;base64,R0lGODlhEAAQAPAAADw8PAAAACH5BAEAAAEAIf4RQ3JlYXRlZCB3aXRoIEdJTVAALAAAAAAQABAAAAImhB+pe71vVHwSVFodTm3uiXwWNwadWSJdiXlbxr7ny7i0Xc/tWQAAOw==";
    pm_benzene = "data:image/gif;base64,R0lGODlhFgAWAPYAADExMT4+PkREREVFRUZGRkhISElJSU1NTU5OTk9PT1ZWVlhYWFlZWV1dXV5eXl9eXl9fX25ubm9vb3Nzc3R0dHZ2dnd3d3t7e3x8fICAgIGBgYaGhoeHh4mJiYqKiYqKiouKipKSkZSUlJWVlZmYmJ2dnJ6enaKioaOioqSjo6enpqenp6iop6moqKqpqbOzsrS0s7u7usDAv8HBwMXFxMbFxcrJycvKyszLy9PS0dPT0tTT0tTT09TU09XU09bV1dfW1uvq6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEIAIf4RQ3JlYXRlZCB3aXRoIEdJTVAALAAAAAAWABYAAAfRgEKCg4SFhoeEODiIjEI8GAYGGDyNg0AyHQQLKioLBCAyP4wjEAAQJYQlD6YjhT4sCQkdNKJCGhQ0QT80HbErPoIxARs5hS4SACEkgjwbATHBADeIMQkECidCNwDQQjHSQhYpiBsv2tzRi7KV293f6h3s6N4A8JU289/TChvy7uAUsh3qAOPcv2mHql3L1i7YMEqEXExItsyRs24/YMmiAUSQhgm5gNAAoSDBimKEQpQ6lWpVgxCMgMwAoYmTpw4zIFbiccFAAQzAKhlSJLTooUAAOw==";
    pm_r3 = "data:image/gif;base64,R0lGODlhFgAWAPUAACQkJCUlJTExMTw8PEREREVFRUhISExMTE5OTk9PT1FRUVJRUVJSUlVVVVZWVldXV2tra2xra2xsbG1tbG5ubXNzc3R0dHt6ent7e4GBgYKCgoqKiYuLipiYmJmYmJmZmZqamqCfn6GgoKampqmpqKqqqbu6ur++vsDAv8HBwMLBwcPDw8XFxMfGxsfHxsjHx8jIx9HR0NLR0dTT0tXU09fW1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAADYAIf4RQ3JlYXRlZCB3aXRoIEdJTVAALAAAAAAWABYAAAaCQJtwSCwajSvacUlcBRwvJhMlwBgw0iMVNYpYSFkilSWcIBKysG08RG0WnTCb2Ck44lMB2ZiBw5ZzRjIHCCZaekw1IQMRRoFGNSIDE46IRzIIhYd7RX0dnEWPNnUPeICWNisccHKWEwsIaa0rIxMVYGo2J1UFF7lDKwBQv02yxMdCQQA7";
    pm_r4 = "data:image/gif;base64,R0lGODlhFgAWAPQAABwcHB0dHR8fHyAgIDExMVlZWXt7e35+fra2tre3t7u7ur++vsTEw8XFxMrJycvKys7NzQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEAIf4RQ3JlYXRlZCB3aXRoIEdJTVAALAAAAAAWABYAAAVnYCSOZGmeaAopbOu+LSQqAWHfeE4Aykwkj6BwOEwQehEF4ZEqPY4+ZnP0RCql00g1mhVtk8uuFgrGTr9XsYOc7qLDbjY8+zY362J83EpoiBlsAwWDhIWGBQFICwcGjY6PkAYHC2IpIQA7";
    pm_r5 = "data:image/gif;base64,R0lGODlhFgAWAPUAADExMUBAQEFAQEJCQkNCQkREREZGRkhISElJSU5OTk9PT1NTU1ZWVVdWVlhYWFlZWVxbW15eXl9eXl9fX2BgYGVlZWZmZmxsbHt7e3x8fH9/f4CAgIODg4SDg4WEhIuKipOTk5mYmJ2dnJ6enaenpqiop6+urrCvr7Szs7S0tLW0tLu7usDAv8HBwMXFxMbFxcnJyMvKyszLy9DPztHQz9PT0tTT09XV1NbV1dfW1gAAAAAAAAAAAAAAAAAAAAAAACH5BAEAADoAIf4RQ3JlYXRlZCB3aXRoIEdJTVAALAAAAAAWABYAAAabQJ1wSCwaj8hkcrVSIm0UAIBicw5hH0NHBuMYPjBniiAREUWTQQr5mihOOCPulJi8ih6AZp1EaQAdQiQPFS1WQi0VDyUXCIdFCBcgCzOPQjMLIDogDHGHOAyaOjIIJI8lCDJDGQ+PDxhFFR5WHhVGLAB3SS8AhkYcE0oTGkgoCSjFCnxHJgMhz9DPAydKOBADAwbZ2gYPnpbg4EEAOw==";
    pm_r6 = "data:image/gif;base64,R0lGODlhFgAWAPUAADExMT4+PkZGRkhISElJSU5OTk9PT1hYWFlZWV1dXV5eXl9eXl9fX3t7e3x8fIaGhoeHh4mJiYqKiouKipSUlJWVlZ2dnJ6enaenpqenp6iop7u7usDAv8HBwMXFxMbFxcrJycvKyszLy9PS0dPT0tTT0tTT09TU09XU09bV1dfW1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACsAIf4RQ3JlYXRlZCB3aXRoIEdJTVAALAAAAAAWABYAAAaVwJVwSCwaj0SRCMlcmRwEgsPUHKo4EcEBgzkIJpwUs8IAMCxES5lRKaI0BkPEIy6mPJE4BiXcBB4jVU4PARt9ACGCQiEAhisbiIorjI6QiYqUh5eCmY+RiiCNmpKdlqSinptVpX98VSaEjilwcnRGKh4TeoFEFGULaEMWC2ZtSCodE1pcXhEddVUjDVEO0JIrIqrXikEAOw==";
    pm_r7 = "data:image/gif;base64,R0lGODlhFgAWAPYAACIiIjExMTs7Oz09PT4+PkREREVFRUZGRkdHR0lJSU5OTk9PT1NTU1RUVFVVVVZWVVZWVlhYWFlZWVpaWltbW1xbW15eXl9fX2BgYGJiYmVlZWZmZmhoaGxsbHJycnp6ent6ent7e3x8fH19fYKCgoODg4WFhYaGhomJiYqJiYuKiouLioyMjI2MjI+Pj5KSkZOTkpSTk5SUlJWVlZmYmJ6enaKioqWlpaenpqenp6ioqKqpqa2tra+vrrGxsLOzs7e3trq5ubu7ury7u729vMDAv8XFxMbFxcfHxsrJycvKys3MzNDQz9TT0tTT09TU09XU09bV1NfW1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFMAIf4RQ3JlYXRlZCB3aXRoIEdJTVAALAAAAAAWABYAAAe2gFOCg4SFhoeESUOIjFNOIgkBGC+Ng1I+BgYSOEklDAUXRYwzFwQ0NYRMNCYBID2GRQAoSYxHEgWGFSaVU1IPLYUGNLxTEiCELwxMxD0FR4MYu8RTFyiCQwG00zoET1MzD97TRAY/TwQ409AdxdbqxdISwNMa0lNLBjbEHB6FJRq8iCzQUQgJASCVWjw41GNBEEYvJDhB9ECEjosYL+JY4IKRFAYCQooUeaxSEyZOnjxxwnJioUAAOw==";
    pm_import = "data:image/gif;base64,R0lGODlhEAAQAPcAAEyXPU6ZP0uSRU6bQlCbQVGbQ1CcQFCdQlCbRFieTVqfTVGQVlSTV2W3TmKmV2OmV2e5UW2/V2uyX22yYW/BWnXGYnnIZX/ObIHRcIjVd4fZeYrZeojce4zafFV+sFaAsleCtFeDtVyDs1iEt1iFuFmHuVqIu1qJvFuLvVuLvlyNwF6Qw1+SxV+SxmCUyGCVyGGWymKYy2KZzGOazmObz2Sd0Wih1G6o426o5G6p5G+p5HOs5Xyz5YKtioKvjo7dgKHbjKLcjafblqfbl5PiiJXjiKrlm6zlna3qn7Huo7rzrIW76ZDF65rO7aPU77HP8K/Q8LHQ8LLR8LPS8rfV8b3a9MLd9cfj9srl99/s/+Hv/+Pu/ubv/ufv/ujx/unx/+jy/uvy/ury/+zz/u3z/uv2/+31/+70/u/1/u72/+73//D1//D2/vH2//H3//L3/vP3/vL3//P3//P4/vP4//T4/vT4//X4//X5//b5//b6//f6//f7//j7//n7//r7//j8//n8//r8//v8//v+//7//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAIYAIf4RQ3JlYXRlZCB3aXRoIEdJTVAALAAAAAAQABAAAAjlAA0ZEvEBBAkTKFSocOECxowaNgR6GESI0CCKFi9erCFxEI6PN3bwWMKkiZNBMzpGWRllCpUqVq5gQSnRT5w4de7UqQMHTp04g2BIjBMmDBk1cdgojUPGjwuJarYYpXMnKRs1avyskNhjwJY4W7rEWaNUzaCthhgMGWBWZ5w7d5DeQWFIwJEkEwYYGBAgQIIBg8yicKCkCIcfGy5YoNAgyABAdwCdIExEQ4cMFyowBjIA7iATdY0gkRBgL4ABf++MARRC4IK1WcYU5VK06B0QEn0MyFImcGC5hD5I9ED8A/Hjxz8EBAA7";
    pm_export = "data:image/gif;base64,R0lGODlhEAAQAPcAAEyXPU6ZP0uSRU6bQlCbQVGbQ1CcQFCdQlCbRFieTVqfTVGQVlSTV2W3TmKmV2OmV2e5UW2/V2uyX22yYW/BWnXGYnnIZX/ObIHRcIjVd4fZeYrZeojce4zafFV+sFaAsleCtFeDtVyDs1iEt1iFuFmHuVqIu1qJvFuLvVuLvlyNwF6Qw1+SxV+SxmCUyGCVyGGWymKYy2KZzGOazmObz2Sd0Wih1G6o426o5G6p5G+p5HOs5Xyz5YKtioKvjouzk4y0k47dgKHbjKLcjafblqfbl5PiiJXjiKrlm6zlna3qn7Huo7rzrIW76ZDF65rO7aPU77HP8K/Q8LHQ8LLR8LPS8rfV8b3a9Mnc3M/f3MLd9cfj9srl99vp/9/s/+Dt/+Hv/+Pu/ubv/ufv/ujx/unx/+jy/uvy/ury/+zz/u3z/un0/+v2/+z0/+31/+70/u/1/u72/+73/+z4//D1//D2/vH2//H3//L3/vP3/vL3//P3//P4/vP4//T4/vT4//X4//X5//b5//T6//b6//f6//f7//j7//n7//r7//j8//n8//r8//v8//v+//7//////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAJEAIf4RQ3JlYXRlZCB3aXRoIEdJTVAALAAAAAAQABAAAAjkACNFEvEBxAgTKFSscOEixowaNgR6aIQIUaOLGDHWkNhox42PO3g0cfIESqMZHKVQWVnFyhUtW7g0isGxDaCbN/346dOn0QuJfci0GVqnaB08bRq5kNhmjNA+gJAWhQNoaSQPbcKMwTOgRyM8RZOukAhIaKMDRBjc7APHEIoBCQYEOHAAwYQlSQRkadT27RAIFCxg6NCBwxEmD4AYcjtgSIMIFTBk4KDhcGJAjUzAPQAggGcJSpAIwAIoaQiJabp4STOAyAIyacyQMfRB4hwvYFj7aDSUZ6PaVz14+PBBeHHhxgMCADs=";
    pm_new = "data:image/gif;base64,R0lGODlhEAAQAPEAAE1NTcTExAAAAAAAACH5BAEAAAIALAAAAAAQABAAAAIslI95wA26ggyAQlFnfipLzyEeNVli6TDJWJpRq61wfM6uwaKyHeJpegkKLwUAOw==";
    pm_about = "data:image/gif;base64,R0lGODlhGAAYAPcAABISWRISWhUUXRYUYiMidiopeysqez08d0lIckxLdVNTfFNTfacXG8IOEsYPFOMTF6RmXZFvZLt8fHWLf46Cdx8hgywrgDQzhzs4lD47lSY0qkA+mUE+mkZEiFlZgFZVk3l5nEpToUtHsUtHtlNPs1NQuVVSuGZipnZ0om1run58tkFP2FxsxmVhz2ZizmxoyXRuyXVzwGdj2G1p22dp5XZw7Xh163x27IJ/0oJ88oR/822Zh1qOsXe2pm69vH3juFWMw2KM0GeJ13+D5YuLi4yMjI2NjY6Ojo+Pj5CQkJGRkZOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm56enp+fn46ikqGhno2No5+fqZCPvoKir4CssaCgoKGhoaKioqOjo6SkpKWlpaWlpqampqenpqenp6qppampp6ioqKqqq6urq66sq6urrKysrK2tra6urq+vr7yhoK+vsKKhv7CwsLGxsbOzs7S0tLW1tbS0tra2tre3t7u6tLi4uLm5ubm5urq6uru7u768u729vby8vr6+vr+/v4Lpt4SDzJGWzaCfxKaoyLi4wYWC5JGN64aB846J9pmV95qW95aS+J6a+be14K+r8rSw97269LWx+Lm2+JnK18DAwMHBwcLCwsLCw8TExMXFxcbGxsfHx8jIx8zMx8fHyMjIyMnJycrKycnKysrKysvLy8/MyczMzc3Nzc7Ozs/Pz8PD0MzL0svL3tDQ0NDQ0dPT0dHR0tLS0tPT09fX09DQ1NLS1tTU1tbW1tjY1NjY1tHQ29nZ2NnZ2dra2tvb29jY3dzc3MTD48fH5s7O4cXD69Ta5dXU69LQ79jX7t7d6MbE8N3d8+Hh4eLi4ubm5ufn5uLi6e/v6uzs7O3t7eTl/+3w8vb28/f39/r79Pn69/78/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAOUALAAAAAAYABgAAAj+AMsJHEiwoMGDBI08mUKFypQnRhAaNEKFTJo4GOOwQfMliUSBU8jEucPHjyE/g7agyEJmisSQc/gMAjUKlSpXPU4wmtPy4BORfjydiqVLGC86OC4p8zNnjMuEX+Lw8aRq165ZWl7kqKRpGSg/ab5EHDglzR1DqhqB+MChxAwdkzQxU2WIT5qn5YhQieMnFKwFAQq0laEjk7RktkL5ifOFiMAkX87CsqUggIUQiqiNE8etGrBWhu6A8VjuCZo7nmD9UlCBRw8IEpxtxnYMlqc7ZJ4IfJJmKixjMID8iPCgwQQhj7IlgxUKDxooIHunTqZtGicKDhjsQLTCEWJPdp+8JiGD+ve1b+S8ybHiI4gNaMhs2yVtJDJaYNW4gSPXzRGNSJtEAwxdjI2lF1+h2GIMMrWkMIILN1CyyTOJLSYWWWYZEgoWBxCAAQku1DBJM7+cYggedxFERFR8GJKAAAZgIEIilgxjSyvgFVjQT3PogcAAF6RACzG7wHJKJ3zwpJtBP7XRgQaMmFLKKaF4UhdP0CH0kwos9OHHl37ccUccPX1UxBVoXDRSHGmQQYVjHw2k0BR0PgFRnHhKFBAAOw==";
    pm_chain = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAANZJREFUOE+tzj8OAUEUx/F3BJ2STica3XY6F6Cj0WgoJE4hcQidCziGRhQKlQgiIpSS8Z0xu9k/T2O85JPs/N4vsyPGmL9SwxBqGEINQ6hhCDsbtLSlhuniifqXvbR9YaoV0nz3hjEe9lzo+GIFJyzyhRjTxB2RP0f+3Mv0kg+REnZY2+9M6fPDwouYGq6YJFm64AKRFQ5o+HMZ9iWdfNfvqzhi7s75ggtFZjijjwuGWi/G2Ev3WKoFixnghZG2z2PspVt1GbMlLf/GXaotQqhhCDX8nZE354EyLDZ4KlUAAAAASUVORK5CYII=";
    pm_moledit24 = "data:image/gif;base64,R0lGODlhGAAYAPQAAAAAAAwMDBoaGiIiIigoKDMzM0JCQkxMTFlZWWZmZnBwcP+ZAP/MMwAA/4GBgY+Pj5mZmaurq7y8vP+ZmczMzN/f3//MzP//zO/v7/f39wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABoALAAAAAAYABgAAAWSoCaOZGmeYmUYFepqmAIgSKBgbwkJBiVSBsEjJyoQIplSZDAgApKnDMCpiUxN19fUesq6tl4iCVxqaMw5AM7UaJcSiZIhMCRlzGhRwmKJk5YFEiKCJgkMe30lGA4BNDZregySCRN+JSosb5KSC5ZihpudYiOgnJ5EpQyioxoJF6CrrK6vsawHs6ejB7e5rL6/IyEAOw==";
    pm_bo = ["data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIZjI+pyw2dHjxyhjox1M4azoCLqJCRh6ZHAQA7", "data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIdjI+pCrvtEoxnGoswrtJp3z0hM5bBBlKcerGuUQAAOw==", "data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIgjI+pCrsdoItGOohv3Y9blFGd+B1h6XFMOpGt+6pxXAAAOw==", "data:image/gif;base64,R0lGODlhEAAQAPUAADQ0Mzg4Nzo6OT8/PkBAQEFBQUJCQUJCQkNDQ0REREZGRkpKSktLS05OT1BQUVFRUlRUVVhYWVhYWl1dX15eX2NjZWRkZm1tcHBwc3l5fYKCh4yMkYyMko6OlZWVnKCgqLCwuba2wLe3wL+/ycfH0tHR3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACYALAAAAAAQABAAAAZfQJNwSDRZIKSi0uRxGBqg5bDEMCCeSSnjiuhCpBPutWFZdhTdLsOzHAnSCEZpKTJYEYqJ1CThCjp7GlZ2I3sfbwYRInscVgEae0IOCQYfkSYYBg4clxkAF5dCFxmhQkEAOw=="];
    pm_cross = new Image();
    pm_cross.src = "data:image/gif;base64,R0lGODlhDAAMAPYAAGdoZGdpZWttaGpsaWxtaGxuaWxtam5wbIOFgIOEgYSGgYWHgYaHg4aIg4eIg4eJg4aJhIeKhIiKhYiKhomKh4mMhoqNh4uNh4yOh4qLiIuNiYuNioyNioyPio2Pio2PjI6PjY+PjY+Qio+Ri46QjY+QjY+SjI+SjY+SjpCRjZCQjpCRjpCSjpGSj5KTj5KVj5OVj5KTkJOWkJSXkZSXkpWXkpWWlJeZk5iZlJialZmal5qdlpqdl5mamJucmJuemJufmZycmZydmZ+fnKKjoaanpbG0rLS3r7i7s7m8tLq9tb3AuL3Bub/Du8HEvMPGvsPHv8TIwMXJwcrOxsvOxs3RyQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFYALAAAAAAMAAwAAAd0gEUHNlaFhggGRAZRMimGVi8PSANCJlQ0jlYyHEsTQFYpL1U0ICAmTxwghiAvVEA7TyYcj1YbQFFROxm0VjE3T000KrQpEU04OEoRw4UxD0oiDxEbRwsmVj0IRxcPhRMTRgw4AkYXDI8TEUYBQwYbvCoAQIEAOw==";
    rotateAroundImage = new Image();
    rotateAroundImage.src = "data:image/gif;base64,R0lGODlhEAAQAPAAAMDAwAAAACH5BAAAAAAALAAAAAAQABAAAAImhI9pceGvHHiUoZpkmzbf1SkgJZbmiWbYqYVhw7jvClfxy5FLmhQAOw==";
    this.atomColors = {S: "#b2b200", O: "#ff0000", N: "#004dff", H: "#707070", F: "#66cd00", Cl: "#66cd00", Br: "#66cd00", I: "#66cd00"};
    this.toolButtons = [];
    this.activeTool = null;
    this.atomDislayMask = 0;
    this.android = navigator.userAgent.match(/Android/i);
    this.iOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
    var u, q, t, e;
    var f = document.createElement("table");
    f.style.backgroundColor = "#efefef";
    f.style.width = "1%";
    var j = document.createElement("tbody");
    var B = function(c) {
        v.toolButtonClicked(this);
    };
    var D = document.getElementById(y);
    t = document.createElement("tr");
    var u = document.createElement("td");
    this.bUndo = this.addToolButton(u, pm_undo_disabled, "undo", "Undo", function(c) {
        v.undo();
    });
    this.bRedo = this.addToolButton(u, pm_redo_disabled, "undo", "Redo", function(c) {
        v.redo();
    });
    this.addToolButton(u, pm_cent, "center", "Center", function(c) {
        v.updateZoom = true;
        v.drawMol();
    });
    this.addToolButton(u, pm_rs2, "rs", "Toggle R/S labels", function(c) {
        v.atomDislayMask ^= ATOM_DISPLAY_RS;
        v.drawMol();
    });
    this.addToolButton(u, pm_new, "new", "Clear", function(c) {
        v.clearMol();
    });
    this.addToolButton(u, pm_import, "import", "Import", function(c) {
        v.importMol();
    });
    this.addToolButton(u, pm_export, "export", "Export", function(c) {
        v.exportMol();
    });
    this.addToolButton(u, pm_about, "about", "About", function(c) {
        v.about();
    });
    this.addToolButton(u, pm_moledit24, "depict", "2D Cleanup/Depiction", function(c) {
        v.assignCoordinates();
    });
    this.searchInput = null;
    this.search_panel = null;
    this.req = null;
    this.offsetSearchWidth = H;
    this.searchTool = this.addSearch(u, pm_search, "search", "Search Tool", function(c) {
        v.search_panel.style.display = v.search_panel.style.display === "none" ? "block" : "none";
        if (v.search_panel.style.display === "block") {
            v.searchInput.focus();
        }
        if (v.search_panel.style.display === "none") {
            v.searchInput.value = null;
            while (v.dropDown.firstChild) {
                v.dropDown.removeChild(v.dropDown.firstChild);
            }
        }
    });
    var k = 340;
    v.search_panel = document.createElement("div");
    v.search_panel.style.cssText = "position:absolute; top:33px; left:-180px; width:" + k + "px; height:35px; background-color:#efefef;";
    v.searchInput = document.createElement("input");
    v.searchInput.type = "text";
    v.searchInput.style.padding = "4px";
    v.searchInput.style.width = "87%";
    v.searchInput.placeholder = "Enter molecule name here...";
    v.search_panel.appendChild(v.searchInput);
    var v = this;
    this.inputText = "";
    this.dropDown = document.createElement("div");
    this.dropDown.style.cssText = "position:absolute; top:35px; width:" + (k - 6) + "px; height:" + (v.dropSize * 25) + "px; right:0px; border-style:solid; border-color:#efefef; overflow:auto; background-color:white;";
    v.searchInput.onkeyup = function(L) {
        var M = String.fromCharCode(L.keyCode);
        var K = /\w|[\b]/;
        if (K.test(M)) {
            v.parseSearch(v.searchInput.value + "*");
        }
        inputText = "" + v.searchInput.value;
        if (inputText.length === 0) {
            v.dropDown.style.height = "0px";
        }
    };
    if ((v.searchInput.value === "" || v.searchInput.value === null) && v.dropDown.parentNode) {
        v.search_panel.removeChild(v.dropDown);
    } else {
        v.search_panel.appendChild(v.dropDown);
    }
    v.search_panel.style.display = "none";
    this.searchTool.search_panel = v.search_panel;
    this.searchTool.div.appendChild(v.search_panel);
    u.align = "center";
    t.appendChild(u);
    j.appendChild(t);
    t = document.createElement("tr");
    var s = "width: 36px; border-spacing: 2px; border-collapse: separate;";
    e = document.createElement("td");
    var p = document.createElement("table");
    p.style.cssText = s;
    q = document.createElement("tbody");
    this.addEditToolAtom(q, "C", "Carbon", B);
    this.addEditToolAtom(q, "N", "Nitrogen", B);
    this.addEditToolAtom(q, "O", "Oxygen", B);
    this.addEditToolAtom(q, "F", "Fluorine", B);
    this.addEditToolAtom(q, "P", "Phosphorus", B);
    this.addEditToolAtom(q, "S", "Sulfur", B);
    this.addEditToolAtom(q, "H", "Hydrogen", B);
    var z = null, x = null;
    this.customElement = this.addEditToolAtom(q, "..", "Custom Element", function(c) {
        if (typeof c.target.toolType !== "undefined") {
            v.toolButtonClicked(null);
            z.style.display = z.style.display === "none" ? "block" : "none";
            if (z.style.display === "block") {
                x.focus();
            }
        }
    });
    z = document.createElement("div");
    z.style.position = "absolute";
    z.style.top = "0px";
    z.style.left = "32px";
    z.style.width = "250px";
    var d = document.createElement("table");
    d.style.cssText = "width: 100%; border-spacing: 2px; border-collapse: separate; border:2px solid gray; border-radius:5px; background-color:#efefef";
    var o = document.createElement("tbody");
    d.appendChild(o);
    function b(O, M, L) {
        var N = document.createElement("tr");
        var c = document.createElement("td");
        c.style.textAlign = "left";
        if (typeof O === "string") {
            c.innerHTML = O;
        } else {
            c.appendChild(O);
        }
        N.appendChild(c);
        var c = document.createElement("td");
        c.style.textAlign = "left";
        c.appendChild(M);
        N.appendChild(c);
        if (L !== null) {
            var K = document.createElement("td");
            K.style.textAlign = "right";
            K.appendChild(L);
            N.appendChild(K);
        } else {
            c.colSpan = 2;
        }
        o.appendChild(N);
    }
    function h(O, K, N) {
        var M = document.createElement("select");
        for (var L = 0; L < N.length; L++) {
            var c = document.createElement("option");
            c.text = N[L];
            c.value = N[L];
            M.options.add(c);
        }
        b(K, M, null);
        M.sm = O;
        return M;
    }
    x = document.createElement("input");
    x.type = "text";
    x.style.width = "130px";
    x.placeholder = "Element(H,Br,Si)";
    var a = document.createElement("input");
    a.type = "button";
    a.value = "OK";
    a.onclick = function(c) {
        v.customAtomSelected(v.customElement);
    };
    x.onkeydown = function(c) {
        if (c.keyCode === 13) {
            v.customAtomSelected(v.customElement);
        }
    };
    b(x, a, pm_cross);
    pm_cross.style.cssText = "border:2px solid gray; border-radius:5px; padding:2px";
    pm_cross.onmouseover = function(c) {
        this.style.borderColor = "black";
    };
    pm_cross.onmouseout = function(c) {
        this.style.borderColor = "gray";
    };
    pm_cross.onclick = function(c) {
        v.toolButtonClicked(null);
    };
    z.input = x;
    z.H = h("H", "Hydrogen Count", ["any", "0", "1", "2", "3"]);
    z.D = h("D", "Heavy Count", ["any", "1", "2", "3"]);
    z.R = h("R", "Ring Count", ["any", "0", "1", "2", "3"]);
    z.H.onchange = z.D.onchange = z.R.onchange = function() {
        var c = z.input.value;
        var L = "";
        if (this.selectedIndex !== 0) {
            L = this.sm + this.options[this.selectedIndex].value;
        }
        var K = new RegExp(this.sm + "[0-9]");
        if (c.match(K)) {
            c = c.replace(K, L);
        } else {
            if (!c.length) {
                c = sprintf("[%s]", L);
            } else {
                if (c.match(/\[(.*)\]/)) {
                    c = c.replace(/\[(.*)\]/, "[$1;" + L + "]");
                } else {
                    c = sprintf("[%s;%s]", c, L);
                }
            }
        }
        c = c.replace(/;+/, ";");
        z.input.value = c;
    };
    z.getSearchAtts = function() {
        var c = {};
        if (this.H.selectedIndex) {
            c.H = parseInt(this.H.options[this.H.selectedIndex].value);
        }
        if (this.D.selectedIndex) {
            c.D = parseInt(this.D.options[this.D.selectedIndex].value);
        }
        if (this.R.selectedIndex) {
            c.R = parseInt(this.R.options[this.R.selectedIndex].value);
        }
        return c;
    };
    z.appendChild(d);
    z.style.display = "none";
    this.customElement.panel = z;
    this.customElement.div.appendChild(z);
    var g = document.createElement("div");
    g.style.position = "absolute";
    g.style.top = 0;
    g.style.left = 0;
    g.style.width = H + "px";
    g.style.height = F + "px";
    var C = document.createElement("textarea");
    C.rows = 20;
    C.style.width = "100%";
    g.appendChild(C);
    var m = document.createElement("div");
    m.style.cssText = sprintf("vertical-align: middle; text-align:center; width:%dpx; height:%dpx; border:2px solid gray; border-radius:5px; background-color:#efefef", H, F / 2);
    m.innerHTML = '<p></p><p><h3>Web Molecular Editor v1.1</h3></p><p style="font-size:smaller;">Authors: Eugene Raush, Max Totrov, Ruben Abagyan.</p><p style="font-size:smaller;">&copy; Copyright 2013, MolSoft L.L.C.</p>';
    g.about = m;
    var I = document.createElement("div");
    I.style.width = "100%";
    I.style.textAlign = "center";
    g.appendChild(I);
    var A = document.createElement("input");
    A.type = "button";
    A.value = "OK";
    I.appendChild(A);
    var i = document.createElement("input");
    i.type = "button";
    i.value = "Cancel";
    I.appendChild(i);
    g.style.display = "none";
    g.ok = A;
    g.cancel = i;
    g.text = C;
    g.hlay = I;
    this.impexp = g;
    this.impexp.cancel.onclick = function(c) {
        v.impexp.style.display = "none";
    };
    this.addEditToolBond(q, 1, "Single", B);
    this.addEditToolBond(q, 2, "Double", B);
    this.addEditToolBond(q, 3, "Tripple", B);
    this.addEditToolBond(q, 4, "Up/Down Toggle", B);
    p.appendChild(q);
    e.appendChild(p);
    e.vAlign = "top";
    t.appendChild(e);
    e = document.createElement("td");
    var G = document.createElement("div");
    G.style.position = "relative";
    this.canvas = document.createElement("canvas");
    this.canvas.style.backgroundColor = "#ffffff";
    this.canvas.width = H;
    this.canvas.height = F;
    this.canvas.onselectstart = function() {
        return false;
    };
    e.appendChild(G);
    e.appendChild(this.canvas);
    t.appendChild(e);
    e = document.createElement("td");
    var l = document.createElement("table");
    l.style.cssText = s;
    vToolBar2 = document.createElement("tbody");
    this.addEditToolGeneral(vToolBar2, pm_sel_rect, "rect", "Rectangular Selection", B);
    this.addEditToolGeneral(vToolBar2, pm_sel_lasso, "lasso", "Lasso Selection", B);
    this.addEditToolGeneral(vToolBar2, pm_eraser, "eraser", "Eraser Tool", B);
    this.addEditToolGeneral(vToolBar2, "-/+", "qfm", "charge", B);
    this.addEditToolGeneral(vToolBar2, pm_benzene, "frag_0", "benzene", B);
    this.addEditToolGeneral(vToolBar2, pm_r3, "frag_1", "cyclopropane", B);
    this.addEditToolGeneral(vToolBar2, pm_r4, "frag_2", "cyclobutane", B);
    this.addEditToolGeneral(vToolBar2, pm_r5, "frag_3", "cyclopentane", B);
    this.addEditToolGeneral(vToolBar2, pm_r6, "frag_4", "cyclohexane", B);
    this.addEditToolGeneral(vToolBar2, pm_r7, "frag_5", "cycloheptane", B);
    this.addEditToolGeneral(vToolBar2, pm_chain, "chain", "Chain", B);
    l.appendChild(vToolBar2);
    e.appendChild(l);
    e.vAlign = "top";
    t.appendChild(e);
    j.appendChild(t);
    var E = document.createElement("tr");
    var J = document.createElement("td");
    this.hStatusBar = document.createElement("div");
    J.colSpan = t.cells.length;
    J.appendChild(this.hStatusBar);
    E.appendChild(J);
    j.appendChild(E);
    this.hStatusBar.style.height = "20px";
    u.colSpan = t.cells.length;
    f.appendChild(j);
    D.style.position = "relative";
    D.appendChild(f);
    G.appendChild(this.impexp);
    this.undoStack = [];
    this.redoStack = [];
    this.chem = new Chemical();
    this.chemIsReady = true;
    this.ctx = null;
    this.dragAtoms = [];
    this.lastPos = null;
    this.lastPosArr = [];
    this.endPos = null;
    this.lassoPath = [];
    this.h_atom = -1;
    this.h_bond = -1;
    this.rotateAroundPoint = null;
    this.connectToAtom = -1;
    this.button = -1;
    this.updateZoom = true;
    this.mode = 0;
    this.onchange = null;
    if (this.iOS || this.android) {
        this.canvas.addEventListener("touchstart", function(c) {
            v.onMouseDown(c, true);
        }, false);
        this.canvas.addEventListener("touchend", function(c) {
            v.onMouseUp(c);
        }, false);
        this.canvas.addEventListener("touchmove", function(c) {
            v.onMouseMove(c, true);
        }, true);
        document.body.addEventListener("touchcancel", function(c) {
            v.onMouseUp(c);
        }, false);
    } else {
        this.canvas.addEventListener("mousedown", function(c) {
            v.onMouseDown(c, false);
        }, false);
        this.canvas.addEventListener("mouseup", function(c) {
            v.onMouseUp(c);
        }, false);
        this.canvas.addEventListener("mousemove", function(c) {
            v.onMouseMove(c, false);
        }, false);
    }
    document.addEventListener("keydown", function(c) {
        v.onKeyPress(c);
    }, false);
    this.kfc = 40;
    this.dx = this.dy = 0;
    if (w !== "") {
        this.chemIsReady = false;
        this.chem.parseString(w, function() {
            v.chemIsReady = true;
            v.drawMol();
        });
    } else {
    }
}

ChemicalView.prototype.showStatus = function(a) {
    this.hStatusBar.innerHTML = a;
};

ChemicalView.prototype.clearStatus = function() {
    this.hStatusBar.innerHTML = "";
};

ChemicalView.prototype.toolButtonCss = function(a) {
    return sprintf("text-align:center; width: %dpx; height: %dpx; cursor:default; border:2px solid gray; border-radius:5px;vertical-align: middle", a, a);
};

ChemicalView.prototype.assignOverOut = function(a) {
    var b = this;
    a.onmouseover = function(c) {
        b.showStatus(a.alt);
    };
    a.onmouseout = function(c) {
        b.clearStatus();
    };
};

ChemicalView.prototype.addEditToolGeneral = function(d, e, b, g, f) {
    var h = document.createElement("tr");
    var a = document.createElement("td");
    var c = null;
    if (e.indexOf("data:image/gif") === 0) {
        c = new Image();
        c.src = e;
        c.title = g;
    } else {
        a.innerHTML = e;
    }
    a.onclick = f;
    a.toolType = b;
    a.style.cssText = this.toolButtonCss(ICON_SIZE);
    a.onclick = f;
    a.alt = g;
    if (c !== null) {
        a.appendChild(c);
    }
    this.assignOverOut(a);
    h.appendChild(a);
    d.appendChild(h);
    this.toolButtons.push(a);
    return a;
};

ChemicalView.prototype.addEditToolBond = function(d, b, f, e) {
    var g = document.createElement("tr");
    g.style.height = ICON_SIZE;
    var a = document.createElement("td");
    var c = new Image();
    c.src = pm_bo[b - 1];
    c.title = f;
    a.onclick = e;
    a.toolType = "bond";
    a.ty = b;
    a.alt = f;
    a.style.cssText = this.toolButtonCss(ICON_SIZE);
    a.onclick = e;
    a.appendChild(c);
    this.assignOverOut(a);
    g.appendChild(a);
    d.appendChild(g);
    this.toolButtons.push(a);
    return a;
};

ChemicalView.prototype.addEditToolAtom = function(a, d, c, b) {
    return this.addEditTool(a, "atom", d, c, b);
};

ChemicalView.prototype.addEditTool = function(f, e, h, d, a) {
    var i = document.createElement("tr");
    i.style.height = ICON_SIZE;
    var b = document.createElement("td");
    var g = document.createElement("div");
    g.innerHTML = h;
    b.toolType = e;
    g.toolType = b.toolType;
    b.cd = h;
    var c = this.atomColors[h];
    if (typeof c === "undefined") {
        c = "#000000";
    }
    b.style.cssText = this.toolButtonCss(ICON_SIZE);
    g.style.cssText = ";position:relative;vertical-align: middle;";
    b.onclick = a;
    b.alt = d;
    this.assignOverOut(b);
    b.div = g;
    b.appendChild(g);
    i.appendChild(b);
    f.appendChild(i);
    this.toolButtons.push(b);
    return b;
};

ChemicalView.prototype.addToolButton = function(d, g, a, f, e) {
    var b = document.createElement("div");
    b.style.cssText = ";position:relative; display:inline-block;";
    var c = new Image();
    c.src = g;
    c.title = f;
    c.onclick = e;
    this.assignOverOut(c);
    c.style.cssText = this.toolButtonCss(16) + ";padding: 4px; margin: 1px;";
    c.toolType = a;
    b.appendChild(c);
    d.appendChild(b);
    c.div = b;
    c.alt = f;
    this.assignOverOut(c);
    return c;
};

ChemicalView.prototype.addSearch = function(d, g, a, f, e) {
    var b = document.createElement("div");
    b.style.cssText = ";position:relative; display:inline-block;";
    var c = new Image();
    c.src = g;
    c.title = f;
    c.onclick = e;
    this.assignOverOut(c);
    c.style.cssText = "text-align:center; width: 70px; height: 16px; cursor:default; border:2px solid gray; border-radius:5px;vertical-align: middle; padding: 4px; margin: 1px;";
    c.toolType = a;
    b.appendChild(c);
    d.appendChild(b);
    c.div = b;
    return c;
};

ChemicalView.prototype.customAtomSelected = function(c) {
    var b;
    var e = this.customElement.panel.input.value;
    var a = null;
    var d = /([^\[\];]+);?/g;
    var f = false;
    b = d.exec(e);
    do {
        f = true;
        if (b[1] in Elements) {
            a = b[1];
        }
        b = d.exec(e);
    } while (d);
    if (f) {
    } else {
        if (e in Elements) {
            a = e;
        }
    }
    this.toolButtonClicked(c);
    this.activeTool.cd = a;
};

ChemicalView.prototype.toolButtonClicked = function(b) {
    this.customElement.panel.style.display = "none";
    if (this.activeTool === b) {
        this.activeTool = null;
    } else {
        this.activeTool = b;
        if (b) {
            this.activeTool.firstUse = true;
        }
    }
    for (var a = 0; a < this.toolButtons.length; a++) {
        this.toolButtons[a].style.borderStyle = this.toolButtons[a] === this.activeTool ? "inset" : "solid";
        this.toolButtons[a].style.borderColor = this.toolButtons[a] === this.activeTool ? "white" : "gray";
        this.toolButtons[a].style.backgroundColor = this.toolButtons[a] === this.activeTool ? "#D1D1D1" : "transparent";
    }
};

ChemicalView.prototype.isEmpty = function() {
    return this.chem.atoms.length === 0;
};

ChemicalView.prototype.changed = function() {
    this.bUndo.src = this.undoStack.length > 0 ? pm_undo : pm_undo_disabled;
    this.bRedo.src = this.redoStack.length > 0 ? pm_redo : pm_redo_disabled;
    if (this.onchange !== null) {
        if (typeof this.onchange === "function") {
            this.onchange();
        } else {
            if (typeof this.onchange === "string") {
                eval(this.onchange);
            }
        }
    }
};

ChemicalView.prototype.undoPush = function() {
    this.undoStack.push(this.chem.clone());
    this.changed();
};

ChemicalView.prototype.parseSearch = function(input) {
    console.clear();
    if (this.req !== null) {
        this.req.abort();
    }
    this.req = getXMLObject(true);
    var molidNum;
    var that = this;
    var row = -1;
    var liArr;
    var tmp = input.replace("*", "");
    var color = "rgb(135, 206, 255)";
    var clearList = function() {
        while (that.dropDown.firstChild) {
            that.dropDown.removeChild(that.dropDown.firstChild);
        }
        that.dropDown.style.height = "0px";
    };
    function getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;
        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return{x: xPosition, y: yPosition};
    }
    this.req.onload = function(e) {
        var a = eval("(" + that.req.responseText + ")");
        var synonyms = a.molecule_name.length;
        liArr = [];
        clearList();
        for (var i = 0; i < a.molecule_name.length; i++) {
            liArr[i] = document.createElement("p");
            liArr[i].innerHTML = a.molecule_name[i];
            that.dropDown.appendChild(liArr[i]);
            liArr[i].style.cssText = "text-align:left; font-size:17px; margin:5px;";
            liArr[i].onmouseover = function(ev) {
                for (var i = 0; i < a.molecule_name.length; i++) {
                    if (liArr[i].style.backgroundColor === color) {
                        liArr[i].style.backgroundColor = "#fff";
                    }
                }
                this.style.backgroundColor = color;
                this.style.cursor = "pointer";
                row = liArr.indexOf(this);
            };
            liArr[i].onmouseout = function(ev) {
                this.style.backgroundColor = "#fff";
            };
            liArr[i].onclick = function(ev) {
                molidNum = a.molid[liArr.indexOf(this)];
                that.loadMolById(molidNum);
                that.search_panel.style.display = "none";
                that.searchInput.value = null;
                clearList();
            };
            that.search_panel.onkeydown = function(e) {
                var tmpRow;
                if (inputText.length > 0 && e.keyCode === 40 && that.dropDown.firstChild && row < that.dropSize - 1) {
                    if (row === that.dropSize - 1) {
                        return false;
                    }
                    row++;
                    tmpRow = row;
                    liArr[row].style.backgroundColor = color;
                    if (tmpRow >= 1) {
                        liArr[tmpRow - 1].style.backgroundColor = "#fff";
                    }
                    var rowPos = getPosition(liArr[row]);
                    var rowY = rowPos.y;
                    if (rowPos.y === rowY) {
                        liArr[row].scrollIntoView(false);
                    }
                    return false;
                }
                if (inputText.length > 0 && e.keyCode === 38 && that.dropDown.firstChild && row <= that.dropSize && row >= 0) {
                    if (row === 0) {
                        return false;
                    }
                    row--;
                    tmpRow = row;
                    liArr[row].style.backgroundColor = color;
                    if (tmpRow >= 0) {
                        liArr[tmpRow + 1].style.backgroundColor = "#fff";
                    }
                    liArr[row].scrollIntoView(false);
                    return false;
                }
                if (e.keyCode === 13) {
                    molidNum = a.molid[liArr.indexOf(liArr[row])];
                    that.loadMolById(molidNum);
                    that.search_panel.style.display = "none";
                    that.searchInput.value = null;
                    clearList();
                }
                return true;
            };
            if (liArr.length > 9) {
                that.dropDown.style.height = ((getPosition(liArr[1]).y) - (getPosition(liArr[0]).y)) * 10 + "px";
            }
            if (liArr.length <= 9) {
                that.dropDown.style.height = liArr.length * 26 + "px";
            }
            that.dropSize = liArr.length;
            var n = liArr[i].innerHTML;
            var patt = new RegExp("(\\b" + tmp + ")", "gi");
            var blahblah = new RegExp(tmp, "gi").exec(a.synonym[a.molecule_name.indexOf(liArr[i].innerHTML)]);
            if (n.match(patt)) {
                liArr[i].innerHTML = n.replace(patt, function(match) {
                    return"<b><u>" + match + "</u></b>";
                });
            } else {
                var synRow = a.molecule_name[i];
                var tmpHold = a.synonym[i].substring(a.synonym[i].indexOf(blahblah));
                var re = /[A-z]+/;
                var tmpStr = re.exec(tmpHold);
                liArr[i].innerHTML = liArr[i].innerHTML + "    -     " + tmpStr;
                liArr[i].innerHTML = liArr[i].innerHTML.replace(patt, function(match) {
                    return"<b><u>" + match + "</u></b>";
                });
            }
        }
        if (liArr.length === 0) {
            that.dropDown.style.height = "0px";
        }
        that.req = null;
    };
    this.req.open("GET", sprintf("http://mars.molsoft.com/cgi-bin/dictsearch.cgi?kwd=%s&format=json", encodeURIComponent(input)));
    this.req.send();
};

ChemicalView.prototype.loadMolById = function(b) {
    this.req = getXMLObject(true);
    var a = this;
    this.req.onload = function(c) {
        a.importFromString(a.req.responseText);
    };
    this.req.open("GET", sprintf("http://mars.molsoft.com/cgi-bin/dictsearch.cgi?getmolbyid=%s", encodeURIComponent(b)));
    this.req.send();
};

ChemicalView.prototype.getSmiles = function() {
    return this.chem.getSmiles();
};

ChemicalView.prototype.getMolfile = function() {
    return this.chem.toMol();
};

ChemicalView.prototype.importFromString = function(b) {
    this.undoPush();
    if (b.indexOf("M  END") !== -1) {
        this.chem = new Chemical().parseMol(b);
        this.updateZoom = true;
        this.drawMol();
        this.changed();
    } else {
        var a = this;
        this.chem.parseSmiles(b, function() {
            a.updateZoom = true;
            a.drawMol();
            a.changed();
        });
    }
};

ChemicalView.prototype.clearMol = function() {
    this.undoPush();
    this.chem = new Chemical();
    this.drawMol();
    this.changed();
    this.toolButtonClicked(this.activeTool);
};

ChemicalView.prototype.assignCoordinates = function() {
    this.undoPush();
    var a = this;
    this.chem.assignCoordinates(function() {
        a.updateZoom = true;
        a.drawMol();
        a.changed();
    });
};

ChemicalView.prototype.importMol = function() {
    var a = this;
    this.impexp.style.display = "block";
    this.impexp.text.value = "";
    this.impexp.text.placeholder = "Paste MOL or SMILES file here";
    this.impexp.text.focus();
    this.impexp.ok.onclick = function(b) {
        a.impexp.style.display = "none";
        a.importFromString(a.impexp.text.value);
    };
    if (this.impexp.about.parentNode === this.impexp) {
        this.impexp.removeChild(this.impexp.about);
        this.impexp.insertBefore(this.impexp.text, this.impexp.hlay);
    }
    if (this.impexp.cancel.parentNode !== this.impexp.hlay) {
        this.impexp.hlay.appendChild(this.impexp.cancel);
    }
    this.impexp.cancel.value = "Cancel";
    this.impexp.cancel.onclick = function(b) {
        a.impexp.style.display = "none";
    };
};

ChemicalView.prototype.exportMol = function() {
    var a = this;
    this.impexp.style.display = "block";
    this.impexp.text.placeholder = "";
    this.impexp.text.value = this.chem.toMol();
    if (this.impexp.about.parentNode === this.impexp) {
        this.impexp.removeChild(this.impexp.about);
        this.impexp.insertBefore(this.impexp.text, this.impexp.hlay);
    }
    if (this.impexp.cancel.parentNode !== this.impexp.hlay) {
        this.impexp.hlay.appendChild(this.impexp.cancel);
    }
    this.impexp.ok.onclick = function(b) {
        a.impexp.style.display = "none";
    };
    this.impexp.cancel.value = "Show SMILES";
    this.impexp.cancel.onclick = function(b) {
        if (a.impexp.cancel.value === "Show SMILES") {
            a.chem.toSmiles(function(c) {
                a.impexp.text.value = c;
            });
            a.impexp.cancel.value = "Show MOL";
        } else {
            a.impexp.text.value = a.chem.toMol();
            a.impexp.cancel.value = "Show SMILES";
        }
    };
};

ChemicalView.prototype.about = function() {
    var a = this;
    this.impexp.style.display = "block";
    this.impexp.ok.onclick = function(b) {
        a.impexp.style.display = "none";
    };
    if (this.impexp.text.parentNode === this.impexp) {
        this.impexp.removeChild(this.impexp.text);
        this.impexp.insertBefore(this.impexp.about, this.impexp.hlay);
    }
    if (this.impexp.cancel.parentNode === this.impexp.hlay) {
        this.impexp.hlay.removeChild(this.impexp.cancel);
    }
};

ChemicalView.prototype.undo = function() {
    if (this.undoStack.length > 0) {
        this.redoStack.push(this.chem.clone());
        this.chem = this.undoStack.pop();
        this.h_atom = this.h_bond = -1;
        this.drawMol();
        this.changed();
    }
};

ChemicalView.prototype.undoSimple = function() {
    if (this.undoStack.length > 0) {
        this.chem = this.undoStack.pop();
        this.h_atom = this.h_bond = -1;
    }
};

ChemicalView.prototype.redo = function() {
    if (this.redoStack.length > 0) {
        this.undoStack.push(this.chem.clone());
        this.chem = this.redoStack.pop();
        this.drawMol();
        this.changed();
    }
};

ChemicalView.prototype.getMolfile = function() {
    return this.chem.toMol();
};

ChemicalView.prototype.getSearchMolfile = function() {
    return this.chem.toMol();
};

ChemicalView.prototype.wtos = function(a) {
    return{x: a.x * this.kfc + this.dx, y: -a.y * this.kfc + this.dy, z: 0};
};

ChemicalView.prototype.stow = function(a) {
    return{x: (a.x - this.dx) / this.kfc, y: (this.dy - a.y) / this.kfc, z: 0};
};

ChemicalView.prototype.stowd = function(a) {
    return{x: a.x / this.kfc, y: -a.y / this.kfc, z: 0};
};

function vector(b, a) {
    return{x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
}

function vectorLength(a) {
    return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2));
}

function vectorSetLength(c, a) {
    var b = a / vectorLength(c);
    return{x: c.x * b, y: c.y * b, z: c.z * b};
}

function vecpy(d, c) {
    d.x = c.x;
    d.y = c.y;
    d.z = c.z;
}

function veadd(d, c) {
    return{x: d.x + c.x, y: d.y + c.y, z: d.z + c.z};
}

function vesub(d, c) {
    return{x: d.x - c.x, y: d.y - c.y, z: d.z - c.z};
}

function vemul(d, c) {
    return{x: d.y * c.z - d.z * c.y, y: d.z * c.x - d.x * c.z, z: d.x * c.y - d.y * c.x};
}

function vemulZSign(d, c) {
    var e = d.x * c.y - d.y * c.x;
    return e < 0 ? -1 : 1;
}

function scmul(d, c) {
    return d.x * c.x + d.y * c.y + d.z * c.z;
}

function vemulby(b, c) {
    return{x: b.x * c, y: b.y * c, z: b.z * c};
}

function xyz(a) {
    return{x: a.x, y: a.y, z: a.z};
}

function testPolyInclusion(g, e) {
    var f = e.length;
    var h = false;
    var d = 0;
    var b = f - 1;
    for (var a = 0; a < f; a++) {
        if (e[d].y <= g.y) {
            if ((g.y < e[b].y) && (g.x - e[d].x) * (e[b].y - e[d].y) < (e[b].x - e[d].x) * (g.y - e[d].y)) {
                h = !h;
            }
        } else {
            if ((g.y >= e[b].y) && (g.x - e[d].x) * (e[b].y - e[d].y) > (e[b].x - e[d].x) * (g.y - e[d].y)) {
                h = !h;
            }
        }
        b = d;
        d++;
    }
    return h;
}

function angleBetween(d, c) {
    return TO_DEG * Math.acos((scmul(d, c)) / (vectorLength(d) * vectorLength(c)));
}

ChemicalView.prototype.bondRect = function(e) {
    var d = this.chem.atoms[e.fr];
    var b = this.chem.atoms[e.to];
    var c = vectorSetLength(vector(d, b), 0.2);
    var a = vectorSetLength(vector(d, b), 0.2);
    a = {x: -a.y, y: a.x, z: 0};
    return[veadd(veadd(d, a), c), veadd(veadd(b, a), vemulby(c, -1)), veadd(veadd(b, vemulby(a, -1)), vemulby(c, -1)), veadd(veadd(d, vemulby(a, -1)), c)];
};

ChemicalView.prototype.atomRect = function(a, b) {
    var c = this.wtos(a);
    return{x: c.x - b / 2, y: c.y - b / 2, w: b, h: b};
};

ChemicalView.prototype.bondOrtho = function(d, c, b, a) {
    return this.chem.bondOrtho(d, c, b, a);
};

ChemicalView.prototype.moveTo = function(a) {
    var b = this.wtos(a);
    this.ctx.moveTo(b.x, b.y);
};

ChemicalView.prototype.lineTo = function(a) {
    var b = this.wtos(a);
    this.ctx.lineTo(b.x, b.y);
};

ChemicalView.prototype.drawLine = function(a, d) {
    var c = this.wtos(a);
    var b = this.wtos(d);
    this.ctx.moveTo(c.x, c.y);
    this.ctx.lineTo(b.x, b.y);
};

ChemicalView.prototype.getMousePos = function(c, a) {
    var b = this.canvas.getBoundingClientRect();
    return{x: (a ? c.touches[0].clientX : c.clientX) - b.left, y: (a ? c.touches[0].clientY : c.clientY) - b.top, z: 0};
};

ChemicalView.prototype.getMousePosArr = function(d) {
    var c = this.canvas.getBoundingClientRect();
    var b = [];
    for (var a = 0; a < d.targetTouches.length; a++) {
        b.push({x: d.touches[a].clientX - c.left, y: d.touches[a].clientY - c.top, z: 0});
    }
    return b;
};

ChemicalView.prototype.onKeyPress = function(e) {
    var d = e.charCode ? e.charCode : e.keyCode;
    var c = String.fromCharCode(d);
    if (d === 46 || d === 8) {
        var g = this.chem.getSelectedAtoms(M_CE);
        if (g.length === 0 && this.h_atom !== -1) {
            g = [this.h_atom];
        }
        if (g.length) {
            this.undoPush();
            this.chem.removeAtoms(g);
            this.changed();
            this.drawMol();
        }
    } else {
        if (this.h_atom !== -1) {
            if (c in Elements) {
                this.undoPush();
                this.chem.changeAtom(this.h_atom, Elements[c], {});
                this.changed();
                this.drawMol();
            }
        } else {
            if (this.h_bond !== -1) {
                var a = -1, b = 0;
                var f = this.chem.bonds[this.h_bond];
                switch (d) {
                    case 189:
                        a = 1;
                        b = 0;
                        break;
                    case 187:
                        a = 2;
                        b = 0;
                        break;
                    case 51:
                        if (!(f.ms & M_RNG)) {
                            a = 3;
                            b = 0;
                        }
                        break;
                    case 85:
                        if (f.ty === 1) {
                            a = 1;
                            b = M_BO_UP;
                        }
                        break;
                    case 68:
                        if (f.ty === 1) {
                            a = 1;
                            b = M_BO_DW;
                        }
                        break
                }
                if (a !== -1) {
                    this.undoPush();
                    f.ty = a;
                    f.ms = (f.ms & ~(M_BO_UP | M_BO_DW)) | b;
                    this.chem.processChemical();
                    this.changed();
                    this.drawMol();
                }
            }
        }
    }
};

ChemicalView.prototype.onMouseUp = function(a) {
    this.clearStatus();
    if (this.dragAtoms.length > 0) {
        this.chem.gravitateCollisions();
        this.changed();
    } else {
        if (this.mode === MODE_CHAIN) {
            this.chem.gravitateCollisions();
            if (this.chem.atoms.length === 1 || (this.newCount === 0 && this.chem.atoms[this.connectToAtom].bo.length === 0)) {
                this.chem.removeAtoms([this.chem.atoms.length - 1]);
                this.h_atom = this.h_bond = -1;
                this.connectToAtom = -1;
            }
        }
    }
    this.mode = MODE_NORMAL;
    this.endPos = this.lastPos = null;
    this.lastPosArr = [];
    this.lassoPath = [];
    this.dragAtoms = [];
    this.connectToAtom = -1;
    this.button = -1;
    this.drawMol();
};

ChemicalView.prototype.canSelect = function(a) {
    return(this.h_atom === -1 && this.h_bond === -1 && (!this.activeTool || !this.activeTool.firstUse || (this.activeTool.toolType !== "lasso" && this.activeTool.toolType.substr(0, 4) !== "frag" && this.activeTool.toolType !== "bond")) && (!this.activeTool || this.activeTool.toolType !== "atom")) && (!this.activeTool || this.activeTool.toolType !== "chain");
};

ChemicalView.prototype.getDragAtoms = function() {
    if (this.h_atom === -1) {
        return[];
    }
    if (this.chem.atoms[this.h_atom].ms & M_CE) {
        var b = [this.h_atom];
        for (var a = 0; a < this.chem.atoms.length; a++) {
            if (a !== this.h_atom && (this.chem.atoms[a].ms & M_CE)) {
                b.push(a);
            }
        }
        return b;
    } else {
        return[this.h_atom];
    }
};

ChemicalView.prototype.onMouseDown = function(f, b) {
    var e = this;
    if (b && f.targetTouches.length > 1) {
        this.lastPosArr = this.getMousePosArr(f);
        return;
    }
    this.button = 0;
    if (typeof f.button !== "undefined") {
        this.button = f.button;
    }
    var g = this.getMousePos(f, b);
    this.newCount = 0;
    this.mode = MODE_NORMAL;
    switch (this.button) {
        case 2:
            break;
        case 1:
            this.lastPos = this.endPos = g;
            break;
        case 0:
            this.h_atom = this.chem.findClosestAtom(this.stow(g));
            this.h_bond = -1;
            if (this.h_atom === -1) {
                this.h_bond = this.chem.findClosestBond(this.stow(g));
            }
            if (this.h_atom === -1 && this.h_bond === -1 && g.x <= this.canvas.width * 0.05) {
                this.lastPos = this.endPos = g;
                this.mode = MODE_ZOOM;
                return;
            }
            if (this.canSelect()) {
                this.mode = MODE_RECT_SEL;
                this.h_atom = -1;
                this.lastPos = this.endPos = g;
                return;
            }
            if (this.activeTool && this.activeTool.toolType === "lasso") {
                this.mode = MODE_LASSO_SEL;
                this.h_atom = -1;
                this.lastPos = g;
                this.lassoPath = [];
                return;
            }
            if (this.activeTool && this.activeTool.toolType === "chain") {
                this.mode = MODE_CHAIN;
                this.lastPos = g;
            }
            if (this.h_atom !== -1) {
                var a = this.chem.atoms[this.h_atom];
                if (this.activeTool && !(a.ms & M_CE) && this.activeTool.toolType === "atom") {
                    this.undoPush();
                    var h = {};
                    if (typeof this.activeTool.panel !== "undefined") {
                        h = this.activeTool.panel.getSearchAtts();
                    }
                    this.chem.changeAtom(this.h_atom, this.activeTool.cd === null ? -1 : Elements[this.activeTool.cd], h);
                    this.changed();
                } else {
                    if (this.activeTool && !(a.ms & M_CE) && this.activeTool.toolType === "qfm") {
                        this.undoPush();
                        this.chem.chargeAtom(this.h_atom);
                        this.changed();
                    } else {
                        if (this.activeTool && !(a.ms & M_CE) && this.activeTool.toolType === "bond") {
                            this.undoPush();
                            this.lastPos = g;
                            this.connectToAtom = this.h_atom;
                            this.dragAtoms = this.chem.connectTo(this.h_atom, this.activeTool.ty, null, -1);
                        } else {
                            if (this.activeTool && this.activeTool.toolType === "chain") {
                                this.undoPush();
                                this.lastPos = g;
                                this.h_atom = this.chem.findClosestAtomLong(this.stow(g));
                                this.connectToAtom = this.h_atom;
                            } else {
                                if (this.activeTool && !(a.ms & M_CE) && this.activeTool.toolType.substr(0, 4) === "frag") {
                                    this.undoPush();
                                    this.lastPos = g;
                                    this.connectToAtom = this.h_atom;
                                    this.dragAtoms = this.chem.connectTo(this.h_atom, this.activeTool.ty, Rings[parseInt(this.activeTool.toolType.substr(5, 1))], 0);
                                } else {
                                    if (this.activeTool && this.activeTool.toolType === "eraser") {
                                        this.undoPush();
                                        this.chem.removeAtoms(this.getDragAtoms());
                                        this.h_bond = this.h_atom = -1;
                                        this.changed();
                                    } else {
                                        this.undoPush();
                                        this.lastPos = g;
                                        this.mode = MODE_DRAG_ATOMS;
                                        this.dragAtoms = this.getDragAtoms();
                                    }
                                }
                            }
                        }
                    }
                }
                this.drawMol();
            } else {
                if (this.h_bond !== -1) {
                    if (this.activeTool && this.activeTool.toolType === "bond") {
                        this.chem.bondToggle(this.h_bond, this.activeTool.ty);
                    } else {
                        if (this.activeTool && this.activeTool.toolType.substr(0, 4) === "frag") {
                            this.undoPush();
                            this.chem.connectToBond(this.h_bond, Rings[parseInt(this.activeTool.toolType.substr(5, 1))]);
                            this.changed();
                        } else {
                            if (this.activeTool && this.activeTool.toolType === "eraser") {
                                this.undoPush();
                                this.chem.removeBonds([this.h_bond]);
                                this.h_bond = this.h_atom = -1;
                                this.changed();
                            } else {
                                this.undoPush();
                                this.lastPos = g;
                                this.dragAtoms = [];
                                if (this.chem.bonds[this.h_bond].ms & M_CE) {
                                    this.chem.bonds.forEach(function(i) {
                                        if (i.ms & M_CE) {
                                            e.dragAtoms.push(i.fr);
                                        }
                                        if (i.ms & M_CE) {
                                            e.dragAtoms.push(i.to);
                                        }
                                    });
                                    this.mode = MODE_DRAG_ATOMS;
                                    this.dragAtoms = this.dragAtoms.sort(function(j, i) {
                                        return j - i;
                                    }).unique();
                                } else {
                                    this.dragAtoms = [this.chem.bonds[this.h_bond].fr, this.chem.bonds[this.h_bond].to];
                                    this.mode = MODE_DRAG_ATOMS;
                                }
                            }
                        }
                    }
                    this.drawMol();
                } else {
                    if (this.activeTool.firstUse || this.activeTool.toolType === "atom" || this.activeTool.toolType === "chain") {
                        var c = this.chem.atoms.length === 0 && this.dx === 0 && this.dy === 0;
                        var d = null;
                        if (this.activeTool.toolType.substr(0, 4) === "frag") {
                            d = Rings[parseInt(this.activeTool.toolType.substr(5, 1))];
                        } else {
                            if (this.activeTool.toolType === "bond") {
                                d = (new Chemical()).makeBond(0, this.activeTool.ty);
                            } else {
                                if (this.activeTool.toolType === "atom" && this.activeTool.cd !== null) {
                                    d = (new Chemical()).makeAtom(Elements[this.activeTool.cd]);
                                } else {
                                    if (this.activeTool.toolType === "chain") {
                                        d = (new Chemical()).makeAtom(6);
                                    }
                                }
                            }
                        }
                        if (d !== null) {
                            this.undoPush();
                            if (c) {
                                this.updateKfc(d, 16);
                            }
                            this.chem.placeFragment(this.stow(g), d);
                            if (this.activeTool.toolType === "chain") {
                                this.connectToAtom = this.chem.atoms.length - 1;
                            }
                            this.changed();
                            this.drawMol();
                        }
                    }
                }
            }
            if (this.activeTool !== null) {
                this.activeTool.firstUse = false;
            }
            break
        }
};

ChemicalView.prototype.onMouseMove = function(B, m) {
    var k = this;
    if (m) {
        B.preventDefault();
    }
    if (m && B.targetTouches.length > 1) {
        var v = this.getMousePosArr(B);
        if (v.length === this.lastPosArr.length) {
            this.multiTouch(this.lastPosArr, v);
        }
        this.lastPosArr = v;
        return;
    }
    var v = this.getMousePos(B, m);
    var u = this.chem.findClosestAtom(this.stow(v));
    var j = 0;
    if (this.lastPos !== null) {
        j = Math.max(Math.abs(v.y - this.lastPos.y), Math.abs(v.x - this.lastPos.x));
    }
    if (this.button === 1) {
        if (j > 1) {
            this.dx += v.x - this.lastPos.x;
            this.dy += v.y - this.lastPos.y;
            this.updateZoom = false;
            this.drawMol();
        }
        this.lastPos = v;
        return;
    }
    if (this.mode === MODE_ZOOM && Math.abs(v.y - this.lastPos.y) > 5) {
        var c = this.wtos(this.chem.centerPoint());
        this.kfc *= (v.y < this.lastPos.y) ? 1.02 : 0.98;
        var b = this.wtos(this.chem.centerPoint());
        this.dx += c.x - b.x;
        this.dy += c.y - b.y;
        this.lastPos = v;
        this.updateZoom = false;
        this.drawMol();
        return;
    }
    if (this.mode === MODE_DRAG_ATOMS) {
        if (j <= 4) {
            return;
        }
        if (this.rotateAroundPoint === null) {
            this.chem.moveAtoms(this.dragAtoms, this.stowd(vesub(v, this.lastPos)));
        } else {
            var w = vector(this.rotateAroundPoint, this.stow(v));
            if (vectorLength(w) < 0.001) {
                return;
            }
            this.chem.rotateAtomsVector(this.dragAtoms, this.rotateAroundPoint, w, -1);
        }
        this.lastPos = v;
        this.drawMol();
        return;
    }
    if (this.mode === MODE_RECT_SEL) {
        if (j <= 4) {
            return;
        }
        this.endPos = v;
        this.lassoPath = [{x: Math.min(this.lastPos.x, this.endPos.x), y: Math.max(this.lastPos.y, this.endPos.y)}, {x: Math.max(this.lastPos.x, this.endPos.x), y: Math.max(this.lastPos.y, this.endPos.y)}, {x: Math.max(this.lastPos.x, this.endPos.x), y: Math.min(this.lastPos.y, this.endPos.y)}, {x: Math.min(this.lastPos.x, this.endPos.x), y: Math.min(this.lastPos.y, this.endPos.y)}];
        this.chem.updateAtomSelection(this.lassoPath.map(function(i) {
            return k.stow(i);
        }));
        this.drawMol();
        return;
    }
    if (this.mode === MODE_CHAIN) {
        if (j <= 4) {
            return;
        }
        this.endPos = v;
        this.atomHold = -1;
        if (this.connectToAtom === -1) {
            return;
        }
        var C = this.connectToAtom;
        var A = this.chem.atoms[C].bo.length;
        var f = A ? this.chem.atoms[C].bo[0] : -1;
        var D = this.canDraw === null ? true : false;
        var e = vector(this.stow(this.lastPos), this.stow(v));
        var o = f !== -1 ? vector(this.chem.atoms[f], this.chem.atoms[C]) : e;
        var z = Math.acos(scmul(e, o) / (vectorLength(o) * vectorLength(e)));
        var q = this.chem.findClosestAtomLong(this.stow(v));
        var a = vectorLength(vector(this.stow(v), this.chem.atoms[f === -1 ? C : f]));
        var F = vectorLength(vector(this.stow(v), this.chem.atoms[C]));
        if (this.chem.atoms.length > 1 && this.newCount === 0) {
            var g;
            var d = vector(this.chem.atoms[C], this.stow(v));
            for (var y = 0; y < this.chem.atoms[C].bo.length; y++) {
                g = vector(this.chem.atoms[C], this.chem.atoms[this.chem.atoms[C].bo[y]]);
                if (angleBetween(g, d) < 60) {
                    return;
                }
            }
        }
        this.showStatus("Press <b>Alt</b> and move mouse to other atom to close the loop");
        if (F > 1.2 && a > 1.2 && !this.chem.hasCollisions(C) && D) {
            if (this.newCount === 0) {
                this.atomHold = this.connectToAtom;
            }
            if (B.altKey) {
                if (u !== -1 && u !== C) {
                    var h = this.chem.atoms[u].clone();
                    this.chem.atoms.push(h);
                    this.chem.bonds.push({fr: C, to: this.chem.atoms.length - 1, ty: 1, ms: 0});
                    this.connectToAtom = this.chem.atoms.length - 1;
                    this.chem.processChemical();
                    this.newCount++;
                    this.lastPos = v;
                }
            } else {
                this.chem.chainTo(C, 1, this.stow(this.lastPos), this.stow(v));
                var s = this.chem.atoms[this.connectToAtom];
                this.connectToAtom = s.bo[s.bo.length - 1];
                this.newCount++;
                this.lastPos = v;
            }
        } else {
            if (a > 0.6 && a < 1.2 && f !== -1 && A === 1) {
                var t;
                if (vectorLength(vector(this.chem.atoms[q], this.stow(v))) <= 1.2 && this.chem.findShortestPath(this.connectToAtom, q).length < 2) {
                    t = q;
                } else {
                    t = -1;
                }
                if (t !== -1 && this.newCount > 0) {
                    for (var y = 0; y < this.chem.atoms.length - t; y++) {
                        this.chem.removeAtoms([this.connectToAtom]);
                        this.h_atom = this.h_bond = -1;
                        this.connectToAtom--;
                        this.newCount--;
                        if (this.chem.atoms.length === 0) {
                            this.connectToAtom = -1;
                        }
                    }
                    if (this.chem.atoms.length > 0 && this.newCount === 0 && this.chem.atoms[this.connectToAtom].bo.length >= 1) {
                        this.connectToAtom = this.atomHold;
                    }
                }
            } else {
                if (z > Math.PI / 2 && a < 0.6 && f !== -1 && A === 1 && this.newCount > 0) {
                    this.chem.removeAtoms([this.connectToAtom]);
                    this.h_atom = this.h_bond = -1;
                    this.connectToAtom = f;
                    this.newCount--;
                    if (this.chem.atoms.length === 0) {
                        this.connectToAtom = -1;
                    }
                    this.lastPos = v;
                }
            }
        }
        this.drawMol();
        return;
    }
    if (this.mode === MODE_LASSO_SEL && this.h_atom === -1 && this.activeTool && this.activeTool.toolType === "lasso" && this.lastPos !== null) {
        if (!this.lassoPath.length || vectorLength(vector(v, this.lassoPath[this.lassoPath.length - 1])) > 8) {
            this.lassoPath.push(v);
            this.chem.updateAtomSelection(this.lassoPath.map(function(i) {
                return k.stow(i);
            }));
            this.drawMol();
        }
        return;
    }
    if (this.dragAtoms.length > 0 && this.connectToAtom !== -1 && j > 5) {
        if (this.activeTool) {
            var w = vector(this.chem.atoms[this.connectToAtom], this.stow(v));
            if (vectorLength(w) < 0.001) {
                return;
            }
            this.h_atom = this.chem.findClosestAtom(this.stow(v));
            if (this.h_atom === this.connectToAtom) {
                this.h_atom = -1;
            }
            this.chem.rotateAtomsVector(this.dragAtoms, this.chem.atoms[this.connectToAtom], w, this.h_atom);
        }
        this.lastPos = v;
        this.drawMol();
        return;
    }
    var x = false;
    u = this.chem.findClosestAtom(this.stow(v));
    if (u !== this.h_atom) {
        this.h_atom = u;
        x = true;
    }
    this.rotateAroundPoint = null;
    if (this.h_atom !== -1 && (this.chem.atoms[this.h_atom].ms & M_CE)) {
        var l = this.chem.apoFromSelection(M_CE);
        if (l.length === 1) {
            this.rotateAroundPoint = {x: this.chem.atoms[l[0]].x, y: this.chem.atoms[l[0]].y, z: 0};
        } else {
            if (l.length === 0) {
                this.rotateAroundPoint = this.chem.centerPoint();
            }
        }
    }
    if (u === -1) {
        var E = this.chem.findClosestBond(this.stow(v));
        if (E !== this.h_bond) {
            this.h_bond = E;
            x = true;
        }
    } else {
        x === this.h_bond !== -1;
        this.h_bond = -1;
    }
    if (this.h_atom !== -1) {
        this.showStatus("<b>Hint</b>: to change atom type press 'C','N','O',etc.. ");
    } else {
        if (this.h_bond !== -1) {
            this.showStatus("<b>Hint</b>: to change bond type press '-','=','#','u','d'");
        } else {
            this.clearStatus();
        }
    }
    if (x) {
        this.drawMol();
    }
};

ChemicalView.prototype.multiTouch = function(e, c) {
    if (e.length !== c.length || e.length < 2) {
        return;
    }
    var h = vemulby(veadd(vesub(c[0], e[0]), vesub(c[1], e[1])), 0.5);
    if (true) {
        var b = vectorLength(vesub(e[0], c[0]));
        var a = vectorLength(vesub(e[1], c[1]));
        var l = null;
        var t, s;
        if (b < a) {
            l = vemulby(veadd(e[0], c[0]), 0.5);
            t = e[1];
            s = c[1];
        } else {
            l = vemulby(veadd(e[1], c[1]), 0.5);
            t = e[0];
            s = c[0];
        }
        if (l !== null) {
            var q = vesub(t, l);
            var p = vesub(s, l);
            var f = Math.acos(scmul(q, p) / (vectorLength(q) * vectorLength(p))) * vemulZSign(p, q);
            if (Math.abs(f) > 0.001) {
                var o = [];
                for (var g = 0; g < this.chem.atoms.length; g++) {
                    o.push(g);
                }
                this.chem.rotateAtomsAround(o, this.stow(l), f);
            }
        }
    }
    b = vectorLength(vesub(e[0], e[1]));
    a = vectorLength(vesub(c[0], c[1]));
    var m = vemulby(veadd(e[0], e[1]), 0.5);
    var k = this.stow(m);
    this.kfc *= a / b;
    var j = this.wtos(k);
    this.dx += m.x - j.x + h.x;
    this.dy += m.y - j.y + h.y;
    this.updateZoom = false;
    this.drawMol();
};

ChemicalView.prototype.atomLabel = function(b) {
    var e = "";
    var d = this.chem.get_qfm(b);
    var c = ((this.atomDislayMask & ATOM_DISPLAY_RS) && b.eo);
    if (b.cd !== 6 || b.bo.length === 0 || d || c || (b.hasOwnProperty("atts") && b.atts.count())) {
        e = ElementNames[b.cd];
        if (d) {
            e += (Math.abs(d) === 1 ? "" : d.toString()) + ((d < 0) ? ("-") : ("+"));
        }
        if (c) {
            e += STEREO_LABEL[b.eo];
        }
        if (b.hasOwnProperty("atts")) {
            for (var a in b.atts) {
                if (b.atts.hasOwnProperty(a)) {
                    e += ";";
                    e += a;
                    e += b.atts[a];
                }
            }
        }
    }
    return e;
};

ChemicalView.prototype.updateKfc = function(c, d) {
    if (c.maxx - c.minx !== 0 && c.maxy - c.miny !== 0) {
        this.kfc = Math.min(40, (this.canvas.width - d * 2) / (c.maxx - c.minx), (this.canvas.height - d * 2) / (c.maxy - c.miny));
    } else {
        this.kfc = 40;
    }
    var a = (c.maxx - c.minx) * this.kfc;
    var b = (c.maxy - c.miny) * this.kfc;
    this.dx = -c.minx * this.kfc + (this.canvas.width - a) / 2;
    this.dy = c.maxy * this.kfc + (this.canvas.height - b) / 2;
    this.updateZoom = false;
};

ChemicalView.prototype.drawMol = function() {
    var d = 14;
    if (!this.chemIsReady) {
        return;
    }
    this.ctx = this.canvas.getContext("2d");
    if (this.android) {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.ctx.lineWidth = 1.5;
    if (this.updateZoom) {
        this.updateKfc(this.chem, 16);
    }
    this.ctx.font = "bold " + d + "px Arial";
    if (this.mode === MODE_CHAIN && this.chem.atoms[this.connectToAtom] !== null && this.chem.atoms[this.connectToAtom].bo[0] >= 0) {
        var q = this.chem.atoms.length - this.newCount;
        var f = 0.25 * (vector(this.wtos(this.chem.atoms[this.chem.atoms[this.connectToAtom].bo[0]]), this.wtos(this.chem.atoms[this.connectToAtom])).x);
        var e = 0.25 * (vector(this.wtos(this.chem.atoms[this.chem.atoms[this.connectToAtom].bo[0]]), this.wtos(this.chem.atoms[this.connectToAtom])).y);
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(this.chem.atoms.length - q, this.wtos(this.chem.atoms[this.connectToAtom]).x + f, this.wtos(this.chem.atoms[this.connectToAtom]).y + e);
    }
    for (var z = 0; z < this.chem.atoms.length; z++) {
        var s = this.chem.atoms[z];
        var a = this.wtos(s);
        if (s.ms & M_CE) {
            this.ctx.fillStyle = "#b2ffb2";
            this.ctx.beginPath();
            this.ctx.arc(a.x, a.y, (1.4 / 6) * this.kfc, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        var C;
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        if ((C = this.atomLabel(s)).length) {
            var x = this.atomColors[ElementNames[s.cd]];
            if (typeof x === "undefined") {
                x = "#000000";
            }
            this.ctx.strokeStyle = x;
            this.ctx.fillStyle = x;
            this.ctx.fillText(C, a.x, a.y);
        }
        if (this.h_atom === z) {
            r = this.atomRect(s, 10);
            this.ctx.strokeStyle = "#ff0000";
            this.ctx.strokeRect(r.x, r.y, r.w, r.h);
        }
    }
    if (this.rotateAroundPoint !== null) {
        var t = this.wtos(this.rotateAroundPoint);
        this.ctx.drawImage(rotateAroundImage, t.x - rotateAroundImage.width / 2, t.y - rotateAroundImage.height / 2);
    }
    for (var z = 0; z < this.chem.bonds.length; z++) {
        var E = this.chem.bonds[z];
        if (E.ms & (M_CE)) {
            var a = this.wtos(vemulby(veadd(this.chem.atoms[E.fr], this.chem.atoms[E.to]), 0.5));
            this.ctx.fillStyle = "#b2ffb2";
            this.ctx.beginPath();
            this.ctx.arc(a.x, a.y, (1.4 / 6) * this.kfc, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    this.ctx.strokeStyle = "#1a1a1a";
    this.ctx.fillStyle = "#000000";
    this.ctx.beginPath();
    for (var z = 0; z < this.chem.bonds.length; z++) {
        var E = this.chem.bonds[z];
        var l = xyz(this.chem.atoms[E.fr]);
        var c = xyz(this.chem.atoms[E.to]);
        var u;
        if (this.atomLabel(this.chem.atoms[E.fr]).length) {
            u = vectorSetLength(vector(l, c), 0.75 * d / this.kfc);
            l = veadd(l, u);
        }
        if (this.atomLabel(this.chem.atoms[E.to]).length) {
            u = vectorSetLength(vector(c, l), 0.75 * d / this.kfc);
            c = veadd(c, u);
        }
        switch (E.ty) {
            case 2:
                var m = this.bondOrtho(E.fr, E.to, E.ty, 0.25);
                if (this.chem.atoms[E.fr].bo.length === 1 || this.chem.atoms[E.to].bo.length === 1) {
                    this.drawLine(veadd(l, vemulby(m, -0.5)), veadd(c, vemulby(m, -0.5)));
                    this.drawLine(veadd(l, vemulby(m, 0.5)), veadd(c, vemulby(m, 0.5)));
                } else {
                    this.drawLine(l, c);
                    var B = vectorSetLength(vector(l, c), 0.2);
                    this.drawLine(veadd(veadd(l, m), B), veadd(veadd(c, m), vemulby(B, -1)));
                }
                break;
            case 3:
                this.drawLine(l, c);
                var m = this.bondOrtho(E.fr, E.to, E.ty, 0.15);
                var B = vectorSetLength(vector(l, c), 0.2);
                this.drawLine(veadd(veadd(l, m), B), veadd(veadd(c, m), vemulby(B, -1)));
                m = vemulby(m, -1);
                this.drawLine(veadd(veadd(l, m), B), veadd(veadd(c, m), vemulby(B, -1)));
                break;
            default:
                if (E.ms & M_BO_UP) {
                    this.ctx.closePath();
                    this.ctx.stroke();
                    var m = this.bondOrtho(E.fr, E.to, 3, 0.2);
                    this.ctx.beginPath();
                    this.moveTo(l);
                    this.lineTo(veadd(c, m));
                    this.lineTo(veadd(c, vemulby(m, -1)));
                    this.lineTo(l);
                    this.ctx.closePath();
                    this.ctx.fill();
                    this.ctx.beginPath();
                } else {
                    if (E.ms & M_BO_DW) {
                        var o = vector(l, c);
                        var A = vectorLength(o);
                        var h = Math.round((this.kfc / 17.5) * (5 * (A / 1.2)));
                        var j = A / h;
                        var b = vectorSetLength(vector(c, l), j);
                        var m = this.bondOrtho(E.fr, E.to, 3, 0.2);
                        var y = xyz(c);
                        for (var w = 0; w < h; w++) {
                            var D = vemulby(m, (1 - w / h));
                            this.drawLine(veadd(y, vemulby(D, 0.9)), veadd(y, vemulby(D, -0.9)));
                            y = veadd(y, b);
                        }
                    } else {
                        this.drawLine(l, c);
                    }
                }
                break
            }
    }
    this.ctx.closePath();
    this.ctx.stroke();
    if (this.h_bond !== -1) {
        this.ctx.beginPath();
        var E = this.chem.bonds[this.h_bond];
        var g = this.bondRect(E);
        for (var w = 0; w < g.length; w++) {
            this.drawLine(g[w], g[(w + 1) % g.length]);
        }
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.stroke();
    }
    if (this.lassoPath.length > 0) {
        this.ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
        this.ctx.strokeStyle = "#000000";
        this.ctx.beginPath();
        for (var z = 0; z < this.lassoPath.length; z++) {
            if (!z) {
                this.ctx.moveTo(this.lassoPath[z].x, this.lassoPath[z].y);
            }
            this.ctx.lineTo(this.lassoPath[(z + 1) % this.lassoPath.length].x, this.lassoPath[(z + 1) % this.lassoPath.length].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};
var Rings = [(new Chemical()).makeRing(6, true), (new Chemical()).makeRing(3, false), (new Chemical()).makeRing(4, false), (new Chemical()).makeRing(5, false), (new Chemical()).makeRing(6, false), (new Chemical()).makeRing(7, false)];
(function(a) {
    var e = function() {
        if (!e.cache.hasOwnProperty(arguments[0])) {
            e.cache[arguments[0]] = e.parse(arguments[0]);
        }
        return e.format.call(null, e.cache[arguments[0]], arguments);
    };
    e.format = function(p, o) {
        var u = 1, s = p.length, j = "", v, f = [], l, h, m, g, q, t;
        for (l = 0; l < s; l++) {
            j = b(p[l]);
            if (j === "string") {
                f.push(p[l]);
            } else {
                if (j === "array") {
                    m = p[l];
                    if (m[2]) {
                        v = o[u];
                        for (h = 0; h < m[2].length; h++) {
                            if (!v.hasOwnProperty(m[2][h])) {
                                throw (e('[sprintf] property "%s" does not exist', m[2][h]))
                            }
                            v = v[m[2][h]];
                        }
                    } else {
                        if (m[1]) {
                            v = o[m[1]];
                        } else {
                            v = o[u++];
                        }
                    }
                    if (/[^s]/.test(m[8]) && (b(v) !== "number")) {
                        throw (e("[sprintf] expecting number but found %s", b(v)))
                    }
                    switch (m[8]) {
                        case"b":
                            v = v.toString(2);
                            break;
                        case"c":
                            v = String.fromCharCode(v);
                            break;
                        case"d":
                            v = parseInt(v, 10);
                            break;
                        case"e":
                            v = m[7] ? v.toExponential(m[7]) : v.toExponential();
                            break;
                        case"f":
                            v = m[7] ? parseFloat(v).toFixed(m[7]) : parseFloat(v);
                            break;
                        case"o":
                            v = v.toString(8);
                            break;
                        case"s":
                            v = ((v = String(v)) && m[7] ? v.substring(0, m[7]) : v);
                            break;
                        case"u":
                            v = v >>> 0;
                            break;
                        case"x":
                            v = v.toString(16);
                            break;
                        case"X":
                            v = v.toString(16).toUpperCase();
                            break
                    }
                    v = (/[def]/.test(m[8]) && m[3] && v >= 0 ? "+" + v : v);
                    q = m[4] ? m[4] === "0" ? "0" : m[4].charAt(1) : " ";
                    t = m[6] - String(v).length;
                    g = m[6] ? c(q, t) : "";
                    f.push(m[5] ? v + g : g + v);
                }
            }
        }
        return f.join("");
    };
    e.cache = {};
    e.parse = function(f) {
        var i = f, j = [], l = [], k = 0;
        while (i) {
            j = /^[^\x25]+/.exec(i);
            if (j !== null) {
                l.push(j[0]);
            } else {
                j = /^\x25{2}/.exec(i);
                if (j !== null) {
                    l.push("%");
                } else {
                    j = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(i);
                    if (j !== null) {
                        if (j[2]) {
                            k |= 1;
                            var m = [], h = j[2], g = [];
                            g = /^([a-z_][a-z_\d]*)/i.exec(h);
                            if (g !== null) {
                                m.push(g[1]);
                                h = h.substring(g[0].length);
                                do {
                                    g = /^\.([a-z_][a-z_\d]*)/i.exec(h);
                                    if (g !== null) {
                                        m.push(g[1]);
                                    } else {
                                        g = /^\[(\d+)\]/.exec(h);
                                        if (g !== null) {
                                            m.push(g[1]);
                                        } else {
                                            throw ("[sprintf] huh?");
                                        }
                                    }
                                    h = h.substring(g[0].length);
                                } while(h !== "");
                            } else {
                                throw ("[sprintf] huh?");
                            }
                            j[2] = m;
                        } else {
                            k |= 2;
                        }
                        if (k === 3) {
                            throw ("[sprintf] mixing positional and named placeholders is not (yet) supported");
                        }
                        l.push(j);
                    } else {
                        throw ("[sprintf] huh?");
                    }
                }
            }
            i = i.substring(j[0].length);
        }
        return l;
    };
    var d = function(g, f, h) {
        h = f.slice(0);
        h.splice(0, 0, g);
        return e.apply(null, h);
    };
    function b(f) {
        return Object.prototype.toString.call(f).slice(8, -1).toLowerCase();
    }
    function c(g, h) {
        for (var f = []; h > 0; f[--h] = g) {
        }
        return f.join("");
    }
    a.sprintf = e;
    a.vsprintf = d;
})(typeof exports !== "undefined" ? exports : window);

function getXMLObject(b) {
    if (b) {
        return/MSIE/.test(navigator.userAgent) ? new XDomainRequest() : new XMLHttpRequest();
    }
    var a = false;
    try {
        a = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (d) {
        try {
            a = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (c) {
            a = false;
        }
    }
    if (!a && typeof XMLHttpRequest !== "undefined") {
        a = new XMLHttpRequest();
    }
    return a;
}
