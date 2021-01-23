import Dispatcher from './dispatcher.ts';

import frontsiteHnd from './endpoints/frontpage.ts';

const dispatchRoot = new Dispatcher();

//const fronsiteHnd = new FrontSiteBuilder()

dispatchRoot.registerTrigger('/site', frontsiteHnd);

export default dispatchRoot;