import {
  h,
  app,
  Effect,
  DispatchableType,
  Action,
  SubscriptionEffectRunner,
  SubscriptionEffect
} from "hyperapp";

interface DelayProps {
  action: DispatchableType<any, any, any>;
  timeout: number;
}

const delay: Effect<DelayProps, DelayProps> = props => ({
  effect: (props, dispatch) => {
    setTimeout(() => dispatch(props.action), props.timeout);
  },
  ...props
});

const mainState = {
  count: 0
};

type MainState = typeof mainState;

type MainAction<P = {}, E = {}> = Action<MainState, P, E>;

const Test: MainAction = (state, args, ev) => {
  console.log(state, args, ev);
};

const CountUp: MainAction = (state, ev) => ({
  ...state,
  count: state.count + 1
});

const DelayCountUp: MainAction = state => [
  state,
  delay({ action: CountUp, timeout: 1000 })
];

interface TickProps {
  action: DispatchableType<any, any, any>;
  interval: number;
}

const tickRunner: SubscriptionEffectRunner<TickProps> = (
  { action, interval },
  dispatch
) => {
  console.log("scribe");
  const id = setInterval(() => dispatch(action), interval);
  return () => {
    console.log("unscribe");
    clearInterval(id);
  };
};

const tick: SubscriptionEffect<TickProps, TickProps> = ({
  action,
  interval
}) => ({
  effect: tickRunner,
  action,
  interval
});

app({
  init: [{ count: 0 }, delay({ action: CountUp, timeout: 1000 })],
  view: state => (
    <div>
      <button onClick={[Test, "abc"]}>Test</button>
      <button onClick={DelayCountUp}>delay</button>
      <button onClick={CountUp}>increment</button>
      {state.count}
    </div>
  ),
  subscriptions: state => tick({ action: CountUp, interval: 1000 }),
  container: document.body
});
