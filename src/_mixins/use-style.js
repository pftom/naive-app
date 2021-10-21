import { onBeforeMount } from "vue";
import globalStyle from "../_styles/global/index.cssr";
import { throwError } from "../_utils";

export default function useStyle(mountId, style, clsPrefixRef) {
  if (!style) {
    if (__DEV__) throwError("use-style", "No style is specified.");
    return;
  }

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
