import { h, defineComponent, toRef } from "vue";
import { useStyle } from "../../../_mixins";
import style from "./styles/index.cssr";

export default defineComponent({
  name: "BaseIcon",
  props: {
    role: String,
    ariaLabel: String,
    ariaDisabled: {
      type: Boolean,
      default: undefined,
    },
    ariaHidden: {
      type: Boolean,
      default: undefined,
    },
    clsPrefix: {
      type: String,
      required: true,
    },
    onClick: Function,
    onMousedown: Function,
    onMouseup: Function,
  },
  setup(props) {
    useStyle("BaseIcon", style, toRef(props, "clsPrefix"));
  },
  render() {
    return (
      <i
        class={`${this.clsPrefix}-base-icon`}
        onClick={this.onClick}
        onMousedown={this.onMousedown}
        onMouseup={this.onMouseup}
        role={this.role}
        aria-label={this.ariaLabel}
        aria-hidden={this.ariaHidden}
        aria-disabled={this.ariaDisabled}
      >
        {this.$slots}
      </i>
    );
  },
});
