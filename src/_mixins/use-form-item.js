import { computed, inject, provide, onBeforeUnmount } from "vue";

export const formItemInjectionKey = Symbol("formItem");

export default function useFormItem(
  props,
  { defaultSize = "medium", mergedSize }
) {
  const NFormItem = inject(formItemInjectionKey, null);
  provide(formItemInjectionKey, null);

  const mergedSizeRef = computed(
    mergedSize
      ? () => mergedSize(NFormItem)
      : () => {
          const { size } = props;
          if (size) return size;
          if (NFormItem) {
            const { mergedSize } = NFormItem;
            if (mergedSize.value !== undefined) {
              return mergedSize.value;
            }
          }
          return defaultSize;
        }
  );

  onBeforeUnmount(() => {
    if (NFormItem) {
      NFormItem.restoreValidation();
    }
  });

  return {
    mergedSizeRef,
    nTriggerFormBlur() {
      if (NFormItem) {
        NFormItem.handleContentBlur();
      }
    },
    nTriggerFormChange() {
      if (NFormItem) {
        NFormItem.handleContentChange();
      }
    },
    nTriggerFormFocus() {
      if (NFormItem) {
        NFormItem.handleContentFocus();
      }
    },
    nTriggerFormInput() {
      if (NFormItem) {
        NFormItem.handleContentInput();
      }
    },
  };
}
