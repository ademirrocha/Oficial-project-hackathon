import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';

import { environment } from '../environments/environment';

export const AppRxStompConfig: InjectableRxStompConfig = {
  brokerURL: environment.broker,

  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 200,

  // debug: (msg: string): void => {
  //   console.log(new Date(), msg);
  // },
};
