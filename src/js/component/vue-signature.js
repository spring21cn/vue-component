(function(context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['Vue', 'VueUtil'], definition);
  } else {
    context.VueSignature = definition(context.Vue, context.VueUtil);
    delete context.VueSignature;
  }
})(this, function(Vue, VueUtil) {
  'use strict';

  var DEFAULT_OPTIONS = {
    dotSize: (0.5 + 2.5) / 2,
    minWidth: 0.5,
    maxWidth: 2.5,
    throttle: 16,
    minDistance: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    penColor: 'black',
    velocityFilterWeight: 0.7,
    onBegin: function onBegin() {},
    onEnd: function onEnd() {}
  };

  var convert2NonReactive = function (observerValue) {
    return JSON.parse(JSON.stringify(observerValue));
  };

  var TRANSPARENT_PNG = {
    src:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    x: 0,
    y: 0
  };
  var VueSignature = {
    name: 'VueSignature',
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      customStyle: {
        type: Object
      },
      saveType: {
        type: String,
        default: 'image/png'
      },
      saveQuality: {
        type: Number,
        default: 0.8
      },
      options: {
        type: Object,
        default: function () {
          return {};
        }
      },
      images: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data: function() {
      return {
        signaturePad: {},
        cacheImages: [],
        signatureData: TRANSPARENT_PNG,
      };
    },
    mounted: function() {
      var options = this.options;
      var canvas = this.$refs.signaturePadCanvas;
      var signaturePad = new SignaturePad(canvas, VueUtil.merge({}, DEFAULT_OPTIONS, options));
      this.signaturePad = signaturePad;
  
      VueUtil.addResizeListener(this.$el, this.resizeCanvas);
      this.resizeCanvas();
    },
    beforeDestroy: function() {
      VueUtil.removeResizeListener(this.$el, this.resizeCanvas);
    },
    methods: {
      resizeCanvas: function() {
        var canvas = this.$refs.signaturePadCanvas;
        var data = this.signaturePad.toData();
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        this.signaturePad.clear();
        this.signatureData = TRANSPARENT_PNG;
        this.signaturePad.fromData(data);
      },
      saveSignature: function() {
        var signaturePad = this.signaturePad;
        var saveType = this.saveType;
  
        if (['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].indexOf(saveType) == -1) {
          throw new Error('Image type is incorrect!');
        }
  
        if (signaturePad.isEmpty()) {
          return {
            data: undefined,
            isEmpty: true
          };
        } else {
          this.signatureData = signaturePad.toDataURL(saveType, this.saveQuality);
  
          return {
            isEmpty: false,
            data: this.signatureData
          };
        }
      },
      undoSignature: function() {
        var signaturePad = this.signaturePad;
        var record = signaturePad.toData();
  
        if (record) {
          return signaturePad.fromData(record.slice(0, -1));
        }
      },
      // mergeImageAndSignature(customSignature) {
      //   this.signatureData = customSignature;
  
      //   return mergeImages([
      //     ...this.images,
      //     ...this.cacheImages,
      //     this.signatureData
      //   ]);
      // },
      // addImages(images = []) {
      //   this.cacheImages = [...this.cacheImages, ...images];
  
      //   return mergeImages([
      //     ...this.images,
      //     ...this.cacheImages,
      //     this.signatureData
      //   ]);
      // },
      fromDataURL: function(data) {
        return this.signaturePad.fromDataURL(data);
      },
      lockSignaturePad: function() {
        return this.signaturePad.off();
      },
      openSignaturePad: function() {
        return this.signaturePad.on();
      },
      isEmpty: function() {
        return this.signaturePad.isEmpty();
      },
      getPropImagesAndCacheImages: function() {
        return this.propsImagesAndCustomImages;
      },
      clearCacheImages: function() {
        this.cacheImages = [];
  
        return this.cacheImages;
      },
      clearSignature: function() {
        return this.signaturePad.clear();
      }
    },
    computed: {
      propsImagesAndCustomImages: function() {
        var nonReactiveProrpImages = convert2NonReactive(this.images);
        var nonReactiveCachImages = convert2NonReactive(this.cacheImages);
  
        return nonReactiveProrpImages.concat(nonReactiveCachImages);
      }
    },
    render: function(createElement) {
      var width = this.width;
      var height = this.height;
      var customStyle = this.customStyle;

      return createElement(
        'div',
        {
          style: VueUtil.merge({
            width: width,
            height: height,
          }, customStyle)
        },
        [
          createElement('canvas', {
            style: {
              width: '100%',
              height: '100%'
            },
            ref: 'signaturePadCanvas'
          })
        ]
      );
    }
  };
  Vue.component(VueSignature.name, VueSignature);
});