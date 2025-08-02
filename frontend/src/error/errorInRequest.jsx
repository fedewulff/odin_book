import "./errors.css"
import { GiDeer } from "react-icons/gi"

function ErrorRequest({ statusCode }) {
  return (
    <>
      <GiDeer className="deer-icon-error" />
      <div className="error-on-request">
        <h1>Oops, this is unexpected...</h1>
        {statusCode && (
          <p>
            Error code: <span>{statusCode}</span>
          </p>
        )}

        <p>An error has occured and we are working on a fix.</p>
        <p>Refresh the page or try again later.</p>
      </div>
    </>
  )
}

export default ErrorRequest
