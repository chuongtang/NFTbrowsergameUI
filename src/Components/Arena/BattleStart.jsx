import './Arena.css';

const BattleStart = ({attackState}) => {

  return (


    <button className='btn btn--shockwave is-active'>
      {!attackState ?<p>Let the Battle Begin!</p> : <p style={{"color":"yellow"}}>{attackState}</p>}
    </button>

  )
}

export default BattleStart