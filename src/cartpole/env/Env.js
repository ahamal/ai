/*
  Description:
      A pole is attached by an un-actuated joint to a cart, which moves along
      a frictionless track. The pendulum starts upright, and the goal is to
      prevent it from falling over by increasing and reducing the cart's
      velocity.
  
  Source:
      This environment corresponds to the version of the cart-pole problem
      described by Barto, Sutton, and Anderson
  
  Observation:
      Type: Box(4)
      Num     Observation               Min                     Max
      0       Cart Position             -4.8                    4.8
      1       Cart Velocity             -Inf                    Inf
      2       Pole Angle                -0.418 rad (-24 deg)    0.418 rad (24 deg)
      3       Pole Angular Velocity     -Inf                    Inf
  Actions:
      Type: Discrete(2)
      Num   Action
      0     Push cart to the left
      1     Push cart to the right
      Note: The amount the velocity that is reduced or increased is not
      fixed; it depends on the angle the pole is pointing. This is because
      the center of gravity of the pole increases the amount of energy needed
      to move the cart underneath it
  Reward:
      Reward is 1 for every step taken, including the termination step
  Starting State:
      All observations are assigned a uniform random value in [-0.05..0.05]
  Episode Termination:
      Pole Angle is more than 12 degrees.
      Cart Position is more than 2.4 (center of the cart reaches the edge of
      the display).
      Episode length is greater than 200.
      Solved Requirements:
      Considered solved when the average return is greater than or equal to
      195.0 over 100 consecutive trials.
*/

import BaseController from '../../common/tools/BaseController';


const
  makeRandom = (i) => Math.random() * 0.1 - 0.05,
  makeRandomState = _ => [makeRandom(), makeRandom(), makeRandom(), makeRandom()];



class CartPoleEnv extends BaseController {
  gravity = 9.8;
  cartMass = 1.0;
  poleMass = 0.1;
  force = 10.0;
  length = 0.5;
  tau = 0.02;
  thetaThresholdRadians = 12 * 2 * Math.PI / 360;
  xThreshold = 2.4;
  totalMass = this.poleMass + this.cartMass;
  polemassLength = this.poleMass * this.length;
  kinematics_integrator = 'euler';
  action_space = [-1, 0, 1];
  observation_space = [
    [this.xThreshold * 2, -Infinity, this.thetaThresholdRadians * 2, Infinity],
    [-this.xThreshold * 2, Infinity, -this.thetaThresholdRadians * 2, -Infinity],
  ];

  constructor() {
    super();
    this.state = this.state.merge({ cartpole: makeRandomState() });
  }

  step(action) {
    // err_msg = "%r (%s) invalid" % (action, type(action))
    // assert this.action_space.contains(action), err_msg
    if (!this.action_space.indexOf(action) === -1)
      throw ('Invalid action ' + action + '');

    var
      [x, x_dot, theta, theta_dot] = this.state.get('cartpole'),
      force = action === 1 ? this.force : action === -1 ? -this.force : 0,
      costheta = Math.cos(theta),
      sintheta = Math.sin(theta),
      // For the interested reader:
      // https://coneural.org/florian/papers/05_cart_pole.pdf
      temp = (
          force + this.polemassLength * theta_dot ** 2 * sintheta
      ) / this.totalMass,

      thetaacc = (this.gravity * sintheta - costheta * temp) / (
          this.length * (4.0 / 3.0 - this.poleMass * costheta ** 2 / this.totalMass)
      ),
      xacc = temp - this.polemassLength * thetaacc * costheta / this.totalMass;

    if (this.kinematics_integrator === "euler") {
      x = x + this.tau * x_dot;
      x_dot = x_dot + this.tau * xacc;
      theta = theta + this.tau * theta_dot;
      theta_dot = theta_dot + this.tau * thetaacc;
    } else {  // semi-implicit euler
      x_dot = x_dot + this.tau * xacc;
      x = x + this.tau * x_dot;
      theta_dot = theta_dot + this.tau * thetaacc;
      theta = theta + this.tau * theta_dot;
    }

    const
      cartpole = [x, x_dot, theta, theta_dot],
      done = (
          x < -this.xThreshold
          || x > this.xThreshold
          || theta < -this.thetaThresholdRadians
          || theta > this.thetaThresholdRadians
      );

    var reward;

    if (!done) {
      reward = 1.0
    } else if (this.steps_beyond_done === null) {
      // Pole just fell!
      this.steps_beyond_done = 0;
      reward = 1.0;
    } else {
        if (this.steps_beyond_done === 0) {
          console.warn(
            'You are calling "step()" even though this ' +
            'environment has already returned done = True. You ' +
            'should always call "reset()" once you receive "done =" ' +
            '"True" -- any further steps are undefined behavior.'
          );
        }
        this.steps_beyond_done += 1
        reward = 0.0;
    }
    this.setState({ reward, done, cartpole });
  }

  reset() {
    this.state = makeRandomState();
    this.steps_beyond_done = null;
  }
}

export default CartPoleEnv;