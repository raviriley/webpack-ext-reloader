import { debounce, runInContext } from "lodash";
import { info, warn } from "./logger";

export const debounceSignal =
  (deboucingFrame: number, context?: object) =>
  (func: (...args: any[]) => any) => {
    if (context) {
      runInContext(context);
    }

    return debounce((...args) => func.apply(context, args), deboucingFrame);
  };

export const fastReloadBlocker =
  (maxCalls: number, wait: number, context) =>
  (func: (...args: any[]) => any) => {
    let calls = 0;
    let inWait = false;

    // eslint-disable-next-line consistent-return
    return (...args) => {
      if (inWait) {
        /* do nothing */
      } else if (calls === maxCalls) {
        calls = 0;
        inWait = true;

        let interval = wait / 1000;
        warn(
          `Please wait ${interval} secs. for next reload to prevent your extension being blocked`,
        );
        const logInterval = setInterval(() => warn(`${--interval} ...`), 1000);

        setTimeout(() => {
          clearInterval(logInterval);
          info("Signing for reload now");
          func.apply(context, args);
          inWait = false;
        }, wait);
      } else {
        calls++;
        return func.apply(context, args);
      }
    };
  };
