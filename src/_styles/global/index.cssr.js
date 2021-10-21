import { c } from "../../_utils/cssr";
import commonVariables from "../common/_common";

export default c(
  "body",
  `
margin: 0;
  font-size: ${commonVariables.fontSize};
  font-family: ${commonVariables.fontFamily};
  line-height: ${commonVariables.lineHeight};
  -webkit-text-size-adjust: 100%;
`,
  [
    c(
      "input",
      `
    font-family: inherit;
    font-size: inherit;
  `
    ),
  ]
);
