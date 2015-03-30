var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var co = co || {}
if(!co.doubleduck) co.doubleduck = {}
co.doubleduck.BaseAssets = $hxClasses["co.doubleduck.BaseAssets"] = function() {
};
co.doubleduck.BaseAssets.__name__ = ["co","doubleduck","BaseAssets"];
co.doubleduck.BaseAssets.loader = function() {
	if(co.doubleduck.BaseAssets._loader == null) {
		co.doubleduck.BaseAssets._loader = new createjs.LoadQueue(true);
		co.doubleduck.BaseAssets._loader.installPlugin(createjs.LoadQueue.SOUND);
		co.doubleduck.BaseAssets._loader.onFileLoad = co.doubleduck.BaseAssets.handleFileLoaded;
		co.doubleduck.BaseAssets._loader.onError = co.doubleduck.BaseAssets.handleLoadError;
		co.doubleduck.BaseAssets._loader.setMaxConnections(10);
	}
	return co.doubleduck.BaseAssets._loader;
}
co.doubleduck.BaseAssets.loadAndCall = function(uri,callbackFunc) {
	co.doubleduck.BaseAssets.loader().loadFile(uri);
	co.doubleduck.BaseAssets._loadCallbacks[uri] = callbackFunc;
}
co.doubleduck.BaseAssets.finishLoading = function(manifest,sounds) {
	if(co.doubleduck.SoundManager.available) {
		var _g1 = 0, _g = sounds.length;
		while(_g1 < _g) {
			var currSound = _g1++;
			manifest.push(sounds[currSound] + co.doubleduck.SoundManager.EXTENSION);
			co.doubleduck.SoundManager.initSound(sounds[currSound]);
		}
	}
	if(co.doubleduck.BaseAssets._useLocalStorage) co.doubleduck.BaseAssets.loadFromLocalStorage(manifest);
	if(manifest.length == 0) {
		if(co.doubleduck.BaseAssets.onLoadAll != null) co.doubleduck.BaseAssets.onLoadAll();
	}
	co.doubleduck.BaseAssets.loader().onProgress = co.doubleduck.BaseAssets.handleProgress;
	co.doubleduck.BaseAssets.loader().onFileLoad = co.doubleduck.BaseAssets.manifestFileLoad;
	co.doubleduck.BaseAssets.loader().loadManifest(manifest);
	co.doubleduck.BaseAssets.loader().load();
}
co.doubleduck.BaseAssets.loadAll = function(manifest,sounds) {
	manifest[manifest.length] = "images/duckling/orientation_error_port.png";
	manifest[manifest.length] = "images/duckling/orientation_error_land.png";
	manifest[manifest.length] = "images/duckling/page_marker.png";
}
co.doubleduck.BaseAssets.audioLoaded = function(event) {
	co.doubleduck.BaseAssets._cacheData[event.item.src] = event;
}
co.doubleduck.BaseAssets.manifestFileLoad = function(event) {
	if(co.doubleduck.BaseAssets._useLocalStorage && event != null) {
		var utils = new ddjsutils();
		try {
			var fileName = event.item.src;
			if(HxOverrides.substr(fileName,fileName.length - 3,null) == "jpg") return;
			co.doubleduck.BasePersistence.setValue(event.item.src,utils.getBase64Image(event.result));
		} catch( err ) {
		}
	}
}
co.doubleduck.BaseAssets.loadFromLocalStorage = function(manifest) {
	var entriesToRemove = new Array();
	var _g1 = 0, _g = manifest.length;
	while(_g1 < _g) {
		var i = _g1++;
		var entry = manifest[i];
		var value = co.doubleduck.BasePersistence.getValue(entry);
		if(value != null) {
			var bmp = new createjs.Bitmap("data:image/png;base64," + value);
			co.doubleduck.BaseAssets._cacheData[entry] = bmp.image;
			entriesToRemove.push(manifest[i]);
		}
	}
	var _g1 = 0, _g = entriesToRemove.length;
	while(_g1 < _g) {
		var j = _g1++;
		HxOverrides.remove(manifest,entriesToRemove[j]);
	}
}
co.doubleduck.BaseAssets.handleProgress = function(event) {
	co.doubleduck.BaseAssets.loaded = event.loaded;
	if(event.loaded == event.total) {
		co.doubleduck.BaseAssets.loader().onProgress = null;
		co.doubleduck.BaseAssets.onLoadAll();
	}
}
co.doubleduck.BaseAssets.handleLoadError = function(event) {
}
co.doubleduck.BaseAssets.handleFileLoaded = function(event) {
	if(event != null) {
		co.doubleduck.BaseAssets._cacheData[event.item.src] = event.result;
		var callbackFunc = Reflect.field(co.doubleduck.BaseAssets._loadCallbacks,event.item.src);
		if(callbackFunc != null) callbackFunc();
	}
}
co.doubleduck.BaseAssets.getAsset = function(uri) {
	var cache = Reflect.field(co.doubleduck.BaseAssets._cacheData,uri);
	if(cache == null) {
		if(co.doubleduck.BaseAssets.loader().getResult(uri) != null) {
			cache = co.doubleduck.BaseAssets.loader().getResult(uri);
			co.doubleduck.BaseAssets._cacheData[uri] = cache;
		}
	}
	return cache;
}
co.doubleduck.BaseAssets.getRawImage = function(uri) {
	var cache = co.doubleduck.BaseAssets.getAsset(uri);
	if(cache == null) {
		var bmp = new createjs.Bitmap(uri);
		co.doubleduck.BaseAssets._cacheData[uri] = bmp.image;
		cache = bmp.image;
		null;
	}
	return cache;
}
co.doubleduck.BaseAssets.getImage = function(uri,mouseEnabled) {
	if(mouseEnabled == null) mouseEnabled = false;
	var result = new createjs.Bitmap(co.doubleduck.BaseAssets.getRawImage(uri));
	result.mouseEnabled = mouseEnabled;
	return result;
}
co.doubleduck.BaseAssets.prototype = {
	__class__: co.doubleduck.BaseAssets
}
co.doubleduck.Assets = $hxClasses["co.doubleduck.Assets"] = function() {
	co.doubleduck.BaseAssets.call(this);
};
co.doubleduck.Assets.__name__ = ["co","doubleduck","Assets"];
co.doubleduck.Assets.loadAll = function() {
	var manifest = new Array();
	var sounds = new Array();
	sounds.push("sound/Menu_music");
	sounds.push("sound/Button_click");
	sounds.push("sound/Falling_gems");
	sounds.push("sound/Swaping_gems");
	sounds.push("sound/Unswapped_gem");
	sounds.push("sound/Removing_gems_1");
	sounds.push("sound/Removing_gems_2");
	sounds.push("sound/gems_filling");
	sounds.push("sound/Bigbomb_part_1");
	sounds.push("sound/Bigbomb_part_2");
	sounds.push("sound/Bomb_powerup");
	sounds.push("sound/Color_bomb_powerup");
	sounds.push("sound/Extra_moves_powerup");
	sounds.push("sound/Icicle_fall_powerup");
	sounds.push("sound/Lose_tune");
	sounds.push("sound/Win_tune");
	co.doubleduck.BaseAssets.loadAll(manifest,sounds);
	manifest.push("images/splash/logo_1.png");
	manifest.push("images/splash/logo_2.png");
	manifest.push("images/splash/logo_3.png");
	manifest.push("images/splash/pp_splash_bg.png");
	manifest.push("images/splash/pp_splash_chaz.png");
	manifest.push("images/splash/pp_splash_front.png");
	manifest.push("images/splash/pp_tap2play.png");
	manifest.push("images/general/pp_btn_next.png");
	manifest.push("images/general/pp_chaz_happy.png");
	manifest.push("images/general/pp_session_bg.png");
	manifest.push("images/general/pp_session_bottom.png");
	manifest.push("images/general/font_dark/comma.png");
	manifest.push("images/general/font_dark/0.png");
	manifest.push("images/general/font_dark/1.png");
	manifest.push("images/general/font_dark/2.png");
	manifest.push("images/general/font_dark/3.png");
	manifest.push("images/general/font_dark/4.png");
	manifest.push("images/general/font_dark/5.png");
	manifest.push("images/general/font_dark/6.png");
	manifest.push("images/general/font_dark/7.png");
	manifest.push("images/general/font_dark/8.png");
	manifest.push("images/general/font_dark/9.png");
	manifest.push("images/general/font_light/comma.png");
	manifest.push("images/general/font_light/0.png");
	manifest.push("images/general/font_light/1.png");
	manifest.push("images/general/font_light/2.png");
	manifest.push("images/general/font_light/3.png");
	manifest.push("images/general/font_light/4.png");
	manifest.push("images/general/font_light/5.png");
	manifest.push("images/general/font_light/6.png");
	manifest.push("images/general/font_light/7.png");
	manifest.push("images/general/font_light/8.png");
	manifest.push("images/general/font_light/9.png");
	manifest.push("images/menu/btn_level.png");
	manifest.push("images/menu/btn_sound.png");
	manifest.push("images/menu/pp_btn_arrow_right.png");
	manifest.push("images/menu/pp_btn_gotit.png");
	manifest.push("images/menu/pp_btn_help.png");
	manifest.push("images/menu/pp_help_1.png");
	manifest.push("images/menu/pp_help_2.png");
	manifest.push("images/menu/pp_help_bg.png");
	manifest.push("images/maps/1.png");
	manifest.push("images/maps/2.png");
	manifest.push("images/maps/3.png");
	manifest.push("images/maps/4.png");
	manifest.push("images/maps/5.png");
	manifest.push("images/maps/6.png");
	manifest.push("images/maps/7.png");
	manifest.push("images/maps/8.png");
	manifest.push("images/maps/9.png");
	manifest.push("images/maps/10.png");
	manifest.push("images/maps/11.png");
	manifest.push("images/maps/12.png");
	manifest.push("images/maps/13.png");
	manifest.push("images/maps/14.png");
	manifest.push("images/maps/15.png");
	manifest.push("images/maps/16.png");
	manifest.push("images/maps/17.png");
	manifest.push("images/maps/18.png");
	manifest.push("images/maps/19.png");
	manifest.push("images/maps/20.png");
	manifest.push("images/maps/21.png");
	manifest.push("images/maps/22.png");
	manifest.push("images/maps/23.png");
	manifest.push("images/maps/24.png");
	manifest.push("images/maps/25.png");
	manifest.push("images/maps/26.png");
	manifest.push("images/maps/27.png");
	manifest.push("images/maps/28.png");
	manifest.push("images/maps/29.png");
	manifest.push("images/maps/30.png");
	manifest.push("images/session/pp_gem_board.png");
	manifest.push("images/session/gems_all.png");
	manifest.push("images/session/pp_gem_selection.png");
	manifest.push("images/session/pp_hud_moves_score.png");
	manifest.push("images/session/pp_hud_bar_empty.png");
	manifest.push("images/session/pp_hud_bar_fill.png");
	manifest.push("images/session/powerups.png");
	manifest.push("images/session/blast.png");
	manifest.push("images/session/pp_ice_blast.png");
	manifest.push("images/session/pp_icicle.png");
	manifest.push("images/session/pp_star_empty.png");
	manifest.push("images/session/pp_star_fill.png");
	manifest.push("images/session/pp_btn_pause.png");
	manifest.push("images/session/pp_game_paused.png");
	manifest.push("images/session/pp_btn_menu.png");
	manifest.push("images/session/pp_btn_replay.png");
	manifest.push("images/session/session_end.png");
	manifest.push("images/session/pp_lvlend_fail.png");
	manifest.push("images/session/pp_lvlend_good.png");
	manifest.push("images/session/star_1.png");
	manifest.push("images/session/star_2.png");
	manifest.push("images/session/star_3.png");
	manifest.push("images/session/pp_chaz_sad.png");
	co.doubleduck.BaseAssets.finishLoading(manifest,sounds);
}
co.doubleduck.Assets.__super__ = co.doubleduck.BaseAssets;
co.doubleduck.Assets.prototype = $extend(co.doubleduck.BaseAssets.prototype,{
	__class__: co.doubleduck.Assets
});
co.doubleduck.BaseGame = $hxClasses["co.doubleduck.BaseGame"] = function(stage) {
	this._waitingToStart = false;
	this._orientError = null;
	this._prevWinSize = new createjs.Rectangle(0,0,1,1);
	if(this._wantLandscape) {
		co.doubleduck.BaseGame.MAX_HEIGHT = 427;
		co.doubleduck.BaseGame.MAX_WIDTH = 915;
	} else {
		co.doubleduck.BaseGame.MAX_HEIGHT = 760;
		co.doubleduck.BaseGame.MAX_WIDTH = 427;
	}
	if(co.doubleduck.BaseGame.DEBUG) co.doubleduck.BasePersistence.clearAll();
	var isGS3Stock = /Android 4.0.4/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && /GT-I9300/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && !/Chrome/.test(navigator.userAgent);
	if(isGS3Stock) {
		var loc = window.location.href;
		if(loc.lastIndexOf("index.html") != -1) loc = HxOverrides.substr(loc,0,loc.lastIndexOf("index.html"));
		loc += "error.html";
		window.location.href=loc;
		return;
	}
	co.doubleduck.Persistence.initGameData();
	co.doubleduck.BaseGame._stage = stage;
	co.doubleduck.BaseGame._stage.onTick = $bind(this,this.handleStageTick);
	co.doubleduck.BaseGame._viewport = new createjs.Rectangle(0,0,1,1);
	co.doubleduck.BaseGame.hammer = new Hammer(js.Lib.document.getElementById("stageCanvas"));
	viewporter.preventPageScroll = true;
	viewporter.change($bind(this,this.handleViewportChanged));
	if(viewporter.ACTIVE) {
		viewporter.preventPageScroll = true;
		viewporter.change($bind(this,this.handleViewportChanged));
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._wantLandscape) co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_LAND_URI,$bind(this,this.waitForOrientation)); else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_PORT_URI,$bind(this,this.waitForOrientation));
		} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
	} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
};
co.doubleduck.BaseGame.__name__ = ["co","doubleduck","BaseGame"];
co.doubleduck.BaseGame._stage = null;
co.doubleduck.BaseGame.MAX_HEIGHT = null;
co.doubleduck.BaseGame.MAX_WIDTH = null;
co.doubleduck.BaseGame.hammer = null;
co.doubleduck.BaseGame.getViewport = function() {
	return co.doubleduck.BaseGame._viewport;
}
co.doubleduck.BaseGame.getScale = function() {
	return co.doubleduck.BaseGame._scale;
}
co.doubleduck.BaseGame.getStage = function() {
	return co.doubleduck.BaseGame._stage;
}
co.doubleduck.BaseGame.prototype = {
	setScale: function() {
		var fixedVal = co.doubleduck.BaseGame._viewport.width;
		var varVal = co.doubleduck.BaseGame._viewport.height;
		var idealFixed = co.doubleduck.BaseGame.MAX_WIDTH;
		var idealVar = co.doubleduck.BaseGame.MAX_HEIGHT;
		if(this._wantLandscape) {
			fixedVal = co.doubleduck.BaseGame._viewport.height;
			varVal = co.doubleduck.BaseGame._viewport.width;
			idealFixed = co.doubleduck.BaseGame.MAX_HEIGHT;
			idealVar = co.doubleduck.BaseGame.MAX_WIDTH;
		}
		var regScale = varVal / idealVar;
		if(fixedVal >= varVal) co.doubleduck.BaseGame._scale = regScale; else if(idealFixed * regScale < fixedVal) co.doubleduck.BaseGame._scale = fixedVal / idealFixed; else co.doubleduck.BaseGame._scale = regScale;
	}
	,handleViewportChanged: function() {
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._orientError == null) {
				var err = co.doubleduck.BaseGame.ORIENT_PORT_URI;
				if(this._wantLandscape) err = co.doubleduck.BaseGame.ORIENT_LAND_URI;
				this._orientError = co.doubleduck.BaseAssets.getImage(err);
				this._orientError.regX = this._orientError.image.width / 2;
				this._orientError.regY = this._orientError.image.height / 2;
				this._orientError.x = co.doubleduck.BaseGame._viewport.height / 2;
				this._orientError.y = co.doubleduck.BaseGame._viewport.width / 2;
				co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
				co.doubleduck.BaseGame._stage.update();
			}
		} else if(this._orientError != null) {
			co.doubleduck.BaseGame._stage.removeChild(this._orientError);
			this._orientError = null;
			if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
			if(this._waitingToStart) {
				this._waitingToStart = false;
				co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
			}
		}
	}
	,focused: function() {
		co.doubleduck.SoundManager.unmute();
	}
	,blured: function(e) {
		co.doubleduck.SoundManager.mute();
	}
	,handleResize: function(e) {
		var isFirefox = /Firefox/.test(navigator.userAgent);
		var isAndroid = /Android/.test(navigator.userAgent);
		var screenW = js.Lib.window.innerWidth;
		var screenH = js.Lib.window.innerHeight;
		co.doubleduck.BaseGame._stage.canvas.width = screenW;
		co.doubleduck.BaseGame._stage.canvas.height = screenH;
		var shouldResize = this._wantLandscape == viewporter.isLandscape() || !viewporter.ACTIVE;
		if(shouldResize) {
			if(isFirefox) {
				screenH = Math.floor(co.doubleduck.Main.getFFHeight());
				var ffEstimate = Math.ceil((js.Lib.window.screen.height - 110) * (screenW / js.Lib.window.screen.width));
				if(!isAndroid) ffEstimate = Math.ceil((js.Lib.window.screen.height - 30) * (screenW / js.Lib.window.screen.width));
				if(ffEstimate < screenH) screenH = Math.floor(ffEstimate);
			}
			var wrongSize = screenH < screenW;
			if(this._wantLandscape) wrongSize = screenH > screenW;
			if(!viewporter.ACTIVE || !wrongSize) {
				co.doubleduck.BaseGame._viewport.width = screenW;
				co.doubleduck.BaseGame._viewport.height = screenH;
				this.setScale();
			}
			if(this._orientError != null && isFirefox) this.handleViewportChanged();
		} else if(isFirefox) this.handleViewportChanged();
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
	}
	,handleBackToMenu: function() {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,handleRestart: function(properties) {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this.startSession(properties);
	}
	,handleSessionEnd: function() {
	}
	,handlePlayClick: function(properties) {
		co.doubleduck.BaseGame._stage.removeChild(this._menu);
		this.startSession(properties);
		this._menu.destroy();
		this._menu = null;
	}
	,startSession: function(properties) {
		this._session = new co.doubleduck.Session(properties);
		this._session.onBackToMenu = $bind(this,this.handleBackToMenu);
		this._session.onRestart = $bind(this,this.handleRestart);
		this._session.onSessionEnd = $bind(this,this.handleSessionEnd);
		co.doubleduck.BaseGame._stage.addChild(this._session);
	}
	,showMenu: function() {
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,alphaFade: function(fadeElement) {
		if(fadeElement != null && js.Boot.__instanceof(fadeElement,createjs.Bitmap)) this._fadedText = fadeElement; else if(this._fadedText == null) return;
		if(this._fadedText.alpha == 0) createjs.Tween.get(this._fadedText).to({ alpha : 1},750).call($bind(this,this.alphaFade)); else if(this._fadedText.alpha == 1) createjs.Tween.get(this._fadedText).to({ alpha : 0},1500).call($bind(this,this.alphaFade));
	}
	,showGameSplash: function() {
	}
	,splashEnded: function() {
		js.Lib.document.body.bgColor = "#000000";
		co.doubleduck.BaseGame._stage.removeChild(this._splash);
		this._splash = null;
		js.Lib.window.onresize = $bind(this,this.handleResize);
		this.handleResize(null);
		this.showGameSplash();
	}
	,handleDoneLoading: function() {
		createjs.Tween.get(this._splash).wait(200).to({ alpha : 0},800).call($bind(this,this.splashEnded));
		co.doubleduck.BaseGame._stage.removeChild(this._loadingBar);
		co.doubleduck.BaseGame._stage.removeChild(this._loadingStroke);
	}
	,updateLoading: function() {
		if(co.doubleduck.BaseAssets.loaded != 1) {
			this._loadingBar.visible = true;
			var percent = co.doubleduck.BaseAssets.loaded;
			var barMask = new createjs.Shape();
			barMask.graphics.beginFill("#00000000");
			barMask.graphics.drawRect(this._loadingBar.x - this._loadingBar.image.width / 2,this._loadingBar.y,this._loadingBar.image.width * percent | 0,this._loadingBar.image.height);
			barMask.graphics.endFill();
			this._loadingBar.mask = barMask;
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.updateLoading));
		}
	}
	,exitFocus: function() {
		var hidden = document.mozHidden;
		if(hidden) co.doubleduck.SoundManager.mute(false); else if(!co.doubleduck.SoundManager.getPersistedMute()) co.doubleduck.SoundManager.unmute(false);
	}
	,showSplash: function() {
		if(viewporter.ACTIVE) js.Lib.document.body.bgColor = "#00A99D"; else js.Lib.document.body.bgColor = "#D94D00";
		this._splash = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOGO_URI);
		this._splash.regX = this._splash.image.width / 2;
		this._splash.x = js.Lib.window.innerWidth / 2;
		if(this._wantLandscape) this._splash.y = 20; else this._splash.y = 90;
		co.doubleduck.BaseGame._stage.addChild(this._splash);
		this._loadingStroke = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_STROKE_URI);
		this._loadingStroke.regX = this._loadingStroke.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingStroke,0);
		this._loadingBar = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_FILL_URI);
		this._loadingBar.regX = this._loadingBar.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingBar,1);
		this._loadingBar.x = js.Lib.window.innerWidth / 2;
		this._loadingBar.y = this._splash.y + 192;
		this._loadingStroke.x = this._loadingBar.x;
		this._loadingStroke.y = this._loadingBar.y;
		this._loadingBar.visible = false;
		this.updateLoading();
		co.doubleduck.BaseGame._stage.canvas.width = js.Lib.window.innerWidth;
		co.doubleduck.BaseGame._stage.canvas.height = js.Lib.window.innerHeight;
		co.doubleduck.BaseAssets.onLoadAll = $bind(this,this.handleDoneLoading);
		co.doubleduck.Assets.loadAll();
		document.addEventListener('mozvisibilitychange', this.exitFocus);
	}
	,waitForOrientation: function() {
		this._waitingToStart = true;
		if(this._orientError == null) {
			this._orientError = this.getErrorImage();
			this._orientError.regX = this._orientError.image.width / 2;
			this._orientError.regY = this._orientError.image.height / 2;
			this._orientError.x = js.Lib.window.innerWidth / 2;
			this._orientError.y = js.Lib.window.innerHeight / 2;
			co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
		}
	}
	,getErrorImage: function() {
		if(this._wantLandscape) return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_LAND_URI); else return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_PORT_URI);
	}
	,loadBarStroke: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_STROKE_URI,$bind(this,this.showSplash));
	}
	,loadBarFill: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_FILL_URI,$bind(this,this.loadBarStroke));
	}
	,handleStageTick: function() {
		if(js.Lib.window.innerWidth != this._prevWinSize.width || js.Lib.window.innerHeight != this._prevWinSize.height) {
			this._prevWinSize.width = js.Lib.window.innerWidth;
			this._prevWinSize.height = js.Lib.window.innerHeight;
			this.handleResize(null);
		}
	}
	,_prevWinSize: null
	,_fadedText: null
	,_loadingStroke: null
	,_loadingBar: null
	,_waitingToStart: null
	,_orientError: null
	,_wantLandscape: null
	,_session: null
	,_menu: null
	,_splash: null
	,__class__: co.doubleduck.BaseGame
}
co.doubleduck.BaseMenu = $hxClasses["co.doubleduck.BaseMenu"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseMenu.__name__ = ["co","doubleduck","BaseMenu"];
co.doubleduck.BaseMenu.__super__ = createjs.Container;
co.doubleduck.BaseMenu.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this.onPlayClick = null;
	}
	,onPlayClick: null
	,__class__: co.doubleduck.BaseMenu
});
co.doubleduck.BasePersistence = $hxClasses["co.doubleduck.BasePersistence"] = function() { }
co.doubleduck.BasePersistence.__name__ = ["co","doubleduck","BasePersistence"];
co.doubleduck.BasePersistence.localStorageSupported = function() {
	var result = null;
	try {
		localStorage.setItem("test","test");
		localStorage.removeItem("test");
		result = true;
	} catch( e ) {
		result = false;
	}
	return result;
}
co.doubleduck.BasePersistence.getValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return "0";
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.clearAll = function() {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage.clear();
}
co.doubleduck.BasePersistence.initVar = function(initedVar,defaultVal) {
	if(defaultVal == null) defaultVal = "0";
	var value = co.doubleduck.BasePersistence.getValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.getDynamicValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return { };
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setDynamicValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.initDynamicVar = function(initedVar,defaultVal) {
	var value = co.doubleduck.BasePersistence.getDynamicValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setDynamicValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.printAll = function() {
	var ls = localStorage;
	var localStorageLength = ls.length;
	var _g = 0;
	while(_g < localStorageLength) {
		var entry = _g++;
		null;
	}
}
co.doubleduck.BaseSession = $hxClasses["co.doubleduck.BaseSession"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseSession.__name__ = ["co","doubleduck","BaseSession"];
co.doubleduck.BaseSession.__super__ = createjs.Container;
co.doubleduck.BaseSession.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		createjs.Ticker.removeListener(this);
		this.onRestart = null;
		this.onBackToMenu = null;
		this.onSessionEnd = null;
		this.onNextLevel = null;
	}
	,sessionEnded: function() {
		if(this.onSessionEnd != null) {
			createjs.Ticker.setPaused(false);
			this.onSessionEnd();
		}
	}
	,handleReplayClick: function(properties) {
		if(this.onRestart != null) {
			createjs.Ticker.setPaused(false);
			this.onRestart(properties);
		}
	}
	,handleMenuClick: function() {
		if(this.onBackToMenu != null) {
			createjs.Ticker.setPaused(false);
			this.onBackToMenu();
		}
	}
	,_replayBtn: null
	,_menuBtn: null
	,onNextLevel: null
	,onBackToMenu: null
	,onSessionEnd: null
	,onRestart: null
	,__class__: co.doubleduck.BaseSession
});
co.doubleduck.LabeledContainer = $hxClasses["co.doubleduck.LabeledContainer"] = function(bmp) {
	createjs.Container.call(this);
	this._bitmap = bmp;
	if(this._bitmap != null) {
		if(js.Boot.__instanceof(this._bitmap,createjs.Bitmap)) {
			this._bmp = this._bitmap;
			this.image = this._bmp.image;
		} else if(js.Boot.__instanceof(this._bitmap,createjs.BitmapAnimation)) {
			this.anim = this._bitmap;
			this.image = { width : this.anim.spriteSheet._frameWidth, height : this.anim.spriteSheet._frameHeight};
		}
	}
};
co.doubleduck.LabeledContainer.__name__ = ["co","doubleduck","LabeledContainer"];
co.doubleduck.LabeledContainer.__super__ = createjs.Container;
co.doubleduck.LabeledContainer.prototype = $extend(createjs.Container.prototype,{
	getLabel: function() {
		return this._label;
	}
	,addBitmap: function() {
		this.addChild(this._bitmap);
	}
	,addCenteredBitmap: function() {
		this._bitmap.regX = this.image.width / 2;
		this._bitmap.regY = this.image.height / 2;
		this._bitmap.x = this.image.width / 2;
		this._bitmap.y = this.image.height / 2;
		this.addChild(this._bitmap);
	}
	,addBitmapLabel: function(label,fontType,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(fontType == null) fontType = "";
		if(this._bitmapText != null) this.removeChild(this._bitmapText);
		var fontHelper = new co.doubleduck.FontHelper(fontType);
		this._bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding,centered);
		if(this.image != null) {
			this._bitmapText.x = this.image.width / 2;
			this._bitmapText.y = this.image.height / 2;
		}
		this._label = label;
		this.addChild(this._bitmapText);
	}
	,scaleBitmapFont: function(scale) {
		this._bitmapText.scaleX = this._bitmapText.scaleY = scale;
	}
	,shiftLabel: function(shiftX,shiftY) {
		this._bitmapText.x *= shiftX;
		this._bitmapText.y *= shiftY;
	}
	,setBitmapLabelY: function(ly) {
		this._bitmapText.y = ly;
	}
	,setBitmapLabelX: function(lx) {
		this._bitmapText.x = lx;
	}
	,getBitmapLabelWidth: function() {
		var maxWidth = 0;
		var _g1 = 0, _g = this._bitmapText.getNumChildren();
		while(_g1 < _g) {
			var digit = _g1++;
			var currentDigit = js.Boot.__cast(this._bitmapText.getChildAt(digit) , createjs.Bitmap);
			var endsAt = currentDigit.x + currentDigit.image.width;
			if(endsAt > maxWidth) maxWidth = endsAt;
		}
		return maxWidth;
	}
	,setLabelY: function(ly) {
		this._text.y = ly;
	}
	,setLabelX: function(lx) {
		this._text.x = lx;
	}
	,addLabel: function(label,color) {
		if(color == null) color = "#000000";
		if(this._text != null) this.removeChild(this._text);
		this._label = label;
		this._text = new createjs.Text(label,"bold 22px Arial",color);
		this._text.regY = this._text.getMeasuredHeight() / 2;
		this._text.textAlign = "center";
		if(this._bitmap != null) {
			this._text.x = this._bitmap.x;
			this._text.y = this._bitmap.y;
		}
		this.addChild(this._text);
	}
	,changeText: function(txt) {
	}
	,_bitmapText: null
	,_text: null
	,_bmp: null
	,_bitmap: null
	,_label: null
	,anim: null
	,image: null
	,__class__: co.doubleduck.LabeledContainer
});
co.doubleduck.Button = $hxClasses["co.doubleduck.Button"] = function(bmp,pauseAffected,clickType,clickSound) {
	if(clickType == null) clickType = 2;
	if(pauseAffected == null) pauseAffected = true;
	this._lastClickTime = 0;
	co.doubleduck.LabeledContainer.call(this,bmp);
	if(clickSound == null && co.doubleduck.Button._defaultSound != null) this._clickSound = co.doubleduck.Button._defaultSound; else this._clickSound = clickSound;
	this._bitmap.mouseEnabled = true;
	this._clickType = clickType;
	this._pauseAffected = pauseAffected;
	if(clickType == co.doubleduck.Button.CLICK_TYPE_TOGGLE) {
		var initObject = { };
		var size = this.image.width / 2;
		initObject.images = [this.image];
		initObject.frames = { width : size, height : this.image.height, regX : size / 2, regY : this.image.height / 2};
		this._states = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._states.gotoAndStop(0);
		this.onClick = $bind(this,this.handleToggle);
		this.addChild(this._states);
	} else this.addCenteredBitmap();
	this.onPress = $bind(this,this.handlePress);
};
co.doubleduck.Button.__name__ = ["co","doubleduck","Button"];
co.doubleduck.Button.setDefaultSound = function(sound) {
	co.doubleduck.Button._defaultSound = sound;
}
co.doubleduck.Button.__super__ = co.doubleduck.LabeledContainer;
co.doubleduck.Button.prototype = $extend(co.doubleduck.LabeledContainer.prototype,{
	handleEndPressTint: function() {
		co.doubleduck.Utils.tintBitmap(this._bmp,1,1,1,1);
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
	}
	,setToggle: function(flag) {
		if(flag) this._states.gotoAndStop(0); else this._states.gotoAndStop(1);
	}
	,handleToggle: function(e) {
		if(this.onToggle == null) return;
		if(this._lastClickPos == null) this._lastClickPos = new createjs.Point(0,0);
		if((this._lastClickPos.x < e.stageX + 1 || this._lastClickPos.x > e.stageX + 1) && (this._lastClickPos.y < e.stageY + 1 || this._lastClickPos.y > e.stageY + 1)) {
			var now = createjs.Ticker.getTime(true);
			if(now < this._lastClickTime + 500) return;
		}
		this._lastClickPos.x = e.stageX;
		this._lastClickPos.y = e.stageY;
		this._lastClickTime = createjs.Ticker.getTime(true);
		this._states.gotoAndStop(1 - this._states.currentFrame);
		this.onToggle();
	}
	,handlePress: function(event) {
		if(createjs.Ticker.getPaused() && this._pauseAffected) return;
		if(this._clickType == co.doubleduck.Button.CLICK_TYPE_HOLD) {
			if(this.onHoldStart != null) {
				this.onHoldStart();
				event.onMouseUp = this.onHoldFinish;
			}
		}
		if(this.onClick != null) {
			if(this._clickSound != null) co.doubleduck.SoundManager.playEffect(this._clickSound);
			switch(this._clickType) {
			case co.doubleduck.Button.CLICK_TYPE_TINT:
				if(this._bmp != null) {
					co.doubleduck.Utils.tintBitmap(this._bmp,0.55,0.55,0.55,1);
					var tween = createjs.Tween.get(this._bmp);
					tween.ignoreGlobalPause = true;
					tween.wait(200).call($bind(this,this.handleEndPressTint));
					if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
				}
				break;
			case co.doubleduck.Button.CLICK_TYPE_JUICY:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.25;
				this._bitmap.scaleY = startScaleY * 0.75;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},500,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_SCALE:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.18;
				this._bitmap.scaleY = startScaleY * 1.18;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},200,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_TOGGLE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_NONE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_HOLD:
				throw "Use onHoldStart with CLICK_TYPE_HOLD, not onClick";
				break;
			}
		}
	}
	,setNoSound: function() {
		this._clickSound = null;
	}
	,_lastClickPos: null
	,_lastClickTime: null
	,_clickSound: null
	,_juiceTween: null
	,_clickType: null
	,_pauseAffected: null
	,_states: null
	,onHoldFinish: null
	,onHoldStart: null
	,onToggle: null
	,__class__: co.doubleduck.Button
});
co.doubleduck.DataLoader = $hxClasses["co.doubleduck.DataLoader"] = function() { }
co.doubleduck.DataLoader.__name__ = ["co","doubleduck","DataLoader"];
co.doubleduck.DataLoader.readTilesData = function(mapFile) {
	var data = co.doubleduck.Utils.getImageData(mapFile);
	var h = data.height | 0;
	var w = data.width | 0;
	var tiles = new Array();
	var _g = 0;
	while(_g < h) {
		var y = _g++;
		var _g1 = 0;
		while(_g1 < w) {
			var x = _g1++;
			var isWall = data.data[w * y * 4 + x * 4] == 0;
			var newTile = new co.doubleduck.Tile(x,y,isWall);
			tiles.push(newTile);
		}
	}
	return tiles;
}
co.doubleduck.DataLoader.getReward = function(pattern) {
	if(pattern == null) return null;
	var rewards = new GameplayDB().getAllRewards();
	var _g = 0;
	while(_g < rewards.length) {
		var reward = rewards[_g];
		++_g;
		if(reward.name == pattern[0]) return reward;
	}
	return null;
}
co.doubleduck.DataLoader.getLevel = function(id) {
	var levels = co.doubleduck.DataLoader.getAllLevels();
	var _g = 0;
	while(_g < levels.length) {
		var level = levels[_g];
		++_g;
		if((level.id | 0) == id) return level;
	}
	throw "Error: no such level!";
}
co.doubleduck.DataLoader.getAllLevels = function() {
	return new LevelDB().getAllLevels();
}
co.doubleduck.DataLoader.getLevelCount = function() {
	return co.doubleduck.DataLoader.getAllLevels().length;
}
co.doubleduck.FontHelper = $hxClasses["co.doubleduck.FontHelper"] = function(type) {
	this._fontType = type;
};
co.doubleduck.FontHelper.__name__ = ["co","doubleduck","FontHelper"];
co.doubleduck.FontHelper.prototype = {
	getNumber: function(num,scale,forceContainer,dims,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(forceContainer == null) forceContainer = false;
		if(scale == null) scale = 1;
		if(num >= 0 && num < 10) {
			var result = new createjs.Container();
			var bmp = this.getDigit(num);
			bmp.scaleX = bmp.scaleY = scale;
			result.addChild(bmp);
			if(centered) {
				result.regX = bmp.image.width / 2;
				result.regY = bmp.image.height / 2;
			}
			if(forceContainer) {
				if(dims != null) {
					dims.width = bmp.image.width;
					dims.height = bmp.image.height;
				}
				return result;
			} else return bmp;
		} else {
			var result = new createjs.Container();
			var numString = "" + num;
			var digits = new Array();
			var totalWidth = 0;
			digits[digits.length] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,0,1)));
			digits[0].scaleX = digits[0].scaleY = scale;
			result.addChild(digits[0]);
			totalWidth += digits[0].image.width * scale;
			if(numString.length == 4 || numString.length == 7) {
				this._lastComma = this.getComma();
				this._lastComma.scaleX = this._lastComma.scaleY = scale;
				this._lastComma.x = digits[0].x + digits[0].image.width + padding;
				result.addChild(this._lastComma);
				totalWidth += this._lastComma.image.width * scale;
			}
			var _g1 = 1, _g = numString.length;
			while(_g1 < _g) {
				var i = _g1++;
				var index = digits.length;
				digits[index] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,i,1)));
				if(numString.length - i == 3 || numString.length - i == 6) digits[index].x = this._lastComma.x + this._lastComma.image.width + padding; else digits[index].x = digits[index - 1].x + digits[index - 1].image.width + padding;
				digits[index].scaleX = digits[index].scaleY = scale;
				result.addChild(digits[index]);
				totalWidth += digits[index].image.width * scale + padding;
				if(numString.length - i == 4 || numString.length - i == 7) {
					this._lastComma = this.getComma();
					this._lastComma.scaleX = this._lastComma.scaleY = scale;
					this._lastComma.x = digits[index].x + digits[index].image.width + padding;
					result.addChild(this._lastComma);
					totalWidth += this._lastComma.image.width * scale + padding;
				}
			}
			if(centered) {
				result.regX = totalWidth / 2;
				result.regY = digits[0].image.height / 2;
			}
			if(dims != null) {
				dims.width = totalWidth;
				dims.height = digits[0].image.height;
			}
			return result;
		}
	}
	,getDigit: function(digit) {
		var digit1 = co.doubleduck.BaseAssets.getImage(this._fontType + digit + ".png");
		return digit1;
	}
	,getComma: function() {
		return co.doubleduck.BaseAssets.getImage(this._fontType + "comma.png");
	}
	,_fontType: null
	,_lastComma: null
	,__class__: co.doubleduck.FontHelper
}
co.doubleduck.Game = $hxClasses["co.doubleduck.Game"] = function(stage) {
	this._wantLandscape = false;
	co.doubleduck.BaseGame.call(this,stage);
};
co.doubleduck.Game.__name__ = ["co","doubleduck","Game"];
co.doubleduck.Game.__super__ = co.doubleduck.BaseGame;
co.doubleduck.Game.prototype = $extend(co.doubleduck.BaseGame.prototype,{
	removeSplash: function() {
		co.doubleduck.BaseGame._stage.removeChild(this._splashBack);
		co.doubleduck.BaseGame._stage.removeChild(this._cave);
		this._splashBack = null;
	}
	,closeSplash: function() {
		this.showMenu();
		createjs.Tween.get(this._cave).to({ alpha : 0},100).call($bind(this,this.removeSplash));
	}
	,dropToCave: function() {
		co.doubleduck.BaseGame._stage.removeChild(this._splashChaz);
		co.doubleduck.BaseGame._stage.removeChild(this._splashFront);
		co.doubleduck.BaseGame._stage.removeChild(this._gameLogo);
		co.doubleduck.BaseGame._stage.removeChild(this._gameLogo2);
		co.doubleduck.BaseGame._stage.removeChild(this._gameLogoPolar);
		co.doubleduck.BaseGame._stage.removeChild(this._tapToPlay);
		this._splashBack.onClick = null;
		this._tapToPlay = null;
		this._cave = co.doubleduck.Utils.getCenteredImage("images/general/pp_session_bg.png",true);
		this._cave.x = co.doubleduck.BaseGame.getViewport().width * 0.5;
		this._cave.y = this._splashBack.y + co.doubleduck.BaseGame.getScale() * 0.5 * (this._splashBack.image.height + this._cave.image.height) - 2;
		co.doubleduck.BaseGame._stage.addChild(this._cave);
		createjs.Tween.get(this._splashBack).to({ y : 2 * this._splashBack.y - this._cave.y},350,createjs.Ease.sineInOut);
		createjs.Tween.get(this._cave).to({ y : co.doubleduck.BaseGame.getViewport().height / 2},350,createjs.Ease.sineInOut).call($bind(this,this.closeSplash));
	}
	,removeElements: function() {
		this._splashBack.onClick = null;
		this._splashBack.mouseEnabled = false;
		var logoFadeTime = 500;
		createjs.Tween.get(this._gameLogo).to({ alpha : 0},logoFadeTime);
		createjs.Tween.get(this._gameLogo2).to({ alpha : 0},logoFadeTime);
		createjs.Tween.get(this._gameLogoPolar).to({ alpha : 0},logoFadeTime);
		createjs.Tween.removeTweens(this._tapToPlay);
		createjs.Tween.get(this._tapToPlay).to({ alpha : 0},100);
		var newScale = co.doubleduck.BaseGame.getScale() * 1.2;
		var zoomTime = 750;
		createjs.Tween.get(this._splashFront).wait(logoFadeTime).to({ scaleX : newScale, scaleY : newScale, x : this._splashFront.x - co.doubleduck.BaseGame.getViewport().width, y : this._splashFront.y + co.doubleduck.BaseGame.getViewport().height * 0.3},zoomTime,createjs.Ease.sineIn);
		createjs.Tween.get(this._splashChaz).wait(logoFadeTime).to({ scaleX : newScale, scaleY : newScale, x : this._splashChaz.x + co.doubleduck.BaseGame.getViewport().width, y : this._splashChaz.y + co.doubleduck.BaseGame.getViewport().height * 0.3},zoomTime,createjs.Ease.sineIn).call($bind(this,this.dropToCave));
	}
	,handleNextLevel: function(properties) {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this.startSession(properties);
	}
	,startSession: function(properties) {
		co.doubleduck.BaseGame.prototype.startSession.call(this,properties);
		this._session.onNextLevel = $bind(this,this.handleNextLevel);
	}
	,showTap2Play: function() {
		this.alphaFade(this._tapToPlay);
		this._splashBack.onClick = $bind(this,this.removeElements);
	}
	,showGameSplash: function() {
		this._splashBack = co.doubleduck.Utils.getCenteredImage("images/splash/pp_splash_bg.png",true);
		this._splashBack.scaleX = this._splashBack.scaleY = co.doubleduck.BaseGame.getScale();
		this._splashBack.regY = this._splashBack.image.height / 2;
		this._splashBack.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._splashBack.y = co.doubleduck.BaseGame.getViewport().height / 2;
		this._splashBack.mouseEnabled = true;
		co.doubleduck.BaseGame._stage.addChild(this._splashBack);
		this._splashChaz = co.doubleduck.BaseAssets.getImage("images/splash/pp_splash_chaz.png");
		this._splashChaz.regX = this._splashChaz.image.width;
		this._splashChaz.regY = this._splashChaz.image.height;
		this._splashChaz.scaleX = this._splashChaz.scaleY = co.doubleduck.BaseGame.getScale();
		this._splashChaz.x = co.doubleduck.BaseGame.getViewport().width + co.doubleduck.BaseGame.getScale() * 70;
		this._splashChaz.y = this._splashBack.y + this._splashBack.image.height * co.doubleduck.BaseGame.getScale() * 0.5;
		co.doubleduck.BaseGame._stage.addChild(this._splashChaz);
		this._splashFront = co.doubleduck.BaseAssets.getImage("images/splash/pp_splash_front.png");
		this._splashFront.regX = this._splashFront.image.width / 2;
		this._splashFront.regY = this._splashFront.image.height;
		this._splashFront.scaleX = this._splashFront.scaleY = co.doubleduck.BaseGame.getScale();
		this._splashFront.x = co.doubleduck.BaseGame.getViewport().width;
		this._splashFront.y = this._splashBack.y + this._splashBack.image.height * co.doubleduck.BaseGame.getScale() * 0.5;
		co.doubleduck.BaseGame._stage.addChild(this._splashFront);
		this._gameLogo = co.doubleduck.Utils.getCenteredImage("images/splash/logo_1.png",true);
		this._gameLogo.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._gameLogo.y = co.doubleduck.BaseGame.getViewport().height * 0.2;
		this._gameLogo.alpha = 0;
		co.doubleduck.BaseGame._stage.addChild(this._gameLogo);
		this._gameLogo2 = co.doubleduck.Utils.getCenteredImage("images/splash/logo_2.png",true);
		this._gameLogo2.x = this._gameLogo.x;
		this._gameLogo2.y = this._gameLogo.y;
		this._gameLogo2.alpha = 0;
		co.doubleduck.BaseGame._stage.addChild(this._gameLogo2);
		this._gameLogoPolar = co.doubleduck.Utils.getCenteredImage("images/splash/logo_3.png",true);
		this._gameLogoPolar.scaleX = this._gameLogoPolar.scaleY = co.doubleduck.BaseGame.getScale() * 2.5;
		this._gameLogoPolar.x = this._gameLogo.x;
		this._gameLogoPolar.y = this._gameLogo.y;
		this._gameLogoPolar.alpha = 0;
		co.doubleduck.BaseGame._stage.addChild(this._gameLogoPolar);
		this._tapToPlay = co.doubleduck.Utils.getCenteredImage("images/splash/pp_tap2play.png",true);
		this._tapToPlay.x = co.doubleduck.BaseGame.getViewport().width * 0.3;
		this._tapToPlay.y = co.doubleduck.BaseGame.getViewport().height * 0.53;
		this._tapToPlay.alpha = 0;
		co.doubleduck.BaseGame._stage.addChild(this._tapToPlay);
		var moveTime = 1400;
		createjs.Tween.get(this._splashFront).to({ x : 0},moveTime,createjs.Ease.sineInOut);
		createjs.Tween.get(this._splashChaz).to({ x : co.doubleduck.BaseGame.getViewport().width},moveTime,createjs.Ease.sineInOut);
		createjs.Tween.get(this._gameLogo).wait(moveTime).to({ alpha : 1},350,createjs.Ease.sineInOut);
		createjs.Tween.get(this._gameLogo2).wait(moveTime + 600).to({ alpha : 1},350,createjs.Ease.sineInOut);
		createjs.Tween.get(this._gameLogoPolar).wait(moveTime + 1100).to({ alpha : 1, scaleX : co.doubleduck.BaseGame.getScale(), scaleY : co.doubleduck.BaseGame.getScale()},350,createjs.Ease.sineInOut).wait(500).call($bind(this,this.showTap2Play));
		co.doubleduck.Button.setDefaultSound("sound/Button_click");
	}
	,_cave: null
	,_tapToPlay: null
	,_gameLogoPolar: null
	,_gameLogo2: null
	,_gameLogo: null
	,_splashFront: null
	,_splashChaz: null
	,_splashBack: null
	,__class__: co.doubleduck.Game
});
co.doubleduck.Popup = $hxClasses["co.doubleduck.Popup"] = function(backgroundImage) {
	createjs.Container.call(this);
	this.visible = false;
	this._background = co.doubleduck.Utils.getCenteredImage(backgroundImage);
	this.addChild(this._background);
	this._menuButton = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.Popup.MENU),true);
	this._menuButton.x = -this._menuButton.image.width * 1.75;
	this._menuButton.regY = this._menuButton.image.height;
	this._menuButton.y = this._background.image.height / 2 - this._menuButton.image.height * 0.4;
	this.addChild(this._menuButton);
	this._menuButton.mouseEnabled = true;
	this._menuButton.onClick = $bind(this,this.handleMenu);
	this._replayButton = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.Popup.RESTART),true);
	this._replayButton.x = this._menuButton.x + this._menuButton.image.width * 1.15;
	this._replayButton.regY = this._replayButton.image.height;
	this._replayButton.y = this._menuButton.y;
	this.addChild(this._replayButton);
	this._replayButton.mouseEnabled = true;
	this._replayButton.onClick = $bind(this,this.handleRestart);
	this._continueButton = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(co.doubleduck.Popup.NEXT),true);
	this._continueButton.x = this._replayButton.x + this._replayButton.image.width * 1.15;
	this._continueButton.regY = this._continueButton.image.height;
	this._continueButton.y = this._menuButton.y;
	this.addChild(this._continueButton);
	this._continueButton.mouseEnabled = true;
	this._continueButton.onClick = $bind(this,this.handleContinue);
};
co.doubleduck.Popup.__name__ = ["co","doubleduck","Popup"];
co.doubleduck.Popup.__super__ = createjs.Container;
co.doubleduck.Popup.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this.removeAllChildren();
		createjs.Tween.removeTweens(this);
		this.onRestart = null;
		this.onContinue = null;
		this.onMenu = null;
		this.onNext = null;
		this._background = null;
		this._menuButton = null;
		this._replayButton = null;
		this._continueButton = null;
	}
	,handleContinue: function() {
		this.onContinue();
	}
	,handleRestart: function() {
		this.onRestart();
	}
	,handleMenu: function() {
		this.onMenu();
	}
	,_continueButton: null
	,_replayButton: null
	,_menuButton: null
	,_background: null
	,onNext: null
	,onMenu: null
	,onContinue: null
	,onRestart: null
	,__class__: co.doubleduck.Popup
});
co.doubleduck.GameOverPopup = $hxClasses["co.doubleduck.GameOverPopup"] = function() {
	co.doubleduck.Popup.call(this,"images/session/session_end.png");
	this._continueButton.y *= 0.9;
	this._replayButton.y *= 0.9;
	this._menuButton.y *= 0.9;
};
co.doubleduck.GameOverPopup.__name__ = ["co","doubleduck","GameOverPopup"];
co.doubleduck.GameOverPopup.__super__ = co.doubleduck.Popup;
co.doubleduck.GameOverPopup.prototype = $extend(co.doubleduck.Popup.prototype,{
	showStar: function(index) {
		var starBmp = co.doubleduck.Utils.getCenteredImage("images/session/star_" + index + ".png");
		starBmp.regY = starBmp.image.height;
		starBmp.y = starBmp.image.height - this._background.image.height / 2;
		starBmp.scaleX = starBmp.scaleY = 0.9;
		starBmp.alpha = 0;
		this.addChild(starBmp);
		var starRipple = co.doubleduck.Utils.getCenteredImage("images/session/star_" + index + ".png");
		starRipple.regY = starRipple.image.height;
		starRipple.y = starRipple.image.height - this._background.image.height / 2;
		starRipple.alpha = 0;
		this.addChild(starRipple);
		var expandTime = 300;
		createjs.Tween.get(starBmp).to({ scaleX : 1.03, scaleY : 1.03, alpha : 1},expandTime,createjs.Ease.circInOut).to({ scaleX : 1, scaleY : 1},250,createjs.Ease.circInOut);
		createjs.Tween.get(starRipple).to({ scaleX : 1.03, scaleY : 1.03, alpha : 0.6},expandTime,createjs.Ease.circInOut).to({ scaleX : 1.2, scaleY : 1.2, alpha : 0},1000,createjs.Ease.sineOut);
	}
	,tweenChaz: function(x1,y1,x2,y2) {
		this.chaz.x = x1;
		this.chaz.y = y1;
		createjs.Tween.get(this.chaz).to({ x : x2},400,createjs.Ease.sineInOut).wait(1500).to({ x : x1},250,createjs.Ease.sineInOut);
		createjs.Tween.get(this.chaz).to({ y : y2},400,createjs.Ease.linear).wait(1500).to({ y : y1},250,createjs.Ease.linear);
	}
	,show: function(points,stars,level) {
		this.visible = true;
		var text;
		if(level == co.doubleduck.DataLoader.getLevelCount()) {
			this._continueButton.visible = false;
			this._replayButton.x = this._continueButton.x;
		}
		if(stars == 0) {
			co.doubleduck.SoundManager.playEffect("sound/Lose_tune");
			text = co.doubleduck.Utils.getCenteredImage("images/session/pp_lvlend_fail.png");
			text.regY = 0;
			this.chaz = co.doubleduck.BaseAssets.getImage("images/session/pp_chaz_sad.png");
			this._continueButton.visible = false;
			this._menuButton.x = -this._menuButton.image.width * 1.15;
			this._replayButton.x = this._menuButton.x + this._menuButton.image.width * 1.3;
		} else {
			co.doubleduck.SoundManager.playEffect("sound/Win_tune");
			this.chaz = co.doubleduck.BaseAssets.getImage("images/general/pp_chaz_happy.png");
			text = co.doubleduck.Utils.getCenteredImage("images/session/pp_lvlend_good.png");
			text.regY = 0;
			text.y -= text.image.height * 1.5;
			var pointsText = co.doubleduck.Utils.getBitmapLabel("" + points,co.doubleduck.Hud.DARK_FONT,4);
			this.addChild(pointsText);
			pointsText.regY = 0;
			pointsText.y = text.y + text.image.height * 1.5;
			if(stars >= 1) createjs.Tween.get(this).wait(250).call($bind(this,this.showStar),[1]);
			if(stars >= 2) createjs.Tween.get(this).wait(650).call($bind(this,this.showStar),[2]);
			if(stars >= 3) createjs.Tween.get(this).wait(1050).call($bind(this,this.showStar),[3]);
		}
		this.addChild(text);
		this.chaz.regX = this.chaz.image.width;
	}
	,destroy: function() {
		co.doubleduck.Popup.prototype.destroy.call(this);
		this.chaz = null;
	}
	,getChaz: function() {
		return this.chaz;
	}
	,chaz: null
	,__class__: co.doubleduck.GameOverPopup
});
co.doubleduck.Gem = $hxClasses["co.doubleduck.Gem"] = function(tile,type) {
	this._alive = true;
	this._destroyed = false;
	if(co.doubleduck.Gem._gemSheet == null) {
		var initObject = { };
		var bmp = co.doubleduck.BaseAssets.getImage("images/session/gems_all.png");
		initObject.images = [bmp.image];
		initObject.frames = { width : co.doubleduck.Gem.WIDTH, height : co.doubleduck.Gem.HEIGHT, regX : 0, regY : 0};
		co.doubleduck.Gem._gemSheet = new createjs.SpriteSheet(initObject);
		bmp = null;
		initObject = { };
		bmp = co.doubleduck.BaseAssets.getImage("images/session/blast.png");
		initObject.images = [bmp.image];
		initObject.frames = { width : 118, height : 118, regX : 0, regY : 0};
		initObject.animations = { };
		initObject.animations.explodeStart = { frames : [0,1,2], frequency : 1, next : "explodeEnd"};
		initObject.animations.explodeEnd = { frames : [3,4,5,6,7,8], frequency : 1};
		co.doubleduck.Gem._blastSheet = new createjs.SpriteSheet(initObject);
	}
	this._patterns = new Array();
	this._type = type;
	this._tile = tile;
	this._graphicContainer = new createjs.Container();
	this._graphicContainer.regX = co.doubleduck.Gem.WIDTH / 2;
	this._graphicContainer.regY = co.doubleduck.Gem.HEIGHT / 2;
	this._selectGraphic = co.doubleduck.BaseAssets.getImage("images/session/pp_gem_selection.png");
	this._graphicContainer.addChild(this._selectGraphic);
	this._selectGraphic.alpha = 0;
	this._gemGraphic = new createjs.BitmapAnimation(co.doubleduck.Gem._gemSheet);
	this._graphicContainer.addChild(this._gemGraphic);
	this._explosionGraphic = new createjs.BitmapAnimation(co.doubleduck.Gem._blastSheet);
	this._graphicContainer.addChild(this._explosionGraphic);
	this._explosionGraphic.x = -(118 - co.doubleduck.Gem.WIDTH) / 2;
	this._explosionGraphic.y = -(118 - co.doubleduck.Gem.HEIGHT) / 2;
	this._explosionGraphic.onAnimationEnd = $bind(this,this.handleExplosionAnimationEnd);
	switch( (type)[1] ) {
	case 0:
		this._gemGraphic.gotoAndStop(3);
		break;
	case 1:
		this._gemGraphic.gotoAndStop(1);
		break;
	case 2:
		this._gemGraphic.gotoAndStop(0);
		break;
	case 3:
		this._gemGraphic.gotoAndStop(4);
		break;
	case 4:
		this._gemGraphic.gotoAndStop(2);
		break;
	}
	this._width = co.doubleduck.Gem.WIDTH;
	this._height = co.doubleduck.Gem.HEIGHT;
	this._tile.setGem(this);
};
co.doubleduck.Gem.__name__ = ["co","doubleduck","Gem"];
co.doubleduck.Gem.onGetTile = null;
co.doubleduck.Gem._blastSheet = null;
co.doubleduck.Gem._gemSheet = null;
co.doubleduck.Gem.prototype = {
	unSelect: function() {
		createjs.Tween.removeTweens(this._selectGraphic);
		this._selectGraphic.visible = true;
		this._selectGraphic.alpha = 1;
		createjs.Tween.get(this._selectGraphic).to({ alpha : 0},co.doubleduck.Gem.SELECTION_TWEEN,createjs.Ease.sineInOut);
	}
	,select: function() {
		this._selectGraphic.visible = true;
		this._selectGraphic.alpha = 0;
		createjs.Tween.get(this._selectGraphic).to({ alpha : 1},co.doubleduck.Gem.SELECTION_TWEEN,createjs.Ease.sineInOut);
	}
	,setTile: function(t) {
		this._tile = t;
		if(t == null) return;
		if(t.getGem() != this) t.setGem(this,false);
	}
	,getTile: function() {
		var tile = this._tile;
		if(this._tile == null) tile = this._lastTileBeforeRemoved;
		return tile;
	}
	,handleExplosionAnimationEnd: function(animation,lastAnimation) {
		if(lastAnimation == "explodeStart") this._gemGraphic.visible = false;
		if(lastAnimation == "explodeEnd" || this._noBlast) {
			this._explosionGraphic.visible = false;
			this._explosionGraphic.stop();
		}
	}
	,unhighlight: function() {
		this._isHighlighting = false;
		if(this._highlight == null || this._type == null || this._gemGraphic == null || this._graphicContainer.children == null) return;
		createjs.Tween.get(this._highlight).to({ alpha : 0},co.doubleduck.Gem.SELECTION_TWEEN).call(($_=this._graphicContainer,$bind($_,$_.removeChild)),[this._highlight]);
	}
	,pulse: function() {
		if(this._isHighlighting) {
			var targetAlpha = 1 - this._highlight.alpha;
			createjs.Tween.get(this._highlight).to({ alpha : targetAlpha},co.doubleduck.Gem.HINT_INTERVAL).call($bind(this,this.pulse));
		}
	}
	,highlight: function() {
		this._isHighlighting = true;
		this._highlight = new createjs.BitmapAnimation(co.doubleduck.Gem._gemSheet);
		switch( (this._type)[1] ) {
		case 0:
			this._highlight.gotoAndStop(8);
			break;
		case 1:
			this._highlight.gotoAndStop(6);
			break;
		case 2:
			this._highlight.gotoAndStop(5);
			break;
		case 3:
			this._highlight.gotoAndStop(9);
			break;
		case 4:
			this._highlight.gotoAndStop(7);
			break;
		}
		this._highlight.alpha = 0;
		this._graphicContainer.addChild(this._highlight);
		this.pulse();
	}
	,_isHighlighting: null
	,_highlight: null
	,removePowerUpGraphics: function(powerup) {
		if(this._graphicContainer != null && powerup.getGraphic() != null) this._graphicContainer.removeChild(powerup.getGraphic()); else {
		}
	}
	,destroy: function() {
		this._alive = false;
		this.removeHighlight();
		if(this._patterns.length > 0 && this.getPatternsPowerUps().length > 0) {
			var powerupTween = this.replaceWithPowerUp();
			if(powerupTween == null) this.drawGemToRelatedPowerUp(); else return powerupTween;
		}
		this.handleRemove();
		this._lastTileBeforeRemoved = this._tile;
		if(this._tile != null && this._tile.getGem() == this) this._tile.setGem(null);
		this.setTile(null);
		this._graphicContainer.removeChild(this._selectGraphic);
		this._graphicContainer = null;
		this._selectGraphic.visible = false;
		this._selectGraphic = null;
		while(this._patterns.length > 0) this._patterns.pop();
		this._patterns = null;
		this._powerUp = null;
		this._destroyed = true;
		return null;
	}
	,isDestroyed: function() {
		if(this.getPowerUp() != null && (this.getPowerUp().getGraphic() == null || !this.getPowerUp().isVisible())) {
			this.setPowerUp(null);
			return true;
		}
		return this._destroyed;
	}
	,isAlive: function() {
		return this._alive;
	}
	,getPatternsPowerUps: function() {
		var powers = new Array();
		var _g = 0, _g1 = this.getPatterns();
		while(_g < _g1.length) {
			var pattern = _g1[_g];
			++_g;
			var power = pattern.getPatternPowerUp();
			if(power != null && power.isActive()) powers.push(power);
		}
		return powers;
	}
	,replaceWithPowerUp: function() {
		if(this.getPowerUp() != null) return null;
		var _g = 0, _g1 = this._patterns;
		while(_g < _g1.length) {
			var pattern = _g1[_g];
			++_g;
			var powerUpLocation = pattern.getPowerupLocation();
			if(powerUpLocation != null && powerUpLocation.isEquel(this.getTile())) {
				this.setPowerUp(pattern.getPatternPowerUp());
				return this.addPowerupGraphics();
			}
		}
		return null;
	}
	,drawGemToRelatedPowerUp: function() {
		if(this.getPowerUp() != null) return;
		if(this.getPatternsPowerUps().length > 0) {
			var powerupToAttractTo = this.getPatternsPowerUps()[0];
			var powerUpLocation = powerupToAttractTo.getPattern().getPowerupLocation();
			this._noBlast = true;
			this.tweenTo(powerUpLocation.getGemX(),powerUpLocation.getGemY(),250);
		} else return;
	}
	,addPowerupGraphics: function() {
		if(this.getPowerUp() != null && this.getPowerUp().getGraphic() != null) {
			this._graphicContainer.removeChild(this._gemGraphic);
			this.getPowerUp().getGraphic().alpha = 0;
			this._graphicContainer.addChild(this.getPowerUp().getGraphic());
			return createjs.Tween.get(this.getPowerUp().getGraphic()).to({ alpha : 1},350);
		}
		return null;
	}
	,removeHighlight: function() {
		if(this._highlight != null) {
			this._graphicContainer.removeChild(this._highlight);
			createjs.Tween.removeTweens(this._highlight);
			this._highlight = null;
		}
	}
	,tweenTo: function(targetX,targetY,duration) {
		this.lastPositionTween = createjs.Tween.get(this.getGraphic());
		return this.lastPositionTween.to({ x : targetX, y : targetY},duration,createjs.Ease.sineIn).call($bind(this,this.tweenOver));
	}
	,tweenOver: function() {
		this.lastPositionTween = null;
	}
	,removeFromMap: function(map) {
		map.removeChild(this.getGraphic());
	}
	,getType: function() {
		return this._type;
	}
	,setGraphicY: function(y) {
		this._graphicContainer.y = y;
	}
	,setGraphicX: function(x) {
		this._graphicContainer.x = x;
	}
	,getGraphic: function() {
		return this._graphicContainer;
	}
	,destroyAnimation: function() {
		this._explosionGraphic.gotoAndPlay("explodeStart");
	}
	,getHeight: function() {
		return this._height;
	}
	,getWidth: function() {
		return this._width;
	}
	,handleRemove: function() {
		if(this.onRemove != null) this.onRemove(this);
	}
	,getPatterns: function() {
		return this._patterns;
	}
	,addPattern: function(pattern) {
		co.doubleduck.Utils.addToArrayWithoutDuplicates(this._patterns,pattern);
	}
	,clearPowerUp: function(powerup) {
		this.removePowerUpGraphics(powerup);
		if(powerup == this.getPowerUp()) {
			var pattern = this.getPowerUp().getPattern();
			this.setPowerUp(null);
			HxOverrides.remove(this._patterns,pattern);
		} else throw "why is the saved power up different?";
	}
	,handleGetTile: function(x,y) {
		return co.doubleduck.Gem.onGetTile(x,y);
	}
	,setPowerUp: function(powerup) {
		this._powerUp = powerup;
	}
	,getPowerUp: function() {
		return this._powerUp;
	}
	,disable: function() {
		createjs.Tween.removeTweens(this);
		this._tile = null;
		this._lastTileBeforeRemoved = null;
		this._graphicContainer.removeAllChildren();
		this._graphicContainer = null;
		this._selectGraphic = null;
		this._gemGraphic = null;
		this._explosionGraphic = null;
		this._powerUp = null;
		this._patterns = null;
		if(this.lastPositionTween != null) createjs.Tween.removeTweens(this.lastPositionTween);
		this.lastPositionTween = null;
		this.onRemove = null;
		co.doubleduck.Gem.onGetTile = null;
	}
	,onRemove: null
	,lastPositionTween: null
	,_alive: null
	,_height: null
	,_width: null
	,_patterns: null
	,_powerUp: null
	,_replaceGemWithPowerUp: null
	,_noBlast: null
	,_destroyed: null
	,_explosionGraphic: null
	,_gemGraphic: null
	,_selectGraphic: null
	,_graphicContainer: null
	,_lastTileBeforeRemoved: null
	,_tile: null
	,_type: null
	,__class__: co.doubleduck.Gem
}
co.doubleduck.GemType = $hxClasses["co.doubleduck.GemType"] = { __ename__ : ["co","doubleduck","GemType"], __constructs__ : ["RED","GREEN","BLUE","ORANGE","PURPLE"] }
co.doubleduck.GemType.RED = ["RED",0];
co.doubleduck.GemType.RED.toString = $estr;
co.doubleduck.GemType.RED.__enum__ = co.doubleduck.GemType;
co.doubleduck.GemType.GREEN = ["GREEN",1];
co.doubleduck.GemType.GREEN.toString = $estr;
co.doubleduck.GemType.GREEN.__enum__ = co.doubleduck.GemType;
co.doubleduck.GemType.BLUE = ["BLUE",2];
co.doubleduck.GemType.BLUE.toString = $estr;
co.doubleduck.GemType.BLUE.__enum__ = co.doubleduck.GemType;
co.doubleduck.GemType.ORANGE = ["ORANGE",3];
co.doubleduck.GemType.ORANGE.toString = $estr;
co.doubleduck.GemType.ORANGE.__enum__ = co.doubleduck.GemType;
co.doubleduck.GemType.PURPLE = ["PURPLE",4];
co.doubleduck.GemType.PURPLE.toString = $estr;
co.doubleduck.GemType.PURPLE.__enum__ = co.doubleduck.GemType;
co.doubleduck.Hud = $hxClasses["co.doubleduck.Hud"] = function() {
	createjs.Container.call(this);
	this._backgroundLeft = co.doubleduck.BaseAssets.getImage("images/session/pp_hud_moves_score.png");
	this._backgroundRight = co.doubleduck.BaseAssets.getImage("images/session/pp_hud_bar_empty.png");
	this._barFill = co.doubleduck.BaseAssets.getImage("images/session/pp_hud_bar_fill.png");
	this._backgroundRight.x = this._backgroundLeft.image.width * 0.945;
	var shiftX = this._backgroundLeft.image.width * 0.022;
	this._backgroundRight.x += shiftX;
	this._backgroundLeft.x += shiftX;
	this._barFill.x = this._backgroundRight.x;
	this.addChild(this._backgroundRight);
	this.addChild(this._backgroundLeft);
	this._movesCounter = new co.doubleduck.LabeledContainer(null);
	this._movesCounter.x = this._backgroundLeft.image.width * 0.825;
	this._movesCounter.y = this._backgroundLeft.image.height * 0.58;
	this._score = new co.doubleduck.LabeledContainer(null);
	this._score.x = this._backgroundLeft.image.width * 0.375;
	this._score.y = this._backgroundLeft.image.height * 0.4;
	this._score.scaleX = this._score.scaleY = 0.6;
	this._goal = new co.doubleduck.LabeledContainer(null);
	this._goal.x = this._score.x;
	this._goal.y = this._backgroundLeft.image.height * 0.68;
	this._goal.scaleX = this._goal.scaleY = 0.65;
	this._level = new co.doubleduck.LabeledContainer(null);
	this._level.x = this._score.x + this._backgroundRight.image.width * 1.25;
	this._level.y = this._backgroundLeft.image.height * 0.68;
	this._level.scaleX = this._level.scaleY = 0.65;
	this.addChild(this._movesCounter);
	this.addChild(this._score);
	this.addChild(this._goal);
	this.addChild(this._level);
	this._barMask = new createjs.Shape();
	this._barMask.graphics.beginFill("#000000");
	this._barMask.graphics.drawRect(this._barFill.x,this._barFill.y,this._barFill.image.width,this._barFill.image.height);
	this._barMask.graphics.endFill();
	this._barMask.regX = this._barFill.image.width;
	this._barFill.mask = this._barMask;
	this.setBar(0);
	this.addChild(this._emptyStar1 = this.getEmptyStar());
	this.addChild(this._emptyStar2 = this.getEmptyStar());
	this.addChild(this._emptyStar3 = this.getEmptyStar());
	this.addChild(this._barFill);
	this.addChild(this._filledStar1 = this.getFilledStar());
	this.addChild(this._filledStar2 = this.getFilledStar());
	this.addChild(this._filledStar3 = this.getFilledStar());
	var starsY = this._barFill.y + this._filledStar1.image.height * 0.95;
	this._emptyStar1.y = this._emptyStar2.y = this._emptyStar3.y = this._filledStar1.y = this._filledStar2.y = this._filledStar3.y = starsY;
	this._filledStar1.visible = this._filledStar2.visible = this._filledStar3.visible = false;
	this._pauseButton = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/pp_btn_pause.png"),false);
	this._pauseButton.onClick = $bind(this,this.handlePause);
	this.addChild(this._pauseButton);
	this._pauseButton.x = this._backgroundLeft.x + this._pauseButton.image.width * 0.1;
	this._pauseButton.y = this._backgroundLeft.y + this._pauseButton.image.height * 0.35;
	this._pauseContainer = new co.doubleduck.Popup("images/session/pp_game_paused.png");
	this._pauseContainer.onMenu = $bind(this,this.handleMenuPause);
	this._pauseContainer.onRestart = $bind(this,this.handleRestartPause);
	this._pauseContainer.onContinue = $bind(this,this.handleContinuePause);
	this._pauseContainer.regY = co.doubleduck.BaseAssets.getImage("images/session/pp_game_paused.png").image.height / 2;
	this.addChild(this._pauseContainer);
};
co.doubleduck.Hud.__name__ = ["co","doubleduck","Hud"];
co.doubleduck.Hud.__super__ = createjs.Container;
co.doubleduck.Hud.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this.removeAllChildren();
		createjs.Tween.removeTweens(this);
		this.onRestart = null;
		this.onContinue = null;
		this.onMenu = null;
		this._movesCounter = null;
		this._score = null;
		this._goal = null;
		this._level = null;
		this._backgroundLeft = null;
		this._backgroundRight = null;
		this._pauseButton = null;
		this._barFill = null;
		this._barMask = null;
		this._emptyStar1 = null;
		this._emptyStar2 = null;
		this._emptyStar3 = null;
		this._filledStar1 = null;
		this._filledStar2 = null;
		this._filledStar3 = null;
		this._pauseContainer.destroy();
		this._pauseContainer = null;
	}
	,getHeight: function() {
		return Math.max(this._backgroundLeft.image.height,this._backgroundRight.image.height);
	}
	,getWidth: function() {
		return this._backgroundLeft.image.width + this._backgroundRight.image.width;
	}
	,setLevel: function(level) {
		this._level.addLabel("LEVEL " + level,"#00496e");
	}
	,setGoal: function(goal) {
		this._goal.addLabel("GOAL: " + goal,"#00496e");
	}
	,setScore: function(score) {
		this._score.addBitmapLabel("" + score,co.doubleduck.Hud.LIGHT_FONT);
	}
	,setMoves: function(moves) {
		this._movesCounter.addBitmapLabel("" + moves,co.doubleduck.Hud.LIGHT_FONT,2);
	}
	,setBar: function(fill) {
		if(fill > 1.0) fill = 1.0;
		createjs.Tween.get(this._barMask).to({ x : this._barFill.image.width * fill},100,createjs.Ease.sineInOut);
	}
	,getFilledStar: function() {
		var star = co.doubleduck.Utils.getCenteredImage("images/session/pp_star_fill.png");
		star.regY = 0;
		return star;
	}
	,getEmptyStar: function() {
		var star = co.doubleduck.Utils.getCenteredImage("images/session/pp_star_empty.png");
		var filledImage = co.doubleduck.BaseAssets.getRawImage("images/session/pp_star_fill.png");
		star.regX -= (filledImage.width - star.image.width) / 2;
		star.regY = -(filledImage.height - star.image.height) / 2;
		return star;
	}
	,setStarPosition3: function(starX) {
		this._emptyStar3.regX = this._filledStar3.regX = this._filledStar3.image.width * 1.25;
		this._emptyStar3.x = this._filledStar3.x = this._barFill.x + starX * this._barFill.image.width;
	}
	,setStarPosition2: function(starX) {
		this._emptyStar2.x = this._filledStar2.x = this._barFill.x + starX * this._barFill.image.width;
	}
	,setStarPosition1: function(starX) {
		this._emptyStar1.x = this._filledStar1.x = this._barFill.x + starX * this._barFill.image.width;
	}
	,handlePause: function() {
		this._pauseContainer.visible = true;
		this._pauseButton.visible = false;
		createjs.Tween.get(this._pauseContainer).wait(100).call(createjs.Ticker.setPaused,[true]);
	}
	,setPauseContainerPosition: function(x,y) {
		this._pauseContainer.x = x;
		this._pauseContainer.y = y;
	}
	,showPauseButton: function() {
		this._pauseButton.visible = true;
	}
	,lightStar3: function() {
		this._emptyStar3.visible = false;
		this._filledStar3.visible = true;
	}
	,lightStar2: function() {
		this._emptyStar2.visible = false;
		this._filledStar2.visible = true;
	}
	,lightStar1: function() {
		this._emptyStar1.visible = false;
		this._filledStar1.visible = true;
	}
	,handleContinuePause: function() {
		createjs.Ticker.setPaused(false);
		this._pauseContainer.visible = false;
		this.onContinue();
	}
	,handleRestartPause: function() {
		createjs.Ticker.setPaused(false);
		this._pauseContainer.visible = false;
		this.onRestart();
	}
	,handleMenuPause: function() {
		createjs.Ticker.setPaused(false);
		this._pauseContainer.visible = false;
		this.onMenu();
	}
	,movesEffect: function() {
		var scale = this._movesCounter.scaleX;
		createjs.Tween.get(this._movesCounter).to({ scaleX : scale * 2, scaleY : scale * 2},150,createjs.Ease.sineInOut).to({ scaleX : scale, scaleY : scale},150,createjs.Ease.sineInOut);
	}
	,_pauseContainer: null
	,_filledStar3: null
	,_filledStar2: null
	,_filledStar1: null
	,_emptyStar3: null
	,_emptyStar2: null
	,_emptyStar1: null
	,_barMask: null
	,_barFill: null
	,_pauseButton: null
	,_backgroundRight: null
	,_backgroundLeft: null
	,_level: null
	,_goal: null
	,_score: null
	,_movesCounter: null
	,onMenu: null
	,onContinue: null
	,onRestart: null
	,__class__: co.doubleduck.Hud
});
co.doubleduck.Main = $hxClasses["co.doubleduck.Main"] = function() { }
co.doubleduck.Main.__name__ = ["co","doubleduck","Main"];
co.doubleduck.Main._stage = null;
co.doubleduck.Main._game = null;
co.doubleduck.Main._ffHeight = null;
co.doubleduck.Main.main = function() {
	co.doubleduck.Main.testFFHeight();
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	co.doubleduck.Main._stage = new createjs.Stage(js.Lib.document.getElementById("stageCanvas"));
	co.doubleduck.Main._game = new co.doubleduck.Game(co.doubleduck.Main._stage);
	createjs.Ticker.addListener(co.doubleduck.Main._stage);
	createjs.Touch.enable(co.doubleduck.Main._stage,true,false);
}
co.doubleduck.Main.testFFHeight = function() {
	var isAplicable = /Firefox/.test(navigator.userAgent);
	if(isAplicable && viewporter.ACTIVE) co.doubleduck.Main._ffHeight = js.Lib.window.innerHeight;
}
co.doubleduck.Main.getFFHeight = function() {
	return co.doubleduck.Main._ffHeight;
}
co.doubleduck.Map = $hxClasses["co.doubleduck.Map"] = function(mapNum) {
	this._powerups = new Array();
	co.doubleduck.PowerUp.onPowerUpAdded = $bind(this,this.handlePowerUpAdded);
	this._initComplete = false;
	createjs.Container.call(this);
	this._tileContainer = new createjs.Container();
	this._tileContainer.alpha = 0;
	this.addChild(this._tileContainer);
	createjs.Tween.get(this._tileContainer).to({ alpha : 0.8},co.doubleduck.Map.ALPHA_TWEEN,createjs.Ease.sineInOut);
	this._tiles = co.doubleduck.DataLoader.readTilesData("images/maps/" + mapNum + ".png");
	this._gems = new Array();
	var _g1 = 0, _g = co.doubleduck.Map.ROWS;
	while(_g1 < _g) {
		var y = _g1++;
		var _g3 = 0, _g2 = co.doubleduck.Map.COLUMNS;
		while(_g3 < _g2) {
			var x = _g3++;
			var tile = this.getTile(x,y);
			this._tileContainer.addChild(tile.getGraphic());
			tile.onClick = $bind(this,this.handleTileClick);
		}
	}
	this.nextStep(co.doubleduck.State.FILL);
	this._initComplete = true;
	this._enabled = true;
};
co.doubleduck.Map.__name__ = ["co","doubleduck","Map"];
co.doubleduck.Map._isSwapping = null;
co.doubleduck.Map.__super__ = createjs.Container;
co.doubleduck.Map.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this._tileContainer.removeAllChildren();
		this._tileContainer = null;
		var _g = 0, _g1 = this._tiles.slice();
		while(_g < _g1.length) {
			var tile = _g1[_g];
			++_g;
			tile.disable();
			HxOverrides.remove(this._tiles,tile);
		}
		this._tiles = null;
		var _g = 0, _g1 = this._gems.slice();
		while(_g < _g1.length) {
			var gem = _g1[_g];
			++_g;
			gem.disable();
			HxOverrides.remove(this._gems,gem);
		}
		this._gems = null;
		var _g = 0, _g1 = this._powerups.slice();
		while(_g < _g1.length) {
			var powerup = _g1[_g];
			++_g;
			powerup.disable();
			HxOverrides.remove(this._powerups,powerup);
		}
		this._powerups = null;
		if(this._patterns != null && this._patterns.length > 0) {
			var _g = 0, _g1 = this._patterns.slice();
			while(_g < _g1.length) {
				var pattern = _g1[_g];
				++_g;
				pattern.disable();
				HxOverrides.remove(this._patterns,pattern);
			}
			this._patterns = null;
		}
		if(this._latestGemRemovalTween != null) {
			createjs.Tween.removeTweens(this._latestGemRemovalTween);
			this._latestGemRemovalTween = null;
		}
		createjs.Tween.removeTweens(this);
		if(this._selectedTile != null) {
			createjs.Tween.removeTweens(this._selectedTile);
			this._selectedTile = null;
		}
		this.canMove = null;
		this.onMoveStart = null;
		this.onMoveEnd = null;
		this.onPointsGain = null;
		this.onIncreaseMoves = null;
	}
	,checkForRemainingOldGems: function() {
		var _g = 0, _g1 = this._tiles;
		while(_g < _g1.length) {
			var tile = _g1[_g];
			++_g;
			var gem = tile.getGem();
			if(gem != null && (gem.isDestroyed() || gem.getTile() != tile)) tile.setGem(null,false);
		}
	}
	,areThereHoles: function() {
		var _g = 0, _g1 = this._tiles;
		while(_g < _g1.length) {
			var tile = _g1[_g];
			++_g;
			if(tile.getType() == co.doubleduck.TileType.EMPTY && tile.getGem() == null) return true;
		}
		return false;
	}
	,executeRest: function() {
		if(this.areThereHoles()) {
			this.nextStep(co.doubleduck.State.GRAVITY);
			return;
		}
		if(this._powerups.length > 0) {
			this.nextStep(co.doubleduck.State.POWERUPS);
			return;
		}
		if(!this.searchHints(false)) {
		}
		this.handleMoveEnd();
	}
	,executeGravity: function() {
		var stepFinishedTween = null;
		var tilesThatDrop = new Array();
		stepFinishedTween = this.applyGravity(tilesThatDrop);
		if(stepFinishedTween == null) stepFinishedTween = createjs.Tween.get(this);
		return stepFinishedTween;
	}
	,executePowerUps: function() {
		var powerupTween = this.activateFirstExistingPowerUp();
		return powerupTween;
	}
	,executeSolve: function() {
		var stepFinishedTween = null;
		var tilesWithPatterns = new Array();
		var _g = 0, _g1 = this._tiles;
		while(_g < _g1.length) {
			var newTile = _g1[_g];
			++_g;
			if(this.hasPattern(newTile)) tilesWithPatterns.push(newTile);
		}
		var tilesToRemove = new Array();
		this._patterns = new Array();
		var _g = 0;
		while(_g < tilesWithPatterns.length) {
			var tile = tilesWithPatterns[_g];
			++_g;
			var solvedTiles = this.solve(tile);
			co.doubleduck.Utils.concatWithoutDuplicates(tilesToRemove,solvedTiles);
		}
		this.gainPoints(this._patterns);
		var lastPowerUpTween = null;
		if(tilesToRemove.length > 0) {
			var powerUpTween = this.removeGemsFromMap(tilesToRemove);
			if(powerUpTween != null) lastPowerUpTween = powerUpTween;
		}
		co.doubleduck.PowerUp.onGetTile = $bind(this,this.getTile);
		var lingeringPowerUps = new Array();
		var _g = 0, _g1 = this._powerups;
		while(_g < _g1.length) {
			var power = _g1[_g];
			++_g;
			try {
				var tile = power.getTile();
				if(tile.getGem().getPowerUp() != power) throw "powerup and its gem don't match";
			} catch( msg ) {
				if( js.Boot.__instanceof(msg,String) ) {
					lingeringPowerUps.push(power);
				} else throw(msg);
			}
		}
		if(lingeringPowerUps.length > 0) {
			while(lingeringPowerUps.length > 0) {
				var power = lingeringPowerUps.pop();
				power.deactivate();
				var _g = 0, _g1 = this._gems;
				while(_g < _g1.length) {
					var gem = _g1[_g];
					++_g;
					if(gem.getPowerUp() == power) gem.setPowerUp(null);
				}
				HxOverrides.remove(this._powerups,power);
			}
			lingeringPowerUps = null;
		}
		if(lastPowerUpTween != null) stepFinishedTween = lastPowerUpTween; else stepFinishedTween = this._latestGemRemovalTween;
		return stepFinishedTween;
	}
	,executeCheck: function() {
		var _g = 0, _g1 = this._tiles;
		while(_g < _g1.length) {
			var tile = _g1[_g];
			++_g;
			if(this.hasPattern(tile)) return true;
		}
		return false;
	}
	,executeFill: function() {
		var firstTime = !this._initComplete;
		var newlyAddedGems = this.fillUp();
		while(!this.searchHints(false)) {
			while(newlyAddedGems.length > 0) {
				var gem = newlyAddedGems.pop();
				gem.getTile().setGem(null);
				gem.setTile(null);
			}
			newlyAddedGems = this.fillUp();
		}
		var stepFinishedTween = null;
		newlyAddedGems.reverse();
		var baseDelay = { miliseconds : 100.0};
		var numberOfGems = newlyAddedGems.length;
		var _g = 0;
		while(_g < newlyAddedGems.length) {
			var gem = newlyAddedGems[_g];
			++_g;
			stepFinishedTween = this.addGemGraphic(gem,baseDelay,numberOfGems);
		}
		if(numberOfGems > 0) co.doubleduck.SoundManager.playEffect("sound/gems_filling");
		return stepFinishedTween;
	}
	,fillUp: function() {
		var firstTime = !this._initComplete;
		var newlyAddedGems = null;
		if(firstTime) {
			newlyAddedGems = this._gems;
			var _g1 = 0, _g = co.doubleduck.Map.ROWS;
			while(_g1 < _g) {
				var y = _g1++;
				var _g3 = 0, _g2 = co.doubleduck.Map.COLUMNS;
				while(_g3 < _g2) {
					var x = _g3++;
					var tile = this.getTile(x,y);
					if(tile.getType() == co.doubleduck.TileType.EMPTY) this.addNewRandomGem(tile,true);
				}
			}
		} else newlyAddedGems = this.addGemsInGaps();
		return newlyAddedGems;
	}
	,addGemsInGaps: function() {
		var newlyAddedGems = new Array();
		var _g = 0, _g1 = this._tiles;
		while(_g < _g1.length) {
			var currTile = _g1[_g];
			++_g;
			if(currTile.getType() == co.doubleduck.TileType.EMPTY && currTile.getGem() == null) {
				var newGem = this.addNewRandomGem(currTile,false);
				currTile.setGem(newGem,false);
				co.doubleduck.Utils.addToArrayWithoutDuplicates(newlyAddedGems,newGem);
			}
		}
		return newlyAddedGems;
	}
	,swapGemsBack: function(tile1,tile2) {
		co.doubleduck.SoundManager.playEffect("sound/Unswapped_gem");
		this.swapGems(tile1,tile2);
	}
	,executeSwap: function(tile1,tile2) {
		if(!this.canMove()) return null;
		if(tile1.getType() == co.doubleduck.TileType.WALL || tile2.getType() == co.doubleduck.TileType.WALL) {
			co.doubleduck.Map._isSwapping = false;
			this._selectedTile = null;
			if(tile1.getGem() != null) tile1.unSelect();
			if(tile2.getGem() != null) tile2.unSelect();
			return null;
		}
		if(!co.doubleduck.Map._isSwapping) this.startSwapping();
		var swappedTile = this.wouldSwitchingSolve(tile1,tile2);
		co.doubleduck.SoundManager.playEffect("sound/Swaping_gems");
		if(swappedTile == null) {
			this.swapGems(tile1,tile2).call($bind(this,this.swapGemsBack),[tile1,tile2]).call($bind(this,this.endSwapping));
			return createjs.Tween.get(swappedTile).wait(co.doubleduck.Map.SWAP_TWEEN * 2);
		} else {
			this.handleMoveStart();
			return this.swapGems(tile1,tile2).call($bind(this,this.endSwapping));
		}
	}
	,nextStep: function(currState,tile1,tile2) {
		var stepFinishedTween = null;
		switch( (currState)[1] ) {
		case 0:
			stepFinishedTween = this.executeFill();
			stepFinishedTween.wait(co.doubleduck.Map.WAIT_FILL_POWERUP).call($bind(this,this.nextStep),[co.doubleduck.State.POWERUPS]);
			return;
		case 1:
			var nextState;
			if(this.executeCheck()) nextState = co.doubleduck.State.SOLVE; else nextState = co.doubleduck.State.REST;
			this.nextStep(nextState);
			return;
		case 2:
			stepFinishedTween = this.executeSolve();
			stepFinishedTween.wait(co.doubleduck.Map.WAIT_SOLVE_GRAVITY).call($bind(this,this.nextStep),[co.doubleduck.State.GRAVITY]);
			return;
		case 3:
			stepFinishedTween = this.executePowerUps();
			if(stepFinishedTween == null) stepFinishedTween = createjs.Tween.get(this); else stepFinishedTween = stepFinishedTween.wait(co.doubleduck.Map.WAIT_POWERUP_CHECK);
			stepFinishedTween.call($bind(this,this.nextStep),[co.doubleduck.State.CHECK]);
			return;
		case 4:
			stepFinishedTween = this.executeGravity();
			stepFinishedTween.wait(co.doubleduck.Map.WAIT_GRAVITY_FILL).call($bind(this,this.nextStep),[co.doubleduck.State.FILL]);
			return;
		case 5:
			this.executeRest();
			return;
		case 6:
			var _g = 0, _g1 = this._gems;
			while(_g < _g1.length) {
				var gem = _g1[_g];
				++_g;
				gem.unhighlight();
			}
			stepFinishedTween = this.executeSwap(tile1,tile2);
			if(stepFinishedTween == null) stepFinishedTween = createjs.Tween.get(this);
			stepFinishedTween.wait(co.doubleduck.Map.WAIT_SWAP_CHECK).call($bind(this,this.nextStep),[co.doubleduck.State.CHECK]);
			return;
		}
	}
	,getSharedTile: function(pattern1,pattern2) {
		var _g = 0, _g1 = pattern1.getTiles();
		while(_g < _g1.length) {
			var tile = _g1[_g];
			++_g;
			if(pattern2.containsTile(tile)) return tile;
		}
		return null;
	}
	,detectAndHandleBigT: function(pattern1,pattern2) {
		if(!(pattern1.getType() == co.doubleduck.PatternType.FIVE || pattern1.getType() == co.doubleduck.PatternType.SIX || pattern2.getType() == co.doubleduck.PatternType.FIVE || pattern2.getType() == co.doubleduck.PatternType.SIX)) return false;
		var five;
		var other;
		if(pattern1.getType() == co.doubleduck.PatternType.FIVE || pattern1.getType() == co.doubleduck.PatternType.SIX) {
			five = pattern1;
			other = pattern2;
		} else {
			five = pattern2;
			other = pattern1;
		}
		var contactPoint = this.getSharedTile(pattern1,pattern2);
		var centerPoint = five.centerTile();
		if(contactPoint != centerPoint) return false;
		HxOverrides.remove(this._patterns,five);
		if(other.getType() == co.doubleduck.PatternType.THREE) HxOverrides.remove(this._patterns,other);
		var bigT = co.doubleduck.Pattern.newCompoundPattern(pattern1,pattern2,$bind(this,this.getAllPatterns));
		bigT.setType(co.doubleduck.PatternType.BIG_T);
		bigT.setJointPoint(contactPoint);
		this._patterns.push(bigT);
		return true;
	}
	,detectAndHandleL: function(pattern1,pattern2) {
		var contactPoint = this.getSharedTile(pattern1,pattern2);
		if(pattern1.isTileAtEdges(contactPoint) && pattern2.isTileAtEdges(contactPoint)) {
			if(pattern1.getType() == co.doubleduck.PatternType.FIVE || pattern1.getType() == co.doubleduck.PatternType.SIX || pattern2.getType() == co.doubleduck.PatternType.FIVE || pattern2.getType() == co.doubleduck.PatternType.SIX) return false;
			if(pattern1.getType() == co.doubleduck.PatternType.THREE) HxOverrides.remove(this._patterns,pattern1);
			if(pattern2.getType() == co.doubleduck.PatternType.THREE) HxOverrides.remove(this._patterns,pattern2);
			var L = co.doubleduck.Pattern.newCompoundPattern(pattern1,pattern2,$bind(this,this.getAllPatterns));
			L.setType(co.doubleduck.PatternType.L);
			L.setJointPoint(contactPoint);
			this._patterns.push(L);
			return true;
		}
		return false;
	}
	,detectAndHandleT: function(pattern1,pattern2) {
		var contactPoint = this.getSharedTile(pattern1,pattern2);
		if(pattern1.getType() == co.doubleduck.PatternType.FIVE || pattern1.getType() == co.doubleduck.PatternType.SIX || pattern2.getType() == co.doubleduck.PatternType.FIVE || pattern2.getType() == co.doubleduck.PatternType.SIX) return false;
		if(pattern1.getType() == co.doubleduck.PatternType.THREE) HxOverrides.remove(this._patterns,pattern1);
		if(pattern2.getType() == co.doubleduck.PatternType.THREE) HxOverrides.remove(this._patterns,pattern2);
		var T = co.doubleduck.Pattern.newCompoundPattern(pattern1,pattern2,$bind(this,this.getAllPatterns));
		T.setType(co.doubleduck.PatternType.T);
		T.setJointPoint(contactPoint);
		this._patterns.push(T);
		return true;
	}
	,detectValidCompoundPatterns: function(linkedPatterns) {
		var _g = 0;
		while(_g < linkedPatterns.length) {
			var linkedPattern = linkedPatterns[_g];
			++_g;
			var pattern1 = linkedPattern[0];
			var pattern2 = linkedPattern[1];
			if(!this.detectAndHandleBigT(pattern1,pattern2)) {
				if(!this.detectAndHandleL(pattern1,pattern2)) this.detectAndHandleT(pattern1,pattern2);
			}
		}
	}
	,handleGainPoints: function(pattern) {
		this.onPointsGain(pattern.pointValue());
	}
	,gainPoints: function(patterns) {
		if(patterns.length > 1) {
			var linkedPatterns = new Array();
			var patternId = 0;
			while(patternId < patterns.length - 1) {
				var _g1 = patternId + 1, _g = patterns.length;
				while(_g1 < _g) {
					var otherPatternId = _g1++;
					if(patterns[patternId].isSharingTile(patterns[otherPatternId])) {
						if(!patterns[patternId].isEqual(patterns[otherPatternId])) linkedPatterns.push([patterns[patternId],patterns[otherPatternId]]);
					}
				}
				patternId++;
			}
			this.detectValidCompoundPatterns(linkedPatterns);
		}
		var _g = 0;
		while(_g < patterns.length) {
			var pattern = patterns[_g];
			++_g;
			this.handleGainPoints(pattern);
		}
	}
	,getDirection: function(currTile,nextTile) {
		var dx = nextTile.getX() - currTile.getX();
		var dy = nextTile.getY() - currTile.getY();
		if(Math.abs(dx) > 1 || Math.abs(dy) > 1 || dx == 0 && dy == 0) return null;
		if(dy == 0) {
			if(dx < 0) return co.doubleduck.Direction.LEFT; else return co.doubleduck.Direction.RIGHT;
		} else if(dx == 0) {
			if(dy < 0) return co.doubleduck.Direction.UP; else return co.doubleduck.Direction.DOWN;
		}
		return null;
	}
	,addNewRandomGem: function(tile,unsolvable) {
		if(tile.getType() == co.doubleduck.TileType.EMPTY) {
			var gemTypes = Type.allEnums(co.doubleduck.GemType);
			var gemType = co.doubleduck.Utils.getRandomElement(gemTypes);
			var newGem = new co.doubleduck.Gem(tile,gemType);
			this._gems.push(newGem);
			if(unsolvable) while(this.hasPattern(tile) && gemTypes.length > 0) {
				HxOverrides.remove(this._gems,newGem);
				newGem.destroy();
				HxOverrides.remove(gemTypes,gemType);
				gemType = co.doubleduck.Utils.getRandomElement(gemTypes);
				newGem = new co.doubleduck.Gem(tile,gemType);
				this._gems.push(newGem);
			}
			return newGem;
		}
		return null;
	}
	,swapGems: function(t1,t2) {
		var oldGem1 = t1.getGem();
		var oldGem2 = t2.getGem();
		oldGem1.setTile(t2);
		oldGem2.setTile(t1);
		t1.setGem(oldGem2,true,co.doubleduck.Map.SWAP_TWEEN);
		t2.setGem(oldGem1,true,co.doubleduck.Map.SWAP_TWEEN);
		return t2.getLatestGemSettingTween();
	}
	,hasPattern: function(tile,allTiles) {
		if(tile.getGem() == null || tile.getGem().getPowerUp() != null) return false;
		if(allTiles == null) allTiles = this._tiles;
		if(this.hasHorizontalLine(tile,allTiles)) return true;
		if(this.hasVerticalLine(tile,allTiles)) return true;
		return false;
	}
	,hasHorizontalLine: function(tile,tiles) {
		var gemType = tile.getGem().getType();
		var comboLength = 1;
		var tx = tile.getX();
		while(tx + 1 < co.doubleduck.Map.COLUMNS) {
			tx++;
			var t = this.getTile(tx,tile.getY(),tiles);
			if(t.getGem() != null && t.getGem().getType() == gemType && tile.getGem().getPowerUp() == null) comboLength++; else break;
		}
		tx = tile.getX();
		while(tx - 1 >= 0) {
			tx--;
			var t = this.getTile(tx,tile.getY(),tiles);
			if(t.getGem() != null && t.getGem().getType() == gemType && tile.getGem().getPowerUp() == null) comboLength++; else break;
		}
		return comboLength >= 3;
	}
	,hasVerticalLine: function(tile,tiles) {
		var gemType = tile.getGem().getType();
		var comboLength = 1;
		var tx = tile.getX();
		var ty = tile.getY();
		while(ty + 1 < co.doubleduck.Map.ROWS) {
			ty++;
			var t = this.getTile(tx,ty,tiles);
			if(t.getGem() != null && t.getGem().getType() == gemType && tile.getGem().getPowerUp() == null) comboLength++; else break;
		}
		ty = tile.getY();
		while(ty - 1 >= 0) {
			ty--;
			var t = this.getTile(tx,ty,tiles);
			if(t.getGem() != null && t.getGem().getType() == gemType && tile.getGem().getPowerUp() == null) comboLength++; else break;
		}
		return comboLength >= 3;
	}
	,solve: function(tile) {
		var tilesToClear = new Array();
		var gemType = tile.getGem().getType();
		if(this.hasVerticalLine(tile,this._tiles)) {
			var newPattern = new co.doubleduck.Pattern();
			newPattern.onGetAllPatterns = $bind(this,this.getAllPatterns);
			newPattern.addTile(tile);
			newPattern.setRotation(90);
			var tx = tile.getX();
			var ty = tile.getY();
			while(ty + 1 < co.doubleduck.Map.ROWS) {
				ty++;
				var t = this.getTile(tx,ty);
				if(t.getGem() != null && t.getGem().getType() == gemType) {
					tilesToClear.push(t);
					newPattern.addTile(t);
				} else break;
			}
			ty = tile.getY();
			while(ty - 1 >= 0) {
				ty--;
				var t = this.getTile(tx,ty);
				if(t.getGem() != null && t.getGem().getType() == gemType) {
					tilesToClear.push(t);
					newPattern.addTile(t);
				} else break;
			}
			if(newPattern.getTiles().length == 3) newPattern.setType(co.doubleduck.PatternType.THREE); else if(newPattern.getTiles().length == 4) newPattern.setType(co.doubleduck.PatternType.FOUR); else if(newPattern.getTiles().length == 5) newPattern.setType(co.doubleduck.PatternType.FIVE); else if(newPattern.getTiles().length >= 6) newPattern.setType(co.doubleduck.PatternType.SIX);
			this.addNewPattern(newPattern);
			newPattern.calculatePowerUpGem();
		}
		if(this.hasHorizontalLine(tile,this._tiles)) {
			var newPattern = new co.doubleduck.Pattern();
			newPattern.onGetAllPatterns = $bind(this,this.getAllPatterns);
			newPattern.addTile(tile);
			var tx = tile.getX();
			while(tx + 1 < co.doubleduck.Map.COLUMNS) {
				tx++;
				var t = this.getTile(tx,tile.getY());
				if(t.getGem() != null && t.getGem().getType() == gemType) {
					tilesToClear.push(t);
					newPattern.addTile(t);
				} else break;
			}
			tx = tile.getX();
			while(tx - 1 >= 0) {
				tx--;
				var t = this.getTile(tx,tile.getY());
				if(t.getGem() != null && t.getGem().getType() == gemType) {
					tilesToClear.push(t);
					newPattern.addTile(t);
				} else break;
			}
			if(newPattern.getTiles().length == 3) newPattern.setType(co.doubleduck.PatternType.THREE); else if(newPattern.getTiles().length == 4) newPattern.setType(co.doubleduck.PatternType.FOUR); else if(newPattern.getTiles().length == 5) newPattern.setType(co.doubleduck.PatternType.FIVE); else if(newPattern.getTiles().length >= 6) newPattern.setType(co.doubleduck.PatternType.SIX);
			this.addNewPattern(newPattern);
			newPattern.calculatePowerUpGem();
		}
		tilesToClear.push(tile);
		return tilesToClear;
	}
	,getAllPatterns: function() {
		return this._patterns;
	}
	,addNewPattern: function(newPattern) {
		var _g = 0, _g1 = this._patterns;
		while(_g < _g1.length) {
			var existingPattern = _g1[_g];
			++_g;
			if(newPattern.isEqual(existingPattern)) return false;
		}
		this._patterns.push(newPattern);
		newPattern.onGetAllPatterns = $bind(this,this.getAllPatterns);
		return true;
	}
	,dropGemFromTile: function(tile,delay) {
		delay.sum += 5 + Std.random(20);
		var duration = delay.sum;
		var currRow;
		var targetRow = tile.getY();
		var targetTile = null;
		do {
			currRow = targetRow++;
			if(targetRow < co.doubleduck.Map.ROWS) targetTile = this.getTile(tile.getX(),targetRow); else break;
		} while(targetTile.isEmpty());
		var currTile = this.getTile(tile.getX(),currRow);
		if(currTile.getGem() != null) throw "should not be a gem here!";
		var gem = tile.getGem();
		var targetX = currTile.getGemX();
		var targetY = currTile.getGemY();
		tile.setGem(null,false);
		currTile.setGem(gem,true,duration);
		return currTile.getLatestGemSettingTween();
	}
	,applyGravity: function(tilesToChange) {
		this.checkForRemainingOldGems();
		var lastTween = null;
		var delay = { sum : 200};
		var row = co.doubleduck.Map.ROWS - 1;
		while(row > 0) {
			row--;
			var _g1 = 0, _g = co.doubleduck.Map.COLUMNS;
			while(_g1 < _g) {
				var col = _g1++;
				var tile = this.getTile(col,row);
				var gem = tile.getGem();
				if(gem != null) {
					var tileBelow = this.getTile(col,row + 1);
					var gemBelow = tileBelow.getGem();
					if(tileBelow.getType() == co.doubleduck.TileType.EMPTY && gemBelow == null) {
						lastTween = this.dropGemFromTile(tile,delay);
						tilesToChange.push(gem.getTile());
					}
				}
			}
		}
		return lastTween;
	}
	,endSwapping: function() {
		co.doubleduck.Map._isSwapping = false;
	}
	,startSwapping: function() {
		co.doubleduck.Map._isSwapping = true;
	}
	,showHintsAtTile: function(tile) {
		tile.highlight();
	}
	,wouldSwitchingSolve: function(tile1,tile2) {
		if(tile1.getType() == co.doubleduck.TileType.WALL || tile2.getType() == co.doubleduck.TileType.WALL) return null;
		var tiles = this._tiles.slice();
		if(this._lockSwitchingCheck) throw "switching already in progress!";
		this._lockSwitchingCheck = true;
		var tile1x = tile1.getX();
		var tile1y = tile1.getY();
		var tile2x = tile2.getX();
		var tile2y = tile2.getY();
		var tiles1 = this._tiles.slice();
		var oldTile1 = this.setTile(tile1x,tile1y,tile2,tiles1);
		var oldTile2 = this.setTile(tile2x,tile2y,tile1,tiles1);
		var tileWithPattern = null;
		if(this.hasPattern(tile1,tiles1)) tileWithPattern = tile1;
		if(this.hasPattern(tile2,tiles1)) tileWithPattern = tile2;
		var newTile2 = this.setTile(tile1x,tile1y,tile1,tiles1);
		var newTile1 = this.setTile(tile2x,tile2y,tile2,tiles1);
		if(tile1 != oldTile1 || tile1 != newTile1) throw "tile1 is not as it should be!\n" + tile1.toString() + "; " + oldTile1.toString() + "; " + newTile1.toString();
		if(tile2 != oldTile2 || tile2 != newTile2) throw "tile2 is not as it should be!\n" + tile2.toString() + "; " + oldTile2.toString() + "; " + newTile2.toString();
		this._lockSwitchingCheck = false;
		return tileWithPattern;
	}
	,_lockSwitchingCheck: null
	,searchHints: function(showHintsWhenFound) {
		if(showHintsWhenFound == null) showHintsWhenFound = true;
		var _g1 = 0, _g = co.doubleduck.Map.ROWS - 1;
		while(_g1 < _g) {
			var tileY = _g1++;
			var _g3 = 0, _g2 = co.doubleduck.Map.COLUMNS - 1;
			while(_g3 < _g2) {
				var tileX = _g3++;
				var currTile = this.getTile(tileX,tileY);
				var rightTile = this.getTile(tileX + 1,tileY);
				var belowTile = this.getTile(tileX,tileY + 1);
				var rightSwap = this.wouldSwitchingSolve(currTile,rightTile);
				if(rightSwap != null) {
					if(showHintsWhenFound) this.showHintsAtTile(rightSwap);
					return true;
				}
				var belowSwap = this.wouldSwitchingSolve(currTile,belowTile);
				if(belowSwap != null) {
					if(showHintsWhenFound) this.showHintsAtTile(belowSwap);
					return true;
				}
			}
		}
		return false;
	}
	,handleMoveEnd: function() {
		this.onMoveEnd();
	}
	,handleMoveStart: function() {
		this.onMoveStart();
	}
	,activateFirstExistingPowerUp: function() {
		if(this._powerups.length > 0) {
			co.doubleduck.PowerUp.onGainPoints = $bind(this,this.handleGainPoints);
			co.doubleduck.PowerUp.onGetTile = $bind(this,this.getTile);
			co.doubleduck.Gem.onGetTile = $bind(this,this.getTile);
			var power = this._powerups.shift();
			power.onIncreaseMoves = $bind(this,this.handleIncreaseMoves);
			var tween = power.activate(this._tiles,this);
			var _g = 0, _g1 = this._gems;
			while(_g < _g1.length) {
				var gem = _g1[_g];
				++_g;
				if(gem.getPowerUp() == power) gem.clearPowerUp(power);
			}
			return tween;
		} else return null;
	}
	,handleTileClick: function(e) {
		if(co.doubleduck.Map._isSwapping) return;
		var tile2 = e.target;
		if(this._selectedTile == null) {
			this._selectedTile = tile2;
			this._selectedTile.select();
		} else {
			this._selectedTile.unSelect();
			if(this._selectedTile.isAdjacent(tile2)) this.nextStep(co.doubleduck.State.SWAP,this._selectedTile,tile2);
			this._selectedTile = null;
		}
	}
	,removeGemsFromMap: function(tilesToRemove) {
		var _g = 0, _g1 = this._patterns;
		while(_g < _g1.length) {
			var pattern = _g1[_g];
			++_g;
			var _g2 = 0, _g3 = pattern.getTiles();
			while(_g2 < _g3.length) {
				var tile = _g3[_g2];
				++_g2;
				tile.getGem().addPattern(pattern);
			}
		}
		co.doubleduck.SoundManager.playEffect("sound/Removing_gems_" + (Std.random(2) + 1));
		var lastPowerUpFadeInTween = null;
		var _g = 0;
		while(_g < tilesToRemove.length) {
			var tileToRemove = tilesToRemove[_g];
			++_g;
			if(tileToRemove.getGem().isAlive()) {
				var powerUpFadeInTween = tileToRemove.getGem().destroy();
				if(powerUpFadeInTween != null) lastPowerUpFadeInTween = powerUpFadeInTween;
			} else {
			}
		}
		return lastPowerUpFadeInTween;
	}
	,removeGemGraphic: function(g) {
		HxOverrides.remove(this._gems,g);
		g.destroyAnimation();
		this._latestGemRemovalTween = createjs.Tween.get(g).wait(co.doubleduck.Map.SPATIAL_TWEEN).call($bind(g,g.removeFromMap),[this]);
	}
	,addGemGraphic: function(g,baseDelay,numberOfGems) {
		var graphic = g.getGraphic();
		var targetY = graphic.y;
		var tileY = g.getTile().getY() - co.doubleduck.Map.COLUMNS;
		graphic.y = co.doubleduck.Gem.HEIGHT * tileY;
		var halfDelay = Math.round(0.5 * co.doubleduck.Map.FALLING_TWEEN_MAXIMUM / numberOfGems);
		var delay = halfDelay + Std.random(halfDelay);
		delay = Math.min(co.doubleduck.Map.FALLING_TWEEN_MINIMUM,delay);
		baseDelay.miliseconds += delay;
		var spatialTween = g.tweenTo(g.getTile().getGemX(),targetY,js.Boot.__cast(baseDelay.miliseconds , Float));
		this.addChild(graphic);
		g.onRemove = $bind(this,this.removeGemGraphic);
		return spatialTween;
	}
	,outOfBounds: function(tx,ty) {
		return tx < 0 || ty < 0 || tx >= co.doubleduck.Map.COLUMNS || ty >= co.doubleduck.Map.ROWS;
	}
	,handleSwipe: function(start,end,direction) {
		this.startSwapping();
		if(this._selectedTile != null) {
			this._selectedTile.unSelect();
			this._selectedTile = null;
		}
		var tileStart = new createjs.Point(start.x / co.doubleduck.Gem.WIDTH,start.y / co.doubleduck.Gem.HEIGHT);
		if(this.outOfBounds(tileStart.x | 0,tileStart.y | 0)) {
			this.endSwapping();
			this.setEnabled(true);
			return;
		}
		var tile1 = this.getTile(tileStart.x | 0,tileStart.y | 0);
		var tile2 = null;
		var t2x = -1;
		var t2y = -1;
		switch(direction) {
		case "down":
			t2x = tileStart.x | 0;
			t2y = (tileStart.y | 0) + 1;
			tile2 = this.getTile(t2x,t2y);
			break;
		case "up":
			t2x = tileStart.x | 0;
			t2y = (tileStart.y | 0) - 1;
			tile2 = this.getTile(t2x,t2y);
			break;
		case "left":
			t2x = (tileStart.x | 0) - 1;
			t2y = tileStart.y | 0;
			tile2 = this.getTile(t2x,t2y);
			break;
		case "right":
			t2x = (tileStart.x | 0) + 1;
			t2y = tileStart.y | 0;
			tile2 = this.getTile(t2x,t2y);
			break;
		}
		if(this.outOfBounds(t2x,t2y)) this.endSwapping(); else this.nextStep(co.doubleduck.State.SWAP,tile1,tile2);
	}
	,handlePowerUpAdded: function(power) {
		this._powerups.push(power);
	}
	,setEnabled: function(e) {
		this._enabled = e;
		this.mouseEnabled = e;
	}
	,isEnabled: function() {
		return this._enabled;
	}
	,setTile: function(x,y,newTile,tiles) {
		var oldTile = tiles[co.doubleduck.Map.COLUMNS * y + x];
		tiles[co.doubleduck.Map.COLUMNS * y + x] = newTile;
		newTile.setX(x);
		newTile.setY(y);
		return oldTile;
	}
	,getTile: function(x,y,tiles) {
		if(this.outOfBounds(x,y)) throw "out of bounds: <" + x + ", " + y + ">";
		if(tiles == null) tiles = this._tiles;
		return co.doubleduck.Utils.get(x,y,tiles,co.doubleduck.Map.COLUMNS);
	}
	,getHeight: function() {
		return co.doubleduck.Map.ROWS * co.doubleduck.Gem.HEIGHT + (co.doubleduck.Tile.HEIGHT - co.doubleduck.Gem.HEIGHT);
	}
	,getWidth: function() {
		return co.doubleduck.Map.COLUMNS * co.doubleduck.Gem.WIDTH + (co.doubleduck.Tile.WIDTH - co.doubleduck.Gem.WIDTH);
	}
	,handleIncreaseMoves: function(m) {
		this.onIncreaseMoves(m);
	}
	,onIncreaseMoves: null
	,onPointsGain: null
	,onMoveEnd: null
	,onMoveStart: null
	,canMove: null
	,_patterns: null
	,_selectedTile: null
	,_latestGemRemovalTween: null
	,_initComplete: null
	,_enabled: null
	,_powerups: null
	,_gems: null
	,_tiles: null
	,_tileContainer: null
	,__class__: co.doubleduck.Map
});
co.doubleduck.State = $hxClasses["co.doubleduck.State"] = { __ename__ : ["co","doubleduck","State"], __constructs__ : ["FILL","CHECK","SOLVE","POWERUPS","GRAVITY","REST","SWAP"] }
co.doubleduck.State.FILL = ["FILL",0];
co.doubleduck.State.FILL.toString = $estr;
co.doubleduck.State.FILL.__enum__ = co.doubleduck.State;
co.doubleduck.State.CHECK = ["CHECK",1];
co.doubleduck.State.CHECK.toString = $estr;
co.doubleduck.State.CHECK.__enum__ = co.doubleduck.State;
co.doubleduck.State.SOLVE = ["SOLVE",2];
co.doubleduck.State.SOLVE.toString = $estr;
co.doubleduck.State.SOLVE.__enum__ = co.doubleduck.State;
co.doubleduck.State.POWERUPS = ["POWERUPS",3];
co.doubleduck.State.POWERUPS.toString = $estr;
co.doubleduck.State.POWERUPS.__enum__ = co.doubleduck.State;
co.doubleduck.State.GRAVITY = ["GRAVITY",4];
co.doubleduck.State.GRAVITY.toString = $estr;
co.doubleduck.State.GRAVITY.__enum__ = co.doubleduck.State;
co.doubleduck.State.REST = ["REST",5];
co.doubleduck.State.REST.toString = $estr;
co.doubleduck.State.REST.__enum__ = co.doubleduck.State;
co.doubleduck.State.SWAP = ["SWAP",6];
co.doubleduck.State.SWAP.toString = $estr;
co.doubleduck.State.SWAP.__enum__ = co.doubleduck.State;
co.doubleduck.Direction = $hxClasses["co.doubleduck.Direction"] = { __ename__ : ["co","doubleduck","Direction"], __constructs__ : ["LEFT","RIGHT","UP","DOWN"] }
co.doubleduck.Direction.LEFT = ["LEFT",0];
co.doubleduck.Direction.LEFT.toString = $estr;
co.doubleduck.Direction.LEFT.__enum__ = co.doubleduck.Direction;
co.doubleduck.Direction.RIGHT = ["RIGHT",1];
co.doubleduck.Direction.RIGHT.toString = $estr;
co.doubleduck.Direction.RIGHT.__enum__ = co.doubleduck.Direction;
co.doubleduck.Direction.UP = ["UP",2];
co.doubleduck.Direction.UP.toString = $estr;
co.doubleduck.Direction.UP.__enum__ = co.doubleduck.Direction;
co.doubleduck.Direction.DOWN = ["DOWN",3];
co.doubleduck.Direction.DOWN.toString = $estr;
co.doubleduck.Direction.DOWN.__enum__ = co.doubleduck.Direction;
co.doubleduck.Menu = $hxClasses["co.doubleduck.Menu"] = function() {
	this._currLevelScreen = 0;
	this._isMoving = false;
	this._justViewedTutor = false;
	co.doubleduck.BaseMenu.call(this);
	this._back = co.doubleduck.BaseAssets.getImage("images/general/pp_session_bg.png");
	this._back.regX = 0;
	this._back.regY = this._back.image.height / 2;
	this._back.scaleX = this._back.scaleY = co.doubleduck.BaseGame.getScale();
	this._back.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._back);
	this._levelButtons = new Array();
	this._levelsLayer = new createjs.Container();
	if(co.doubleduck.Menu._iconSpritesheet == null) {
		var img = co.doubleduck.BaseAssets.getRawImage("images/menu/btn_level.png");
		var initObject = { };
		initObject.images = [img];
		initObject.frames = { width : img.width / 5, height : img.height, regX : 0, regY : 0};
		initObject.animations = { };
		initObject.animations.locked = { frames : 0, frequency : 20};
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			initObject.animations["star" + i] = { frames : i + 1, frequency : 20};
		}
		co.doubleduck.Menu._iconSpritesheet = new createjs.SpriteSheet(initObject);
	}
	var _g1 = 0, _g = Math.ceil(co.doubleduck.DataLoader.getLevelCount() / co.doubleduck.Menu.LEVELS_PER_SCREEN);
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = 0, _g2 = co.doubleduck.Menu.LEVELS_PER_SCREEN;
		while(_g3 < _g2) {
			var j = _g3++;
			var lvlNum = i * co.doubleduck.Menu.LEVELS_PER_SCREEN + j + 1;
			if(lvlNum > co.doubleduck.DataLoader.getLevelCount()) break;
			var currLvl = new co.doubleduck.Button(new createjs.BitmapAnimation(co.doubleduck.Menu._iconSpritesheet));
			currLvl.name = "" + lvlNum;
			currLvl.scaleX = currLvl.scaleY = co.doubleduck.BaseGame.getScale();
			currLvl.regX = currLvl.image.width / 2;
			currLvl.regY = currLvl.image.height / 2;
			currLvl.x = co.doubleduck.BaseGame.getViewport().width * (0.35 + j % (co.doubleduck.Menu.LEVELS_PER_SCREEN / 3) * 0.3);
			currLvl.x += co.doubleduck.BaseGame.getViewport().width * i;
			currLvl.y = co.doubleduck.BaseGame.getViewport().height * (0.26 + Math.floor(j / (co.doubleduck.Menu.LEVELS_PER_SCREEN / 3)) * 0.2);
			if(lvlNum <= co.doubleduck.Persistence.getUnlockedLevel()) {
				var stars = co.doubleduck.Persistence.getStarRating(lvlNum);
				currLvl.anim.gotoAndStop("star" + stars);
				currLvl.addBitmapLabel("" + lvlNum,"images/general/font_dark/",6);
				if(lvlNum == co.doubleduck.Persistence.getUnlockedLevel()) currLvl.shiftLabel(1,1.15); else currLvl.shiftLabel(1,1.3);
				currLvl.scaleBitmapFont(0.74);
				currLvl.onClick = $bind(this,this.handleLevelClick);
			} else currLvl.anim.gotoAndStop("locked");
			this._levelButtons[lvlNum - 1] = currLvl;
			this._levelsLayer.addChild(currLvl);
		}
	}
	this._levelsLayer.alpha = 0;
	this.addChild(this._levelsLayer);
	createjs.Tween.get(this._levelsLayer).wait(100).to({ alpha : 1},400);
	this._menuRightBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/pp_btn_arrow_right.png"));
	this._menuRightBtn.scaleX = this._menuRightBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._menuRightBtn.regX = this._menuRightBtn.image.width;
	this._menuRightBtn.regY = this._menuRightBtn.image.height / 2;
	this._menuRightBtn.x = co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getScale() * 20;
	this._menuRightBtn.y = co.doubleduck.BaseGame.getViewport().height * 0.475;
	this._menuRightBtn.onClick = $bind(this,this.goToNext);
	this._menuRightBtn.alpha = 0;
	this.addChild(this._menuRightBtn);
	createjs.Tween.get(this._menuRightBtn).to({ alpha : 1},300);
	this._menuLeftBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/pp_btn_arrow_right.png"));
	this._menuLeftBtn.scaleX = this._menuLeftBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._menuLeftBtn.scaleX *= -1;
	this._menuLeftBtn.regX = this._menuLeftBtn.image.width;
	this._menuLeftBtn.regY = this._menuLeftBtn.image.height / 2;
	this._menuLeftBtn.x = co.doubleduck.BaseGame.getScale() * 20;
	this._menuLeftBtn.y = this._menuRightBtn.y;
	this._menuLeftBtn.onClick = $bind(this,this.goToPrev);
	this._menuLeftBtn.alpha = 0;
	this.addChild(this._menuLeftBtn);
	createjs.Tween.get(this._menuLeftBtn).to({ alpha : 1},300);
	this._helpBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/pp_btn_help.png"));
	this._helpBtn.regX = 0;
	this._helpBtn.regY = this._helpBtn.image.height;
	this._helpBtn.scaleX = this._helpBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._helpBtn.x = co.doubleduck.BaseGame.getScale() * 22;
	this._helpBtn.y = this._back.y + this._back.image.height * co.doubleduck.BaseGame.getScale() * 0.31;
	this._helpBtn.onClick = $bind(this,this.showHelpMenu);
	this._helpBtn.alpha = 0;
	this.addChild(this._helpBtn);
	createjs.Tween.get(this._helpBtn).to({ alpha : 1},200);
	if(co.doubleduck.SoundManager.available) {
		this._muteBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_sound.png"),true,co.doubleduck.Button.CLICK_TYPE_TOGGLE);
		this.addChild(this._muteBtn);
		this._muteBtn.regX = this._muteBtn.image.width / 4;
		this._muteBtn.regY = this._muteBtn.image.height / 2;
		this._muteBtn.scaleX = this._muteBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._muteBtn.x = co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getScale() * 22;
		this._muteBtn.y = this._helpBtn.y;
		this._muteBtn.setToggle(!co.doubleduck.SoundManager.isMuted());
		this._muteBtn.onToggle = $bind(this,this.handleMuteToggle);
		this._muteBtn.alpha = 0;
		this.addChild(this._muteBtn);
		createjs.Tween.get(this._muteBtn).to({ alpha : 1},200);
	}
	this._helpScreen = new co.doubleduck.PagedHelp("images/menu/pp_help_bg.png","images/general/pp_btn_next.png","images/menu/pp_btn_gotit.png",["images/menu/pp_help_1.png","images/menu/pp_help_2.png"]);
	this._helpScreen.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._helpScreen.y = co.doubleduck.BaseGame.getViewport().height * 0.475;
	this._helpScreen.scaleX = this._helpScreen.scaleY = co.doubleduck.BaseGame.getScale();
	this._helpScreen.setButtonsPos(0.77,0.86);
	this._helpScreen.setMarkersPos(0.75);
	this._helpScreen.onGotIt = $bind(this,this.closeHelp);
	this.addChild(this._helpScreen);
	this._helpScreen.alpha = 0;
	this._helpScreen.visible = false;
	var gotoLevel = co.doubleduck.Session.getLastVisitedLevel();
	if(gotoLevel == -1) gotoLevel = co.doubleduck.Persistence.getUnlockedLevel();
	gotoLevel--;
	this.goToWorld(Math.floor(gotoLevel / co.doubleduck.Menu.LEVELS_PER_SCREEN),true);
	this.setArrowBtnVisibility();
	this._snow = co.doubleduck.Utils.getCenteredImage("images/general/pp_session_bottom.png",true);
	this._snow.regY = this._snow.image.height;
	this._snow.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._snow.y = co.doubleduck.BaseGame.getViewport().height / 2 + co.doubleduck.BaseGame.getScale() * this._back.image.height / 2;
	if(!co.doubleduck.Menu._shownChaz) {
		co.doubleduck.Menu._shownChaz = true;
		this._chaz = co.doubleduck.BaseAssets.getImage("images/general/pp_chaz_happy.png");
		this._chaz.scaleX = this._chaz.scaleY = co.doubleduck.BaseGame.getScale();
		this._chaz.regX = this._chaz.image.width;
		var baseY = co.doubleduck.BaseGame.getViewport().height * 1.02;
		this._chaz.y = baseY;
		this.addChild(this._chaz);
		createjs.Tween.get(this._chaz).wait(150).to({ x : this._chaz.image.width * co.doubleduck.BaseGame.getScale()},400,createjs.Ease.sineInOut).wait(1500).to({ x : 0},250,createjs.Ease.sineInOut);
		createjs.Tween.get(this._chaz).wait(150).to({ y : baseY - this._chaz.image.height * co.doubleduck.BaseGame.getScale()},400,createjs.Ease.linear).wait(1500).to({ y : baseY},250,createjs.Ease.linear);
	}
	this.addChild(this._snow);
	co.doubleduck.BaseGame.hammer.onswipe = $bind(this,this.handleSwipe);
	this._themeMusic = co.doubleduck.SoundManager.playMusic("sound/Menu_music");
};
co.doubleduck.Menu.__name__ = ["co","doubleduck","Menu"];
co.doubleduck.Menu.__super__ = co.doubleduck.BaseMenu;
co.doubleduck.Menu.prototype = $extend(co.doubleduck.BaseMenu.prototype,{
	goToPrev: function() {
		if(this._currLevelScreen == 0) return;
		this.goToWorld(this._currLevelScreen - 1);
		this.setArrowBtnVisibility();
	}
	,goToNext: function() {
		if(this._currLevelScreen == co.doubleduck.DataLoader.getLevelCount() / co.doubleduck.Menu.LEVELS_PER_SCREEN - 1) return;
		this.goToWorld(this._currLevelScreen + 1);
		this.setArrowBtnVisibility();
	}
	,handleTick: function(elapsed) {
		var delta = co.doubleduck.Menu.WORLD_MOVE_EASE * elapsed;
		delta = Math.min(delta,0.2);
		delta *= this._targetLevelsPos - this._levelsLayer.x;
		this._levelsLayer.x += delta;
		if(Math.abs(delta) >= 1) this._levelsLayer.mouseEnabled = false; else this._levelsLayer.mouseEnabled = true;
		if(Math.abs(this._targetLevelsPos - this._levelsLayer.x) < 1) {
			this._levelsLayer.x = this._targetLevelsPos;
			this._levelsLayer.mouseEnabled = true;
			this._isMoving = false;
			this.onTick = null;
		}
	}
	,setArrowBtnVisibility: function() {
		this._menuRightBtn.visible = this._currLevelScreen < co.doubleduck.DataLoader.getLevelCount() / co.doubleduck.Menu.LEVELS_PER_SCREEN - 1;
		this._menuLeftBtn.visible = this._currLevelScreen > 0;
	}
	,goToWorld: function(id,force) {
		if(force == null) force = false;
		this._targetLevelsPos = id * co.doubleduck.BaseGame.getViewport().width * -1;
		this._currLevelScreen = id;
		if(force) this._levelsLayer.x = this._targetLevelsPos; else if(!this._isMoving) {
			this.onTick = $bind(this,this.handleTick);
			this._isMoving = true;
		}
	}
	,handleLevelClick: function(e) {
		var levelID = Std.parseInt(e.target.name);
		this._chosenLevel = levelID;
		if(this._themeMusic != null) this._themeMusic.stop();
		if(co.doubleduck.Persistence.getUnlockedLevel() == 1) {
			if(this._justViewedTutor) this._justViewedTutor = false; else {
				this._justViewedTutor = true;
				this.showHelpMenu();
				return;
			}
		}
		this._levelsLayer.mouseEnabled = false;
		if(co.doubleduck.SoundManager.available) this._muteBtn.onClick = null;
		this._helpBtn.onClick = null;
		if(co.doubleduck.SoundManager.available) createjs.Tween.get(this._muteBtn).to({ alpha : 0},140);
		createjs.Tween.get(this._helpBtn).to({ alpha : 0},140);
		createjs.Tween.get(this._menuRightBtn).to({ alpha : 0},140);
		createjs.Tween.get(this._menuLeftBtn).to({ alpha : 0},140);
		createjs.Tween.get(this._levelsLayer).to({ alpha : 0},500);
		if(this.onPlayClick != null) {
			var properties = { level : this._chosenLevel};
			this.onPlayClick(properties);
		}
	}
	,closeHelp: function() {
		co.doubleduck.BaseGame.hammer.onswipe = $bind(this,this.handleSwipe);
		createjs.Tween.removeTweens(this._helpScreen);
		createjs.Tween.removeTweens(this._helpBtn);
		createjs.Tween.get(this._helpScreen).to({ alpha : 0},1000,createjs.Ease.sineOut);
		this._helpBtn.onClick = $bind(this,this.showHelpMenu);
		this._levelsLayer.mouseEnabled = true;
		if(this._justViewedTutor) {
			var e = { target : { name : "1"}};
			this.handleLevelClick(e);
		} else {
			this.setArrowBtnVisibility();
			this._helpBtn.alpha = 1;
		}
	}
	,showHelpMenu: function() {
		co.doubleduck.BaseGame.hammer.onswipe = null;
		this._helpScreen.rewindPages();
		this._helpScreen.enableSwipe();
		createjs.Tween.get(this._helpScreen).to({ alpha : 1},1000,createjs.Ease.sineOut);
		createjs.Tween.get(this._helpBtn).to({ alpha : 0},1000,createjs.Ease.sineOut);
		this._helpScreen.visible = true;
		this._helpBtn.onClick = null;
		this._levelsLayer.mouseEnabled = false;
		this._menuRightBtn.visible = this._menuLeftBtn.visible = false;
	}
	,handleMuteToggle: function() {
		co.doubleduck.SoundManager.toggleMute();
	}
	,handleSwipe: function(event) {
		if(event.direction == "left") this.goToNext(); else if(event.direction == "right") this.goToPrev();
	}
	,_chosenLevel: null
	,_levelsLayer: null
	,_currLevelScreen: null
	,_isMoving: null
	,_targetLevelsPos: null
	,_chaz: null
	,_menuLeftBtn: null
	,_menuRightBtn: null
	,_helpScreen: null
	,_helpBtn: null
	,_muteBtn: null
	,_snow: null
	,_back: null
	,_themeMusic: null
	,_justViewedTutor: null
	,_levelButtons: null
	,__class__: co.doubleduck.Menu
});
co.doubleduck.PagedHelp = $hxClasses["co.doubleduck.PagedHelp"] = function(backUri,nextBtnUri,gotItBtnUri,pages) {
	createjs.Container.call(this);
	this._background = co.doubleduck.BaseAssets.getImage(backUri);
	this.addChild(this._background);
	this.regX = this._background.image.width / 2;
	this.regY = this._background.image.height / 2;
	this._contentLayer = new createjs.Container();
	if(pages.length > 0) {
		var _g1 = 0, _g = pages.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.addPage(pages[i],i);
		}
		this.addChild(this._contentLayer);
		this._pagesCount = pages.length;
		this._mask = new createjs.Shape();
		this._mask.graphics.beginFill("#000000");
		this._mask.graphics.drawRect(20,20,this._background.image.width - 40,this._background.image.height - 40);
		this._mask.graphics.endFill();
		this._contentLayer.mask = this._mask;
	} else this._pagesCount = 0;
	if(nextBtnUri != null && nextBtnUri != "") {
		this._nextBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(nextBtnUri),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
		this._nextBtn.regX = this._nextBtn.image.width / 2;
		this._nextBtn.regY = this._nextBtn.image.height / 2;
		this._nextBtn.onClick = $bind(this,this.handleNextClick);
		this.addChild(this._nextBtn);
	}
	this._gotItBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage(gotItBtnUri),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
	this._gotItBtn.regX = this._gotItBtn.image.width / 2;
	this._gotItBtn.regY = this._gotItBtn.image.height / 2;
	this._gotItBtn.onClick = $bind(this,this.handleGotItClick);
	this.addChild(this._gotItBtn);
	this.setButtonsPos();
	this._currPage = 0;
	this.enableSwipe();
	this.addPageMarkers();
	this.setButtonsVis();
};
co.doubleduck.PagedHelp.__name__ = ["co","doubleduck","PagedHelp"];
co.doubleduck.PagedHelp.__super__ = createjs.Container;
co.doubleduck.PagedHelp.prototype = $extend(createjs.Container.prototype,{
	createPageMarker: function() {
		var img = co.doubleduck.BaseAssets.getRawImage("images/duckling/page_marker.png");
		var initObject = { };
		initObject.images = [img];
		initObject.frames = { width : 16, height : 18};
		initObject.animations = { };
		initObject.animations.idle = { frames : 0, frequency : 20};
		initObject.animations.active = { frames : 1, frequency : 20};
		var pageMarker = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		pageMarker.gotoAndStop("idle");
		return pageMarker;
	}
	,handleNextClick: function() {
		this._currPage++;
		if(this._currPage >= this._pagesCount) {
			this._currPage = this._pagesCount - 1;
			return;
		}
		this._pageMarkers[this._currPage - 1].gotoAndStop("idle");
		this._pageMarkers[this._currPage].gotoAndStop("active");
		createjs.Tween.get(this._contentLayer).to({ x : -1 * this._background.image.width * this._currPage},200,createjs.Ease.sineOut);
		this.setButtonsVis();
	}
	,handlePrevClick: function() {
		this._currPage--;
		if(this._currPage < 0) {
			this._currPage = 0;
			return;
		}
		this._pageMarkers[this._currPage + 1].gotoAndStop("idle");
		this._pageMarkers[this._currPage].gotoAndStop("active");
		createjs.Tween.get(this._contentLayer).to({ x : -1 * this._background.image.width * this._currPage},200,createjs.Ease.sineOut);
		this.setButtonsVis();
	}
	,setButtonsVis: function() {
		if(this._pagesCount == 0) {
			this._gotItBtn.visible = true;
			return;
		}
		if(this._currPage == this._pagesCount - 1) {
			this._gotItBtn.visible = true;
			this._nextBtn.visible = false;
		} else {
			this._gotItBtn.visible = false;
			this._nextBtn.visible = true;
		}
	}
	,handleSwipe: function(event) {
		if(event.direction == "left") this.handleNextClick(); else if(event.direction == "right") this.handlePrevClick();
	}
	,handleGotItClick: function() {
		if(this.onGotIt != null) this.onGotIt();
	}
	,addPageMarkers: function() {
		if(this._pagesCount == 0) return;
		this._pageMarkers = new Array();
		var totalWidth = 0;
		this._markersLayer = new createjs.Container();
		var _g1 = 0, _g = this._pagesCount;
		while(_g1 < _g) {
			var currPage = _g1++;
			var pageMarker = this.createPageMarker();
			this._pageMarkers.push(pageMarker);
			if(currPage != 0) {
				pageMarker.x = this._pageMarkers[currPage - 1].x + this._pageMarkers[currPage - 1].spriteSheet._frameWidth + 5;
				totalWidth += 5;
			}
			totalWidth += pageMarker.spriteSheet._frameWidth;
			this._markersLayer.addChild(pageMarker);
		}
		this._markersLayer.y = this._background.image.height * 0.80;
		this._markersLayer.x = this._background.image.width / 2;
		this._markersLayer.regX = totalWidth / 2;
		this.addChild(this._markersLayer);
		this._pageMarkers[0].gotoAndStop("active");
	}
	,addPage: function(pageUri,index) {
		var page = co.doubleduck.BaseAssets.getImage(pageUri);
		page.x += this._background.image.width * index;
		this._contentLayer.addChild(page);
	}
	,goToPage: function(page) {
		this._pageMarkers[this._currPage].gotoAndStop("idle");
		this._currPage = page;
		this._pageMarkers[this._currPage].gotoAndStop("active");
		this._contentLayer.x = -1 * this._background.image.width * this._currPage;
		this.setButtonsVis();
	}
	,changeContentMask: function(topPad,bottomPad,leftPad,rightPad) {
		this._mask.graphics.clear();
		this._mask.graphics.beginFill("#000000");
		this._mask.graphics.drawRect(leftPad,topPad,this._background.image.width - (rightPad + leftPad),this._background.image.height - (bottomPad + topPad));
		this._mask.graphics.endFill();
	}
	,rewindPages: function() {
		this.goToPage(0);
	}
	,enableSwipe: function() {
		co.doubleduck.BaseGame.hammer.onswipe = $bind(this,this.handleSwipe);
	}
	,setMarkersPos: function(percentY,percentX) {
		if(percentX == null) percentX = 0.5;
		this._markersLayer.y = this._background.image.height * percentY;
		this._markersLayer.x = this._background.image.width * percentX;
	}
	,setButtonsPos: function(percentX,percentY) {
		if(percentY == null) percentY = 0.5;
		if(percentX == null) percentX = 0.5;
		if(this._nextBtn != null) {
			this._nextBtn.x = this._background.image.width * percentX;
			this._nextBtn.y = this._background.image.height * percentY;
		}
		this._gotItBtn.x = this._background.image.width * percentX;
		this._gotItBtn.y = this._background.image.height * percentY;
	}
	,_currPage: null
	,_pagesCount: null
	,_gotItBtn: null
	,_nextBtn: null
	,_pageMarkers: null
	,_markersLayer: null
	,_mask: null
	,_contentLayer: null
	,_background: null
	,onGotIt: null
	,__class__: co.doubleduck.PagedHelp
});
co.doubleduck.Pattern = $hxClasses["co.doubleduck.Pattern"] = function() {
	this._tiles = new Array();
};
co.doubleduck.Pattern.__name__ = ["co","doubleduck","Pattern"];
co.doubleduck.Pattern.newCompoundPattern = function(pattern1,pattern2,getAllPatterns) {
	var newPattern = new co.doubleduck.Pattern();
	newPattern.onGetAllPatterns = getAllPatterns;
	pattern1.onGetAllPatterns = null;
	pattern2.onGetAllPatterns = null;
	newPattern.setTiles(co.doubleduck.Utils.concatWithoutDuplicates(pattern1.getTiles().slice(),pattern2.getTiles().slice()));
	newPattern.calculatePowerUpGem();
	return newPattern;
}
co.doubleduck.Pattern.sortTiles = function(tile1,tile2) {
	var t1Index = co.doubleduck.Map.COLUMNS * tile1.getY() + tile1.getX();
	var t2Index = co.doubleduck.Map.COLUMNS * tile2.getY() + tile2.getX();
	return t1Index - t2Index;
}
co.doubleduck.Pattern.prototype = {
	containsTile: function(tile) {
		var _g = 0, _g1 = this._tiles;
		while(_g < _g1.length) {
			var myTile = _g1[_g];
			++_g;
			if(myTile.isEquel(tile)) return true;
		}
		return false;
	}
	,isTileAtEdges: function(tile) {
		return tile.isEquel(this._tiles[0]) || tile.isEquel(this._tiles[this._tiles.length - 1]);
	}
	,centerTile: function(roundUp) {
		if(roundUp == null) roundUp = false;
		if(this._center == null) {
			if(roundUp) this._center = this._tiles[this._tiles.length / 2 | 0]; else this._center = this._tiles[(this._tiles.length - 1) / 2 | 0];
		}
		return this._center;
	}
	,_center: null
	,isSharingTile: function(other) {
		var _g = 0, _g1 = other.getTiles();
		while(_g < _g1.length) {
			var tile = _g1[_g];
			++_g;
			if(this.containsTile(tile)) return true;
		}
		return false;
	}
	,pointValue: function() {
		if(this._type == null) return 0;
		var reward = co.doubleduck.DataLoader.getReward(this._type);
		if(reward == null) return 0;
		return reward.points | 0;
	}
	,isEqual: function(other) {
		if(this._rotation != other.getRotation()) return false;
		if(this._type != other.getType()) return false;
		if(this._tiles.length != other.getTiles().length) return false;
		var _g1 = 0, _g = this._tiles.length;
		while(_g1 < _g) {
			var tileIndex = _g1++;
			if(this._tiles[tileIndex] != other.getTiles()[tileIndex]) return false;
		}
		return true;
	}
	,getPowerupGem: function() {
		return this._powerUpGem;
	}
	,getPowerupLocation: function() {
		return this._powerUpGem.getTile();
	}
	,calculatePowerUpGem: function() {
		if(this._joinPoint != null) this._powerUpGem = this._joinPoint.getGem(); else this._powerUpGem = this.centerTile().getGem();
		var tries = 0;
		while(this.gemTakenByOtherPattern(this._powerUpGem) || tries > 50) {
			tries++;
			var newTile = co.doubleduck.Utils.getRandomElement(this._tiles);
			if(newTile.getGem() != null) this._powerUpGem = newTile.getGem();
		}
		this.onGetAllPatterns = null;
	}
	,_powerUpGem: null
	,gemTakenByOtherPattern: function(gem) {
		var _g = 0, _g1 = this.handleGetAllPatterns();
		while(_g < _g1.length) {
			var pattern = _g1[_g];
			++_g;
			if(pattern == this) continue;
			if(pattern.getPowerupGem() == gem) return true;
		}
		return false;
	}
	,addTile: function(t) {
		this._tiles.push(t);
		this._tiles.sort(co.doubleduck.Pattern.sortTiles);
	}
	,setType: function(t) {
		return this._type = t;
	}
	,setRotation: function(r) {
		return this._rotation = r;
	}
	,setTiles: function(tiles) {
		return this._tiles = tiles;
	}
	,getTiles: function() {
		return this._tiles;
	}
	,getType: function() {
		return this._type;
	}
	,getRotation: function() {
		return this._rotation;
	}
	,getPatternPowerUp: function() {
		if(this._powerup == null) {
			var reward = co.doubleduck.DataLoader.getReward(this._type);
			if(reward == null) return null;
			var powerUps = reward.powerup;
			if(powerUps != null) {
				var type = Type.createEnum(co.doubleduck.PowerUpType,co.doubleduck.Utils.getRandomElement(powerUps));
				this._powerup = new co.doubleduck.PowerUp(type,this);
			}
		}
		return this._powerup;
	}
	,disable: function() {
		this._tiles = null;
		this._powerup = null;
		this.onGetAllPatterns = null;
	}
	,setJointPoint: function(tile) {
		this._joinPoint = tile;
	}
	,_joinPoint: null
	,handleGetAllPatterns: function() {
		return this.onGetAllPatterns;
	}
	,onGetAllPatterns: null
	,_powerup: null
	,_tiles: null
	,_type: null
	,_rotation: null
	,__class__: co.doubleduck.Pattern
}
co.doubleduck.PatternType = $hxClasses["co.doubleduck.PatternType"] = { __ename__ : ["co","doubleduck","PatternType"], __constructs__ : ["THREE","FOUR","L","T","FIVE","SIX","BIG_T","SINGLE"] }
co.doubleduck.PatternType.THREE = ["THREE",0];
co.doubleduck.PatternType.THREE.toString = $estr;
co.doubleduck.PatternType.THREE.__enum__ = co.doubleduck.PatternType;
co.doubleduck.PatternType.FOUR = ["FOUR",1];
co.doubleduck.PatternType.FOUR.toString = $estr;
co.doubleduck.PatternType.FOUR.__enum__ = co.doubleduck.PatternType;
co.doubleduck.PatternType.L = ["L",2];
co.doubleduck.PatternType.L.toString = $estr;
co.doubleduck.PatternType.L.__enum__ = co.doubleduck.PatternType;
co.doubleduck.PatternType.T = ["T",3];
co.doubleduck.PatternType.T.toString = $estr;
co.doubleduck.PatternType.T.__enum__ = co.doubleduck.PatternType;
co.doubleduck.PatternType.FIVE = ["FIVE",4];
co.doubleduck.PatternType.FIVE.toString = $estr;
co.doubleduck.PatternType.FIVE.__enum__ = co.doubleduck.PatternType;
co.doubleduck.PatternType.SIX = ["SIX",5];
co.doubleduck.PatternType.SIX.toString = $estr;
co.doubleduck.PatternType.SIX.__enum__ = co.doubleduck.PatternType;
co.doubleduck.PatternType.BIG_T = ["BIG_T",6];
co.doubleduck.PatternType.BIG_T.toString = $estr;
co.doubleduck.PatternType.BIG_T.__enum__ = co.doubleduck.PatternType;
co.doubleduck.PatternType.SINGLE = ["SINGLE",7];
co.doubleduck.PatternType.SINGLE.toString = $estr;
co.doubleduck.PatternType.SINGLE.__enum__ = co.doubleduck.PatternType;
co.doubleduck.Persistence = $hxClasses["co.doubleduck.Persistence"] = function() { }
co.doubleduck.Persistence.__name__ = ["co","doubleduck","Persistence"];
co.doubleduck.Persistence.initGameData = function() {
	co.doubleduck.BasePersistence.GAME_PREFIX = "GA2_";
	if(!co.doubleduck.BasePersistence.available) return;
	co.doubleduck.BasePersistence.initVar("unlockedLVL","1");
	var _g1 = 0, _g = co.doubleduck.DataLoader.getLevelCount();
	while(_g1 < _g) {
		var i = _g1++;
		co.doubleduck.BasePersistence.initVar("starRating" + (i + 1),"0");
	}
}
co.doubleduck.Persistence.getUnlockedLevel = function() {
	return Std.parseInt(co.doubleduck.BasePersistence.getValue("unlockedLVL"));
}
co.doubleduck.Persistence.setUnlockedLevel = function(newLevel) {
	co.doubleduck.BasePersistence.setValue("unlockedLVL","" + newLevel);
}
co.doubleduck.Persistence.getStarRating = function(lvl) {
	return Std.parseInt(co.doubleduck.BasePersistence.getValue("starRating" + lvl));
}
co.doubleduck.Persistence.setStarRating = function(lvl,rating) {
	co.doubleduck.BasePersistence.setValue("starRating" + lvl,"" + rating);
}
co.doubleduck.Persistence.__super__ = co.doubleduck.BasePersistence;
co.doubleduck.Persistence.prototype = $extend(co.doubleduck.BasePersistence.prototype,{
	__class__: co.doubleduck.Persistence
});
co.doubleduck.PowerUp = $hxClasses["co.doubleduck.PowerUp"] = function(type,pattern) {
	this._pattern = pattern;
	this._isActive = true;
	this._type = type;
	if(co.doubleduck.PowerUp._powerupSheet == null) {
		var initObject = { };
		var bmp = co.doubleduck.BaseAssets.getImage("images/session/powerups.png");
		initObject.images = [bmp.image];
		initObject.frames = { width : co.doubleduck.Gem.WIDTH, height : co.doubleduck.Gem.HEIGHT, regX : 0, regY : 0};
		co.doubleduck.PowerUp._powerupSheet = new createjs.SpriteSheet(initObject);
		bmp = null;
		initObject = { };
	}
	this._graphic = new createjs.BitmapAnimation(co.doubleduck.PowerUp._powerupSheet);
	switch( (type)[1] ) {
	case 0:
		this._graphic.gotoAndStop(0);
		break;
	case 1:
		this._graphic.gotoAndStop(2);
		break;
	case 2:
		this._graphic.gotoAndStop(3);
		break;
	case 3:
		this._graphic.gotoAndStop(4);
		break;
	case 4:
		this._graphic.gotoAndStop(1);
		break;
	}
	this.handlePowerUpAdded();
};
co.doubleduck.PowerUp.__name__ = ["co","doubleduck","PowerUp"];
co.doubleduck.PowerUp._powerupSheet = null;
co.doubleduck.PowerUp.onGainPoints = null;
co.doubleduck.PowerUp.onPowerUpAdded = null;
co.doubleduck.PowerUp.onGetTile = null;
co.doubleduck.PowerUp.prototype = {
	getPattern: function() {
		return this._pattern;
	}
	,isEqual: function(other) {
		return this._type == other.getType() && this._pattern == other.getPattern();
	}
	,getGraphic: function() {
		return this._graphic;
	}
	,getTilesAround: function(tile,tiles) {
		var tilesAround = new Array();
		var x = tile.getX();
		var y = tile.getY();
		tilesAround.push(co.doubleduck.Utils.get(x,y,tiles,co.doubleduck.Map.COLUMNS));
		if(y > 0) tilesAround.push(co.doubleduck.Utils.get(x,y - 1,tiles,co.doubleduck.Map.COLUMNS));
		if(y < co.doubleduck.Map.ROWS - 1) tilesAround.push(co.doubleduck.Utils.get(x,y + 1,tiles,co.doubleduck.Map.COLUMNS));
		if(x > 0) {
			tilesAround.push(co.doubleduck.Utils.get(x - 1,y,tiles,co.doubleduck.Map.COLUMNS));
			if(y > 0) tilesAround.push(co.doubleduck.Utils.get(x - 1,y - 1,tiles,co.doubleduck.Map.COLUMNS));
			if(y < co.doubleduck.Map.ROWS - 1) tilesAround.push(co.doubleduck.Utils.get(x - 1,y + 1,tiles,co.doubleduck.Map.COLUMNS));
		}
		if(x < co.doubleduck.Map.COLUMNS - 1) {
			tilesAround.push(co.doubleduck.Utils.get(x + 1,y,tiles,co.doubleduck.Map.COLUMNS));
			if(y > 0) tilesAround.push(co.doubleduck.Utils.get(x + 1,y - 1,tiles,co.doubleduck.Map.COLUMNS));
			if(y < co.doubleduck.Map.ROWS - 1) tilesAround.push(co.doubleduck.Utils.get(x + 1,y + 1,tiles,co.doubleduck.Map.COLUMNS));
		}
		return tilesAround;
	}
	,getTilesofSameColor: function(tile,tiles) {
		var tilesOfSameColor = new Array();
		var _g = 0;
		while(_g < tiles.length) {
			var t = tiles[_g];
			++_g;
			if(t.getGem() == null) continue;
			if(t.getGem().getType() == tile.getGem().getType()) tilesOfSameColor.push(t);
		}
		return tilesOfSameColor;
	}
	,getTilesofSameColumn: function(tile,tiles) {
		var tilesOfSameColumn = new Array();
		var _g = 0;
		while(_g < tiles.length) {
			var t = tiles[_g];
			++_g;
			if(t.getGem() == null) continue;
			if(t.getX() == tile.getX()) tilesOfSameColumn.push(t);
		}
		return tilesOfSameColumn;
	}
	,handleGainPoints: function(pattern) {
		co.doubleduck.PowerUp.onGainPoints(pattern);
	}
	,setInvisible: function() {
		this.getGraphic().visible = false;
	}
	,isVisible: function() {
		return this.getGraphic().visible;
	}
	,activate: function(tiles,mapContainer) {
		if(!this.isActive()) throw "Can't activate the same power up more than once!";
		var tile = null;
		try {
			tile = this.getTile();
		} catch( msg ) {
			if( js.Boot.__instanceof(msg,String) ) {
				return createjs.Tween.get(this);
			} else throw(msg);
		}
		if(tile.getGem() == null) {
		}
		this._isActive = false;
		this.clearFromTileAndGem(tile);
		var tilesToAffect = [];
		switch( (this._type)[1] ) {
		case 0:
			co.doubleduck.SoundManager.playEffect("sound/Bomb_powerup");
			tilesToAffect = this.getTilesAround(tile,tiles);
			break;
		case 2:
			co.doubleduck.SoundManager.playEffect("sound/Color_bomb_powerup");
			tilesToAffect = this.getTilesofSameColor(tile,tiles);
			break;
		case 1:
			co.doubleduck.SoundManager.playEffect("sound/Icicle_fall_powerup");
			tilesToAffect = this.getTilesofSameColumn(tile,tiles);
			this._specialEffect = new co.doubleduck.SpecialEffect(co.doubleduck.SpecialEffectType.ICICLE);
			break;
		case 3:
			co.doubleduck.SoundManager.playEffect("sound/Bigbomb_part_1");
			tilesToAffect = tiles;
			this._specialEffect = new co.doubleduck.SpecialEffect(co.doubleduck.SpecialEffectType.ICE_BLAST);
			break;
		case 4:
			co.doubleduck.SoundManager.playEffect("sound/Extra_moves_powerup");
			tilesToAffect.push(tile);
			this.onIncreaseMoves(2);
			break;
		}
		var specialEffectTween = null;
		if(this._specialEffect != null) {
			var backgroundHeight = co.doubleduck.BaseGame.getViewport().height / co.doubleduck.BaseGame.getScale();
			specialEffectTween = this._specialEffect.show(tile.getX(),backgroundHeight,mapContainer);
		}
		var sumDelay = 0;
		if(this._type == co.doubleduck.PowerUpType.MEGABOMB) sumDelay = co.doubleduck.SpecialEffect.ICE_CREEPING_DURATION + 400;
		var singleTile = new co.doubleduck.Pattern();
		singleTile.setType(co.doubleduck.PatternType.SINGLE);
		var _g = 0;
		while(_g < tilesToAffect.length) {
			var tile1 = tilesToAffect[_g];
			++_g;
			if(tile1.getGem() != null && tile1.getGem().getPowerUp() == null) {
				sumDelay += Std.random(5) * 10;
				createjs.Tween.get(tile1).wait(sumDelay).call(($_=tile1.getGem(),$bind($_,$_.destroy))).call($bind(this,this.handleGainPoints),[singleTile]).call($bind(this,this.setInvisible));
			}
		}
		this._pattern = null;
		if(this._type == co.doubleduck.PowerUpType.COL_REMOVE) return specialEffectTween; else return createjs.Tween.get(this).wait(sumDelay + 250);
	}
	,deactivate: function() {
		this._pattern = null;
		this._graphic.visible = false;
		if(this._graphic.parent != null) (js.Boot.__cast(this._graphic.parent , createjs.Container)).removeChild(this._graphic);
		this._graphic = null;
		this._isActive = false;
		if(this._specialEffect != null) {
			this._specialEffect.destroy();
			this._specialEffect = null;
		}
	}
	,getTile: function() {
		var gemContainer = this.getGraphic().parent;
		if(gemContainer == null) {
			this._isActive = false;
			this.setInvisible();
			throw "no container for this power up? " + Std.string(this.getType());
		}
		var tileX = Math.round((gemContainer.x - co.doubleduck.Tile.WIDTH / 2) / co.doubleduck.Gem.WIDTH);
		var tileY = Math.round((gemContainer.y - co.doubleduck.Tile.HEIGHT / 2) / co.doubleduck.Gem.HEIGHT);
		return this.handleGetTile(tileX,tileY);
	}
	,handleGetTile: function(x,y) {
		return co.doubleduck.PowerUp.onGetTile(x,y);
	}
	,clearFromTileAndGem: function(tile) {
		if(tile != null && tile.getGem() != null) tile.getGem().clearPowerUp(this);
		tile = null;
	}
	,isActive: function() {
		return this._isActive;
	}
	,getType: function() {
		return this._type;
	}
	,handlePowerUpAdded: function() {
		co.doubleduck.PowerUp.onPowerUpAdded(this);
	}
	,disable: function() {
		createjs.Tween.removeTweens(this);
		this._pattern = null;
		this._graphic = null;
		this._specialEffect = null;
		co.doubleduck.PowerUp._powerupSheet = null;
		this.onIncreaseMoves = null;
		co.doubleduck.PowerUp.onGainPoints = null;
		co.doubleduck.PowerUp.onPowerUpAdded = null;
		co.doubleduck.PowerUp.onGetTile = null;
	}
	,onIncreaseMoves: null
	,_specialEffect: null
	,_isActive: null
	,_graphic: null
	,_type: null
	,_pattern: null
	,__class__: co.doubleduck.PowerUp
}
co.doubleduck.PowerUpType = $hxClasses["co.doubleduck.PowerUpType"] = { __ename__ : ["co","doubleduck","PowerUpType"], __constructs__ : ["BOMB","COL_REMOVE","COLOR_BLAST","MEGABOMB","PLUS_2"] }
co.doubleduck.PowerUpType.BOMB = ["BOMB",0];
co.doubleduck.PowerUpType.BOMB.toString = $estr;
co.doubleduck.PowerUpType.BOMB.__enum__ = co.doubleduck.PowerUpType;
co.doubleduck.PowerUpType.COL_REMOVE = ["COL_REMOVE",1];
co.doubleduck.PowerUpType.COL_REMOVE.toString = $estr;
co.doubleduck.PowerUpType.COL_REMOVE.__enum__ = co.doubleduck.PowerUpType;
co.doubleduck.PowerUpType.COLOR_BLAST = ["COLOR_BLAST",2];
co.doubleduck.PowerUpType.COLOR_BLAST.toString = $estr;
co.doubleduck.PowerUpType.COLOR_BLAST.__enum__ = co.doubleduck.PowerUpType;
co.doubleduck.PowerUpType.MEGABOMB = ["MEGABOMB",3];
co.doubleduck.PowerUpType.MEGABOMB.toString = $estr;
co.doubleduck.PowerUpType.MEGABOMB.__enum__ = co.doubleduck.PowerUpType;
co.doubleduck.PowerUpType.PLUS_2 = ["PLUS_2",4];
co.doubleduck.PowerUpType.PLUS_2.toString = $estr;
co.doubleduck.PowerUpType.PLUS_2.__enum__ = co.doubleduck.PowerUpType;
co.doubleduck.Session = $hxClasses["co.doubleduck.Session"] = function(properties) {
	this._sessionOver = false;
	co.doubleduck.BaseSession.call(this);
	this._level = properties.level;
	co.doubleduck.Session._lastVisitedLevel = this._level;
	var levelData = co.doubleduck.DataLoader.getLevel(this._level);
	this._background = co.doubleduck.Utils.getCenteredImage("images/general/pp_session_bg.png",true);
	this._background.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._background.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this._snow = co.doubleduck.Utils.getCenteredImage("images/general/pp_session_bottom.png",true);
	this._snow.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._snow.y = co.doubleduck.BaseGame.getViewport().height / 2 + co.doubleduck.BaseGame.getScale() * this._background.image.height / 2 - co.doubleduck.BaseGame.getScale() * this._snow.image.height / 2;
	this._goal1 = levelData.goal1;
	this._goal2 = levelData.goal2;
	this._goal3 = levelData.goal3;
	this._score = 0;
	this._moves = levelData.moves;
	this._hud = new co.doubleduck.Hud();
	this._hud.setGoal(this._goal1);
	this._hud.setLevel(this._level);
	this._hud.setScore(this._score);
	this._hud.setMoves(this._moves);
	this._hud.scaleX = this._hud.scaleY = co.doubleduck.BaseGame.getScale();
	this._hud.x = this._background.x - co.doubleduck.BaseGame.getScale() * this._hud.getWidth() / 2;
	this._hud.setPauseContainerPosition(this._background.image.width / 2 - this._hud.x,this._background.image.height / 2);
	var hudHeight = co.doubleduck.BaseGame.getScale() * this._hud.getHeight();
	this._map = new co.doubleduck.Map(levelData.map);
	this._map.x = this._background.x - co.doubleduck.BaseGame.getScale() * this._map.getWidth() / 2;
	this._map.scaleX = this._map.scaleY = co.doubleduck.BaseGame.getScale();
	var mapHeight = co.doubleduck.BaseGame.getScale() * this._map.getHeight();
	this._map.y = this._background.y - mapHeight / 2;
	if(hudHeight > this._map.y) this._map.y = hudHeight * 1.1;
	this._map.canMove = $bind(this,this.handleCanMove);
	this._map.onMoveStart = $bind(this,this.handleMoveStart);
	this._map.onMoveEnd = $bind(this,this.handleMoveEnd);
	this._map.onPointsGain = $bind(this,this.handlePointsGain);
	this._map.onIncreaseMoves = $bind(this,this.handleIncreaseMoves);
	this.addChild(this._background);
	this.addChild(this._map);
	this.addChild(this._hud);
	co.doubleduck.BaseGame.hammer.onswipe = $bind(this,this.handleSwipe);
	this._hud.setStarPosition1(this._goal1 / this._goal3);
	this._hud.setStarPosition2(this._goal2 / this._goal3);
	this._hud.setStarPosition3(1.0);
	this._hud.onRestart = $bind(this,this.handleRestart);
	this._hud.onMenu = $bind(this,this.handleBackToMenu);
	this._hud.onContinue = $bind(this,this.handleContinue);
	this._gameOver = new co.doubleduck.GameOverPopup();
	this._gameOver.onRestart = $bind(this,this.handleRestart);
	this._gameOver.onMenu = $bind(this,this.handleBackToMenu);
	this._gameOver.onContinue = $bind(this,this.handleNextLevel);
	this.addChild(this._gameOver);
	this._gameOver.scaleX = this._gameOver.scaleY = co.doubleduck.BaseGame.getScale();
	this._gameOver.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._gameOver.y = co.doubleduck.BaseGame.getViewport().height / 2;
	co.doubleduck.SoundManager.playEffect("sound/Falling_gems");
	this.addChild(this._snow);
};
co.doubleduck.Session.__name__ = ["co","doubleduck","Session"];
co.doubleduck.Session.getLastVisitedLevel = function() {
	return co.doubleduck.Session._lastVisitedLevel;
}
co.doubleduck.Session.__super__ = co.doubleduck.BaseSession;
co.doubleduck.Session.prototype = $extend(co.doubleduck.BaseSession.prototype,{
	destroy: function() {
		co.doubleduck.BaseSession.prototype.destroy.call(this);
		this._sessionOver = true;
		co.doubleduck.PowerUp.onPowerUpAdded = null;
		co.doubleduck.PowerUp.onGainPoints = null;
		co.doubleduck.PowerUp.onGetTile = null;
		co.doubleduck.Gem.onGetTile = null;
		co.doubleduck.BaseGame.hammer.onswipe = null;
		if(this._hintTimer != null) {
			createjs.Tween.removeTweens(this._hintTimer);
			this._hintTimer = null;
		}
		this.removeAllChildren();
		this._background = null;
		this._snow = null;
		this._map.destroy();
		this._map = null;
		this._hud.destroy();
		this._hud = null;
		this._gameOver.destroy();
		this._gameOver = null;
	}
	,handleSwipe: function(event) {
		if(!this._map.isEnabled()) return;
		this._map.setEnabled(false);
		var start = new createjs.Point(event.position.x - event.distanceX,event.position.y - event.distanceY);
		var end = new createjs.Point(event.position.x,event.position.y);
		var direction = event.direction;
		start.x -= this._map.x;
		start.y -= this._map.y;
		end.x -= this._map.x;
		end.y -= this._map.y;
		start.x /= co.doubleduck.BaseGame.getScale();
		start.y /= co.doubleduck.BaseGame.getScale();
		end.x /= co.doubleduck.BaseGame.getScale();
		end.y /= co.doubleduck.BaseGame.getScale();
		this._map.handleSwipe(start,end,direction);
	}
	,handleNextLevel: function() {
		this.onNextLevel({ level : this._level + 1});
	}
	,handleContinue: function() {
		this._hud.showPauseButton();
		createjs.Ticker.setPaused(false);
	}
	,handleBackToMenu: function() {
		this.onBackToMenu();
	}
	,handleRestart: function() {
		this.onRestart({ level : this._level});
	}
	,handleIncreaseMoves: function(m) {
		this._moves += m;
		this._hud.setMoves(this._moves);
		this._hud.movesEffect();
	}
	,handlePointsGain: function(points) {
		this._score += points;
		this._hud.setScore(this._score);
		this._hud.setBar(this._score / this._goal3);
		if(this._score >= this._goal1) this._hud.lightStar1();
		if(this._score >= this._goal2) this._hud.lightStar2();
		if(this._score >= this._goal3) this._hud.lightStar3();
	}
	,handleCanMove: function() {
		return this._moves > 0;
	}
	,searchHints: function() {
		createjs.Tween.removeTweens(this._hintTimer);
		this._hintTimer = null;
		this._map.searchHints();
	}
	,hintCheck: function() {
		if(this._hintTimer != null) return;
		this._hintTimer = { };
		createjs.Tween.get(this._hintTimer).wait(co.doubleduck.Session.HINT_TIME).call($bind(this,this.searchHints));
	}
	,handleMoveEnd: function() {
		if(this._moves == 0 && !this._sessionOver) {
			this._sessionOver = true;
			co.doubleduck.PowerUp.onPowerUpAdded = null;
			co.doubleduck.PowerUp.onGainPoints = null;
			co.doubleduck.PowerUp.onGetTile = null;
			co.doubleduck.Gem.onGetTile = null;
			var stars = 0;
			if(this._score >= this._goal3) stars = 3; else if(this._score >= this._goal2) stars = 2; else if(this._score >= this._goal1) stars = 1;
			this._gameOver.show(this._score,stars,this._level);
			var chaz = this._gameOver.getChaz();
			chaz.scaleX = chaz.scaleY = co.doubleduck.BaseGame.getScale();
			this.addChildAt(chaz,this.getChildIndex(this._snow));
			var baseY = co.doubleduck.BaseGame.getViewport().height * 1.02;
			this._gameOver.tweenChaz(0,baseY,chaz.image.width * co.doubleduck.BaseGame.getScale(),baseY - chaz.image.height * co.doubleduck.BaseGame.getScale());
			if(co.doubleduck.Persistence.getStarRating(this._level) < stars) {
				if(co.doubleduck.Persistence.getUnlockedLevel() == this._level && stars > 0) {
					if(this._level < co.doubleduck.DataLoader.getLevelCount()) co.doubleduck.Persistence.setUnlockedLevel(this._level + 1);
				}
				co.doubleduck.Persistence.setStarRating(this._level,stars);
			}
		} else {
			this.hintCheck();
			this._map.setEnabled(true);
		}
	}
	,handleMoveStart: function() {
		this._map.setEnabled(false);
		if(this._moves == 0) {
			throw "are cascades counted as moves?";
			return;
		}
		this._moves--;
		this._hud.setMoves(this._moves);
		if(this._hintTimer != null) {
			createjs.Tween.removeTweens(this._hintTimer);
			this._hintTimer = null;
		}
	}
	,_hintTimer: null
	,_sessionOver: null
	,_moves: null
	,_score: null
	,_level: null
	,_goal3: null
	,_goal2: null
	,_goal1: null
	,_gameOver: null
	,_hud: null
	,_map: null
	,_snow: null
	,_background: null
	,__class__: co.doubleduck.Session
});
co.doubleduck.SoundType = $hxClasses["co.doubleduck.SoundType"] = { __ename__ : ["co","doubleduck","SoundType"], __constructs__ : ["WEB_AUDIO","AUDIO_FX","AUDIO_NO_OVERLAP","HOWLER","NONE"] }
co.doubleduck.SoundType.WEB_AUDIO = ["WEB_AUDIO",0];
co.doubleduck.SoundType.WEB_AUDIO.toString = $estr;
co.doubleduck.SoundType.WEB_AUDIO.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_FX = ["AUDIO_FX",1];
co.doubleduck.SoundType.AUDIO_FX.toString = $estr;
co.doubleduck.SoundType.AUDIO_FX.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP = ["AUDIO_NO_OVERLAP",2];
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.toString = $estr;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.HOWLER = ["HOWLER",3];
co.doubleduck.SoundType.HOWLER.toString = $estr;
co.doubleduck.SoundType.HOWLER.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.NONE = ["NONE",4];
co.doubleduck.SoundType.NONE.toString = $estr;
co.doubleduck.SoundType.NONE.__enum__ = co.doubleduck.SoundType;
if(!co.doubleduck.audio) co.doubleduck.audio = {}
co.doubleduck.audio.AudioAPI = $hxClasses["co.doubleduck.audio.AudioAPI"] = function() { }
co.doubleduck.audio.AudioAPI.__name__ = ["co","doubleduck","audio","AudioAPI"];
co.doubleduck.audio.AudioAPI.prototype = {
	setVolume: null
	,pause: null
	,stop: null
	,playMusic: null
	,playEffect: null
	,init: null
	,__class__: co.doubleduck.audio.AudioAPI
}
co.doubleduck.audio.WebAudioAPI = $hxClasses["co.doubleduck.audio.WebAudioAPI"] = function(src) {
	this._src = src;
	this.loadAudioFile(this._src);
};
co.doubleduck.audio.WebAudioAPI.__name__ = ["co","doubleduck","audio","WebAudioAPI"];
co.doubleduck.audio.WebAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.WebAudioAPI.context = null;
co.doubleduck.audio.WebAudioAPI.webAudioInit = function() {
	co.doubleduck.audio.WebAudioAPI.context = new webkitAudioContext();
}
co.doubleduck.audio.WebAudioAPI.saveBuffer = function(buffer,name) {
	co.doubleduck.audio.WebAudioAPI._buffers[name] = buffer;
}
co.doubleduck.audio.WebAudioAPI.decodeError = function() {
	null;
}
co.doubleduck.audio.WebAudioAPI.prototype = {
	setVolume: function(volume) {
		if(this._gainNode != null) this._gainNode.gain.value = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._source != null) this._source.noteOff(0);
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playBuffer: function(name,loop) {
		if(loop == null) loop = false;
		if(this._gainNode == null) {
			this._gainNode = co.doubleduck.audio.WebAudioAPI.context.createGainNode();
			this._gainNode.connect(co.doubleduck.audio.WebAudioAPI.context.destination);
		}
		this._buffer = Reflect.getProperty(co.doubleduck.audio.WebAudioAPI._buffers,this._src);
		if(this._buffer == null) return;
		this._source = co.doubleduck.audio.WebAudioAPI.context.createBufferSource();
		this._source.buffer = this._buffer;
		this._source.loop = loop;
		this._source.connect(this._gainNode);
		this._source.noteOn(0);
	}
	,loadAudioFile: function(src) {
		var request = new XMLHttpRequest();
		request.open("get",src,true);
		request.responseType = "arraybuffer";
		request.onload = function() { co.doubleduck.audio.WebAudioAPI.context.decodeAudioData(request.response, function(decodedBuffer) { buffer = decodedBuffer; co.doubleduck.audio.WebAudioAPI.saveBuffer(buffer,src); }, co.doubleduck.audio.WebAudioAPI.decodeError) }
		request.send();
	}
	,init: function() {
	}
	,_source: null
	,_gainNode: null
	,_buffer: null
	,_src: null
	,__class__: co.doubleduck.audio.WebAudioAPI
}
co.doubleduck.SoundManager = $hxClasses["co.doubleduck.SoundManager"] = function() {
};
co.doubleduck.SoundManager.__name__ = ["co","doubleduck","SoundManager"];
co.doubleduck.SoundManager.engineType = null;
co.doubleduck.SoundManager.EXTENSION = null;
co.doubleduck.SoundManager.getPersistedMute = function() {
	var mute = co.doubleduck.BasePersistence.getValue("mute");
	if(mute == "0") {
		mute = "false";
		co.doubleduck.SoundManager.setPersistedMute(false);
	}
	return mute == "true";
}
co.doubleduck.SoundManager.setPersistedMute = function(mute) {
	var val = "true";
	if(!mute) val = "false";
	co.doubleduck.BasePersistence.setValue("mute",val);
}
co.doubleduck.SoundManager.isSoundAvailable = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isMobile = /Mobile/.test(navigator.userAgent);
	var isAndroid = /Android/.test(navigator.userAgent);
	var isAndroid4 = /Android 4/.test(navigator.userAgent);
	var isSafari = /Safari/.test(navigator.userAgent);
	var agent = navigator.userAgent;
	var reg = new EReg("iPhone OS 6","");
	var isIOS6 = reg.match(agent) && isSafari && isMobile;
	var isIpad = /iPad/.test(navigator.userAgent);
	isIpad = isIpad && /OS 6/.test(navigator.userAgent);
	isIOS6 = isIOS6 || isIpad;
	if(isFirefox) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_FX;
		co.doubleduck.SoundManager.EXTENSION = ".ogg";
		return true;
	}
	if(isChrome && (!isAndroid && !isMobile)) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	if(isIOS6) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	} else if(isAndroid4 && !isChrome) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_NO_OVERLAP;
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.NONE;
	co.doubleduck.BasePersistence.initVar("mute");
	return false;
}
co.doubleduck.SoundManager.mute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = true;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(0);
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.unmute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = false;
	try {
		var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
		while(_g1 < _g) {
			var currSound = _g1++;
			var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
			if(mySound != null) mySound.setVolume(1);
		}
	} catch( e ) {
		null;
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.toggleMute = function() {
	if(co.doubleduck.SoundManager._muted) co.doubleduck.SoundManager.unmute(); else co.doubleduck.SoundManager.mute();
}
co.doubleduck.SoundManager.isMuted = function() {
	co.doubleduck.SoundManager._muted = co.doubleduck.SoundManager.getPersistedMute();
	return co.doubleduck.SoundManager._muted;
}
co.doubleduck.SoundManager.getAudioInstance = function(src) {
	if(!co.doubleduck.SoundManager.available) return new co.doubleduck.audio.DummyAudioAPI();
	src += co.doubleduck.SoundManager.EXTENSION;
	var audio = Reflect.getProperty(co.doubleduck.SoundManager._cache,src);
	if(audio == null) {
		switch( (co.doubleduck.SoundManager.engineType)[1] ) {
		case 1:
			audio = new co.doubleduck.audio.AudioFX(src);
			break;
		case 0:
			audio = new co.doubleduck.audio.WebAudioAPI(src);
			break;
		case 2:
			audio = new co.doubleduck.audio.NonOverlappingAudio(src);
			break;
		case 3:
			audio = new co.doubleduck.audio.HowlerAudio(src);
			break;
		case 4:
			return new co.doubleduck.audio.DummyAudioAPI();
		}
		Reflect.setProperty(co.doubleduck.SoundManager._cache,src,audio);
	}
	return audio;
}
co.doubleduck.SoundManager.playEffect = function(src,volume,optional) {
	if(optional == null) optional = false;
	if(volume == null) volume = 1;
	if(optional && co.doubleduck.SoundManager.engineType == co.doubleduck.SoundType.AUDIO_NO_OVERLAP) return new co.doubleduck.audio.DummyAudioAPI();
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playEffect(playVolume);
	return audio;
}
co.doubleduck.SoundManager.playMusic = function(src,volume,loop) {
	if(loop == null) loop = true;
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playMusic(playVolume,loop);
	return audio;
}
co.doubleduck.SoundManager.initSound = function(src) {
	co.doubleduck.SoundManager.getAudioInstance(src);
}
co.doubleduck.SoundManager.prototype = {
	__class__: co.doubleduck.SoundManager
}
co.doubleduck.SpecialEffect = $hxClasses["co.doubleduck.SpecialEffect"] = function(type) {
	this._type = type;
	switch( (type)[1] ) {
	case 0:
		this._bitmap = co.doubleduck.BaseAssets.getImage(co.doubleduck.SpecialEffect.ICE_BLAST_BITMAP);
		this._mask = new createjs.Shape();
		this._mask.x = this._mask.regX = this._bitmap.image.width / 2;
		this._mask.y = this._mask.regY = this._bitmap.image.height / 2;
		this._mask.graphics.beginFill("#000000");
		this._mask.graphics.rect(0,0,this._bitmap.image.width,this._bitmap.image.height);
		this._mask.graphics.endFill();
		if(!co.doubleduck.Utils.isMobileFirefox()) this._bitmap.mask = this._mask;
		break;
	case 1:
		this._bitmap = co.doubleduck.BaseAssets.getImage(co.doubleduck.SpecialEffect.ICICLE_BITMAP);
		this._bitmap.regY = this._bitmap.image.height;
		break;
	}
};
co.doubleduck.SpecialEffect.__name__ = ["co","doubleduck","SpecialEffect"];
co.doubleduck.SpecialEffect.prototype = {
	destroy: function() {
		this._bitmap = null;
		this._mask = null;
	}
	,end: function(container) {
		container.removeChild(this._bitmap);
		this.destroy();
	}
	,show: function(tileX,backgroundHeight,container) {
		container.addChild(this._bitmap);
		var tween = null;
		switch( (this._type)[1] ) {
		case 1:
			this._bitmap.x = co.doubleduck.Gem.WIDTH * tileX;
			this._bitmap.y = -this._bitmap.image.height;
			tween = createjs.Tween.get(this._bitmap).to({ y : backgroundHeight},500,createjs.Ease.sineIn);
			break;
		case 0:
			if(co.doubleduck.Utils.isMobileFirefox()) {
				this._bitmap.alpha = 0;
				this._bitmap.scaleX = this._bitmap.scaleY = 0;
				this._bitmap.x = this._bitmap.regX = this._bitmap.image.width / 2;
				this._bitmap.y = this._bitmap.regY = this._bitmap.image.height / 2;
				tween = createjs.Tween.get(this._bitmap).to({ alpha : 1, scaleX : 1, scaleY : 1},co.doubleduck.SpecialEffect.ICE_CREEPING_DURATION);
				tween.to({ alpha : 0},co.doubleduck.SpecialEffect.ICE_CREEPING_DURATION);
			} else {
				this._mask.scaleX = this._mask.scaleY = 0;
				tween = createjs.Tween.get(this._mask).to({ scaleX : 1, scaleY : 1},co.doubleduck.SpecialEffect.ICE_CREEPING_DURATION);
				createjs.Tween.get(this._bitmap).wait(co.doubleduck.SpecialEffect.ICE_CREEPING_DURATION).to({ alpha : 0},co.doubleduck.SpecialEffect.ICE_CREEPING_DURATION);
			}
			return tween.call(co.doubleduck.SoundManager.playEffect,["sound/Bigbomb_part_2"]);
		}
		return tween.call($bind(this,this.end),[container]);
	}
	,_mask: null
	,_type: null
	,_bitmap: null
	,__class__: co.doubleduck.SpecialEffect
}
co.doubleduck.SpecialEffectType = $hxClasses["co.doubleduck.SpecialEffectType"] = { __ename__ : ["co","doubleduck","SpecialEffectType"], __constructs__ : ["ICE_BLAST","ICICLE"] }
co.doubleduck.SpecialEffectType.ICE_BLAST = ["ICE_BLAST",0];
co.doubleduck.SpecialEffectType.ICE_BLAST.toString = $estr;
co.doubleduck.SpecialEffectType.ICE_BLAST.__enum__ = co.doubleduck.SpecialEffectType;
co.doubleduck.SpecialEffectType.ICICLE = ["ICICLE",1];
co.doubleduck.SpecialEffectType.ICICLE.toString = $estr;
co.doubleduck.SpecialEffectType.ICICLE.__enum__ = co.doubleduck.SpecialEffectType;
co.doubleduck.Tile = $hxClasses["co.doubleduck.Tile"] = function(x,y,isWall) {
	if(isWall) this._type = co.doubleduck.TileType.WALL; else this._type = co.doubleduck.TileType.EMPTY;
	this._tileX = x;
	this._tileY = y;
	this._graphic = co.doubleduck.BaseAssets.getImage("images/session/pp_gem_board.png",true);
	if(this._type == co.doubleduck.TileType.WALL) this._graphic.visible = false;
	this._width = co.doubleduck.Tile.WIDTH;
	this._height = co.doubleduck.Tile.HEIGHT;
	this._graphic.mouseEnabled = true;
	this._graphic.onClick = $bind(this,this.handleClick);
	this._graphic.x = co.doubleduck.Gem.WIDTH * x;
	this._graphic.y = co.doubleduck.Gem.HEIGHT * y;
};
co.doubleduck.Tile.__name__ = ["co","doubleduck","Tile"];
co.doubleduck.Tile.prototype = {
	getType: function() {
		return this._type;
	}
	,getGraphic: function() {
		return this._graphic;
	}
	,getHeight: function() {
		return this._height;
	}
	,getWidth: function() {
		return this._width;
	}
	,getY: function() {
		return this._tileY;
	}
	,getX: function() {
		return this._tileX;
	}
	,setY: function(y) {
		this._tileY = y;
	}
	,setX: function(x) {
		this._tileX = x;
	}
	,setGem: function(g,updateGemGraphics,tweenDuration) {
		if(updateGemGraphics == null) updateGemGraphics = true;
		this._currentGem = g;
		if(this._currentGem == null) return null;
		if(g.getTile() != this) g.setTile(this);
		if(updateGemGraphics) {
			var targetX = this.getGemX();
			var targetY = this.getGemY();
			if(tweenDuration != null) this._latestGemSettingTween = g.tweenTo(targetX,targetY,tweenDuration); else {
				g.setGraphicX(targetX);
				g.setGraphicY(targetY);
			}
		}
		return this._currentGem;
	}
	,isEquel: function(other) {
		return this.getX() == other.getX() && this.getY() == other.getY();
	}
	,isEmpty: function() {
		return this.getType() == co.doubleduck.TileType.EMPTY && this.getGem() == null;
	}
	,getGem: function() {
		return this._currentGem;
	}
	,isAdjacent: function(other) {
		var dx = Math.abs(other.getX() - this.getX()) | 0;
		var dy = Math.abs(other.getY() - this.getY()) | 0;
		return dx + dy == 1;
	}
	,getGemY: function() {
		return co.doubleduck.Gem.HEIGHT * this._tileY + co.doubleduck.Tile.HEIGHT / 2;
	}
	,getGemX: function() {
		return co.doubleduck.Gem.WIDTH * this._tileX + co.doubleduck.Tile.WIDTH / 2;
	}
	,highlight: function() {
		this.getGem().highlight();
	}
	,handleClick: function(e) {
		if(this.onClick != null) {
			e.target = this;
			this.onClick(e);
		}
	}
	,toString: function() {
		var str = this.getX() + "," + this.getY();
		if(this.getGem() != null) str += ": " + Std.string(this.getGem().getType());
		return str;
	}
	,unSelect: function() {
		this._currentGem.unSelect();
	}
	,select: function() {
		this._currentGem.select();
	}
	,disable: function() {
		createjs.Tween.removeTweens(this);
		this._graphic = null;
		this._currentGem = null;
		this.onClick = null;
	}
	,getLatestGemSettingTween: function() {
		return this._latestGemSettingTween;
	}
	,_latestGemSettingTween: null
	,onClick: null
	,_currentGem: null
	,_height: null
	,_width: null
	,_graphic: null
	,_tileY: null
	,_tileX: null
	,_type: null
	,__class__: co.doubleduck.Tile
}
co.doubleduck.TileType = $hxClasses["co.doubleduck.TileType"] = { __ename__ : ["co","doubleduck","TileType"], __constructs__ : ["WALL","EMPTY"] }
co.doubleduck.TileType.WALL = ["WALL",0];
co.doubleduck.TileType.WALL.toString = $estr;
co.doubleduck.TileType.WALL.__enum__ = co.doubleduck.TileType;
co.doubleduck.TileType.EMPTY = ["EMPTY",1];
co.doubleduck.TileType.EMPTY.toString = $estr;
co.doubleduck.TileType.EMPTY.__enum__ = co.doubleduck.TileType;
co.doubleduck.Utils = $hxClasses["co.doubleduck.Utils"] = function() { }
co.doubleduck.Utils.__name__ = ["co","doubleduck","Utils"];
co.doubleduck.Utils.dateDeltaInDays = function(day1,day2) {
	var delta = Math.abs(day2.getTime() - day1.getTime());
	return delta / 86400000;
}
co.doubleduck.Utils.getTodayDate = function() {
	var newDate = new Date();
	return HxOverrides.dateStr(newDate);
}
co.doubleduck.Utils.getHour = function() {
	var newDate = new Date();
	return newDate.getHours();
}
co.doubleduck.Utils.rectOverlap = function(r1,r2) {
	var r1TopLeft = new createjs.Point(r1.x,r1.y);
	var r1BottomRight = new createjs.Point(r1.x + r1.width,r1.y + r1.height);
	var r1TopRight = new createjs.Point(r1.x + r1.width,r1.y);
	var r1BottomLeft = new createjs.Point(r1.x,r1.y + r1.height);
	var r2TopLeft = new createjs.Point(r2.x,r2.y);
	var r2BottomRight = new createjs.Point(r2.x + r2.width,r2.y + r2.height);
	var r2TopRight = new createjs.Point(r2.x + r2.width,r2.y);
	var r2BottomLeft = new createjs.Point(r2.x,r2.y + r2.height);
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.overlap = function(obj1,obj1Width,obj1Height,obj2,obj2Width,obj2Height) {
	var o1TopLeft = new createjs.Point(obj1.x - obj1.regX * co.doubleduck.BaseGame.getScale(),obj1.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomRight = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale() + obj1Width * co.doubleduck.BaseGame.getScale(),o1TopLeft.y + obj1Height * co.doubleduck.BaseGame.getScale() - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1TopRight = new createjs.Point(o1BottomRight.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1TopLeft.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomLeft = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1BottomRight.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o2TopLeft = new createjs.Point(obj2.x - obj2.regX * co.doubleduck.BaseGame.getScale(),obj2.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomRight = new createjs.Point(o2TopLeft.x + obj2Width * co.doubleduck.BaseGame.getScale() - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y + obj2Height * co.doubleduck.BaseGame.getScale() - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2TopRight = new createjs.Point(o2BottomRight.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomLeft = new createjs.Point(o2TopLeft.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2BottomRight.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.rectContainPoint = function(rectTopLeft,rectBottomRight,point) {
	return point.x >= rectTopLeft.x && point.x <= rectBottomRight.x && point.y >= rectTopLeft.y && point.y <= rectBottomRight.y;
}
co.doubleduck.Utils.objectContains = function(dyn,memberName) {
	return Reflect.hasField(dyn,memberName);
}
co.doubleduck.Utils.contains = function(arr,obj) {
	var _g = 0;
	while(_g < arr.length) {
		var element = arr[_g];
		++_g;
		if(element == obj) return true;
	}
	return false;
}
co.doubleduck.Utils.isMobileFirefox = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	return isFirefox && viewporter.ACTIVE;
}
co.doubleduck.Utils.get = function(x,y,tiles,columns) {
	return tiles[columns * y + x];
}
co.doubleduck.Utils.getBitmapLabel = function(label,fontType,padding) {
	if(padding == null) padding = 0;
	if(fontType == null) fontType = "";
	var fontHelper = new co.doubleduck.FontHelper(fontType);
	var bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding);
	return bitmapText;
}
co.doubleduck.Utils.concatWithoutDuplicates = function(array,otherArray) {
	var _g = 0;
	while(_g < otherArray.length) {
		var element = otherArray[_g];
		++_g;
		co.doubleduck.Utils.addToArrayWithoutDuplicates(array,element);
	}
	return array;
}
co.doubleduck.Utils.addToArrayWithoutDuplicates = function(array,element) {
	var _g = 0;
	while(_g < array.length) {
		var currElement = array[_g];
		++_g;
		if(currElement == element) return array;
	}
	array.push(element);
	return array;
}
co.doubleduck.Utils.getImageData = function(image) {
	var ctx = co.doubleduck.Utils.getCanvasContext();
	var img = co.doubleduck.BaseAssets.getImage(image);
	ctx.drawImage(img.image,0,0);
	return ctx.getImageData(0,0,img.image.width,img.image.height);
}
co.doubleduck.Utils.getCanvasContext = function() {
	var dom = js.Lib.document.createElement("Canvas");
	var canvas = dom;
	return canvas.getContext("2d");
}
co.doubleduck.Utils.joinArrays = function(a1,a2) {
	var arr = a1.slice();
	var _g = 0;
	while(_g < a2.length) {
		var el = a2[_g];
		++_g;
		arr.push(el);
	}
	return arr;
}
co.doubleduck.Utils.getRandomElement = function(arr) {
	return arr[Std.random(arr.length)];
}
co.doubleduck.Utils.splitArray = function(arr,parts) {
	var arrs = new Array();
	var _g = 0;
	while(_g < parts) {
		var p = _g++;
		arrs.push(new Array());
	}
	var currArr = 0;
	while(arr.length > 0) {
		arrs[currArr].push(arr.pop());
		currArr++;
		currArr %= parts;
	}
	return arrs;
}
co.doubleduck.Utils.map = function(value,aMin,aMax,bMin,bMax) {
	if(bMax == null) bMax = 1;
	if(bMin == null) bMin = 0;
	if(value <= aMin) return bMin;
	if(value >= aMax) return bMax;
	return (value - aMin) * (bMax - bMin) / (aMax - aMin) + bMin;
}
co.doubleduck.Utils.waitAndCall = function(parent,delay,func,args) {
	createjs.Tween.get(parent).wait(delay).call(func,args);
}
co.doubleduck.Utils.tintBitmap = function(src,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	var colorFilter = new createjs.ColorFilter(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
	src.cache(src.x,src.y,src.image.width,src.image.height);
	src.filters = [colorFilter];
	src.updateCache();
}
co.doubleduck.Utils.containBitmaps = function(bitmapList,spacing,isRow,dims) {
	if(isRow == null) isRow = true;
	if(spacing == null) spacing = 0;
	var totalWidth = 0;
	var totalHeight = 0;
	var result = new createjs.Container();
	var _g1 = 0, _g = bitmapList.length;
	while(_g1 < _g) {
		var currBitmap = _g1++;
		var bmp = bitmapList[currBitmap];
		bmp.regY = bmp.image.height / 2;
		if(currBitmap != 0) {
			if(isRow) {
				bmp.x = bitmapList[currBitmap - 1].x + bitmapList[currBitmap - 1].image.width + spacing;
				if(bmp.image.height > totalHeight) totalHeight = bmp.image.height;
				totalWidth += bmp.image.width + spacing;
			} else {
				bmp.y = bitmapList[currBitmap - 1].y + bitmapList[currBitmap - 1].image.height + spacing;
				if(bmp.image.width > totalWidth) totalWidth = bmp.image.width;
				totalHeight += bmp.image.height + spacing;
			}
		} else {
			totalWidth = bmp.image.width;
			totalHeight = bmp.image.height;
		}
		result.addChild(bmp);
	}
	result.regX = totalWidth / 2;
	result.regY = totalHeight / 2;
	if(dims != null) {
		dims.width = totalWidth;
		dims.height = totalHeight;
	}
	return result;
}
co.doubleduck.Utils.getCenteredImage = function(name,scaleToGame) {
	if(scaleToGame == null) scaleToGame = false;
	var img = co.doubleduck.BaseAssets.getImage(name);
	img.regX = img.image.width / 2;
	img.regY = img.image.height / 2;
	if(scaleToGame) img.scaleX = img.scaleY = co.doubleduck.BaseGame.getScale();
	return img;
}
co.doubleduck.Utils.setCenterReg = function(bmp) {
	bmp.regX = bmp.image.width / 2;
	bmp.regY = bmp.image.height / 2;
}
co.doubleduck.Utils.shuffleArray = function(arr) {
	var tmp, j, i = arr.length;
	while(i > 0) {
		j = Math.random() * i | 0;
		tmp = arr[--i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}
co.doubleduck.Utils.scaleObject = function(obj) {
	obj.scaleX = obj.scaleY = co.doubleduck.BaseGame.getScale();
}
co.doubleduck.audio.AudioFX = $hxClasses["co.doubleduck.audio.AudioFX"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.AudioFX.__name__ = ["co","doubleduck","audio","AudioFX"];
co.doubleduck.audio.AudioFX.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.AudioFX._currentlyPlaying = null;
co.doubleduck.audio.AudioFX.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.setVolume(volume);
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,2);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		this._jsAudio = AudioFX(pathNoExtension, { loop: isLoop, pool: pool });
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.AudioFX
}
co.doubleduck.audio.DummyAudioAPI = $hxClasses["co.doubleduck.audio.DummyAudioAPI"] = function() {
};
co.doubleduck.audio.DummyAudioAPI.__name__ = ["co","doubleduck","audio","DummyAudioAPI"];
co.doubleduck.audio.DummyAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.DummyAudioAPI.prototype = {
	setVolume: function(volume) {
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.DummyAudioAPI
}
co.doubleduck.audio.HowlerAudio = $hxClasses["co.doubleduck.audio.HowlerAudio"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.HowlerAudio.__name__ = ["co","doubleduck","audio","HowlerAudio"];
co.doubleduck.audio.HowlerAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.HowlerAudio._currentlyPlaying = null;
co.doubleduck.audio.HowlerAudio.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.volume = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,1);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		var myUrls = new Array();
		myUrls.push(this._src + ".mp3");
		myUrls.push(this._src + ".ogg");
		this._jsAudio = new Howl({urls: myUrls, loop: false});
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.HowlerAudio
}
co.doubleduck.audio.NonOverlappingAudio = $hxClasses["co.doubleduck.audio.NonOverlappingAudio"] = function(src) {
	this._src = src;
	this.load();
	this._isMusic = false;
};
co.doubleduck.audio.NonOverlappingAudio.__name__ = ["co","doubleduck","audio","NonOverlappingAudio"];
co.doubleduck.audio.NonOverlappingAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = null;
co.doubleduck.audio.NonOverlappingAudio.prototype = {
	getSrc: function() {
		return this._src;
	}
	,audio: function() {
		return this._audio;
	}
	,setVolume: function(volume) {
		if(this._audio != null) this._audio.volume = volume;
	}
	,pause: function() {
		if(this._audio != null) this._audio.pause();
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._isMusic) co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
		if(this._audio != null) {
			this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
			this._audio.currentTime = 0;
			this._audio.pause();
		}
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._isMusic = true;
		co.doubleduck.audio.NonOverlappingAudio._musicPlaying = true;
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
	}
	,handleEnded: function() {
		this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
		this._audio.currentTime = 0;
	}
	,handleTimeUpdate: function() {
		if(this._audio.currentTime >= this._audio.duration - 0.3) this.stop();
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._musicPlaying) return;
		if(overrideOtherEffects && co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
		co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = this;
	}
	,handleError: function() {
	}
	,handleCanPlay: function() {
	}
	,load: function() {
		this._audio = new Audio();
		this._audio.src = this._src;
		this._audio.initialTime = 0;
		this._audio.addEventListener("canplaythrough",$bind(this,this.handleCanPlay));
		this._audio.addEventListener("onerror",$bind(this,this.handleError));
	}
	,init: function() {
	}
	,_isMusic: null
	,_audio: null
	,_src: null
	,__class__: co.doubleduck.audio.NonOverlappingAudio
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Public = $hxClasses["haxe.Public"] = function() { }
haxe.Public.__name__ = ["haxe","Public"];
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.remoting) haxe.remoting = {}
haxe.remoting.Context = $hxClasses["haxe.remoting.Context"] = function() {
	this.objects = new Hash();
};
haxe.remoting.Context.__name__ = ["haxe","remoting","Context"];
haxe.remoting.Context.share = function(name,obj) {
	var ctx = new haxe.remoting.Context();
	ctx.addObject(name,obj);
	return ctx;
}
haxe.remoting.Context.prototype = {
	call: function(path,params) {
		if(path.length < 2) throw "Invalid path '" + path.join(".") + "'";
		var inf = this.objects.get(path[0]);
		if(inf == null) throw "No such object " + path[0];
		var o = inf.obj;
		var m = Reflect.field(o,path[1]);
		if(path.length > 2) {
			if(!inf.rec) throw "Can't access " + path.join(".");
			var _g1 = 2, _g = path.length;
			while(_g1 < _g) {
				var i = _g1++;
				o = m;
				m = Reflect.field(o,path[i]);
			}
		}
		if(!Reflect.isFunction(m)) throw "No such method " + path.join(".");
		return m.apply(o,params);
	}
	,addObject: function(name,obj,recursive) {
		this.objects.set(name,{ obj : obj, rec : recursive});
	}
	,objects: null
	,__class__: haxe.remoting.Context
}
haxe.remoting.ContextAll = $hxClasses["haxe.remoting.ContextAll"] = function() {
	haxe.remoting.Context.call(this);
};
haxe.remoting.ContextAll.__name__ = ["haxe","remoting","ContextAll"];
haxe.remoting.ContextAll.__super__ = haxe.remoting.Context;
haxe.remoting.ContextAll.prototype = $extend(haxe.remoting.Context.prototype,{
	call: function(path,params) {
		var path2 = path.slice();
		var f = path2.pop();
		var o;
		try {
			o = eval(path2.join("."));
		} catch( e ) {
			o = null;
		}
		var m = Reflect.field(o,f);
		if(m == null) return haxe.remoting.Context.prototype.call.call(this,path,params);
		return m.apply(o,params);
	}
	,__class__: haxe.remoting.ContextAll
});
if(!haxe.unit) haxe.unit = {}
haxe.unit.TestCase = $hxClasses["haxe.unit.TestCase"] = function() {
};
haxe.unit.TestCase.__name__ = ["haxe","unit","TestCase"];
haxe.unit.TestCase.__interfaces__ = [haxe.Public];
haxe.unit.TestCase.prototype = {
	assertEquals: function(expected,actual,c) {
		this.currentTest.done = true;
		if(actual != expected) {
			this.currentTest.success = false;
			this.currentTest.error = "expected '" + Std.string(expected) + "' but was '" + Std.string(actual) + "'";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertFalse: function(b,c) {
		this.currentTest.done = true;
		if(b == true) {
			this.currentTest.success = false;
			this.currentTest.error = "expected false but was true";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertTrue: function(b,c) {
		this.currentTest.done = true;
		if(b == false) {
			this.currentTest.success = false;
			this.currentTest.error = "expected true but was false";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,print: function(v) {
		haxe.unit.TestRunner.print(v);
	}
	,tearDown: function() {
	}
	,setup: function() {
	}
	,currentTest: null
	,__class__: haxe.unit.TestCase
}
haxe.unit.TestResult = $hxClasses["haxe.unit.TestResult"] = function() {
	this.m_tests = new List();
	this.success = true;
};
haxe.unit.TestResult.__name__ = ["haxe","unit","TestResult"];
haxe.unit.TestResult.prototype = {
	toString: function() {
		var buf = new StringBuf();
		var failures = 0;
		var $it0 = this.m_tests.iterator();
		while( $it0.hasNext() ) {
			var test = $it0.next();
			if(test.success == false) {
				buf.b += Std.string("* ");
				buf.b += Std.string(test.classname);
				buf.b += Std.string("::");
				buf.b += Std.string(test.method);
				buf.b += Std.string("()");
				buf.b += Std.string("\n");
				buf.b += Std.string("ERR: ");
				if(test.posInfos != null) {
					buf.b += Std.string(test.posInfos.fileName);
					buf.b += Std.string(":");
					buf.b += Std.string(test.posInfos.lineNumber);
					buf.b += Std.string("(");
					buf.b += Std.string(test.posInfos.className);
					buf.b += Std.string(".");
					buf.b += Std.string(test.posInfos.methodName);
					buf.b += Std.string(") - ");
				}
				buf.b += Std.string(test.error);
				buf.b += Std.string("\n");
				if(test.backtrace != null) {
					buf.b += Std.string(test.backtrace);
					buf.b += Std.string("\n");
				}
				buf.b += Std.string("\n");
				failures++;
			}
		}
		buf.b += Std.string("\n");
		if(failures == 0) buf.b += Std.string("OK "); else buf.b += Std.string("FAILED ");
		buf.b += Std.string(this.m_tests.length);
		buf.b += Std.string(" tests, ");
		buf.b += Std.string(failures);
		buf.b += Std.string(" failed, ");
		buf.b += Std.string(this.m_tests.length - failures);
		buf.b += Std.string(" success");
		buf.b += Std.string("\n");
		return buf.b;
	}
	,add: function(t) {
		this.m_tests.add(t);
		if(!t.success) this.success = false;
	}
	,success: null
	,m_tests: null
	,__class__: haxe.unit.TestResult
}
haxe.unit.TestRunner = $hxClasses["haxe.unit.TestRunner"] = function() {
	this.result = new haxe.unit.TestResult();
	this.cases = new List();
};
haxe.unit.TestRunner.__name__ = ["haxe","unit","TestRunner"];
haxe.unit.TestRunner.print = function(v) {
	var msg = StringTools.htmlEscape(js.Boot.__string_rec(v,"")).split("\n").join("<br/>");
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("haxe:trace element not found"); else d.innerHTML += msg;
}
haxe.unit.TestRunner.customTrace = function(v,p) {
	haxe.unit.TestRunner.print(p.fileName + ":" + p.lineNumber + ": " + Std.string(v) + "\n");
}
haxe.unit.TestRunner.prototype = {
	runCase: function(t) {
		var old = haxe.Log.trace;
		haxe.Log.trace = haxe.unit.TestRunner.customTrace;
		var cl = Type.getClass(t);
		var fields = Type.getInstanceFields(cl);
		haxe.unit.TestRunner.print("Class: " + Type.getClassName(cl) + " ");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var fname = f;
			var field = Reflect.field(t,f);
			if(StringTools.startsWith(fname,"test") && Reflect.isFunction(field)) {
				t.currentTest = new haxe.unit.TestStatus();
				t.currentTest.classname = Type.getClassName(cl);
				t.currentTest.method = fname;
				t.setup();
				try {
					field.apply(t,new Array());
					if(t.currentTest.done) {
						t.currentTest.success = true;
						haxe.unit.TestRunner.print(".");
					} else {
						t.currentTest.success = false;
						t.currentTest.error = "(warning) no assert";
						haxe.unit.TestRunner.print("W");
					}
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,haxe.unit.TestStatus) ) {
						var e = $e0;
						haxe.unit.TestRunner.print("F");
						t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					} else {
					var e = $e0;
					haxe.unit.TestRunner.print("E");
					if(e.message != null) t.currentTest.error = "exception thrown : " + Std.string(e) + " [" + Std.string(e.message) + "]"; else t.currentTest.error = "exception thrown : " + Std.string(e);
					t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					}
				}
				this.result.add(t.currentTest);
				t.tearDown();
			}
		}
		haxe.unit.TestRunner.print("\n");
		haxe.Log.trace = old;
	}
	,run: function() {
		this.result = new haxe.unit.TestResult();
		var $it0 = this.cases.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.runCase(c);
		}
		haxe.unit.TestRunner.print(this.result.toString());
		return this.result.success;
	}
	,add: function(c) {
		this.cases.add(c);
	}
	,cases: null
	,result: null
	,__class__: haxe.unit.TestRunner
}
haxe.unit.TestStatus = $hxClasses["haxe.unit.TestStatus"] = function() {
	this.done = false;
	this.success = false;
};
haxe.unit.TestStatus.__name__ = ["haxe","unit","TestStatus"];
haxe.unit.TestStatus.prototype = {
	backtrace: null
	,posInfos: null
	,classname: null
	,method: null
	,error: null
	,success: null
	,done: null
	,__class__: haxe.unit.TestStatus
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
co.doubleduck.BaseAssets.onLoadAll = null;
co.doubleduck.BaseAssets._loader = null;
co.doubleduck.BaseAssets._cacheData = { };
co.doubleduck.BaseAssets._loadCallbacks = { };
co.doubleduck.BaseAssets.loaded = 0;
co.doubleduck.BaseAssets._useLocalStorage = false;
co.doubleduck.BaseGame._viewport = null;
co.doubleduck.BaseGame._scale = 1;
co.doubleduck.BaseGame.DEBUG = false;
co.doubleduck.BaseGame.LOGO_URI = "images/duckling/splash_logo.png";
co.doubleduck.BaseGame.LOAD_STROKE_URI = "images/duckling/loading_stroke.png";
co.doubleduck.BaseGame.LOAD_FILL_URI = "images/duckling/loading_fill.png";
co.doubleduck.BaseGame.ORIENT_PORT_URI = "images/duckling/orientation_error_port.png";
co.doubleduck.BaseGame.ORIENT_LAND_URI = "images/duckling/orientation_error_land.png";
co.doubleduck.BasePersistence.GAME_PREFIX = "DUCK";
co.doubleduck.BasePersistence.available = co.doubleduck.BasePersistence.localStorageSupported();
co.doubleduck.Button.CLICK_TYPE_NONE = 0;
co.doubleduck.Button.CLICK_TYPE_TINT = 1;
co.doubleduck.Button.CLICK_TYPE_JUICY = 2;
co.doubleduck.Button.CLICK_TYPE_SCALE = 3;
co.doubleduck.Button.CLICK_TYPE_TOGGLE = 4;
co.doubleduck.Button.CLICK_TYPE_HOLD = 5;
co.doubleduck.Button._defaultSound = null;
co.doubleduck.Popup.MENU = "images/session/pp_btn_menu.png";
co.doubleduck.Popup.RESTART = "images/session/pp_btn_replay.png";
co.doubleduck.Popup.NEXT = "images/general/pp_btn_next.png";
co.doubleduck.Gem.HINT_INTERVAL = 600;
co.doubleduck.Gem.SELECTION_TWEEN = 300;
co.doubleduck.Gem.WIDTH = 56;
co.doubleduck.Gem.HEIGHT = 56;
co.doubleduck.Hud.DARK_FONT = "images/general/font_dark/";
co.doubleduck.Hud.LIGHT_FONT = "images/general/font_light/";
co.doubleduck.Map.SWAP_TWEEN = 200;
co.doubleduck.Map.FALLING_TWEEN_MAXIMUM = 750;
co.doubleduck.Map.FALLING_TWEEN_MINIMUM = 75;
co.doubleduck.Map.SPATIAL_TWEEN = 500;
co.doubleduck.Map.ALPHA_TWEEN = 750;
co.doubleduck.Map.WAIT_GRAVITY_FILL = 20;
co.doubleduck.Map.WAIT_SOLVE_GRAVITY = 100;
co.doubleduck.Map.WAIT_FILL_POWERUP = 200;
co.doubleduck.Map.WAIT_POWERUP_CHECK = 100;
co.doubleduck.Map.WAIT_SWAP_CHECK = 100;
co.doubleduck.Map.COLUMNS = 7;
co.doubleduck.Map.ROWS = 7;
co.doubleduck.Menu.LEVELS_PER_SCREEN = 6;
co.doubleduck.Menu.WORLD_MOVE_EASE = 0.007;
co.doubleduck.Menu._iconSpritesheet = null;
co.doubleduck.Menu._shownChaz = false;
co.doubleduck.Session.HINT_TIME = 3000;
co.doubleduck.Session._lastVisitedLevel = -1;
co.doubleduck.audio.WebAudioAPI._buffers = { };
co.doubleduck.SoundManager._muted = false;
co.doubleduck.SoundManager._cache = { };
co.doubleduck.SoundManager.available = co.doubleduck.SoundManager.isSoundAvailable();
co.doubleduck.SpecialEffect.ICE_CREEPING_DURATION = 1000;
co.doubleduck.SpecialEffect.ICE_BLAST_BITMAP = "images/session/pp_ice_blast.png";
co.doubleduck.SpecialEffect.ICICLE_BITMAP = "images/session/pp_icicle.png";
co.doubleduck.Tile.GEM_SETTING_TWEEN = 250;
co.doubleduck.Tile.WIDTH = 66;
co.doubleduck.Tile.HEIGHT = 66;
co.doubleduck.audio.AudioFX._muted = false;
co.doubleduck.audio.HowlerAudio._muted = false;
co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
js.Lib.onerror = null;
co.doubleduck.Main.main();
