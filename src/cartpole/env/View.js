import { useEffect, useState } from 'react';
import './View.css';

function CartPoleView({ env }) {
  const
    [state, setState] = useState(env.state);
    // [reward, done, cartpole] = state.toJS();
  
  useEffect(_ => env.on('change', _ => setState(env.state)), [env]);
  const [x, x_dot, theta, theta_dot] = state.get('cartpole');

  // carty = 100  // TOP OF CART
  // polewidth = 10.0
  // polelen = scale * (2 * this.length)
  // cartwidth = 50.0
  // cartheight = 30.0

  return (
    <div className="cartpole">
      <div
        className="cart"
        style={{
          position: 'relative',
          width: 400,
          height: 400,
          background: '#eee'
        }}>

        <div
          className="cart-box"
          style={{
            position: 'absolute',
            top: 300,
            left: 40 + x * 40,
            width: 50,
            height: 30,
            display: 'block',
            background: '#222'
          }}>
            box
          <div className="cart-hand"></div>
        </div>
      </div>
      
      { x }
      { x_dot }
      { theta }
      { theta_dot }
    </div>
  )
}

export default CartPoleView;


// render() {
//   screen_width = 600
//   screen_height = 400

//   world_width = this.x_threshold * 2
//   scale = screen_width / world_width


//   if this.viewer is null:
//       from gym.envs.classic_control import rendering

//       this.viewer = rendering.Viewer(screen_width, screen_height)
//       l, r, t, b = -cartwidth / 2, cartwidth / 2, cartheight / 2, -cartheight / 2
//       axleoffset = cartheight / 4.0
//       cart = rendering.FilledPolygon([(l, b), (l, t), (r, t), (r, b)])
//       this.carttrans = rendering.Transform()
//       cart.add_attr(this.carttrans)
//       this.viewer.add_geom(cart)
//       l, r, t, b = (
//           -polewidth / 2,
//           polewidth / 2,
//           polelen - polewidth / 2,
//           -polewidth / 2,
//       )
//       pole = rendering.FilledPolygon([(l, b), (l, t), (r, t), (r, b)])
//       pole.set_color(0.8, 0.6, 0.4)
//       this.poletrans = rendering.Transform(translation=(0, axleoffset))
//       pole.add_attr(this.poletrans)
//       pole.add_attr(this.carttrans)
//       this.viewer.add_geom(pole)
//       this.axle = rendering.make_circle(polewidth / 2)
//       this.axle.add_attr(this.poletrans)
//       this.axle.add_attr(this.carttrans)
//       this.axle.set_color(0.5, 0.5, 0.8)
//       this.viewer.add_geom(this.axle)
//       this.track = rendering.Line((0, carty), (screen_width, carty))
//       this.track.set_color(0, 0, 0)
//       this.viewer.add_geom(this.track)

//       this._pole_geom = pole

//   if this.state is null:
//       return null

//   // Edit the pole polygon vertex
//   pole = this._pole_geom
//   l, r, t, b = (
//       -polewidth / 2,
//       polewidth / 2,
//       polelen - polewidth / 2,
//       -polewidth / 2,
//   )
//   pole.v = [(l, b), (l, t), (r, t), (r, b)]



//   x = this.state
//   cartx = x[0] * scale + screen_width / 2.0  // MIDDLE OF CART
//   this.carttrans.set_translation(cartx, carty)
//   this.poletrans.set_rotation(-x[2])

//   return this.viewer.render(return_rgb_array=mode == "rgb_array")    
// }