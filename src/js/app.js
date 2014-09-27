

var Vue = require('vue');
var Geomicons = require('geomicons-open');
var tinycolor = require('tinycolor2');


Vue.directive('icon', function(value) {
  this.el.dataset.icon = value;
  Geomicons.inject(this.el);
});


var app = {};
app.data = {};
app.data.baseHex = '#00c9fc';
app.data.spectrumArray = [];
app.data.rowsArray = [];


app.computed = {};

app.computed.base = {
  $get: function() {
    return this.baseHex;
  },
  $set: function(val) {
    this.baseHex = tinycolor(val).toHexString();
    return this.baseHex;
  }
};

app.computed.baseHsl = {
  $get: function() {
    var hex = this.base;
    var color = tinycolor(hex);
    return color.toHsl();
  },
  $set: function(obj) {
    var color = tinycolor(obj);
    this.base = tinycolor(color).toHexString();
    return color.toHsl();
  }
};

app.computed.baseH = {
  $get: function() {
    return this.baseHsl.h;
  },
  $set: function(val) {
    var hsl = this.baseHsl;
    hsl.h = val;
    this.baseHsl = hsl;
    return this.baseHsl.h;
  }
};

app.computed.baseS = {
  $get: function() {
    return this.baseHsl.s;
  },
  $set: function(val) {
    var hsl = this.baseHsl;
    hsl.s = val;
    this.baseHsl = hsl;
    return this.baseHsl.s;
  }
};

app.computed.baseL = {
  $get: function() {
    return this.baseHsl.l;
  },
  $set: function(val) {
    var hsl = this.baseHsl;
    hsl.l = val;
    this.baseHsl = hsl;
    return this.baseHsl.l;
  }
};

app.computed.hGradient = function() {
  var hsl = tinycolor(this.base).toHsl();
  hsl.h = 0;
  min = tinycolor(hsl).toHexString();
  hsl.h = 119;
  third = tinycolor(hsl).toHexString();
  hsl.h = 239;
  twoThirds = tinycolor(hsl).toHexString();
  hsl.h = 359;
  max = tinycolor(hsl).toHexString();
  var bg = 'linear-gradient(90deg, ' + min + ', ' + third + ', ' + twoThirds + ', ' + max + ')';
  return bg;
};

app.computed.sGradient = function() {
  var hsl = tinycolor(this.base).toHsl();
  hsl.s = 0;
  var min = tinycolor(hsl).toHexString();
  hsl.s = 1;
  var max = tinycolor(hsl).toHexString();
  var bg = 'linear-gradient(90deg, ' + min + ', ' + max + ')';
  return bg;
};

app.computed.lGradient = function() {
  var hsl = tinycolor(this.base).toHsl();
  hsl.l = .5;
  var half = tinycolor(hsl).toHexString();
  hsl.l = 0.1;
  var min = tinycolor(hsl).toHexString();
  hsl.l = 0.9;
  var max = tinycolor(hsl).toHexString();
  var bg = 'linear-gradient(90deg, ' + min + ', ' + half + ', ' + max + ')';
  return bg;
};

app.computed.spectrum = {
  $get: function() {
    this.baseHex;
    var color = tinycolor(this.baseHex);
    var rotate = -360 / (this.spectrumArray.length + 1);
    this.spectrumArray[0] = { color: color.toHexString() };
    for (var i = 1; i < this.spectrumArray.length; i++) {
      this.spectrumArray[i] = { color: color.spin(rotate).toHexString() };
    }
    return this.spectrumArray;
  },
  $set: function(arr) {
    this.spectrumArray = arr;
    return this.spectrumArray;
  }
};

app.computed.rows = {
  $get: function() {
    this.baseHex;
    this.shiftS;
    this.shiftL;
    var spectrum = this.spectrumArray;
    for (var i = 0; i < this.rowsArray.length; i++) {
      var row = { colors: [] };
      for (var j = 0; j < spectrum.length; j++) {
        var hsl = tinycolor(spectrum[j].color).toHsl();
        hsl.s += this.shiftS * (i + 1);
        hsl.l += this.shiftL * (i + 1);
        var color = tinycolor(hsl).toHexString();
        row.colors.push({ color: color });
      }
      this.rowsArray[i] = row;
    }
    return this.rowsArray;
  },
  $set: function(val) {
    this.rowsArray = val;
    return this.rowsArray;
  }
};


app.data.customShiftS = null;
app.computed.shiftS = {
  $get: function() {
    if (this.customShiftS) {
      return this.customShiftS;
    } else {
      var hsl = tinycolor(this.baseHex).toHsl();
      var s;
      if (hsl.s > .5) {
        s = -.1;
      } else {
        s = .1;
      }
      return s;
    }
  },
  $set: function(val) {
    this.customShiftS = val;
    return this.customShiftS;
  }
};

app.data.customShiftL = null;
app.computed.shiftL = {
  $get: function() {
    if (this.customShiftL) {
      return this.customShiftL;
    } else {
      var hsl = tinycolor(this.baseHex).toHsl();
      var s;
      if (hsl.s > .5) {
        s = -.1;
      } else {
        s = .1;
      }
      return s;
    }
  },
  $set: function(val) {
    this.customShiftL = val;
    return this.customShiftL;
  }
};

app.computed.tileWidth = function() {
  return 100 / (this.spectrum.length);
};


app.methods = {};

app.methods.addColumn = function() {
  if (this.spectrumArray.length > 30) return false;
  var color = tinycolor(this.baseHex);
  var arr = this.spectrumArray;
  arr.push({ color: color.toHexString() });
  this.spectrumArray = arr;
};

app.methods.removeColumn = function() {
  if (this.spectrumArray.length < 1) return false;
  this.spectrumArray.splice(this.spectrumArray.length - 1);
};

app.methods.addRow = function() {
  if (this.rowsArray.length > 7) return false;
  this.rowsArray.push([]);
};

app.methods.removeRow = function() {
  if (this.rowsArray.length < 1) return false;
  this.rowsArray.splice(this.rowsArray.length - 1);
};

app.computed.state = function() {
  this.updateState();
  //var state = { base: this.baseHex, hues: this.spectrum.length };
  return window.location.hash;
};

app.methods.updateState = function() {
  var str = '#' + this.baseHex.split('#')[1] + '&hues=' + this.spectrum.length + '&rows=' + this.rows.length;
  //window.location.hash = str;
  window.history.pushState({ foo: 'bar' }, '', str);
};

app.created = function() {

  console.log('app created');
  var self = this;

  function parseHash(str) {
    var obj = {};
    obj.base = str.split('&')[0];
    var arr = str.split('&');
    for (var i = 1; i < arr.length; i++) {
      var a = arr[i].split('=');
      obj[a[0]] = a[1];
    }
    return obj;
  };

  if (window.location.hash) {
    console.log('load hash', window.location.hash);
    var obj = parseHash(window.location.hash);
    this.base = obj.base;
    for (var i = 0; i < obj.hues; i++) {
      self.addColumn();
    }
    for (var i = 0; i < obj.rows; i++) {
      self.addRow();
    }
  };

  window.onpopstate = function(e) {
    console.log('pop', e);
    var obj = parseHash(window.location.hash);
    //self.base = obj.base;
    var hues = eval(obj.hues);
    console.log(typeof hues);
    /*
    if (hues != self.spectrum.length) {
      console.log('reset spectrum');
      self.spectrum = [];
      console.log('length', self.spectrum.length);
      for (var i = 1; i < hues; i++) {
        console.log('add column' + i);
        self.addColumn();
      }
    }
    */
    /*
    if (obj.rows != self.rows.length) {
      console.log('reset rows');
      self.rows = [];
      for (var i = 0; i < obj.rows; i++) {
        self.addRow();
      }
    }
    */
  };
  window.onhashchange = function(e) {
    console.log('app hash change', window.location.hash);
  };
};

var view = new Vue({
  el: '#app',
  created: app.created,
  data: app.data,
  computed: app.computed,
  methods: app.methods
});

