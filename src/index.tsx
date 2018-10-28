import { h, app, DispatchableType, Action } from "hyperapp";
import { createRouter, Route, pushHistory, Link } from './router'

function act<S extends object, P, D>(value: DispatchableType<S, P, D>) {
  return value;
}

const mainState = {
  count: 0,
  route: undefined as Route | undefined,
};

type MainState = typeof mainState;
type MainAction<P = {}, D = {}> = Action<MainState, P, D>;

const MoveTo: MainAction<{ pathname: string }> = (state, props) => [state, pushHistory({ pathname: props.pathname })];

const SetCount: MainAction<{ count: number }> = (state, props) => ({ ...state, count: props.count });
const SetRoute: MainAction<{ route: Route }> = (state, props) => ({ ...state, route: props.route });

const router = createRouter({
  routes: [{
    path: '/',
    view: (state: MainState) => <div>home</div>
  }, {
    path: '/abc',
    view: (state: MainState) => (
      <div>
        <button onClick={act([SetCount, { count: state.count + 1 }])}>increment</button>
        <div>count: {state.count}</div>
      </div>
    )
  }, {
    path: '/xyz',
    view: (state: MainState) => <div>xyz</div>
  }],
  matched: (route, dispatch) => dispatch([SetRoute, { route: route }]),
});

app({
  init: mainState,
  view: state => (
    <div>
      <ul>
        <li><Link to="/">home</Link></li>
        <li><Link to="/abc">abc</Link></li>
        <li><Link to="/xyz">xyz</Link></li>
        <li><Link to="/unknown">unknown</Link></li>
      </ul>
      <button onClick={act([MoveTo, { pathname: '/' }])}>home</button>
      <button onClick={act([MoveTo, { pathname: '/abc' }])}>abc</button>
      <button onClick={act([MoveTo, { pathname: '/xyz' }])}>xyz</button>
      <button onClick={act([MoveTo, { pathname: '/unknown' }])}>unknown</button>
      {state.route ? state.route.view(state) : <div>404</div>}
    </div>
  ),
  subscriptions: state => router,
  container: document.body
});
