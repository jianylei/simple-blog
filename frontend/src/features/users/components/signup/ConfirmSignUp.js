import { useState } from "react"
import { useDispatch } from "react-redux"
import { setType } from "../../../modal/modalSlice"
import { MODAL } from "../../../../constants/constants"

const ConfirmSignUp = () => {
    const dispatch = useDispatch()
    return (
        <div className="modal-content__container">
            <h2 className="modal-title">Verify your email address.</h2>
            <p>
                We've emailed you a confirmation link, this can take up
                to 3-5 minutes. Once you confirm your email 
                you can continue setting up your profile.
            </p>
            <div className="form-nav-signup">
                Email confirmed? 
                <span onClick={() => dispatch(setType({ type: MODAL.TYPE.SIGNIN }))}>&nbsp;Sign in</span>
            </div>
            <div className="form-nav-reset">
                {/* palceholder onClick() */}
                <span onClick={() => dispatch(setType({ type: MODAL.TYPE.SIGNUP }))}>
                    Resend confirmation email
                </span>
            </div>
        </div>
        
    )
}

export default ConfirmSignUp