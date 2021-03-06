import { createNamespace } from '../utils';
import { TouchMixin } from '../mixins/touch';
import { ParentMixin } from '../mixins/relation';
import { BindEventMixin } from '../mixins/bind-event';
import { GREEN } from '../utils/color';
import { getScrollTop, getElementTop, getRootScrollTop, setRootScrollTop, getScrollEventTarget } from '../utils/dom/scroll';

var _createNamespace = createNamespace('index-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  mixins: [TouchMixin, ParentMixin('vanIndexBar'), BindEventMixin(function (bind) {
    if (!this.scroller) {
      this.scroller = getScrollEventTarget(this.$el);
    }

    bind(this.scroller, 'scroll', this.onScroll);
  })],
  props: {
    sticky: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 1
    },
    highlightColor: {
      type: String,
      default: GREEN
    },
    stickyOffsetTop: {
      type: Number,
      default: 0
    },
    indexList: {
      type: Array,
      default: function _default() {
        var indexList = [];
        var charCodeOfA = 'A'.charCodeAt(0);

        for (var i = 0; i < 26; i++) {
          indexList.push(String.fromCharCode(charCodeOfA + i));
        }

        return indexList;
      }
    }
  },
  data: function data() {
    return {
      activeAnchorIndex: null
    };
  },
  computed: {
    highlightStyle: function highlightStyle() {
      var highlightColor = this.highlightColor;

      if (highlightColor) {
        /* istanbul ignore else */
        return {
          color: highlightColor
        };
      }
    }
  },
  watch: {
    indexList: function indexList() {
      this.$nextTick(this.onScroll);
    }
  },
  methods: {
    onScroll: function onScroll() {
      var _this = this;

      var scrollTop;

      if (this.scroller === window || this.scroller === document.body) {
        scrollTop = getScrollTop(this.scroller);
      } else {
        // see: https://github.com/youzan/vant/issues/3774
        scrollTop = 0;
      }

      var rects = this.children.map(function (item) {
        return {
          height: item.height,
          top: getElementTop(item.$el)
        };
      });
      var active = this.getActiveAnchorIndex(scrollTop, rects);
      this.activeAnchorIndex = this.indexList[active];

      if (this.sticky) {
        this.children.forEach(function (item, index) {
          if (index === active) {
            item.active = true;
            item.top = Math.max(_this.stickyOffsetTop, rects[index].top - scrollTop);
          } else if (index === active - 1) {
            var activeItemTop = rects[active].top - scrollTop;
            item.active = activeItemTop > 0;
            item.top = activeItemTop - item.height;
          } else {
            item.active = false;
          }
        });
      }
    },
    getActiveAnchorIndex: function getActiveAnchorIndex(scrollTop, rects) {
      for (var i = this.children.length - 1; i >= 0; i--) {
        var prevHeight = i > 0 ? rects[i - 1].height : 0;

        if (scrollTop + prevHeight + this.stickyOffsetTop >= rects[i].top) {
          return i;
        }
      }

      return -1;
    },
    onClick: function onClick(event) {
      this.scrollToElement(event.target);
    },
    onTouchMove: function onTouchMove(event) {
      this.touchMove(event);

      if (this.direction === 'vertical') {
        /* istanbul ignore else */
        if (event.cancelable) {
          event.preventDefault();
        }

        var _event$touches$ = event.touches[0],
            clientX = _event$touches$.clientX,
            clientY = _event$touches$.clientY;
        var target = document.elementFromPoint(clientX, clientY);

        if (target) {
          var index = target.dataset.index;
          /* istanbul ignore else */

          if (this.touchActiveIndex !== index) {
            this.touchActiveIndex = index;
            this.scrollToElement(target);
          }
        }
      }
    },
    scrollToElement: function scrollToElement(element) {
      var index = element.dataset.index;

      if (!index) {
        return;
      }

      var match = this.children.filter(function (item) {
        return String(item.index) === index;
      });

      if (match[0]) {
        match[0].scrollIntoView();

        if (this.stickyOffsetTop) {
          setRootScrollTop(getRootScrollTop() - this.stickyOffsetTop);
        }

        this.$emit('select', match[0].index);
      }
    },
    onTouchEnd: function onTouchEnd() {
      this.active = null;
    }
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];
    var Indexes = this.indexList.map(function (index) {
      var active = index === _this2.activeAnchorIndex;
      return h("span", {
        "class": bem('index', {
          active: active
        }),
        "style": active ? _this2.highlightStyle : null,
        "attrs": {
          "data-index": index
        }
      }, [index]);
    });
    return h("div", {
      "class": bem()
    }, [h("div", {
      "class": bem('sidebar'),
      "style": {
        zIndex: this.zIndex
      },
      "on": {
        "click": this.onClick,
        "touchstart": this.touchStart,
        "touchmove": this.onTouchMove,
        "touchend": this.onTouchEnd,
        "touchcancel": this.onTouchEnd
      }
    }, [Indexes]), this.slots('default')]);
  }
});