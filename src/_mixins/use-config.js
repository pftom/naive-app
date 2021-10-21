import { inject, computed } from "vue";
import { configProviderInjectionKey } from "../config-provider/src/ConfigProvider";

export const defaultClsPrefix = "n";

export default function useConfig(props, options = { defaultBordered: true }) {
  const NConfigProvider = inject(configProviderInjectionKey, null);
  return {
    NConfigProvider,
    mergedBorderedRef: computed(() => {
      const { bordered } = props;
      if (bordered !== undefined) return bordered;
      return (
        NConfigProvider?.mergedBorderedRef.value ??
        options.defaultBordered ??
        true
      );
    }),
    mergedClsPrefixRef: computed(() => {
      const clsPrefix = NConfigProvider?.mergedClsPrefixRef.value;
      return clsPrefix || defaultClsPrefix;
    }),
    namespaceRef: computed(() => NConfigProvider?.mergedNamespaceRef.value),
  };
}
