import './index.css'

const ForbiddenPage = () => (
  <div>
    <div className="message">You are not authorized.</div>
    <div className="message2">
      You tried to access a page you did not have prior authorization for.
    </div>
    <div className="container">
      <div className="neon">403</div>
      <div className="door-frame">
        <div className="door">
          <div className="rectangle" />
          <div className="handle" />
          <div className="window">
            <div className="eye" />
            <div className="eye eye2" />
            <div className="leaf" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default ForbiddenPage
