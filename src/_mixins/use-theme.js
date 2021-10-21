/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { inject, computed, onBeforeMount } from "vue";
import { merge } from "lodash-es";
import globalStyle from "../_styles/global/index.cssr";
import { configProviderInjectionKey } from "../config-provider/src/ConfigProvider";

export function createTheme(theme) {
  return theme;
}

function useTheme(
  resolveId,
  mountId,
  style,
  defaultTheme,
  props,
  clsPrefixRef
) {
  if (style) {
    const mountStyle = () => {
      const clsPrefix = clsPrefixRef?.value;
      style.mount({
        id: clsPrefix === undefined ? mountId : clsPrefix + mountId,
        head: true,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : undefined,
        },
      });
      globalStyle.mount({
        id: "naive-ui/global",
        head: true,
      });
    };

    onBeforeMount(mountStyle);
  }

  const NConfigProvider = inject(configProviderInjectionKey, null);
  const mergedThemeRef = computed(() => {
    const {
      theme: { common: selfCommon, self, peers = {} } = {},
      themeOverrides: selfOverrides = {},
      builtinThemeOverrides: builtinOverrides = {},
    } = props;
    const { common: selfCommonOverrides, peers: peersOverrides } =
      selfOverrides;
    const {
      common: globalCommon = undefined,
      [resolveId]: {
        common: globalSelfCommon = undefined,
        self: globalSelf = undefined,
        peers: globalPeers = {},
      } = {},
    } = NConfigProvider?.mergedThemeRef.value || {};
    const {
      common: globalCommonOverrides = undefined,
      [resolveId]: globalSelfOverrides = {},
    } = NConfigProvider?.mergedThemeOverridesRef.value || {};
    const {
      common: globalSelfCommonOverrides,
      peers: globalPeersOverrides = {},
    } = globalSelfOverrides;
    const mergedCommon = merge(
      {},
      selfCommon || globalSelfCommon || globalCommon || defaultTheme.common,
      globalCommonOverrides,
      globalSelfCommonOverrides,
      selfCommonOverrides
    );

    const mergedSelf = merge(
      // {}, executed every time, no need for empty obj
      (self || globalSelf || defaultTheme.self)?.(mergedCommon),
      builtinOverrides,
      globalSelfOverrides,
      selfOverrides
    );
    return {
      common: mergedCommon,
      self: mergedSelf,
      peers: merge({}, defaultTheme.peers, globalPeers, peers),
      peerOverrides: merge({}, globalPeersOverrides, peersOverrides),
    };
  });

  return mergedThemeRef;
}

useTheme.props = {
  theme: Object,
  themeOverrides: Object,
  builtinThemeOverrides: Object,
};

export default useTheme;
