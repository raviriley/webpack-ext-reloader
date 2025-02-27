import { info } from "../utils/logger";
import HotReloaderServer from "./HotReloaderServer";

const changesTriggerer: TriggererFactory = (
  port: number,
  reloadPage: boolean,
) => {
  const server = new HotReloaderServer(port);

  info("[ Starting the Extension Hot Reload Server... ]");
  server.listen();

  return (onlyPageChanged: boolean): Promise<any> =>
    server.signChange(reloadPage, onlyPageChanged);
};

export default changesTriggerer;
