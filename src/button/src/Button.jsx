import {
  h,
  ref,
  computed,
  inject,
  nextTick,
  defineComponent,
  renderSlot,
} from "vue";
import { useMemo } from "vooks";
import { createHoverColor, createPressedColor } from "../../_utils/color/index";
import { useConfig, useFormItem, useTheme } from "../../_mixins";
import {
  NFadeInExpandTransition,
  NIconSwitchTransition,
  NBaseLoading,
  NBaseWave,
} from "../../_internal";
import { call, createKey, getSlot, flatten } from "../../_utils";
import { buttonLight } from "../styles";
import style from "./styles/button.cssr.js";

const buttonProps = {
  ...useTheme.props,
  color: String,
  text: Boolean,
  block: Boolean,
  loading: Boolean,
  disabled: Boolean,
  circle: Boolean,
  size: String,
  ghost: Boolean,
  round: Boolean,
  depth: [Number, String],
  focusable: {
    type: Boolean,
    default: true,
  },
  keyboard: {
    type: Boolean,
    default: true,
  },
  tag: {
    type: String,
    default: "button",
  },
  type: {
    type: String,
    default: "default",
  },
  dashed: Boolean,
  iconPlacement: {
    type: String,
    default: "left",
  },
  attrType: {
    type: String,
    default: "button",
  },
  onClick: [Function, Array],
  bordered: {
    type: Boolean,
    default: true,
  },
};

const Button = defineComponent({
  name: "Button",
  props: buttonProps,
  setup(props) {
    const selfRef = ref(null);
    const waveRef = ref(null);
    const enterPressedRef = ref(false);
    const showBorderRef = useMemo(() => {
      return (
        !props.text &&
        (!props.color || props.ghost || props.dashed) &&
        props.bordered
      );
    });
    const { mergedSizeRef } = useFormItem(
      {},
      {
        defaultSize: "medium",
        mergedSize: (NFormItem) => {
          const { size } = props;
          if (size) return size;
          const { mergedSize: formItemSize } = NFormItem || {};
          if (formItemSize) {
            return formItemSize.value;
          }
          return "medium";
        },
      }
    );
    const mergedFocusableRef = computed(() => {
      return props.focusable && !props.disabled;
    });
    const handleMouseDown = (e) => {
      e.preventDefault();
      if (props.disabled) {
        return;
      }
      if (mergedFocusableRef.value) {
        selfRef.value?.focus({ preventScroll: true });
      }
    };
    const handleClick = (e) => {
      if (!props.disabled) {
        const { onClick } = props;
        if (onClick) call(onClick, e);
        if (!props.text) {
          const { value } = waveRef;
          if (value) {
            value.play();
          }
        }
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case "Enter":
        case "NumpadEnter":
          if (!props.keyboard) {
            e.preventDefault();
            return;
          }
          enterPressedRef.value = false;
          void nextTick(() => {
            if (!props.disabled) {
              selfRef.value?.click();
            }
          });
      }
    };
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "Enter":
        case "NumpadEnter":
          if (!props.keyboard) return;
          e.preventDefault();
          enterPressedRef.value = true;
      }
    };
    const handleBlur = () => {
      enterPressedRef.value = false;
    };
    const { mergedClsPrefixRef, NConfigProvider } = useConfig(props);
    console.log("mergedClsPrefixRef", mergedClsPrefixRef);
    const themeRef = useTheme(
      "Button",
      "Button",
      style,
      buttonLight,
      props,
      mergedClsPrefixRef
    );

    console.log("styles");

    return {
      selfRef,
      waveRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedFocusable: mergedFocusableRef,
      mergedSize: mergedSizeRef,
      showBorder: showBorderRef,
      enterPressed: enterPressedRef,
      handleMouseDown,
      handleKeyDown,
      handleBlur,
      handleKeyUp,
      handleClick,
      customColorCssVars: computed(() => {
        const { color } = props;
        if (!color) return null;
        const hoverColor = createHoverColor(color);
        return {
          "--border-color": color,
          "--border-color-hover": hoverColor,
          "--border-color-pressed": createPressedColor(color),
          "--border-color-focus": hoverColor,
          "--border-color-disabled": color,
        };
      }),
      cssVars: computed(() => {
        const theme = themeRef.value;
        const {
          common: { cubicBezierEaseInOut, cubicBezierEaseOut },
          self,
        } = theme;
        const {
          rippleDuration,
          opacityDisabled,
          fontWeightText,
          fontWeighGhost,
          fontWeight,
        } = self;
        const size = mergedSizeRef.value;
        const { dashed, type, ghost, text, color, round, circle } = props;
        // font
        const fontProps = {
          fontWeight: text
            ? fontWeightText
            : ghost
            ? fontWeighGhost
            : fontWeight,
        };
        // color
        let colorProps = {
          "--color": "initial",
          "--color-hover": "initial",
          "--color-pressed": "initial",
          "--color-focus": "initial",
          "--color-disabled": "initial",
          "--ripple-color": "initial",
          "--text-color": "initial",
          "--text-color-hover": "initial",
          "--text-color-pressed": "initial",
          "--text-color-focus": "initial",
          "--text-color-disabled": "initial",
        };
        if (text) {
          const { depth } = props;
          const textColor =
            color ||
            (type === "default" && depth !== undefined
              ? self[createKey("textColorTextDepth", String(depth))]
              : self[createKey("textColorText", type)]);
          colorProps = {
            "--color": "#0000",
            "--color-hover": "#0000",
            "--color-pressed": "#0000",
            "--color-focus": "#0000",
            "--color-disabled": "#0000",
            "--ripple-color": "#0000",
            "--text-color": textColor,
            "--text-color-hover": color
              ? createHoverColor(color)
              : self[createKey("textColorTextHover", type)],
            "--text-color-pressed": color
              ? createPressedColor(color)
              : self[createKey("textColorTextPressed", type)],
            "--text-color-focus": color
              ? createHoverColor(color)
              : self[createKey("textColorTextHover", type)],
            "--text-color-disabled":
              color || self[createKey("textColorTextDisabled", type)],
          };
        } else if (ghost || dashed) {
          colorProps = {
            "--color": "#0000",
            "--color-hover": "#0000",
            "--color-pressed": "#0000",
            "--color-focus": "#0000",
            "--color-disabled": "#0000",
            "--ripple-color": color || self[createKey("rippleColor", type)],
            "--text-color": color || self[createKey("textColorGhost", type)],
            "--text-color-hover": color
              ? createHoverColor(color)
              : self[createKey("textColorGhostHover", type)],
            "--text-color-pressed": color
              ? createPressedColor(color)
              : self[createKey("textColorGhostPressed", type)],
            "--text-color-focus": color
              ? createHoverColor(color)
              : self[createKey("textColorGhostHover", type)],
            "--text-color-disabled":
              color || self[createKey("textColorGhostDisabled", type)],
          };
        } else {
          colorProps = {
            "--color": color || self[createKey("color", type)],
            "--color-hover": color
              ? createHoverColor(color)
              : self[createKey("colorHover", type)],
            "--color-pressed": color
              ? createPressedColor(color)
              : self[createKey("colorPressed", type)],
            "--color-focus": color
              ? createHoverColor(color)
              : self[createKey("colorFocus", type)],
            "--color-disabled": color || self[createKey("colorDisabled", type)],
            "--ripple-color": color || self[createKey("rippleColor", type)],
            "--text-color": color
              ? self.textColorPrimary
              : self[createKey("textColor", type)],
            "--text-color-hover": color
              ? self.textColorHoverPrimary
              : self[createKey("textColorHover", type)],
            "--text-color-pressed": color
              ? self.textColorPressedPrimary
              : self[createKey("textColorPressed", type)],
            "--text-color-focus": color
              ? self.textColorFocusPrimary
              : self[createKey("textColorFocus", type)],
            "--text-color-disabled": color
              ? self.textColorDisabledPrimary
              : self[createKey("textColorDisabled", type)],
          };
        }
        // border
        let borderProps = {
          "--border": "initial",
          "--border-hover": "initial",
          "--border-pressed": "initial",
          "--border-focus": "initial",
          "--border-disabled": "initial",
        };
        if (text) {
          borderProps = {
            "--border": "none",
            "--border-hover": "none",
            "--border-pressed": "none",
            "--border-focus": "none",
            "--border-disabled": "none",
          };
        } else {
          borderProps = {
            "--border": self[createKey("border", type)],
            "--border-hover": self[createKey("borderHover", type)],
            "--border-pressed": self[createKey("borderPressed", type)],
            "--border-focus": self[createKey("borderFocus", type)],
            "--border-disabled": self[createKey("borderDisabled", type)],
          };
        }
        // size
        const {
          [createKey("height", size)]: height,
          [createKey("fontSize", size)]: fontSize,
          [createKey("padding", size)]: padding,
          [createKey("paddingRound", size)]: paddingRound,
          [createKey("iconSize", size)]: iconSize,
          [createKey("borderRadius", size)]: borderRadius,
          [createKey("iconMargin", size)]: iconMargin,
          waveOpacity,
        } = self;
        const sizeProps = {
          "--width": circle && !text ? height : "initial",
          "--height": text ? "initial" : height,
          "--font-size": fontSize,
          "--padding": circle
            ? "initial"
            : text
            ? "initial"
            : round
            ? paddingRound
            : padding,
          "--icon-size": iconSize,
          "--icon-margin": iconMargin,
          "--border-radius": text
            ? "initial"
            : circle || round
            ? height
            : borderRadius,
        };
        return {
          "--bezier": cubicBezierEaseInOut,
          "--bezier-ease-out": cubicBezierEaseOut,
          "--ripple-duration": rippleDuration,
          "--opacity-disabled": opacityDisabled,
          "--wave-opacity": waveOpacity,
          ...fontProps,
          ...colorProps,
          ...borderProps,
          ...sizeProps,
        };
      }),
    };
  },
  render() {
    const { $slots, mergedClsPrefix, tag: Component } = this;
    const children = flatten(getSlot(this));

    return (
      <Component
        ref="selfRef"
        class={[
          `${mergedClsPrefix}-button`,
          `${mergedClsPrefix}-button--${this.type}-type`,
          {
            [`${mergedClsPrefix}-button--disabled`]: this.disabled,
            [`${mergedClsPrefix}-button--block`]: this.block,
            [`${mergedClsPrefix}-button--pressed`]: this.enterPressed,
            [`${mergedClsPrefix}-button--dashed`]: !this.text && this.dashed,
            [`${mergedClsPrefix}-button--color`]: this.color,
            [`${mergedClsPrefix}-button--ghost`]: this.ghost, // required for button group border collapse
          },
        ]}
        tabindex={this.mergedFocusable ? 0 : -1}
        type={this.attrType}
        style={this.cssVars}
        disabled={this.disabled}
        onClick={this.handleClick}
        onBlur={this.handleBlur}
        onMousedown={this.handleMouseDown}
        onKeyup={this.handleKeyUp}
        onKeydown={this.handleKeyDown}
      >
        {$slots.default && this.iconPlacement === "right" ? (
          <div class={`${mergedClsPrefix}-button__content`}>{children}</div>
        ) : null}
        <NFadeInExpandTransition width>
          {{
            default: () =>
              $slots.icon || this.loading ? (
                <span
                  class={`${mergedClsPrefix}-button__icon`}
                  style={{
                    margin: !$slots.default ? 0 : "",
                  }}
                >
                  <NIconSwitchTransition>
                    {{
                      default: () =>
                        this.loading ? (
                          <NBaseLoading
                            clsPrefix={mergedClsPrefix}
                            key="loading"
                            class={`${mergedClsPrefix}-icon-slot`}
                            strokeWidth={20}
                          />
                        ) : (
                          <div
                            key="icon"
                            class={`${mergedClsPrefix}-icon-slot`}
                            role="none"
                          >
                            {renderSlot($slots, "icon")}
                          </div>
                        ),
                    }}
                  </NIconSwitchTransition>
                </span>
              ) : null,
          }}
        </NFadeInExpandTransition>
        {$slots.default && this.iconPlacement === "left" ? (
          <span class={`${mergedClsPrefix}-button__content`}>{children}</span>
        ) : null}
        {!this.text ? (
          <NBaseWave ref="waveRef" clsPrefix={mergedClsPrefix} />
        ) : null}
        {this.showBorder ? (
          <div
            aria-hidden
            class={`${mergedClsPrefix}-button__border`}
            style={this.customColorCssVars}
          />
        ) : null}
        {this.showBorder ? (
          <div
            aria-hidden
            class={`${mergedClsPrefix}-button__state-border`}
            style={this.customColorCssVars}
          />
        ) : null}
      </Component>
    );
  },
});

export default Button;
