import { defineComponent, h } from "vue";

const Button = defineComponent({
  name: "Button",
  render() {
    const { $slots } = this;
    debugger;
    return <div>{$slots}</div>;
  },
});

export default Button;
