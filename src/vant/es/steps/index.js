import { createNamespace } from '../utils';
import { GREEN } from '../utils/color';

var _createNamespace = createNamespace('steps'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    inactiveIcon: String,
    active: {
      type: Number,
      default: 0
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    activeColor: {
      type: String,
      default: GREEN
    },
    activeIcon: {
      type: String,
      default: 'checked'
    }
  },
  data: function data() {
    return {
      steps: []
    };
  },
  render: function render() {
    var h = arguments[0];
    return h("div", {
      "class": bem([this.direction])
    }, [h("div", {
      "class": bem('items')
    }, [this.slots()])]);
  }
});